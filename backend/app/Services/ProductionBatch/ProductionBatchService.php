<?php

declare(strict_types=1);

namespace App\Services\ProductionBatch;

use App\DTOs\ProductionBatch\{ProductionBatchDTO, UpdateBatchItemDTO};
use App\Models\{ProductionBatch, ProductionBatchItem, MealPackingList, ProductionStatusHistory, Order};
use App\Repositories\ProductionBatch\ProductionBatchRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductionBatchService extends BaseService implements ProductionBatchServiceInterface
{
    protected string $moduleName = 'production_batch';

    public function __construct(
        protected ProductionBatchRepositoryInterface $batchRepo,
    ) {}

    public function getPaginatedBatches(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->batchRepo->getPaginated($filters, $perPage);
    }

    public function getBatchById(int $id): ?ProductionBatch
    {
        return $this->batchRepo->getById($id);
    }

    public function getBatchByUuid(string $uuid): ?ProductionBatch
    {
        return $this->batchRepo->getByUuid($uuid);
    }

    public function createBatch(ProductionBatchDTO $dto): ProductionBatch
    {
        return $this->transaction(function () use ($dto) {
            $data = [
                'batch_number' => $this->batchRepo->generateBatchNumber(),
                'production_date' => $dto->productionDate ?? now()->toDateString(),
                'kitchen_id' => $dto->kitchenId,
                'batch_name' => $dto->batchName ?? 'Batch ' . now()->format('Y-m-d'),
                'batch_type' => $dto->batchType,
                'planned_start_time' => $dto->plannedStartTime,
                'planned_end_time' => $dto->plannedEndTime,
                'remarks' => $dto->remarks,
                'production_status' => 'draft',
                'created_by' => auth()->guard('admin')->id(),
                'updated_by' => auth()->guard('admin')->id(),
            ];

            $batch = $this->batchRepo->create($data);

            $this->recordStatusHistory($batch->id, null, 'draft', 'Batch created');
            CacheManager::flush('production');
            $this->logInfo('Batch created', ['batch_id' => $batch->id]);
            $this->logActivity('production_batch_created', $batch);

            return $batch;
        });
    }

    public function updateBatch(int $id, ProductionBatchDTO $dto): ?ProductionBatch
    {
        return $this->transaction(function () use ($id, $dto) {
            $batch = $this->batchRepo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            if (in_array($batch->production_status, ['completed', 'cancelled'])) {
                throw new \RuntimeException('Cannot edit a completed or cancelled batch.');
            }

            $data = array_filter([
                'batch_name' => $dto->batchName,
                'production_date' => $dto->productionDate,
                'kitchen_id' => $dto->kitchenId,
                'batch_type' => $dto->batchType,
                'planned_start_time' => $dto->plannedStartTime,
                'planned_end_time' => $dto->plannedEndTime,
                'remarks' => $dto->remarks,
                'updated_by' => auth()->guard('admin')->id(),
            ], fn ($v) => $v !== null);

            $updated = $this->batchRepo->update($id, $data);

            CacheManager::flush('production');
            $this->logInfo('Batch updated', ['batch_id' => $id]);
            $this->logActivity('production_batch_updated', $updated);

            return $updated;
        });
    }

    public function deleteBatch(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $batch = $this->batchRepo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            if (in_array($batch->production_status, ['cooking', 'prepared', 'packing', 'packed'])) {
                throw new \RuntimeException('Cannot delete a batch that is in progress.');
            }

            $result = $this->batchRepo->delete($id);
            CacheManager::flush('production');
            $this->logActivity('production_batch_deleted', null, ['batch_id' => $id]);

            return $result;
        });
    }

    public function restoreBatch(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->batchRepo->restore($id);
            CacheManager::flush('production');
            $this->logActivity('production_batch_restored', null, ['batch_id' => $id]);
            return $result;
        });
    }

    public function forceDeleteBatch(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->batchRepo->forceDelete($id);
            CacheManager::flush('production');
            return $result;
        });
    }

    public function startProduction(int $id): ?ProductionBatch
    {
        return $this->transaction(function () use ($id) {
            $batch = $this->batchRepo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            if (! in_array($batch->production_status, ['draft', 'planned'])) {
                throw new \RuntimeException('Batch must be in draft or planned status to start.');
            }

            $adminId = auth()->guard('admin')->id();
            $this->batchRepo->update($id, [
                'production_status' => 'cooking',
                'actual_start_time' => now(),
                'prepared_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->recordStatusHistory($id, $batch->production_status, 'cooking', 'Production started');
            CacheManager::flush('production');
            $this->logActivity('production_started', $batch);
            $this->logInfo('Production started', ['batch_id' => $id]);

            return $this->batchRepo->getById($id);
        });
    }

    public function pauseProduction(int $id): ?ProductionBatch
    {
        return $this->transaction(function () use ($id) {
            $batch = $this->batchRepo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            if ($batch->production_status !== 'cooking') {
                throw new \RuntimeException('Only cooking batches can be paused.');
            }

            $adminId = auth()->guard('admin')->id();
            $this->batchRepo->update($id, [
                'production_status' => 'planned',
                'updated_by' => $adminId,
            ]);

            $this->recordStatusHistory($id, 'cooking', 'planned', 'Production paused');
            CacheManager::flush('production');
            $this->logActivity('production_paused', $batch);

            return $this->batchRepo->getById($id);
        });
    }

    public function completeProduction(int $id): ?ProductionBatch
    {
        return $this->transaction(function () use ($id) {
            $batch = $this->batchRepo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            if (! in_array($batch->production_status, ['cooking', 'cooked', 'prepared', 'packing', 'packed'])) {
                throw new \RuntimeException('Batch cannot be completed from current status.');
            }

            $adminId = auth()->guard('admin')->id();
            $this->batchRepo->update($id, [
                'production_status' => 'completed',
                'actual_end_time' => now(),
                'approved_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->recordStatusHistory($id, $batch->production_status, 'completed', 'Production completed');
            CacheManager::flush('production');
            $this->logActivity('production_completed', $batch);

            return $this->batchRepo->getById($id);
        });
    }

    public function cancelProduction(int $id, ?string $reason = null): ?ProductionBatch
    {
        return $this->transaction(function () use ($id, $reason) {
            $batch = $this->batchRepo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            if ($batch->production_status === 'completed') {
                throw new \RuntimeException('Cannot cancel a completed batch.');
            }

            $adminId = auth()->guard('admin')->id();
            $this->batchRepo->update($id, [
                'production_status' => 'cancelled',
                'remarks' => $reason ?? $batch->remarks,
                'updated_by' => $adminId,
            ]);

            $this->recordStatusHistory($id, $batch->production_status, 'cancelled', $reason ?? 'Cancelled');
            CacheManager::flush('production');
            $this->logActivity('production_cancelled', $batch);

            return $this->batchRepo->getById($id);
        });
    }

    public function updateBatchItem(int $batchId, UpdateBatchItemDTO $dto): ?ProductionBatch
    {
        return $this->transaction(function () use ($batchId, $dto) {
            $batch = $this->batchRepo->getById($batchId);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            if (in_array($batch->production_status, ['completed', 'cancelled'])) {
                throw new \RuntimeException('Cannot update items of a completed or cancelled batch.');
            }

            $item = ProductionBatchItem::find($dto->id);

            if (! $item || $item->production_batch_id !== $batchId) {
                throw new \RuntimeException('Batch item not found.');
            }

            $data = array_filter([
                'prepared_quantity' => $dto->preparedQuantity,
                'packed_quantity' => $dto->packedQuantity,
                'wastage_quantity' => $dto->wastageQuantity,
                'status' => $dto->status,
                'remarks' => $dto->remarks,
            ], fn ($v) => $v !== null);

            if (isset($data['packed_quantity']) && isset($data['prepared_quantity'])) {
                if ($data['packed_quantity'] > $data['prepared_quantity']) {
                    throw new \RuntimeException('Packed quantity cannot exceed prepared quantity.');
                }
            }

            if (isset($data['prepared_quantity'])) {
                $data['remaining_quantity'] = $data['prepared_quantity'] - ($dto->packedQuantity ?? $item->packed_quantity) - ($dto->wastageQuantity ?? $item->wastage_quantity);
            }

            $item->update($data);
            CacheManager::flush('production');

            return $this->batchRepo->getById($batchId);
        });
    }

    public function updateWastage(int $batchId, int $itemId, int $wastageQuantity, ?string $reason = null): ?ProductionBatch
    {
        return $this->transaction(function () use ($batchId, $itemId, $wastageQuantity, $reason) {
            $batch = $this->batchRepo->getById($batchId);

            if (! $batch) {
                throw new \RuntimeException('Production batch not found.');
            }

            $item = ProductionBatchItem::find($itemId);

            if (! $item || $item->production_batch_id !== $batchId) {
                throw new \RuntimeException('Batch item not found.');
            }

            $item->update([
                'wastage_quantity' => $wastageQuantity,
                'remaining_quantity' => $item->prepared_quantity - $item->packed_quantity - $wastageQuantity,
            ]);

            CacheManager::flush('production');
            $this->logActivity('waste_recorded', $batch, [
                'item_id' => $itemId,
                'wastage' => $wastageQuantity,
                'reason' => $reason,
            ]);

            return $this->batchRepo->getById($batchId);
        });
    }

    public function packMeal(int $packingListId, int $packedBy): ?ProductionBatch
    {
        return $this->transaction(function () use ($packingListId, $packedBy) {
            $packing = MealPackingList::find($packingListId);

            if (! $packing) {
                throw new \RuntimeException('Packing list entry not found.');
            }

            if ($packing->packing_status !== 'pending') {
                throw new \RuntimeException('This meal has already been packed.');
            }

            $packing->update([
                'packing_status' => 'packed',
                'packed_at' => now(),
                'packed_by' => $packedBy,
            ]);

            $this->logActivity('meal_packed', null, [
                'packing_id' => $packingListId,
                'order_id' => $packing->order_id,
                'meal_id' => $packing->meal_id,
            ]);

            CacheManager::flush('production');

            return $this->batchRepo->getById($packing->production_batch_id);
        });
    }

    public function generateFromOrders(string $date, ?int $kitchenId = null): ProductionBatch
    {
        return $this->transaction(function () use ($date, $kitchenId) {
            $query = Order::where('order_date', $date)
                ->whereNotIn('order_status', ['cancelled', 'refunded']);

            if ($kitchenId) {
                $query->where('kitchen_id', $kitchenId);
            }

            $orders = $query->get();

            if ($orders->isEmpty()) {
                throw new \RuntimeException('No confirmed orders found for the given date.');
            }

            $kitchenId = $orders->first()->kitchen_id;
            $groupedMeals = $orders->flatMap(fn ($order) => $order->orderItems ?? [])->groupBy('meal_id');

            $batch = $this->batchRepo->create([
                'batch_number' => $this->batchRepo->generateBatchNumber(),
                'production_date' => $date,
                'kitchen_id' => $kitchenId,
                'batch_name' => 'Auto Batch - ' . $date,
                'batch_type' => 'regular',
                'total_orders' => $orders->count(),
                'total_meals' => $orders->sum(fn ($o) => $o->orderItems->sum('quantity')),
                'production_status' => 'planned',
                'created_by' => auth()->guard('admin')->id(),
                'updated_by' => auth()->guard('admin')->id(),
            ]);

            foreach ($groupedMeals as $mealId => $items) {
                $firstItem = $items->first();
                ProductionBatchItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'production_batch_id' => $batch->id,
                    'meal_id' => $mealId,
                    'meal_category_id' => $firstItem->meal_category_id,
                    'meal_type_id' => $firstItem->meal_type_id,
                    'planned_quantity' => $items->sum('quantity'),
                    'prepared_quantity' => 0,
                    'packed_quantity' => 0,
                    'wastage_quantity' => 0,
                    'remaining_quantity' => 0,
                    'status' => 'pending',
                ]);
            }

            foreach ($orders as $order) {
                foreach ($order->orderItems as $item) {
                    MealPackingList::create([
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'production_batch_id' => $batch->id,
                        'order_id' => $order->id,
                        'customer_id' => $order->customer_id,
                        'meal_id' => $item->meal_id,
                        'quantity' => $item->quantity,
                        'packing_status' => 'pending',
                    ]);
                }
            }

            $this->recordStatusHistory($batch->id, null, 'planned', 'Batch auto-generated from confirmed orders');
            CacheManager::flush('production');
            $this->logActivity('production_batch_generated', $batch, [
                'orders_count' => $orders->count(),
                'date' => $date,
            ]);

            return $this->batchRepo->getById($batch->id);
        });
    }

    public function getStats(): array
    {
        return $this->batchRepo->getStats();
    }

    public function getTodayProduction(?int $kitchenId = null): LengthAwarePaginator
    {
        $filters = [
            'production_date' => now()->toDateString(),
        ];
        if ($kitchenId) {
            $filters['kitchen_id'] = $kitchenId;
        }
        return $this->batchRepo->getPaginated($filters, 50);
    }

    public function getProductionSummary(string $date, ?int $kitchenId = null): array
    {
        return $this->batchRepo->getProductionSummary($date, $kitchenId);
    }

    public function getPackingList(int $batchId): Collection
    {
        return $this->batchRepo->getPackingList($batchId);
    }

    public function getTimeline(int $batchId): array
    {
        $history = ProductionStatusHistory::where('production_batch_id', $batchId)
            ->with('changedBy')
            ->orderBy('created_at', 'asc')
            ->get();

        return $history->map(fn ($h) => [
            'id' => $h->id,
            'from_status' => $h->from_status,
            'to_status' => $h->to_status,
            'reason' => $h->reason,
            'changed_by_name' => $h->changedBy?->name,
            'metadata' => $h->metadata,
            'created_at' => $h->created_at?->toISOString(),
        ])->all();
    }

    public function bulkStart(array $batchIds): array
    {
        $results = [];
        foreach ($batchIds as $batchId) {
            try {
                $results[] = ['batch_id' => $batchId, 'status' => 'success', 'batch' => $this->startProduction($batchId)];
            } catch (\Exception $e) {
                $results[] = ['batch_id' => $batchId, 'status' => 'error', 'message' => $e->getMessage()];
            }
        }
        return $results;
    }

    public function bulkComplete(array $batchIds): array
    {
        $results = [];
        foreach ($batchIds as $batchId) {
            try {
                $results[] = ['batch_id' => $batchId, 'status' => 'success', 'batch' => $this->completeProduction($batchId)];
            } catch (\Exception $e) {
                $results[] = ['batch_id' => $batchId, 'status' => 'error', 'message' => $e->getMessage()];
            }
        }
        return $results;
    }

    private function recordStatusHistory(int $batchId, ?string $fromStatus, string $toStatus, ?string $reason): void
    {
        ProductionStatusHistory::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'production_batch_id' => $batchId,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'reason' => $reason,
            'changed_by' => auth()->guard('admin')->id(),
        ]);
    }
}
