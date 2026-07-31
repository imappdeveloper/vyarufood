<?php

declare(strict_types=1);

namespace App\Repositories\Purchase;

use App\Models\PurchaseRequest;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PurchaseRequestRepository extends BaseRepository implements PurchaseRequestRepositoryInterface
{
    protected function model(): PurchaseRequest
    {
        return new PurchaseRequest;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['items.inventoryItem', 'items.unit', 'approvedBy', 'createdBy']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('request_number', 'LIKE', "%{$search}%")
                  ->orWhere('requested_by', 'LIKE', "%{$search}%")
                  ->orWhere('department', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (! empty($filters['request_type'])) {
            $query->where('request_type', $filters['request_type']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id): ?PurchaseRequest
    {
        return $this->model->with([
            'items.inventoryItem', 'items.unit',
            'approvedBy', 'createdBy', 'updatedBy',
            'purchaseOrders',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?PurchaseRequest
    {
        return $this->model->where('uuid', $uuid)->with([
            'items.inventoryItem', 'items.unit',
            'approvedBy', 'createdBy', 'updatedBy',
            'purchaseOrders',
        ])->first();
    }

    public function create(array $data): PurchaseRequest
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?PurchaseRequest
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

    public function generateRequestNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "PR-{$date}-";

        $lastRequest = $this->model->where('request_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('request_number')
            ->first();

        if ($lastRequest) {
            $lastNumber = (int) substr($lastRequest->request_number, -4);
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
            'draft' => $this->model->where('status', 'draft')->count(),
            'pending_approval' => $this->model->where('status', 'pending_approval')->count(),
            'approved' => $this->model->where('status', 'approved')->count(),
            'rejected' => $this->model->where('status', 'rejected')->count(),
            'converted_to_po' => $this->model->where('status', 'converted_to_po')->count(),
            'cancelled' => $this->model->where('status', 'cancelled')->count(),
        ];
    }
}
