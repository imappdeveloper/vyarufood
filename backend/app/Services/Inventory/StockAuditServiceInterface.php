<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\StockAuditDTO;
use App\Models\StockAudit;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StockAuditServiceInterface
{
    public function getPaginatedAudits(array $filters, int $perPage): LengthAwarePaginator;
    public function getAuditById(int $id): ?StockAudit;
    public function getAuditByUuid(string $uuid): ?StockAudit;
    public function createAudit(StockAuditDTO $dto): StockAudit;
    public function approveAudit(int $id): StockAudit;
    public function rejectAudit(int $id): StockAudit;
}
