<?php

declare(strict_types=1);

namespace App\Services\Order;

use App\DTOs\Order\OrderDTO;
use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

interface OrderServiceInterface
{
    public function getPaginatedOrders(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getOrderById(int $id): ?Order;
    public function getOrderByUuid(string $uuid): ?Order;
    public function createOrder(OrderDTO $dto, array $items = []): Order;
    public function updateOrder(int $id, OrderDTO $dto): ?Order;
    public function deleteOrder(int $id): bool;
    public function restoreOrder(int $id): bool;
    public function forceDeleteOrder(int $id): bool;
    public function confirmOrder(int $id): ?Order;
    public function prepareOrder(int $id): ?Order;
    public function readyOrder(int $id): ?Order;
    public function dispatchOrder(int $id): ?Order;
    public function deliverOrder(int $id): ?Order;
    public function cancelOrder(int $id, string $reason, ?string $notes = null): ?Order;
    public function refundOrder(int $id, float $amount, string $reason, string $method = 'wallet'): ?Order;
    public function bulkUpdateStatus(array $orderIds, string $status): int;
    public function duplicateOrder(int $id): ?Order;
    public function getStats(): array;
    public function getDashboardStats(): array;
    public function getTimeline(int $orderId): array;
    public function getTodayOrdersSummary(?int $kitchenId = null): array;
    public function generateDailySubscriptionOrders(string $date = null): array;
    public function importOrders(UploadedFile $file): array;
    public function exportOrders(array $filters = []): string;
}
