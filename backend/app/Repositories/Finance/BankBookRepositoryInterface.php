<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\BankBook;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BankBookRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getByBankAccount(int $bankAccountId, array $filters, int $perPage): LengthAwarePaginator;
    public function addEntry(array $data): BankBook;
    public function getBalance(int $bankAccountId): float;
}
