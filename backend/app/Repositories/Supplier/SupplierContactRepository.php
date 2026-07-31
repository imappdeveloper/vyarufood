<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\SupplierContact;
use App\Support\BaseRepository;
use Illuminate\Support\Collection;

class SupplierContactRepository extends BaseRepository implements SupplierContactRepositoryInterface
{
    protected function model(): SupplierContact
    {
        return new SupplierContact;
    }

    public function getBySupplier(int $supplierId): Collection
    {
        return $this->model->where('supplier_id', $supplierId)->get();
    }

    public function create(array $data): SupplierContact
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?SupplierContact
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
}
