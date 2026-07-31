<?php

declare(strict_types=1);

namespace App\Services\CustomerSubscription;

use App\DTOs\CustomerSubscription\{CancelSubscriptionDTO, CustomerSubscriptionDTO, PauseSubscriptionDTO, RenewSubscriptionDTO, SkipSubscriptionDTO, UpgradeSubscriptionDTO};
use App\Models\{CustomerSubscription, SubscriptionPauseHistory, SubscriptionSkipHistory, SubscriptionStatusHistory, SubscriptionUpgradeHistory, SubscriptionRenewHistory};
use App\Repositories\CustomerSubscription\CustomerSubscriptionRepositoryInterface;
use App\Repositories\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerSubscriptionService extends BaseService implements CustomerSubscriptionServiceInterface
{
    protected string $moduleName = 'customer_subscription';

    public function __construct(
        protected CustomerSubscriptionRepositoryInterface $subscriptionRepo,
        protected SubscriptionPlanRepositoryInterface $planRepo,
    ) {}

    public function getPaginatedSubscriptions(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->subscriptionRepo->getPaginated($filters, $perPage);
    }

    public function getSubscriptionById(int $id): ?CustomerSubscription
    {
        return $this->subscriptionRepo->getById($id);
    }

    public function getSubscriptionByUuid(string $uuid): ?CustomerSubscription
    {
        return $this->subscriptionRepo->getByUuid($uuid);
    }

    public function getCustomerSubscriptions(int $customerId, array $filters = []): LengthAwarePaginator
    {
        return $this->subscriptionRepo->getByCustomer($customerId, $filters);
    }

    public function purchaseSubscription(CustomerSubscriptionDTO $dto): CustomerSubscription
    {
        return $this->transaction(function () use ($dto) {
            $plan = $this->planRepo->getById($dto->subscriptionPlanId);

            if (! $plan) {
                throw new \RuntimeException('Subscription plan not found.');
            }

            if ($plan->status !== 'active') {
                throw new \RuntimeException('Cannot purchase a subscription for an inactive plan.');
            }

            $existingCount = $this->subscriptionRepo->getPaginated([
                'customer_id' => $dto->customerId,
                'subscription_status' => 'active',
            ], 1)->total();

            if ($plan->maximum_active_subscriptions > 0 && $existingCount >= $plan->maximum_active_subscriptions) {
                throw new \RuntimeException('Customer has reached the maximum active subscriptions limit for this plan.');
            }

            $totalMeals = (int) ceil($plan->duration_days);

            $price = $plan->offer_price > 0 && $plan->offer_price < $plan->price
                ? $plan->offer_price
                : $plan->price;

            $createdBy = auth()->guard('admin')->id();

            $data = [
                'subscription_number' => $this->subscriptionRepo->generateSubscriptionNumber(),
                'customer_id' => $dto->customerId,
                'subscription_plan_id' => $dto->subscriptionPlanId,
                'kitchen_id' => $dto->kitchenId ?? $plan->kitchen_id,
                'start_date' => $dto->startDate ?? now()->toDateString(),
                'end_date' => now()->addDays($plan->duration_days)->toDateString(),
                'billing_cycle' => $dto->billingCycle,
                'meal_category_id' => $dto->mealCategoryId ?? $plan->meal_category_id,
                'subscription_status' => 'pending',
                'payment_status' => $dto->paymentStatus,
                'wallet_adjustment' => $price,
                'remaining_meals' => $totalMeals,
                'consumed_meals' => 0,
                'skipped_meals' => 0,
                'paused_days' => 0,
                'next_delivery_date' => $dto->startDate ?? now()->toDateString(),
                'delivery_slot' => $dto->deliverySlot,
                'auto_renew' => $dto->autoRenew,
                'remarks' => $dto->remarks,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
            ];

            $subscription = $this->subscriptionRepo->create($data);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $subscription->id,
                'from_status' => 'new',
                'to_status' => 'pending',
                'reason' => 'Subscription purchased',
                'changed_by' => $createdBy,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription purchased', ['subscription_id' => $subscription->id, 'plan_id' => $plan->id]);
            $this->logActivity('subscription_purchased', $subscription);

            return $subscription;
        });
    }

    public function activateSubscription(int $id): ?CustomerSubscription
    {
        return $this->transaction(function () use ($id) {
            $subscription = $this->subscriptionRepo->getById($id);

            if (! $subscription) {
                return null;
            }

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($id, [
                'subscription_status' => 'active',
                'activation_date' => now()->toDateString(),
                'next_delivery_date' => $subscription->start_date->toDateString(),
                'updated_by' => $updatedBy,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $id,
                'from_status' => 'pending',
                'to_status' => 'active',
                'reason' => 'Subscription activated',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription activated', ['subscription_id' => $id]);
            $this->logActivity('subscription_activated', $updated);

            return $updated;
        });
    }

    public function pauseSubscription(PauseSubscriptionDTO $dto): ?CustomerSubscription
    {
        return $this->transaction(function () use ($dto) {
            $subscription = $this->subscriptionRepo->getById($dto->subscriptionId);

            if (! $subscription) {
                throw new \RuntimeException('Subscription not found.');
            }

            if ($subscription->subscription_status !== 'active') {
                throw new \RuntimeException('Only active subscriptions can be paused.');
            }

            $plan = $this->planRepo->getById($subscription->subscription_plan_id);

            if (! $plan || ! $plan->allow_pause) {
                throw new \RuntimeException('This subscription plan does not allow pausing.');
            }

            $pauseStart = \Carbon\Carbon::parse($dto->pauseStart);
            $pauseEnd = \Carbon\Carbon::parse($dto->pauseEnd);
            $pauseDays = $pauseStart->diffInDays($pauseEnd) + 1;

            if ($plan->maximum_pause_days > 0 && ($subscription->paused_days + $pauseDays) > $plan->maximum_pause_days) {
                throw new \RuntimeException("Cannot pause for {$pauseDays} days. Maximum allowed pause days ({$plan->maximum_pause_days}) would be exceeded.");
            }

            $newEndDate = $subscription->end_date->addDays($pauseDays)->toDateString();

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($dto->subscriptionId, [
                'subscription_status' => 'paused',
                'paused_days' => $subscription->paused_days + $pauseDays,
                'pause_start' => $dto->pauseStart,
                'pause_end' => $dto->pauseEnd,
                'end_date' => $newEndDate,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionPauseHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'action' => 'pause',
                'pause_start' => $dto->pauseStart,
                'pause_end' => $dto->pauseEnd,
                'pause_days' => $pauseDays,
                'new_end_date' => $newEndDate,
                'reason' => $dto->reason,
                'status' => 'approved',
                'remarks' => $dto->remarks,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'from_status' => 'active',
                'to_status' => 'paused',
                'reason' => $dto->reason ?? 'Subscription paused',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription paused', ['subscription_id' => $dto->subscriptionId, 'pause_days' => $pauseDays]);
            $this->logActivity('subscription_paused', $updated);

            return $updated;
        });
    }

    public function resumeSubscription(int $id, ?string $reason = null, ?string $remarks = null): ?CustomerSubscription
    {
        return $this->transaction(function () use ($id, $reason, $remarks) {
            $subscription = $this->subscriptionRepo->getById($id);

            if (! $subscription) {
                return null;
            }

            if ($subscription->subscription_status !== 'paused') {
                throw new \RuntimeException('Only paused subscriptions can be resumed.');
            }

            $remainingPausedDays = 0;
            if ($subscription->pause_start && $subscription->pause_end) {
                $pauseEnd = \Carbon\Carbon::parse($subscription->pause_end);
                if ($pauseEnd->isFuture()) {
                    $remainingPausedDays = now()->diffInDays($pauseEnd) + 1;
                }
            }

            $newEndDate = $subscription->end_date->subDays($remainingPausedDays)->toDateString();

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($id, [
                'subscription_status' => 'active',
                'pause_start' => null,
                'pause_end' => null,
                'end_date' => $newEndDate,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionPauseHistory::create([
                'customer_subscription_id' => $id,
                'action' => 'resume',
                'pause_start' => $subscription->pause_start,
                'pause_end' => $subscription->pause_end,
                'pause_days' => 0,
                'new_end_date' => $newEndDate,
                'reason' => $reason,
                'status' => 'approved',
                'remarks' => $remarks,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $id,
                'from_status' => 'paused',
                'to_status' => 'active',
                'reason' => $reason ?? 'Subscription resumed',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription resumed', ['subscription_id' => $id]);
            $this->logActivity('subscription_resumed', $updated);

            return $updated;
        });
    }

    public function skipMeal(SkipSubscriptionDTO $dto): ?CustomerSubscription
    {
        return $this->transaction(function () use ($dto) {
            $subscription = $this->subscriptionRepo->getById($dto->subscriptionId);

            if (! $subscription) {
                throw new \RuntimeException('Subscription not found.');
            }

            if ($subscription->subscription_status !== 'active') {
                throw new \RuntimeException('Only active subscriptions can skip meals.');
            }

            $plan = $this->planRepo->getById($subscription->subscription_plan_id);

            if (! $plan || ! $plan->allow_skip) {
                throw new \RuntimeException('This subscription plan does not allow skipping meals.');
            }

            if ($plan->maximum_skip_days > 0 && $subscription->skipped_meals >= $plan->maximum_skip_days) {
                throw new \RuntimeException('Maximum skip limit reached for this subscription.');
            }

            $totalMeals = $subscription->remaining_meals + $subscription->consumed_meals + $subscription->skipped_meals;
            $creditAmount = $totalMeals > 0 ? round((float) $plan->price / $totalMeals, 2) : 0;

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($dto->subscriptionId, [
                'skipped_meals' => $subscription->skipped_meals + 1,
                'remaining_meals' => max(0, $subscription->remaining_meals - 1),
                'updated_by' => $updatedBy,
            ]);

            SubscriptionSkipHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'skip_type' => $dto->skipType,
                'skip_date' => $dto->skipDate,
                'meal_id' => $dto->mealId,
                'meals_credited' => 1,
                'credit_amount' => $creditAmount,
                'reason' => $dto->reason,
                'status' => 'completed',
                'remarks' => $dto->remarks,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Meal skipped', ['subscription_id' => $dto->subscriptionId, 'credit_amount' => $creditAmount]);
            $this->logActivity('subscription_meal_skipped', $updated);

            return $updated;
        });
    }

    public function upgradeSubscription(UpgradeSubscriptionDTO $dto): ?CustomerSubscription
    {
        return $this->transaction(function () use ($dto) {
            $subscription = $this->subscriptionRepo->getById($dto->subscriptionId);

            if (! $subscription) {
                throw new \RuntimeException('Subscription not found.');
            }

            if ($subscription->subscription_status !== 'active') {
                throw new \RuntimeException('Only active subscriptions can be upgraded.');
            }

            $currentPlan = $this->planRepo->getById($subscription->subscription_plan_id);

            if (! $currentPlan || ! $currentPlan->allow_upgrade) {
                throw new \RuntimeException('This subscription plan does not allow upgrades.');
            }

            $newPlan = $this->planRepo->getById($dto->newPlanId);

            if (! $newPlan) {
                throw new \RuntimeException('Target upgrade plan not found.');
            }

            $totalMeals = $subscription->remaining_meals + $subscription->consumed_meals + $subscription->skipped_meals;
            $remainingRatio = $totalMeals > 0 ? $subscription->remaining_meals / $totalMeals : 0;

            $currentPrice = (float) ($currentPlan->offer_price > 0 && $currentPlan->offer_price < $currentPlan->price ? $currentPlan->offer_price : $currentPlan->price);
            $newPrice = (float) ($newPlan->offer_price > 0 && $newPlan->offer_price < $newPlan->price ? $newPlan->offer_price : $newPlan->price);

            $priceDifference = ($newPrice - $currentPrice) * $remainingRatio;

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($dto->subscriptionId, [
                'subscription_plan_id' => $dto->newPlanId,
                'wallet_adjustment' => (float) $subscription->wallet_adjustment + $priceDifference,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionUpgradeHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'action' => 'upgrade',
                'from_plan_id' => $currentPlan->id,
                'to_plan_id' => $newPlan->id,
                'price_difference' => $priceDifference,
                'remaining_meals_before' => $subscription->remaining_meals,
                'remaining_meals_after' => $subscription->remaining_meals,
                'reason' => $dto->reason,
                'status' => 'completed',
                'additional_charge' => max(0, $priceDifference),
                'remarks' => $dto->remarks,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'from_status' => 'active',
                'to_status' => 'active',
                'reason' => $dto->reason ?? 'Subscription upgraded',
                'changed_by' => $updatedBy,
                'metadata' => [
                    'from_plan_id' => $currentPlan->id,
                    'to_plan_id' => $newPlan->id,
                    'price_difference' => $priceDifference,
                ],
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription upgraded', [
                'subscription_id' => $dto->subscriptionId,
                'from_plan' => $currentPlan->id,
                'to_plan' => $newPlan->id,
            ]);
            $this->logActivity('subscription_upgraded', $updated);

            return $updated;
        });
    }

    public function downgradeSubscription(UpgradeSubscriptionDTO $dto): ?CustomerSubscription
    {
        return $this->transaction(function () use ($dto) {
            $subscription = $this->subscriptionRepo->getById($dto->subscriptionId);

            if (! $subscription) {
                throw new \RuntimeException('Subscription not found.');
            }

            if ($subscription->subscription_status !== 'active') {
                throw new \RuntimeException('Only active subscriptions can be downgraded.');
            }

            $currentPlan = $this->planRepo->getById($subscription->subscription_plan_id);

            if (! $currentPlan || ! $currentPlan->allow_downgrade) {
                throw new \RuntimeException('This subscription plan does not allow downgrades.');
            }

            $newPlan = $this->planRepo->getById($dto->newPlanId);

            if (! $newPlan) {
                throw new \RuntimeException('Target downgrade plan not found.');
            }

            $totalMeals = $subscription->remaining_meals + $subscription->consumed_meals + $subscription->skipped_meals;
            $remainingRatio = $totalMeals > 0 ? $subscription->remaining_meals / $totalMeals : 0;

            $currentPrice = (float) ($currentPlan->offer_price > 0 && $currentPlan->offer_price < $currentPlan->price ? $currentPlan->offer_price : $currentPlan->price);
            $newPrice = (float) ($newPlan->offer_price > 0 && $newPlan->offer_price < $newPlan->price ? $newPlan->offer_price : $newPlan->price);

            $priceDifference = ($newPrice - $currentPrice) * $remainingRatio;
            $refundAmount = abs(min(0, $priceDifference));

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($dto->subscriptionId, [
                'subscription_plan_id' => $dto->newPlanId,
                'wallet_adjustment' => (float) $subscription->wallet_adjustment + $priceDifference,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionUpgradeHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'action' => 'downgrade',
                'from_plan_id' => $currentPlan->id,
                'to_plan_id' => $newPlan->id,
                'price_difference' => $priceDifference,
                'remaining_meals_before' => $subscription->remaining_meals,
                'remaining_meals_after' => $subscription->remaining_meals,
                'reason' => $dto->reason,
                'status' => 'completed',
                'refund_amount' => $refundAmount,
                'remarks' => $dto->remarks,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'from_status' => 'active',
                'to_status' => 'active',
                'reason' => $dto->reason ?? 'Subscription downgraded',
                'changed_by' => $updatedBy,
                'metadata' => [
                    'from_plan_id' => $currentPlan->id,
                    'to_plan_id' => $newPlan->id,
                    'price_difference' => $priceDifference,
                ],
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription downgraded', [
                'subscription_id' => $dto->subscriptionId,
                'from_plan' => $currentPlan->id,
                'to_plan' => $newPlan->id,
            ]);
            $this->logActivity('subscription_downgraded', $updated);

            return $updated;
        });
    }

    public function renewSubscription(RenewSubscriptionDTO $dto): ?CustomerSubscription
    {
        return $this->transaction(function () use ($dto) {
            $subscription = $this->subscriptionRepo->getById($dto->subscriptionId);

            if (! $subscription) {
                throw new \RuntimeException('Subscription not found.');
            }

            $planId = $dto->planId ?? $subscription->subscription_plan_id;
            $plan = $this->planRepo->getById($planId);

            if (! $plan) {
                throw new \RuntimeException('Subscription plan not found.');
            }

            $oldEndDate = $subscription->end_date->toDateString();
            $newEndDate = $subscription->end_date->addDays($plan->duration_days)->toDateString();
            $totalMeals = (int) ceil($plan->duration_days);

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($dto->subscriptionId, [
                'subscription_plan_id' => $planId,
                'end_date' => $newEndDate,
                'remaining_meals' => $subscription->remaining_meals + $totalMeals,
                'consumed_meals' => 0,
                'skipped_meals' => 0,
                'next_delivery_date' => now()->toDateString(),
                'updated_by' => $updatedBy,
            ]);

            $price = (float) ($plan->offer_price > 0 && $plan->offer_price < $plan->price ? $plan->offer_price : $plan->price);

            SubscriptionRenewHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'from_plan_id' => $subscription->subscription_plan_id,
                'to_plan_id' => $planId,
                'old_end_date' => $oldEndDate,
                'new_end_date' => $newEndDate,
                'old_remaining_meals' => $subscription->remaining_meals,
                'new_remaining_meals' => $subscription->remaining_meals + $totalMeals,
                'renewal_amount' => $price,
                'discount_amount' => $plan->renewal_discount ?? 0,
                'final_amount' => $price - ($plan->renewal_discount ?? 0),
                'renewal_type' => $dto->planId ? 'plan_change' : 'same_plan',
                'reason' => $dto->reason,
                'remarks' => $dto->remarks,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'from_status' => 'active',
                'to_status' => 'active',
                'reason' => $dto->reason ?? 'Subscription renewed',
                'changed_by' => $updatedBy,
                'metadata' => [
                    'old_end_date' => $oldEndDate,
                    'new_end_date' => $newEndDate,
                ],
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription renewed', ['subscription_id' => $dto->subscriptionId, 'new_end_date' => $newEndDate]);
            $this->logActivity('subscription_renewed', $updated);

            return $updated;
        });
    }

    public function updateSubscription(int $id, array $data): ?CustomerSubscription
    {
        return $this->subscriptionRepo->update($id, $data);
    }

    public function deleteSubscription(int $id): bool
    {
        return $this->subscriptionRepo->delete($id);
    }

    public function restoreSubscription(int $id): ?CustomerSubscription
    {
        return $this->subscriptionRepo->restore($id);
    }

    public function cancelSubscription(CancelSubscriptionDTO $dto): ?CustomerSubscription
    {
        return $this->transaction(function () use ($dto) {
            $subscription = $this->subscriptionRepo->getById($dto->subscriptionId);

            if (! $subscription) {
                throw new \RuntimeException('Subscription not found.');
            }

            if (! in_array($subscription->subscription_status, ['active', 'paused', 'pending'])) {
                throw new \RuntimeException('Cannot cancel a subscription with status: ' . $subscription->subscription_status);
            }

            $plan = $this->planRepo->getById($subscription->subscription_plan_id);

            if ($plan && ! $plan->allow_cancel) {
                throw new \RuntimeException('This subscription plan does not allow cancellation.');
            }

            $refundAmount = 0;
            if ($dto->processRefund && $subscription->subscription_status === 'active') {
                $totalMeals = $subscription->remaining_meals + $subscription->consumed_meals + $subscription->skipped_meals;
                $refundAmount = $totalMeals > 0
                    ? round((float) $subscription->wallet_adjustment * ($subscription->remaining_meals / $totalMeals), 2)
                    : 0;
            }

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($dto->subscriptionId, [
                'subscription_status' => 'cancelled',
                'cancellation_date' => now()->toDateString(),
                'cancellation_reason' => $dto->reason,
                'payment_status' => $refundAmount > 0 ? 'refunded' : $subscription->payment_status,
                'refund_amount' => $refundAmount,
                'remarks' => $dto->remarks,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $dto->subscriptionId,
                'from_status' => $subscription->subscription_status,
                'to_status' => 'cancelled',
                'reason' => $dto->reason ?? 'Subscription cancelled',
                'changed_by' => $updatedBy,
                'metadata' => [
                    'refund_amount' => $refundAmount,
                    'process_refund' => $dto->processRefund,
                ],
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription cancelled', ['subscription_id' => $dto->subscriptionId, 'refund_amount' => $refundAmount]);
            $this->logActivity('subscription_cancelled', $updated);

            return $updated;
        });
    }

    public function suspendSubscription(int $id, ?string $reason = null): ?CustomerSubscription
    {
        return $this->transaction(function () use ($id, $reason) {
            $subscription = $this->subscriptionRepo->getById($id);

            if (! $subscription) {
                return null;
            }

            if ($subscription->subscription_status !== 'active') {
                throw new \RuntimeException('Only active subscriptions can be suspended.');
            }

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($id, [
                'subscription_status' => 'suspended',
                'remarks' => $reason,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $id,
                'from_status' => 'active',
                'to_status' => 'suspended',
                'reason' => $reason ?? 'Subscription suspended',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription suspended', ['subscription_id' => $id]);
            $this->logActivity('subscription_suspended', $updated);

            return $updated;
        });
    }

    public function forceResumeSubscription(int $id, ?string $reason = null): ?CustomerSubscription
    {
        return $this->transaction(function () use ($id, $reason) {
            $subscription = $this->subscriptionRepo->getById($id);

            if (! $subscription) {
                return null;
            }

            if ($subscription->subscription_status !== 'suspended') {
                throw new \RuntimeException('Only suspended subscriptions can be force resumed.');
            }

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($id, [
                'subscription_status' => 'active',
                'remarks' => $reason,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $id,
                'from_status' => 'suspended',
                'to_status' => 'active',
                'reason' => $reason ?? 'Subscription force resumed',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Subscription force resumed', ['subscription_id' => $id]);
            $this->logActivity('subscription_force_resumed', $updated);

            return $updated;
        });
    }

    public function approveUpgrade(int $historyId, int $approvedBy): ?CustomerSubscription
    {
        return $this->transaction(function () use ($historyId, $approvedBy) {
            $history = SubscriptionUpgradeHistory::find($historyId);

            if (! $history) {
                throw new \RuntimeException('Upgrade history record not found.');
            }

            $history->update([
                'status' => 'approved',
                'approved_by' => $approvedBy,
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Upgrade approved', ['history_id' => $historyId, 'subscription_id' => $history->customer_subscription_id]);
            $this->logActivity('subscription_upgrade_approved', $history);

            return $this->subscriptionRepo->getById($history->customer_subscription_id);
        });
    }

    public function adjustMeals(int $id, int $additionalMeals, ?string $reason = null): ?CustomerSubscription
    {
        return $this->transaction(function () use ($id, $additionalMeals, $reason) {
            $subscription = $this->subscriptionRepo->getById($id);

            if (! $subscription) {
                return null;
            }

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($id, [
                'remaining_meals' => $subscription->remaining_meals + $additionalMeals,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $id,
                'from_status' => $subscription->subscription_status,
                'to_status' => $subscription->subscription_status,
                'reason' => $reason ?? 'Meals adjusted by ' . $additionalMeals,
                'changed_by' => $updatedBy,
                'metadata' => [
                    'adjustment' => $additionalMeals,
                    'new_remaining' => $subscription->remaining_meals + $additionalMeals,
                ],
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Meals adjusted', ['subscription_id' => $id, 'adjustment' => $additionalMeals]);
            $this->logActivity('subscription_meals_adjusted', $updated);

            return $updated;
        });
    }

    public function adjustWallet(int $id, float $amount, ?string $reason = null): ?CustomerSubscription
    {
        return $this->transaction(function () use ($id, $amount, $reason) {
            $subscription = $this->subscriptionRepo->getById($id);

            if (! $subscription) {
                return null;
            }

            $newAmount = (float) $subscription->wallet_adjustment + $amount;

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->subscriptionRepo->update($id, [
                'wallet_adjustment' => $newAmount,
                'updated_by' => $updatedBy,
            ]);

            SubscriptionStatusHistory::create([
                'customer_subscription_id' => $id,
                'from_status' => $subscription->subscription_status,
                'to_status' => $subscription->subscription_status,
                'reason' => $reason ?? 'Wallet adjusted by ' . $amount,
                'changed_by' => $updatedBy,
                'metadata' => [
                    'adjustment' => $amount,
                    'new_balance' => $newAmount,
                ],
            ]);

            CacheManager::flush('customer_subscription');

            $this->logInfo('Wallet adjusted', ['subscription_id' => $id, 'amount' => $amount]);
            $this->logActivity('subscription_wallet_adjusted', $updated);

            return $updated;
        });
    }

    public function getStats(): array
    {
        return $this->subscriptionRepo->getStats();
    }

    public function getDashboardStats(): array
    {
        return $this->subscriptionRepo->getDashboardStats();
    }

    public function getTimeline(int $subscriptionId): array
    {
        $subscription = $this->subscriptionRepo->getById($subscriptionId);

        if (! $subscription) {
            return [];
        }

        $events = [];

        $statusHistory = $subscription->statusHistory()->with('changedBy')->orderBy('created_at', 'asc')->get();
        foreach ($statusHistory as $record) {
            $events[] = [
                'type' => 'status_change',
                'date' => $record->created_at->toIso8601String(),
                'from_status' => $record->from_status,
                'to_status' => $record->to_status,
                'reason' => $record->reason,
                'changed_by' => $record->changedBy?->name,
            ];
        }

        $pauseHistory = $subscription->pauseHistory()->orderBy('created_at', 'asc')->get();
        foreach ($pauseHistory as $record) {
            $events[] = [
                'type' => 'pause',
                'date' => $record->created_at->toIso8601String(),
                'action' => $record->action,
                'pause_start' => $record->pause_start?->toDateString(),
                'pause_end' => $record->pause_end?->toDateString(),
                'pause_days' => $record->pause_days,
                'reason' => $record->reason,
            ];
        }

        $skipHistory = $subscription->skipHistory()->orderBy('created_at', 'asc')->get();
        foreach ($skipHistory as $record) {
            $events[] = [
                'type' => 'skip',
                'date' => $record->created_at->toIso8601String(),
                'skip_type' => $record->skip_type,
                'skip_date' => $record->skip_date?->toDateString(),
                'credit_amount' => $record->credit_amount,
                'reason' => $record->reason,
            ];
        }

        $upgradeHistory = $subscription->upgradeHistory()->with(['fromPlan', 'toPlan'])->orderBy('created_at', 'asc')->get();
        foreach ($upgradeHistory as $record) {
            $events[] = [
                'type' => 'upgrade',
                'date' => $record->created_at->toIso8601String(),
                'action' => $record->action,
                'from_plan' => $record->fromPlan?->plan_name,
                'to_plan' => $record->toPlan?->plan_name,
                'price_difference' => $record->price_difference,
                'status' => $record->status,
            ];
        }

        $renewHistory = $subscription->renewHistory()->orderBy('created_at', 'asc')->get();
        foreach ($renewHistory as $record) {
            $events[] = [
                'type' => 'renewal',
                'date' => $record->created_at->toIso8601String(),
                'old_end_date' => $record->old_end_date?->toDateString(),
                'new_end_date' => $record->new_end_date?->toDateString(),
                'final_amount' => $record->final_amount,
                'renewal_type' => $record->renewal_type,
            ];
        }

        usort($events, fn ($a, $b) => strtotime($a['date']) - strtotime($b['date']));

        return $events;
    }
}
