<?php

declare(strict_types=1);

namespace App\Services\Purchase;

use App\DTOs\Purchase\PurchaseOrderDTO;
use App\Models\PurchaseOrder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PurchaseOrderServiceInterface
{
    public function getPaginatedOrders(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getOrderById(int $id): ?PurchaseOrder;
    public function getOrderByUuid(string $uuid): ?PurchaseOrder;
    public function createOrder(PurchaseOrderDTO $dto): PurchaseOrder;
    public function updateOrder(int $id, PurchaseOrderDTO $dto): ?PurchaseOrder;
    public function approveOrder(int $id, int $adminId): ?PurchaseOrder;
    public function closeOrder(int $id): ?PurchaseOrder;
    public function cancelOrder(int $id): ?PurchaseOrder;
    public function convertRequestToOrder(int $requestId, int $supplierId, int $adminId): PurchaseOrder;
    public function getStats(): array;
}
