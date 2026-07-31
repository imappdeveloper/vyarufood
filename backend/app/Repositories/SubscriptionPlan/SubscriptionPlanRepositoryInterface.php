<?php

declare(strict_types=1);

namespace App\Repositories\SubscriptionPlan;

use App\Models\SubscriptionPlan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface SubscriptionPlanRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getById(int $id): ?SubscriptionPlan;
    public function getByUuid(string $uuid): ?SubscriptionPlan;
    public function create(array $data): SubscriptionPlan;
    public function update(int $id, array $data): ?SubscriptionPlan;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
    public function forceDelete(int $id): bool;
    public function getStats(): array;
}
