<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\SupplierDocument;
use App\Support\BaseRepository;
use Illuminate\Support\Collection;

class SupplierDocumentRepository extends BaseRepository implements SupplierDocumentRepositoryInterface
{
    protected function model(): SupplierDocument
    {
        return new SupplierDocument;
    }

    public function getBySupplier(int $supplierId): Collection
    {
        return $this->model->where('supplier_id', $supplierId)->get();
    }

    public function create(array $data): SupplierDocument
    {
        return $this->model->create($data);
    }

    public function delete(int $id): bool
    {
        $record = $this->model->find($id);
        return $record ? $record->delete() : false;
    }

    public function getExpiringSoon(int $days): Collection
    {
        $expiryDate = now()->addDays($days)->toDateString();

        return $this->model->where('status', 'active')
            ->where('expiry_date', '<=', $expiryDate)
            ->where('expiry_date', '>=', now()->toDateString())
            ->with('supplier')
            ->get();
    }
}
