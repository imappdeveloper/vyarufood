<?php

declare(strict_types=1);

namespace App\Services\WeeklyMenu;

use App\DTOs\WeeklyMenu\CustomerMealSelectionDTO;
use App\Models\CustomerMealSelection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CustomerMealSelectionServiceInterface
{
    public function getPaginatedSelections(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getCustomerSelections(int $customerId, ?string $weekStart = null): Collection;
    public function getSelectionsByMenu(int $menuId): Collection;
    public function getSelectionById(int $id): ?CustomerMealSelection;
    public function selectMeal(CustomerMealSelectionDTO $dto): ?CustomerMealSelection;
    public function updateSelection(int $id, CustomerMealSelectionDTO $dto): ?CustomerMealSelection;
    public function cancelSelection(int $id): bool;
    public function skipMeal(int $customerId, int $menuItemId, string $menuDate): ?CustomerMealSelection;
    public function getSelectionSummary(int $menuId): array;
    public function getSelectionsByDate(string $date, ?int $kitchenId = 1): Collection;
    public function bulkAssignDefaults(int $menuId): int;
    public function canCustomerSelect(int $customerId, int $menuItemId): array;
}
