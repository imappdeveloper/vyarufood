<?php

declare(strict_types=1);

namespace App\Services\Purchase;

use App\DTOs\Purchase\PurchaseRequestDTO;
use App\Models\PurchaseRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PurchaseRequestServiceInterface
{
    public function getPaginatedRequests(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getRequestById(int $id): ?PurchaseRequest;
    public function getRequestByUuid(string $uuid): ?PurchaseRequest;
    public function createRequest(PurchaseRequestDTO $dto): PurchaseRequest;
    public function updateRequest(int $id, PurchaseRequestDTO $dto): ?PurchaseRequest;
    public function deleteRequest(int $id): bool;
    public function approveRequest(int $id, int $adminId): ?PurchaseRequest;
    public function rejectRequest(int $id, int $adminId, ?string $reason = null): ?PurchaseRequest;
    public function cancelRequest(int $id): ?PurchaseRequest;
    public function getStats(): array;
    public function createAutoReorderRequests(): array;
}
