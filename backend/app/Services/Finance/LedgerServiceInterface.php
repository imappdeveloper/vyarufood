<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\BankBook;
use App\Models\CashBook;
use App\Models\CustomerLedger;
use App\Models\SupplierLedger;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LedgerServiceInterface
{
    public function getCustomerLedger(int $customerId, array $filters, int $perPage): LengthAwarePaginator;
    public function addCustomerLedgerEntry(array $data): CustomerLedger;
    public function getSupplierLedger(int $supplierId, array $filters, int $perPage): LengthAwarePaginator;
    public function addSupplierLedgerEntry(array $data): SupplierLedger;
    public function getCashBook(array $filters, int $perPage): LengthAwarePaginator;
    public function addCashBookEntry(array $data): CashBook;
    public function getBankBook(int $bankAccountId, array $filters, int $perPage): LengthAwarePaginator;
    public function addBankBookEntry(array $data): BankBook;
}
