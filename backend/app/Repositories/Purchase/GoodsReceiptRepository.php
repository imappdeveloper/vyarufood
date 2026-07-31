<?php

declare(strict_types=1);

namespace App\Repositories\Purchase;

use App\Models\GoodsReceipt;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GoodsReceiptRepository extends BaseRepository implements GoodsReceiptRepositoryInterface
{
    protected function model(): GoodsReceipt
    {
        return new GoodsReceipt;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['purchaseOrder', 'supplier', 'items.inventoryItem']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('grn_number', 'LIKE', "%{$search}%")
                  ->orWhere('received_by', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['supplier_id'])) {
            $query->where('supplier_id', (int) $filters['supplier_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id): ?GoodsReceipt
    {
        return $this->model->with([
            'purchaseOrder', 'supplier',
            'items.inventoryItem',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?GoodsReceipt
    {
        return $this->model->where('uuid', $uuid)->with([
            'purchaseOrder', 'supplier',
            'items.inventoryItem',
        ])->first();
    }

    public function create(array $data): GoodsReceipt
    {
        return $this->model->create($data);
    }

    public function generateGrnNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "GRN-{$date}-";

        $lastReceipt = $this->model->where('grn_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('grn_number')
            ->first();

        if ($lastReceipt) {
            $lastNumber = (int) substr($lastReceipt->grn_number, -4);
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
            'pending' => $this->model->where('status', 'pending')->count(),
            'accepted' => $this->model->where('status', 'accepted')->count(),
            'rejected' => $this->model->where('status', 'rejected')->count(),
            'partial' => $this->model->where('status', 'partial')->count(),
        ];
    }
}
