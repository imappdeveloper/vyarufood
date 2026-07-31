<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\CashBook;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CashBookRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function addEntry(array $data): CashBook;
    public function getBalance(): float;
}
