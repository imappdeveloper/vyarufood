<?php

declare(strict_types=1);

namespace App\Services\CustomerSubscription;

use App\DTOs\CustomerSubscription\{CancelSubscriptionDTO, CustomerSubscriptionDTO, PauseSubscriptionDTO, RenewSubscriptionDTO, SkipSubscriptionDTO, UpgradeSubscriptionDTO};
use App\Models\CustomerSubscription;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerSubscriptionServiceInterface
{
    public function getPaginatedSubscriptions(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getSubscriptionById(int $id): ?CustomerSubscription;
    public function getSubscriptionByUuid(string $uuid): ?CustomerSubscription;
    public function getCustomerSubscriptions(int $customerId, array $filters = []): LengthAwarePaginator;
    public function purchaseSubscription(CustomerSubscriptionDTO $dto): CustomerSubscription;
    public function activateSubscription(int $id): ?CustomerSubscription;
    public function pauseSubscription(PauseSubscriptionDTO $dto): ?CustomerSubscription;
    public function resumeSubscription(int $id, ?string $reason = null, ?string $remarks = null): ?CustomerSubscription;
    public function skipMeal(SkipSubscriptionDTO $dto): ?CustomerSubscription;
    public function upgradeSubscription(UpgradeSubscriptionDTO $dto): ?CustomerSubscription;
    public function downgradeSubscription(UpgradeSubscriptionDTO $dto): ?CustomerSubscription;
    public function renewSubscription(RenewSubscriptionDTO $dto): ?CustomerSubscription;
    public function updateSubscription(int $id, array $data): ?CustomerSubscription;
    public function deleteSubscription(int $id): bool;
    public function restoreSubscription(int $id): ?CustomerSubscription;
    public function cancelSubscription(CancelSubscriptionDTO $dto): ?CustomerSubscription;
    public function suspendSubscription(int $id, ?string $reason = null): ?CustomerSubscription;
    public function forceResumeSubscription(int $id, ?string $reason = null): ?CustomerSubscription;
    public function approveUpgrade(int $historyId, int $approvedBy): ?CustomerSubscription;
    public function adjustMeals(int $id, int $additionalMeals, ?string $reason = null): ?CustomerSubscription;
    public function adjustWallet(int $id, float $amount, ?string $reason = null): ?CustomerSubscription;
    public function getStats(): array;
    public function getDashboardStats(): array;
    public function getTimeline(int $subscriptionId): array;
}
