<?php

declare(strict_types=1);

namespace App\Repositories\WeeklyMenu;

use App\Models\CustomerMealSelection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CustomerMealSelectionRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getByCustomer(int $customerId): Collection;
    public function getByMenuId(int $menuId): Collection;
    public function getByDate(string $date, ?int $kitchenId = 1): Collection;
    public function getById(int $id): ?CustomerMealSelection;
    public function getByUuid(string $uuid): ?CustomerMealSelection;
    public function create(array $data): CustomerMealSelection;
    public function update(int $id, array $data): ?CustomerMealSelection;
    public function delete(int $id): bool;
    public function getCustomerSelectionsForWeek(int $customerId, string $weekStartDate): Collection;
    public function getSelectionSummary(int $menuId): array;
    public function bulkAssignDefaults(int $menuId): int;
}
