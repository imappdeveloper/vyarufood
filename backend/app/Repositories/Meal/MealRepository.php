<?php

declare(strict_types=1);

namespace App\Repositories\Meal;

use App\Enums\StatusEnum;
use App\Models\Meal;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MealRepository extends BaseRepository implements MealRepositoryInterface
{
    protected function model(): Meal
    {
        return new Meal;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['category', 'mealType', 'kitchen'])
            ->search($filters['search'] ?? null);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['meal_type_id'])) {
            $query->where('meal_type_id', $filters['meal_type_id']);
        }

        if (! empty($filters['kitchen_id'])) {
            $query->where('kitchen_id', $filters['kitchen_id']);
        }

        if (isset($filters['is_featured']) && $filters['is_featured'] !== '') {
            $query->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_recommended']) && $filters['is_recommended'] !== '') {
            $query->where('is_recommended', filter_var($filters['is_recommended'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_bestseller']) && $filters['is_bestseller'] !== '') {
            $query->where('is_bestseller', filter_var($filters['is_bestseller'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_new']) && $filters['is_new'] !== '') {
            $query->where('is_new', filter_var($filters['is_new'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['availability_type'])) {
            $query->where('availability_type', $filters['availability_type']);
        }

        if (isset($filters['price_min']) && $filters['price_min'] !== '') {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (isset($filters['price_max']) && $filters['price_max'] !== '') {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        $perPage = min($perPage, 100);

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->model->query()
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActive(): Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getById(int $id): ?Meal
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Meal
    {
        return $this->model->where('uuid', $uuid)
            ->with(['category', 'mealType', 'kitchen', 'createdBy', 'updatedBy'])
            ->first();
    }

    public function create(array $data, int $createdBy): Meal
    {
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        if (empty($data['slug'])) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
        }

        return $this->model->create($data);
    }

    public function update(Meal $meal, array $data, int $updatedBy): Meal
    {
        $data['updated_by'] = $updatedBy;

        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
        }

        $meal->update($data);

        return $meal->fresh();
    }

    public function softDelete(Meal $meal, int $deletedBy): bool
    {
        $meal->deleted_by = $deletedBy;
        $meal->save();

        return $meal->delete();
    }

    public function restore(int $id): bool
    {
        $meal = $this->model->withTrashed()->find($id);

        if (! $meal) {
            return false;
        }

        return $meal->restore();
    }

    public function forceDelete(Meal $meal): bool
    {
        return $meal->forceDelete();
    }

    public function setStatus(Meal $meal, string $status): Meal
    {
        $meal->status = $status;
        $meal->save();

        return $meal->fresh();
    }

    public function bulkDelete(array $ids): int
    {
        return $this->model->whereIn('id', $ids)->delete();
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        return $this->model->whereIn('id', $ids)->update(['status' => $status]);
    }

    public function bulkUpdatePrice(array $ids, array $prices): int
    {
        return $this->model->whereIn('id', $ids)->update($prices);
    }

    public function bulkUpdateCategory(array $ids, int $categoryId): int
    {
        return $this->model->whereIn('id', $ids)->update(['category_id' => $categoryId]);
    }

    public function import(array $rows): array
    {
        $successes = 0;
        $failures = [];
        $createdBy = auth()->guard('admin')->id();

        foreach ($rows as $index => $row) {
            try {
                $this->create($row, $createdBy);
                $successes++;
            } catch (\Exception $e) {
                $failures[] = [
                    'row' => $index + 1,
                    'error' => $e->getMessage(),
                    'data' => $row,
                ];
            }
        }

        return [
            'successes' => $successes,
            'failures' => $failures,
            'total' => count($rows),
        ];
    }

    public function getForExport(?array $filters = null): Collection
    {
        $query = $this->model->query();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy('display_order', 'asc')->orderBy('created_at', 'desc')->get();
    }

    public function countByStatus(): array
    {
        return $this->model->query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function countByAvailabilityType(): array
    {
        return $this->model->query()
            ->selectRaw('availability_type, count(*) as count')
            ->groupBy('availability_type')
            ->pluck('count', 'availability_type')
            ->toArray();
    }

    public function countFeatured(): int
    {
        return $this->model->query()->where('is_featured', true)->count();
    }

    public function countRecommended(): int
    {
        return $this->model->query()->where('is_recommended', true)->count();
    }

    public function countBestseller(): int
    {
        return $this->model->query()->where('is_bestseller', true)->count();
    }

    public function countNew(): int
    {
        return $this->model->query()->where('is_new', true)->count();
    }

    public function search(?string $search): Collection
    {
        return $this->model->query()
            ->search($search)
            ->limit(25)
            ->get();
    }

    public function hasRelatedData(Meal $meal): bool
    {
        return false;
    }

    public function duplicate(Meal $meal, int $createdBy): Meal
    {
        $data = $meal->toArray();
        unset($data['id'], $data['uuid'], $data['created_at'], $data['updated_at'], $data['deleted_at']);
        $data['name'] = $meal->name . ' (Copy)';
        $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
        $data['meal_code'] = $meal->meal_code . '-COPY';
        $data['status'] = 'inactive';

        return $this->create($data, $createdBy);
    }

    public function getStats(): array
    {
        return [
            'total' => $this->model->count(),
            'total_by_status' => $this->countByStatus(),
            'total_by_availability_type' => $this->countByAvailabilityType(),
            'featured_count' => $this->countFeatured(),
            'recommended_count' => $this->countRecommended(),
            'bestseller_count' => $this->countBestseller(),
            'new_count' => $this->countNew(),
            'avg_price' => round((float) $this->model->avg('price'), 2),
            'min_price' => (float) $this->model->min('price'),
            'max_price' => (float) $this->model->max('price'),
        ];
    }
}
