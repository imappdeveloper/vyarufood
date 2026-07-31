<?php

declare(strict_types=1);

namespace App\Services\Meal;

use App\Models\MealCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MealCategoryServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?MealCategory;
    public function findByUuid(string $uuid): ?MealCategory;
    public function create(array $data): MealCategory;
    public function update(MealCategory $mealCategory, array $data): MealCategory;
    public function delete(MealCategory $mealCategory): bool;
    public function restore(int $id): bool;
    public function forceDelete(MealCategory $mealCategory): bool;
    public function setDefault(MealCategory $mealCategory): MealCategory;
    public function setStatus(MealCategory $mealCategory, string $status): MealCategory;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): Collection;
    public function downloadSampleTemplate(): string;
    public function getStats(): array;
    public function getDefault(): ?MealCategory;
    public function search(?string $search): Collection;
    public function hasRelatedData(MealCategory $mealCategory): bool;
}
