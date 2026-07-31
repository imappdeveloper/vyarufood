<?php

declare(strict_types=1);

namespace App\Services\Meal;

use App\Models\Meal;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MealServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?Meal;
    public function findByUuid(string $uuid): ?Meal;
    public function create(array $data): Meal;
    public function update(Meal $meal, array $data): Meal;
    public function delete(Meal $meal): bool;
    public function restore(int $id): bool;
    public function forceDelete(Meal $meal): bool;
    public function setStatus(Meal $meal, string $status): Meal;
    public function setFeatured(Meal $meal, bool $isFeatured): Meal;
    public function setRecommended(Meal $meal, bool $isRecommended): Meal;
    public function setBestseller(Meal $meal, bool $isBestseller): Meal;
    public function setNewFlag(Meal $meal, bool $isNew): Meal;
    public function duplicate(Meal $meal): Meal;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function bulkUpdatePrice(array $ids, array $prices): int;
    public function bulkUpdateCategory(array $ids, int $categoryId): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): Collection;
    public function downloadSampleTemplate(): string;
    public function getStats(): array;
    public function search(?string $search): Collection;
    public function hasRelatedData(Meal $meal): bool;
}
