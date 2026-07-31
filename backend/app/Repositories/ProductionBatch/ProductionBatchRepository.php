<?php

declare(strict_types=1);

namespace App\Repositories\ProductionBatch;

use App\Models\{ProductionBatch, ProductionBatchItem, MealPackingList};
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductionBatchRepository extends BaseRepository implements ProductionBatchRepositoryInterface
{
    protected function model(): ProductionBatch
    {
        return new ProductionBatch;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['kitchen']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('batch_number', 'LIKE', "%{$search}%")
                  ->orWhere('batch_name', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['production_status'])) {
            $query->where('production_status', $filters['production_status']);
        }

        if (! empty($filters['kitchen_id'])) {
            $query->where('kitchen_id', (int) $filters['kitchen_id']);
        }

        if (! empty($filters['batch_type'])) {
            $query->where('batch_type', $filters['batch_type']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('production_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('production_date', '<=', $filters['date_to']);
        }

        if (! empty($filters['production_date'])) {
            $query->where('production_date', $filters['production_date']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('production_date', 'desc')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->model->query()->with(['kitchen'])->orderBy('production_date', 'desc')->get();
    }

    public function getById(int $id): ?ProductionBatch
    {
        return $this->model->with([
            'kitchen', 'items.meal', 'items.mealCategory', 'items.mealType',
            'packingLists.order', 'packingLists.customer', 'packingLists.meal',
            'statusHistory.changedBy', 'createdBy', 'updatedBy', 'preparedBy', 'approvedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?ProductionBatch
    {
        return $this->model->where('uuid', $uuid)->with([
            'kitchen', 'items.meal', 'items.mealCategory', 'items.mealType',
            'packingLists.order', 'packingLists.customer', 'packingLists.meal',
            'statusHistory.changedBy', 'createdBy', 'updatedBy', 'preparedBy', 'approvedBy',
        ])->first();
    }

    public function create(array $data): ProductionBatch
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?ProductionBatch
    {
        $batch = $this->model->find($id);
        if ($batch) {
            $batch->update($data);
        }
        return $batch;
    }

    public function delete(int $id): bool
    {
        $batch = $this->model->find($id);
        return $batch ? $batch->delete() : false;
    }

    public function restore(int $id): bool
    {
        $batch = $this->model->withTrashed()->find($id);
        return $batch ? $batch->restore() : false;
    }

    public function forceDelete(int $id): bool
    {
        $batch = $this->model->withTrashed()->find($id);
        return $batch ? $batch->forceDelete() : false;
    }

    public function getStats(): array
    {
        $today = now()->toDateString();
        return [
            'total' => $this->model->count(),
            'today' => $this->model->where('production_date', $today)->count(),
            'draft' => $this->model->where('production_status', 'draft')->count(),
            'planned' => $this->model->where('production_status', 'planned')->count(),
            'cooking' => $this->model->where('production_status', 'cooking')->count(),
            'preparing' => $this->model->where('production_status', 'prepared')->count(),
            'packing' => $this->model->where('production_status', 'packing')->count(),
            'completed' => $this->model->where('production_status', 'completed')->count(),
            'cancelled' => $this->model->where('production_status', 'cancelled')->count(),
            'today_meals' => (int) $this->model->where('production_date', $today)->sum('total_meals'),
        ];
    }

    public function getTodayProduction(int $kitchenId = null): Collection
    {
        $query = $this->model->query()->with(['kitchen', 'items.meal'])
            ->where('production_date', now()->toDateString());

        if ($kitchenId) {
            $query->where('kitchen_id', $kitchenId);
        }

        return $query->orderBy('planned_start_time', 'asc')->get();
    }

    public function generateBatchNumber(): string
    {
        $date = now()->format('Ymd');
        $count = $this->model->whereDate('production_date', now()->toDateString())->count() + 1;
        return 'PB-' . $date . '-' . str_pad((string) $count, 4, '0', STR_PAD_LEFT);
    }

    public function getProductionSummary(string $date, ?int $kitchenId = null): array
    {
        $query = $this->model->with(['items.meal'])
            ->where('production_date', $date);

        if ($kitchenId) {
            $query->where('kitchen_id', $kitchenId);
        }

        $batches = $query->get();
        $items = $batches->flatMap->items;

        return [
            'date' => $date,
            'total_batches' => $batches->count(),
            'total_orders' => $batches->sum('total_orders'),
            'total_meals' => $batches->sum('total_meals'),
            'meal_summary' => $items->groupBy('meal_id')->map(fn ($group) => [
                'meal_id' => $group->first()->meal_id,
                'meal_name' => $group->first()->meal?->name ?? 'Unknown',
                'planned' => $group->sum('planned_quantity'),
                'prepared' => $group->sum('prepared_quantity'),
                'packed' => $group->sum('packed_quantity'),
                'wastage' => $group->sum('wastage_quantity'),
            ])->values()->all(),
            'status_summary' => $batches->groupBy('production_status')->map(fn ($group) => $group->count())->all(),
        ];
    }

    public function getPackingList(int $batchId): Collection
    {
        return MealPackingList::where('production_batch_id', $batchId)
            ->with(['order', 'customer', 'meal'])
            ->orderBy('packing_status')
            ->get();
    }
}
