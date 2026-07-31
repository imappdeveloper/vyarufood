<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\Supplier;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

class SupplierRepository extends BaseRepository implements SupplierRepositoryInterface
{
    protected function model(): Supplier
    {
        return new Supplier;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['country', 'state', 'city', 'products']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('supplier_name', 'LIKE', "%{$search}%")
                  ->orWhere('company_name', 'LIKE', "%{$search}%")
                  ->orWhere('supplier_code', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('mobile', 'LIKE', "%{$search}%")
                  ->orWhere('gst_number', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['supplier_type'])) {
            $query->where('supplier_type', $filters['supplier_type']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_preferred']) && $filters['is_preferred'] !== '') {
            $query->where('is_preferred', (bool) $filters['is_preferred']);
        }

        if (! empty($filters['rating'])) {
            $query->where('rating', (int) $filters['rating']);
        }

        if (! empty($filters['city_id'])) {
            $query->where('city_id', (int) $filters['city_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id): ?Supplier
    {
        return $this->model->with([
            'country', 'state', 'city',
            'products.inventoryItem', 'products.unit',
            'documents', 'contacts',
            'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?Supplier
    {
        return $this->model->where('uuid', $uuid)->with([
            'country', 'state', 'city',
            'products.inventoryItem', 'products.unit',
            'documents', 'contacts',
            'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): Supplier
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Supplier
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

    public function generateSupplierCode(): string
    {
        $prefix = 'SUP-';
        $lastSupplier = $this->model->where('supplier_code', 'LIKE', "{$prefix}%")
            ->orderByDesc('supplier_code')
            ->first();

        if ($lastSupplier) {
            $lastNumber = (int) substr($lastSupplier->supplier_code, -4);
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
            'active' => $this->model->where('status', 'active')->count(),
            'inactive' => $this->model->where('status', 'inactive')->count(),
            'blocked' => $this->model->where('status', 'blocked')->count(),
            'blacklisted' => $this->model->where('status', 'blacklisted')->count(),
        ];
    }

    public function getPreferred(): Collection
    {
        return $this->model->where('is_preferred', true)
            ->where('status', 'active')
            ->with(['country', 'state', 'city'])
            ->get();
    }

    public function getExpiringDocuments(int $days): Collection
    {
        $expiryDate = now()->addDays($days)->toDateString();

        return $this->model->whereHas('documents', function ($q) use ($expiryDate) {
            $q->where('status', 'active')
              ->where('expiry_date', '<=', $expiryDate)
              ->where('expiry_date', '>=', now()->toDateString());
        })->with(['documents' => function ($q) use ($expiryDate) {
            $q->where('status', 'active')
              ->where('expiry_date', '<=', $expiryDate)
              ->where('expiry_date', '>=', now()->toDateString());
        }])->get();
    }
}
