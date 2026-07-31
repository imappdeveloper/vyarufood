<?php

declare(strict_types=1);

namespace App\Services\Meal;

use App\Models\MealType;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MealTypeServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?MealType;
    public function findByUuid(string $uuid): ?MealType;
    public function create(array $data): MealType;
    public function update(MealType $mealType, array $data): MealType;
    public function delete(MealType $mealType): bool;
    public function restore(int $id): bool;
    public function forceDelete(MealType $mealType): bool;
    public function setDefault(MealType $mealType): MealType;
    public function setStatus(MealType $mealType, string $status): MealType;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): Collection;
    public function downloadSampleTemplate(): string;
    public function getStats(): array;
    public function getDefault(): ?MealType;
    public function search(?string $search): Collection;
    public function hasRelatedData(MealType $mealType): bool;
}
