<?php

declare(strict_types=1);

namespace App\Repositories\Meal;

use App\DTOs\Meal\MealTypeDTO;
use App\Models\MealType;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MealTypeRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?MealType;
    public function findByUuid(string $uuid): ?MealType;
    public function create(MealTypeDTO $dto, int $createdBy): MealType;
    public function update(MealType $mealType, array $data, int $updatedBy): MealType;
    public function softDelete(MealType $mealType, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(MealType $mealType): bool;
    public function setDefault(MealType $mealType): MealType;
    public function unsetOtherDefaults(?int $excludeId = null): void;
    public function setStatus(MealType $mealType, string $status): MealType;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): Collection;
    public function countByStatus(): array;
    public function countDefault(): int;
    public function getDefault(): ?MealType;
    public function search(?string $search): Collection;
    public function hasRelatedData(MealType $mealType): bool;
}
