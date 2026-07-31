<?php

declare(strict_types=1);

namespace App\Services\Recipe;

use App\DTOs\Recipe\RecipeDTO;
use App\Models\{Recipe, RecipeItem, RecipeVersion, InventoryItem, InventoryConsumptionLog, ProductionBatch, ProductionBatchItem};
use App\Repositories\Recipe\RecipeRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RecipeService extends BaseService implements RecipeServiceInterface
{
    protected string $moduleName = 'recipe';

    public function __construct(
        protected RecipeRepositoryInterface $recipeRepo,
    ) {}

    public function getPaginatedRecipes(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->recipeRepo->getPaginated($filters, $perPage);
    }

    public function getRecipeById(int $id): ?Recipe
    {
        return $this->recipeRepo->getById($id);
    }

    public function getRecipeByUuid(string $uuid): ?Recipe
    {
        return $this->recipeRepo->getByUuid($uuid);
    }

    public function createRecipe(RecipeDTO $dto): Recipe
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $data = [
                'recipe_code' => $dto->recipeCode ?? $this->recipeRepo->generateRecipeCode(),
                'meal_id' => $dto->mealId,
                'recipe_name' => $dto->recipeName,
                'version' => 1,
                'yield_quantity' => $dto->yieldQuantity,
                'yield_unit' => $dto->yieldUnit,
                'preparation_time' => $dto->preparationTime,
                'cooking_time' => $dto->cookingTime,
                'serving_size' => $dto->servingSize,
                'recipe_cost' => $dto->recipeCost,
                'food_cost_percentage' => $dto->foodCostPercentage,
                'status' => $dto->status,
                'remarks' => $dto->remarks,
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ];

            $recipe = $this->recipeRepo->create($data);

            foreach ($dto->items as $index => $itemDto) {
                RecipeItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'recipe_id' => $recipe->id,
                    'inventory_item_id' => $itemDto->inventoryItemId,
                    'unit_id' => $itemDto->unitId,
                    'required_quantity' => $itemDto->requiredQuantity,
                    'wastage_percentage' => $itemDto->wastagePercentage,
                    'actual_quantity' => $itemDto->actualQuantity,
                    'cost' => $itemDto->cost,
                    'display_order' => $itemDto->displayOrder ?: ($index + 1),
                    'remarks' => $itemDto->remarks,
                ]);
            }

            RecipeVersion::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'recipe_id' => $recipe->id,
                'version' => 1,
                'change_notes' => 'Initial recipe creation',
            ]);

            CacheManager::flush('recipe');
            $this->logInfo('Recipe created', ['recipe_id' => $recipe->id]);
            $this->logActivity('recipe_created', $recipe);

            return $recipe->fresh(['meal', 'items.inventoryItem', 'items.unit']);
        });
    }

    public function updateRecipe(int $id, RecipeDTO $dto): ?Recipe
    {
        return $this->transaction(function () use ($id, $dto) {
            $recipe = $this->recipeRepo->getById($id);

            if (! $recipe) {
                throw new \RuntimeException('Recipe not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $newVersion = $recipe->version + 1;

            $data = array_filter([
                'recipe_name' => $dto->recipeName,
                'meal_id' => $dto->mealId,
                'yield_quantity' => $dto->yieldQuantity,
                'yield_unit' => $dto->yieldUnit,
                'preparation_time' => $dto->preparationTime,
                'cooking_time' => $dto->cookingTime,
                'serving_size' => $dto->servingSize,
                'recipe_cost' => $dto->recipeCost,
                'food_cost_percentage' => $dto->foodCostPercentage,
                'status' => $dto->status,
                'remarks' => $dto->remarks,
                'version' => $newVersion,
                'updated_by' => $adminId,
            ], fn ($v) => $v !== null);

            $this->recipeRepo->update($id, $data);

            if (! empty($dto->items)) {
                RecipeItem::where('recipe_id', $id)->delete();

                foreach ($dto->items as $index => $itemDto) {
                    RecipeItem::create([
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'recipe_id' => $id,
                        'inventory_item_id' => $itemDto->inventoryItemId,
                        'unit_id' => $itemDto->unitId,
                        'required_quantity' => $itemDto->requiredQuantity,
                        'wastage_percentage' => $itemDto->wastagePercentage,
                        'actual_quantity' => $itemDto->actualQuantity,
                        'cost' => $itemDto->cost,
                        'display_order' => $itemDto->displayOrder ?: ($index + 1),
                        'remarks' => $itemDto->remarks,
                    ]);
                }
            }

            RecipeVersion::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'recipe_id' => $id,
                'version' => $newVersion,
                'change_notes' => $dto->remarks ?? 'Recipe updated',
            ]);

            CacheManager::flush('recipe');
            $this->logInfo('Recipe updated', ['recipe_id' => $id, 'version' => $newVersion]);
            $this->logActivity('recipe_updated', $recipe);

            return $this->recipeRepo->getById($id);
        });
    }

    public function deleteRecipe(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $recipe = $this->recipeRepo->getById($id);

            if (! $recipe) {
                throw new \RuntimeException('Recipe not found.');
            }

            $result = $this->recipeRepo->delete($id);
            CacheManager::flush('recipe');
            $this->logActivity('recipe_deleted', null, ['recipe_id' => $id]);

            return $result;
        });
    }

    public function restoreRecipe(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->recipeRepo->restore($id);
            CacheManager::flush('recipe');
            $this->logActivity('recipe_restored', null, ['recipe_id' => $id]);
            return $result;
        });
    }

    public function forceDeleteRecipe(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->recipeRepo->forceDelete($id);
            CacheManager::flush('recipe');
            return $result;
        });
    }

    public function cloneRecipe(int $id): Recipe
    {
        return $this->transaction(function () use ($id) {
            $original = $this->recipeRepo->getById($id);

            if (! $original) {
                throw new \RuntimeException('Recipe not found.');
            }

            $adminId = auth()->guard('admin')->id();

            $recipe = $this->recipeRepo->create([
                'recipe_code' => $this->recipeRepo->generateRecipeCode(),
                'meal_id' => $original->meal_id,
                'recipe_name' => $original->recipe_name . ' (Copy)',
                'version' => 1,
                'yield_quantity' => $original->yield_quantity,
                'yield_unit' => $original->yield_unit,
                'preparation_time' => $original->preparation_time,
                'cooking_time' => $original->cooking_time,
                'serving_size' => $original->serving_size,
                'recipe_cost' => $original->recipe_cost,
                'food_cost_percentage' => $original->food_cost_percentage,
                'status' => 'draft',
                'remarks' => 'Cloned from ' . $original->recipe_code,
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            foreach ($original->items as $item) {
                RecipeItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'recipe_id' => $recipe->id,
                    'inventory_item_id' => $item->inventory_item_id,
                    'unit_id' => $item->unit_id,
                    'required_quantity' => $item->required_quantity,
                    'wastage_percentage' => $item->wastage_percentage,
                    'actual_quantity' => $item->actual_quantity,
                    'cost' => $item->cost,
                    'display_order' => $item->display_order,
                    'remarks' => $item->remarks,
                ]);
            }

            RecipeVersion::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'recipe_id' => $recipe->id,
                'version' => 1,
                'change_notes' => 'Cloned from recipe ' . $original->recipe_code,
            ]);

            CacheManager::flush('recipe');
            $this->logInfo('Recipe cloned', ['original_id' => $id, 'new_id' => $recipe->id]);
            $this->logActivity('recipe_cloned', $recipe);

            return $recipe->fresh(['meal', 'items.inventoryItem', 'items.unit']);
        });
    }

    public function getRecipeVersions(int $recipeId): \Illuminate\Database\Eloquent\Collection
    {
        return RecipeVersion::where('recipe_id', $recipeId)
            ->with('approvedBy')
            ->orderBy('version', 'desc')
            ->get();
    }

    public function getStats(): array
    {
        $model = new Recipe;

        return [
            'total_recipes' => $model->count(),
            'active_recipes' => $model->where('status', 'active')->count(),
            'draft_recipes' => $model->where('status', 'draft')->count(),
            'total_items' => RecipeItem::count(),
            'average_cost' => round((float) $model->where('status', 'active')->avg('recipe_cost'), 2),
        ];
    }

    public function getConsumptionLogs(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = InventoryConsumptionLog::with(['recipe', 'meal', 'inventoryItem', 'productionBatch']);

        if (! empty($filters['recipe_id'])) {
            $query->where('recipe_id', (int) $filters['recipe_id']);
        }

        if (! empty($filters['meal_id'])) {
            $query->where('meal_id', (int) $filters['meal_id']);
        }

        if (! empty($filters['inventory_item_id'])) {
            $query->where('inventory_item_id', (int) $filters['inventory_item_id']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('consumption_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('consumption_date', '<=', $filters['date_to']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('consumption_date', 'desc')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getFoodCostReport(array $filters = []): array
    {
        $query = InventoryConsumptionLog::query()
            ->selectRaw('recipe_id, meal_id, SUM(total_cost) as total_cost, SUM(consumed_quantity) as total_quantity, COUNT(*) as consumption_count')
            ->groupBy('recipe_id', 'meal_id');

        if (! empty($filters['date_from'])) {
            $query->where('consumption_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('consumption_date', '<=', $filters['date_to']);
        }

        $results = $query->with(['recipe', 'meal'])->get();

        $report = $results->map(fn ($item) => [
            'recipe_id' => $item->recipe_id,
            'recipe_name' => $item->recipe?->recipe_name,
            'recipe_code' => $item->recipe?->recipe_code,
            'meal_id' => $item->meal_id,
            'meal_name' => $item->meal?->name,
            'total_cost' => round((float) $item->total_cost, 2),
            'total_quantity' => round((float) $item->total_quantity, 4),
            'consumption_count' => $item->consumption_count,
            'average_cost_per_unit' => $item->total_quantity > 0
                ? round((float) $item->total_cost / (float) $item->total_quantity, 2)
                : 0,
        ])->values()->all();

        $grandTotal = $results->sum('total_cost');

        return [
            'items' => $report,
            'grand_total' => round((float) $grandTotal, 2),
            'date_from' => $filters['date_from'] ?? null,
            'date_to' => $filters['date_to'] ?? null,
        ];
    }

    public function consumeInventory(int $batchId): array
    {
        return $this->transaction(function () use ($batchId) {
            $batch = ProductionBatch::with(['items.meal'])->find($batchId);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            $logs = [];
            $totalCost = 0;

            foreach ($batch->items as $batchItem) {
                $recipe = Recipe::where('meal_id', $batchItem->meal_id)
                    ->where('status', 'active')
                    ->first();

                if (! $recipe) {
                    continue;
                }

                $recipeItems = RecipeItem::with('inventoryItem')->where('recipe_id', $recipe->id)->get();

                foreach ($recipeItems as $recipeItem) {
                    $inventoryItem = $recipeItem->inventoryItem;

                    if (! $inventoryItem) {
                        continue;
                    }

                    $quantityPerBatch = $recipeItem->required_quantity * $batchItem->planned_quantity;
                    $wastageAmount = $quantityPerBatch * ($recipeItem->wastage_percentage / 100);
                    $actualConsumed = $quantityPerBatch + $wastageAmount;

                    $unitCost = $inventoryItem->cost_price;
                    $totalItemCost = round($actualConsumed * $unitCost, 2);

                    $inventoryItem->decrement('current_stock', $actualConsumed);

                    if ($inventoryItem->current_stock <= $inventoryItem->minimum_stock) {
                        $inventoryItem->update(['status' => 'low_stock']);
                    }

                    $log = InventoryConsumptionLog::create([
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'production_batch_id' => $batchId,
                        'recipe_id' => $recipe->id,
                        'meal_id' => $batchItem->meal_id,
                        'inventory_item_id' => $inventoryItem->id,
                        'consumed_quantity' => $actualConsumed,
                        'unit_cost' => $unitCost,
                        'total_cost' => $totalItemCost,
                        'consumption_date' => $batch->production_date,
                    ]);

                    $logs[] = $log;
                    $totalCost += $totalItemCost;
                }

                $recipe->update(['recipe_cost' => round($totalCost, 2)]);
            }

            CacheManager::flush('recipe');
            $this->logInfo('Inventory consumed for batch', ['batch_id' => $batchId, 'total_cost' => $totalCost]);
            $this->logActivity('inventory_consumed', $batch, ['total_cost' => $totalCost]);

            return ['logs' => $logs, 'total_cost' => round($totalCost, 2)];
        });
    }
}
