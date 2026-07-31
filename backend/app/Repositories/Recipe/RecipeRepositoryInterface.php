<?php

declare(strict_types=1);

namespace App\Repositories\Recipe;

use App\Models\Recipe;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RecipeRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getById(int $id): ?Recipe;
    public function getByUuid(string $uuid): ?Recipe;
    public function create(array $data): Recipe;
    public function update(int $id, array $data): ?Recipe;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
    public function forceDelete(int $id): bool;
    public function generateRecipeCode(): string;
}
