<?php

declare(strict_types=1);

namespace App\Repositories\Purchase;

use App\Models\PurchaseRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PurchaseRequestRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getById(int $id): ?PurchaseRequest;
    public function getByUuid(string $uuid): ?PurchaseRequest;
    public function create(array $data): PurchaseRequest;
    public function update(int $id, array $data): ?PurchaseRequest;
    public function delete(int $id): bool;
    public function generateRequestNumber(): string;
    public function countByStatus(): array;
}
