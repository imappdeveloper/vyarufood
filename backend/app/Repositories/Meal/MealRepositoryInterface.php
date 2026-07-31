<?php

declare(strict_types=1);

namespace App\Repositories\Meal;

use App\Models\Meal;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MealRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?Meal;
    public function findByUuid(string $uuid): ?Meal;
    public function create(array $data, int $createdBy): Meal;
    public function update(Meal $meal, array $data, int $updatedBy): Meal;
    public function softDelete(Meal $meal, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(Meal $meal): bool;
    public function setStatus(Meal $meal, string $status): Meal;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function bulkUpdatePrice(array $ids, array $prices): int;
    public function bulkUpdateCategory(array $ids, int $categoryId): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): Collection;
    public function countByStatus(): array;
    public function countByAvailabilityType(): array;
    public function countFeatured(): int;
    public function countRecommended(): int;
    public function countBestseller(): int;
    public function countNew(): int;
    public function search(?string $search): Collection;
    public function hasRelatedData(Meal $meal): bool;
    public function duplicate(Meal $meal, int $createdBy): Meal;
    public function getStats(): array;
}
