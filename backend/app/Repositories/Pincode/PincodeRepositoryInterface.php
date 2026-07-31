<?php

declare(strict_types=1);

namespace App\Repositories\Pincode;

use App\DTOs\Pincode\PincodeDTO;
use App\Models\Master\Pincode;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PincodeRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function findById(int $id): ?Pincode;
    public function findByUuid(string $uuid): ?Pincode;
    public function findByPincode(string $pincode): ?Pincode;
    public function create(PincodeDTO $dto, int $createdBy): Pincode;
    public function update(Pincode $pincode, array $data, int $updatedBy): Pincode;
    public function softDelete(Pincode $pincode, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(Pincode $pincode): bool;
    public function setStatus(Pincode $pincode, string $status): Pincode;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function countByStatus(): array;
    public function getActiveByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection;
    public function getActiveByPincode(string $pincode): ?Pincode;
}
