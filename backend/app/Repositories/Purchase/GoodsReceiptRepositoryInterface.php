<?php

declare(strict_types=1);

namespace App\Repositories\Purchase;

use App\Models\GoodsReceipt;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface GoodsReceiptRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getById(int $id): ?GoodsReceipt;
    public function getByUuid(string $uuid): ?GoodsReceipt;
    public function create(array $data): GoodsReceipt;
    public function generateGrnNumber(): string;
    public function countByStatus(): array;
}
