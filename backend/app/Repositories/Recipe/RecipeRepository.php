<?php

declare(strict_types=1);

namespace App\Repositories\Recipe;

use App\Models\Recipe;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RecipeRepository extends BaseRepository implements RecipeRepositoryInterface
{
    protected function model(): Recipe
    {
        return new Recipe;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['meal', 'items']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('recipe_code', 'LIKE', "%{$search}%")
                  ->orWhere('recipe_name', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['meal_id'])) {
            $query->where('meal_id', (int) $filters['meal_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id): ?Recipe
    {
        return $this->model->with([
            'meal', 'items.inventoryItem', 'items.unit',
            'versions.approvedBy', 'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?Recipe
    {
        return $this->model->where('uuid', $uuid)->with([
            'meal', 'items.inventoryItem', 'items.unit',
            'versions.approvedBy', 'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): Recipe
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Recipe
    {
        $recipe = $this->model->find($id);
        if ($recipe) {
            $recipe->update($data);
        }
        return $recipe;
    }

    public function delete(int $id): bool
    {
        $recipe = $this->model->find($id);
        return $recipe ? $recipe->delete() : false;
    }

    public function restore(int $id): bool
    {
        $recipe = $this->model->withTrashed()->find($id);
        return $recipe ? $recipe->restore() : false;
    }

    public function forceDelete(int $id): bool
    {
        $recipe = $this->model->withTrashed()->find($id);
        return $recipe ? $recipe->forceDelete() : false;
    }

    public function generateRecipeCode(): string
    {
        $date = now()->format('Ymd');
        $count = $this->model->whereDate('created_at', now()->toDateString())->count() + 1;
        return 'RCP-' . $date . '-' . str_pad((string) $count, 4, '0', STR_PAD_LEFT);
    }
}
