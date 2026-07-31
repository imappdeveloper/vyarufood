<?php

declare(strict_types=1);

namespace App\Services\Recipe;

use App\DTOs\Recipe\RecipeDTO;
use App\Models\Recipe;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RecipeServiceInterface
{
    public function getPaginatedRecipes(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getRecipeById(int $id): ?Recipe;
    public function getRecipeByUuid(string $uuid): ?Recipe;
    public function createRecipe(RecipeDTO $dto): Recipe;
    public function updateRecipe(int $id, RecipeDTO $dto): ?Recipe;
    public function deleteRecipe(int $id): bool;
    public function restoreRecipe(int $id): bool;
    public function forceDeleteRecipe(int $id): bool;
    public function cloneRecipe(int $id): Recipe;
    public function getRecipeVersions(int $recipeId): \Illuminate\Database\Eloquent\Collection;
    public function getStats(): array;
    public function getConsumptionLogs(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getFoodCostReport(array $filters = []): array;
    public function consumeInventory(int $batchId): array;
}
