<?php

declare(strict_types=1);

namespace App\Repositories\Meal;

use App\DTOs\Meal\MealCategoryDTO;
use App\Models\MealCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MealCategoryRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?MealCategory;
    public function findByUuid(string $uuid): ?MealCategory;
    public function create(MealCategoryDTO $dto, int $createdBy): MealCategory;
    public function update(MealCategory $mealCategory, array $data, int $updatedBy): MealCategory;
    public function softDelete(MealCategory $mealCategory, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(MealCategory $mealCategory): bool;
    public function setDefault(MealCategory $mealCategory): MealCategory;
    public function unsetOtherDefaults(?int $excludeId = null): void;
    public function setStatus(MealCategory $mealCategory, string $status): MealCategory;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): Collection;
    public function countByStatus(): array;
    public function countDefault(): int;
    public function getDefault(): ?MealCategory;
    public function search(?string $search): Collection;
    public function hasRelatedData(MealCategory $mealCategory): bool;
}
