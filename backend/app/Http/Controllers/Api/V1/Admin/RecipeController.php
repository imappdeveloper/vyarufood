<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Recipe\{StoreRecipeRequest, UpdateRecipeRequest};
use App\Http\Resources\Recipe\{RecipeResource, RecipeItemResource, InventoryConsumptionLogResource, RecipeVersionResource};
use App\Services\Recipe\RecipeServiceInterface;
use App\DTOs\Recipe\RecipeDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecipeController extends BaseController
{
    public function __construct(
        protected RecipeServiceInterface $recipeService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['search', 'status', 'meal_id']);

        $recipes = $this->recipeService->getPaginatedRecipes($filters, $perPage);

        return $this->paginatedResponse(
            RecipeResource::collection($recipes),
            'Recipes retrieved successfully'
        );
    }

    public function store(StoreRecipeRequest $request): JsonResponse
    {
        $dto = RecipeDTO::fromArray($request->validated() + [
            'created_by' => auth()->guard('admin')->id(),
            'updated_by' => auth()->guard('admin')->id(),
        ]);

        $recipe = $this->recipeService->createRecipe($dto);

        return $this->createdResponse(
            new RecipeResource($recipe->fresh(['meal', 'items.inventoryItem', 'items.unit'])),
            'Recipe created successfully.',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $recipe = $this->recipeService->getRecipeByUuid($uuid);

        if (! $recipe) {
            return $this->notFoundResponse('Recipe not found.');
        }

        return $this->successResponse(
            new RecipeResource($recipe),
        );
    }

    public function update(UpdateRecipeRequest $request, string $uuid): JsonResponse
    {
        $recipe = $this->recipeService->getRecipeByUuid($uuid);

        if (! $recipe) {
            return $this->notFoundResponse('Recipe not found.');
        }

        $dto = RecipeDTO::fromArray($request->validated() + [
            'id' => $recipe->id,
            'updated_by' => auth()->guard('admin')->id(),
        ]);

        $updated = $this->recipeService->updateRecipe($recipe->id, $dto);

        return $this->successResponse(
            new RecipeResource($updated->fresh(['meal', 'items.inventoryItem', 'items.unit'])),
            'Recipe updated successfully.',
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $recipe = $this->recipeService->getRecipeByUuid($uuid);

        if (! $recipe) {
            return $this->notFoundResponse('Recipe not found.');
        }

        $this->recipeService->deleteRecipe($recipe->id);

        return $this->successResponse(null, 'Recipe deleted successfully.');
    }

    public function restore(string $uuid): JsonResponse
    {
        $recipe = $this->recipeService->getRecipeByUuid($uuid);

        if (! $recipe) {
            return $this->notFoundResponse('Recipe not found.');
        }

        $this->recipeService->restoreRecipe($recipe->id);

        return $this->successResponse(null, 'Recipe restored successfully.');
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        $recipe = $this->recipeService->getRecipeByUuid($uuid);

        if (! $recipe) {
            return $this->notFoundResponse('Recipe not found.');
        }

        $this->recipeService->forceDeleteRecipe($recipe->id);

        return $this->successResponse(null, 'Recipe permanently deleted.');
    }

    public function clone(string $uuid): JsonResponse
    {
        $recipe = $this->recipeService->getRecipeByUuid($uuid);

        if (! $recipe) {
            return $this->notFoundResponse('Recipe not found.');
        }

        $cloned = $this->recipeService->cloneRecipe($recipe->id);

        return $this->createdResponse(
            new RecipeResource($cloned),
            'Recipe cloned successfully.',
        );
    }

    public function getVersions(string $uuid): JsonResponse
    {
        $recipe = $this->recipeService->getRecipeByUuid($uuid);

        if (! $recipe) {
            return $this->notFoundResponse('Recipe not found.');
        }

        $versions = $this->recipeService->getRecipeVersions($recipe->id);

        return $this->successResponse(
            RecipeVersionResource::collection($versions),
        );
    }

    public function getStats(): JsonResponse
    {
        $stats = $this->recipeService->getStats();

        return $this->successResponse($stats);
    }

    public function getConsumptionLogs(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['recipe_id', 'meal_id', 'inventory_item_id', 'date_from', 'date_to']);

        $logs = $this->recipeService->getConsumptionLogs($filters, $perPage);

        return $this->paginatedResponse(
            InventoryConsumptionLogResource::collection($logs),
            'Consumption logs retrieved successfully'
        );
    }

    public function getFoodCostReport(Request $request): JsonResponse
    {
        $filters = $request->only(['date_from', 'date_to']);

        $report = $this->recipeService->getFoodCostReport($filters);

        return $this->successResponse($report);
    }
}
