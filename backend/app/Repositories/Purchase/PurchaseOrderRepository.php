<?php

declare(strict_types=1);

namespace App\Repositories\Purchase;

use App\Models\PurchaseOrder;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PurchaseOrderRepository extends BaseRepository implements PurchaseOrderRepositoryInterface
{
    protected function model(): PurchaseOrder
    {
        return new PurchaseOrder;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['supplier', 'items.inventoryItem', 'items.unit', 'approvedBy']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('po_number', 'LIKE', "%{$search}%")
                  ->orWhere('remarks', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['order_status'])) {
            $query->where('order_status', $filters['order_status']);
        }

        if (! empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (! empty($filters['supplier_id'])) {
            $query->where('supplier_id', (int) $filters['supplier_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id): ?PurchaseOrder
    {
        return $this->model->with([
            'supplier', 'items.inventoryItem', 'items.unit',
            'purchaseRequest', 'approvedBy', 'createdBy', 'updatedBy',
            'goodsReceipts',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?PurchaseOrder
    {
        return $this->model->where('uuid', $uuid)->with([
            'supplier', 'items.inventoryItem', 'items.unit',
            'purchaseRequest', 'approvedBy', 'createdBy', 'updatedBy',
            'goodsReceipts',
        ])->first();
    }

    public function create(array $data): PurchaseOrder
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?PurchaseOrder
    {
        $record = $this->model->find($id);
        if ($record) {
            $record->update($data);
        }
        return $record;
    }

    public function delete(int $id): bool
    {
        $record = $this->model->find($id);
        return $record ? $record->delete() : false;
    }

    public function generatePoNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "PO-{$date}-";

        $lastOrder = $this->model->where('po_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('po_number')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->po_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }

    public function countByStatus(): array
    {
        return [
            'total' => $this->model->count(),
            'draft' => $this->model->where('order_status', 'draft')->count(),
            'approved' => $this->model->where('order_status', 'approved')->count(),
            'sent' => $this->model->where('order_status', 'sent')->count(),
            'partially_received' => $this->model->where('order_status', 'partially_received')->count(),
            'received' => $this->model->where('order_status', 'received')->count(),
            'closed' => $this->model->where('order_status', 'closed')->count(),
            'cancelled' => $this->model->where('order_status', 'cancelled')->count(),
        ];
    }
}
