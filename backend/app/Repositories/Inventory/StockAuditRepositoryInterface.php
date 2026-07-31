<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\StockAudit;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StockAuditRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?StockAudit;
    public function getByUuid(string $uuid): ?StockAudit;
    public function create(array $data): StockAudit;
    public function approve(int $id, int $adminId): ?StockAudit;
    public function reject(int $id, int $adminId): ?StockAudit;
    public function generateAuditNumber(): string;
}
