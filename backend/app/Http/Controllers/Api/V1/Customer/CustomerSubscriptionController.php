<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\DTOs\CustomerSubscription\{CancelSubscriptionDTO, CustomerSubscriptionDTO, PauseSubscriptionDTO, RenewSubscriptionDTO, SkipSubscriptionDTO, UpgradeSubscriptionDTO};
use App\Http\Requests\CustomerSubscription\{CancelSubscriptionRequest, PauseSubscriptionRequest, SkipSubscriptionRequest, UpgradeSubscriptionRequest};
use App\Http\Resources\CustomerSubscription\CustomerSubscriptionResource;
use App\Models\CustomerSubscription;
use App\Models\SubscriptionPlan;
use App\Services\CustomerSubscription\CustomerSubscriptionServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerSubscriptionController extends BaseController
{
    public function __construct(
        private CustomerSubscriptionServiceInterface $subscriptionService,
    ) {}

    private function customerId(): int
    {
        return Auth::guard('customer')->id();
    }

    private function planFeatureEnabled(CustomerSubscription $subscription, string $feature): bool
    {
        $plan = $subscription->subscriptionPlan;
        return $plan !== null && (bool) $plan->{$feature};
    }

    public function getMySubscriptions(Request $request): JsonResponse
    {
        try {
            $customerId = $this->customerId();
            $filters = $request->only(['subscription_status', 'payment_status']);
            $perPage = min((int) $request->input('per_page', 15), 50);

            $subscriptions = $this->subscriptionService->getCustomerSubscriptions($customerId, $filters);

            return $this->paginatedResponse(
                CustomerSubscriptionResource::collection($subscriptions),
                'Subscriptions retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getMySubscription(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->with([
                    'subscriptionPlan', 'kitchen', 'mealCategory',
                    'pauseHistory', 'skipHistory', 'upgradeHistory',
                    'renewHistory', 'statusHistory',
                ])
                ->firstOrFail();

            return $this->successResponse(
                new CustomerSubscriptionResource($subscription),
                'Subscription retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function purchaseSubscription(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'subscription_plan_id' => 'required|integer|exists:subscription_plans,id',
                'start_date' => 'required|date|after_or_equal:today',
                'address_uuid' => 'nullable|string',
                'delivery_slot' => 'nullable|string|in:morning,afternoon,evening',
                'remarks' => 'nullable|string|max:500',
            ]);

            $customerId = $this->customerId();
            $plan = SubscriptionPlan::where('id', $request->input('subscription_plan_id'))
                ->where('status', 'active')
                ->firstOrFail();

            $dto = CustomerSubscriptionDTO::fromArray([
                'customer_id' => $customerId,
                'subscription_plan_id' => $plan->id,
                'start_date' => $request->input('start_date'),
                'billing_cycle' => $plan->billing_cycle,
                'meal_category_id' => $plan->meal_category_id,
                'kitchen_id' => $plan->kitchen_id,
                'delivery_slot' => $request->input('delivery_slot'),
                'remarks' => $request->input('remarks'),
            ]);

            $subscription = $this->subscriptionService->purchaseSubscription($dto);

            return $this->createdResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Subscription purchased successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Plan not found or unavailable');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function pauseSubscription(PauseSubscriptionRequest $request, string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->firstOrFail();

            if (!$this->planFeatureEnabled($subscription, 'allow_pause')) {
                return $this->errorResponse('This plan does not support pausing.', 422);
            }

            $validated = $request->validated();
            $dto = new PauseSubscriptionDTO();
            $dto->subscription_id = $subscription->id;
            $dto->pause_start = $validated['pause_start'];
            $dto->pause_end = $validated['pause_end'] ?? null;
            $dto->reason = $validated['reason'] ?? null;

            $result = $this->subscriptionService->pauseSubscription($dto);

            if (!$result) {
                return $this->errorResponse('Unable to pause subscription. It may already be paused or not eligible.', 422);
            }

            return $this->successResponse(
                new CustomerSubscriptionResource($result->load('subscriptionPlan')),
                'Subscription paused successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function resumeSubscription(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->firstOrFail();

            if (!$this->planFeatureEnabled($subscription, 'allow_resume')) {
                return $this->errorResponse('This plan does not support resuming.', 422);
            }

            $result = $this->subscriptionService->resumeSubscription($subscription->id);

            if (!$result) {
                return $this->errorResponse('Unable to resume subscription. It may not be paused.', 422);
            }

            return $this->successResponse(
                new CustomerSubscriptionResource($result->load('subscriptionPlan')),
                'Subscription resumed successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function skipMeal(SkipSubscriptionRequest $request, string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->firstOrFail();

            if (!$this->planFeatureEnabled($subscription, 'allow_skip')) {
                return $this->errorResponse('This plan does not support skipping meals.', 422);
            }

            $validated = $request->validated();
            $dto = SkipSubscriptionDTO::fromArray([
                'subscription_id' => $subscription->id,
                'skip_type' => $validated['skip_type'],
                'skip_date' => $validated['skip_date'],
                'reason' => $validated['reason'] ?? null,
            ]);

            $result = $this->subscriptionService->skipMeal($dto);

            if (!$result) {
                return $this->errorResponse('Unable to skip meal. Please check the cutoff time or eligibility.', 422);
            }

            return $this->successResponse(
                new CustomerSubscriptionResource($result->load('subscriptionPlan')),
                'Meal skipped successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function upgradeSubscription(UpgradeSubscriptionRequest $request, string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->firstOrFail();

            if (!$this->planFeatureEnabled($subscription, 'allow_upgrade')) {
                return $this->errorResponse('This plan does not support upgrading.', 422);
            }

            $validated = $request->validated();
            $dto = new UpgradeSubscriptionDTO();
            $dto->subscription_id = $subscription->id;
            $dto->to_plan_id = $validated['to_plan_id'];
            $dto->reason = $validated['reason'] ?? null;

            $result = $this->subscriptionService->upgradeSubscription($dto);

            if (!$result) {
                return $this->errorResponse('Unable to upgrade subscription. Please check eligibility.', 422);
            }

            return $this->successResponse(
                new CustomerSubscriptionResource($result->load('subscriptionPlan')),
                'Subscription upgrade request submitted'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function renewSubscription(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->firstOrFail();

            $dto = new RenewSubscriptionDTO();
            $dto->subscription_id = $subscription->id;
            $dto->reason = 'Customer renewal';

            $result = $this->subscriptionService->renewSubscription($dto);

            if (!$result) {
                return $this->errorResponse('Unable to renew subscription.', 422);
            }

            return $this->successResponse(
                new CustomerSubscriptionResource($result->load('subscriptionPlan')),
                'Subscription renewed successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function cancelSubscription(CancelSubscriptionRequest $request, string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->firstOrFail();

            if (!$this->planFeatureEnabled($subscription, 'allow_cancel')) {
                return $this->errorResponse('This plan does not support cancellation. Please contact support.', 422);
            }

            $validated = $request->validated();
            $dto = new CancelSubscriptionDTO();
            $dto->subscription_id = $subscription->id;
            $dto->reason = $validated['reason'] ?? null;
            $dto->remarks = $validated['remarks'] ?? null;

            $result = $this->subscriptionService->cancelSubscription($dto);

            if (!$result) {
                return $this->errorResponse('Unable to cancel subscription.', 422);
            }

            return $this->successResponse(
                new CustomerSubscriptionResource($result->load('subscriptionPlan')),
                'Subscription cancelled successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getTimeline(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()
                ->where('uuid', $uuid)
                ->where('customer_id', $this->customerId())
                ->firstOrFail();

            $timeline = $this->subscriptionService->getTimeline($subscription->id);

            return $this->successResponse($timeline, 'Timeline retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->notFoundResponse('Subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
