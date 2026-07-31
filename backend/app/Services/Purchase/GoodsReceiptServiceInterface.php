<?php

declare(strict_types=1);

namespace App\Services\Purchase;

use App\DTOs\Purchase\GoodsReceiptDTO;
use App\Models\GoodsReceipt;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface GoodsReceiptServiceInterface
{
    public function getPaginatedReceipts(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getReceiptById(int $id): ?GoodsReceipt;
    public function getReceiptByUuid(string $uuid): ?GoodsReceipt;
    public function createReceipt(GoodsReceiptDTO $dto): GoodsReceipt;
    public function getStats(): array;
}
