<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\Http\Requests\CustomerSubscription\AdjustMealsRequest;
use App\Http\Requests\CustomerSubscription\AdjustWalletRequest;
use App\Http\Requests\CustomerSubscription\CancelSubscriptionRequest;
use App\Http\Requests\CustomerSubscription\PauseSubscriptionRequest;
use App\Http\Requests\CustomerSubscription\RenewSubscriptionRequest;
use App\Http\Requests\CustomerSubscription\SkipSubscriptionRequest;
use App\Http\Requests\CustomerSubscription\StoreCustomerSubscriptionRequest;
use App\Http\Requests\CustomerSubscription\UpdateCustomerSubscriptionRequest;
use App\Http\Requests\CustomerSubscription\UpgradeSubscriptionRequest;
use App\Http\Resources\CustomerSubscription\CustomerSubscriptionResource;
use App\Models\CustomerSubscription;
use App\Services\CustomerSubscription\CustomerSubscriptionServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerSubscriptionController extends BaseController
{
    public function __construct(
        private CustomerSubscriptionServiceInterface $subscriptionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerSubscription::class);

            $filters = $request->only([
                'search', 'customer_id', 'subscription_plan_id', 'kitchen_id',
                'meal_category_id', 'subscription_status', 'payment_status',
                'billing_cycle', 'start_date_from', 'start_date_to',
                'end_date_from', 'end_date_to', 'auto_renew',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $subscriptions = $this->subscriptionService->getPaginatedSubscriptions($filters, $perPage);

            return $this->paginatedResponse(
                CustomerSubscriptionResource::collection($subscriptions),
                'Customer subscriptions retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreCustomerSubscriptionRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', CustomerSubscription::class);

            $validated = $request->validated();
            $subscription = $this->subscriptionService->purchaseSubscription($validated);

            return $this->createdResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Customer subscription created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $subscription);

            $subscription->load(
                'customer', 'subscriptionPlan', 'kitchen', 'mealCategory',
                'pauseHistory', 'skipHistory', 'upgradeHistory',
                'renewHistory', 'statusHistory', 'createdBy', 'updatedBy'
            );

            return $this->successResponse(
                new CustomerSubscriptionResource($subscription),
                'Customer subscription retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateCustomerSubscriptionRequest $request, string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $subscription);

            $validated = $request->validated();
            $subscription = $this->subscriptionService->updateSubscription($subscription->id, $validated);

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Customer subscription updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $subscription);

            $this->subscriptionService->deleteSubscription($subscription->id);

            return $this->successResponse(null, 'Customer subscription deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $subscription);

            $result = $this->subscriptionService->restoreSubscription($subscription->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore customer subscription', 400);
            }

            return $this->successResponse(null, 'Customer subscription restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $subscription);

            $this->subscriptionService->forceDeleteSubscription($subscription->id);

            return $this->successResponse(null, 'Customer subscription permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function activate(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->activateSubscription($subscription->id);

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Customer subscription activated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function pause(PauseSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('pause', $subscription);

            $subscription = $this->subscriptionService->pauseSubscription(
                $subscription->id,
                $validated['pause_start'],
                $validated['pause_end'],
                $validated['reason'] ?? null,
                $validated['remarks'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory', 'pauseHistory')
                ),
                'Customer subscription paused successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function resume(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('resume', $subscription);

            $subscription = $this->subscriptionService->resumeSubscription($subscription->id);

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Customer subscription resumed successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function skip(SkipSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->skipSubscription(
                $subscription->id,
                $validated['skip_type'],
                $validated['skip_date'],
                $validated['meal_id'] ?? null,
                $validated['reason'] ?? null,
                $validated['remarks'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory', 'skipHistory')
                ),
                'Subscription skipped successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function upgrade(UpgradeSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->upgradeSubscription(
                $subscription->id,
                $validated['new_plan_id'],
                $validated['reason'] ?? null,
                $validated['remarks'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory', 'upgradeHistory')
                ),
                'Customer subscription upgraded successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function downgrade(UpgradeSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->downgradeSubscription(
                $subscription->id,
                $validated['new_plan_id'],
                $validated['reason'] ?? null,
                $validated['remarks'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory', 'upgradeHistory')
                ),
                'Customer subscription downgraded successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function renew(RenewSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->renewSubscription(
                $subscription->id,
                $validated['plan_id'] ?? null,
                $validated['reason'] ?? null,
                $validated['remarks'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory', 'renewHistory')
                ),
                'Customer subscription renewed successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function cancel(CancelSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('cancel', $subscription);

            $subscription = $this->subscriptionService->cancelSubscription(
                $subscription->id,
                $validated['reason'],
                $validated['process_refund'] ?? false,
                $validated['remarks'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Customer subscription cancelled successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function suspend(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->suspendSubscription($subscription->id);

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Customer subscription suspended successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceResume(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->forceResumeSubscription($subscription->id);

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Customer subscription force resumed successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function approveUpgrade(string $uuid, int $historyId): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->approveUpgrade($subscription->id, $historyId);

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory', 'upgradeHistory')
                ),
                'Upgrade approved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription or upgrade history not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function adjustMeals(AdjustMealsRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->adjustMeals(
                $subscription->id,
                $validated['additional_meals'],
                $validated['reason'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Subscription meals adjusted successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function adjustWallet(AdjustWalletRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $subscription = CustomerSubscription::withoutTrashed()->where('id', $validated['subscription_id'])->firstOrFail();
            $this->authorize('update', $subscription);

            $subscription = $this->subscriptionService->adjustWallet(
                $subscription->id,
                $validated['amount'],
                $validated['reason'] ?? null,
            );

            return $this->successResponse(
                new CustomerSubscriptionResource(
                    $subscription->load('customer', 'subscriptionPlan', 'kitchen', 'mealCategory')
                ),
                'Subscription wallet adjusted successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getStats(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerSubscription::class);

            $filters = $request->only([
                'customer_id', 'kitchen_id', 'subscription_plan_id',
                'subscription_status', 'date_from', 'date_to',
            ]);
            $stats = $this->subscriptionService->getStats();

            return $this->successResponse($stats, 'Customer subscription statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getTimeline(string $uuid): JsonResponse
    {
        try {
            $subscription = CustomerSubscription::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $subscription);

            $subscription->load('pauseHistory', 'skipHistory', 'upgradeHistory', 'renewHistory', 'statusHistory');

            $timeline = $this->subscriptionService->getTimeline($subscription->id);

            return $this->successResponse($timeline, 'Subscription timeline retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer subscription not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
