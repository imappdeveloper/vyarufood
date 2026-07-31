<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\BankBook;
use App\Models\CashBook;
use App\Models\CustomerLedger;
use App\Models\SupplierLedger;
use App\Repositories\Finance\CustomerLedgerRepositoryInterface;
use App\Repositories\Finance\SupplierLedgerRepositoryInterface;
use App\Repositories\Finance\CashBookRepositoryInterface;
use App\Repositories\Finance\BankBookRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LedgerService extends BaseService implements LedgerServiceInterface
{
    protected string $moduleName = 'Finance';

    public function __construct(
        private readonly CustomerLedgerRepositoryInterface $customerLedgerRepo,
        private readonly SupplierLedgerRepositoryInterface $supplierLedgerRepo,
        private readonly CashBookRepositoryInterface $cashBookRepo,
        private readonly BankBookRepositoryInterface $bankBookRepo,
    ) {}

    public function getCustomerLedger(int $customerId, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->customerLedgerRepo->getByCustomer($customerId, $filters, $perPage);
    }

    public function addCustomerLedgerEntry(array $data): CustomerLedger
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;

            $entry = $this->customerLedgerRepo->create($data);

            $this->logInfo('Customer ledger entry added', ['customer_id' => $data['customer_id']]);

            return $entry;
        });
    }

    public function getSupplierLedger(int $supplierId, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->supplierLedgerRepo->getBySupplier($supplierId, $filters, $perPage);
    }

    public function addSupplierLedgerEntry(array $data): SupplierLedger
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;

            $entry = $this->supplierLedgerRepo->create($data);

            $this->logInfo('Supplier ledger entry added', ['supplier_id' => $data['supplier_id']]);

            return $entry;
        });
    }

    public function getCashBook(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->cashBookRepo->getPaginated($filters, $perPage);
    }

    public function addCashBookEntry(array $data): CashBook
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;

            $entry = $this->cashBookRepo->create($data);

            $this->logInfo('Cash book entry added');

            return $entry;
        });
    }

    public function getBankBook(int $bankAccountId, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->bankBookRepo->getByBankAccount($bankAccountId, $filters, $perPage);
    }

    public function addBankBookEntry(array $data): BankBook
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;

            $entry = $this->bankBookRepo->create($data);

            $this->logInfo('Bank book entry added', ['bank_account_id' => $data['bank_account_id']]);

            return $entry;
        });
    }
}
