<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Finance\CashBookResource;
use App\Http\Resources\Finance\CustomerLedgerResource;
use App\Http\Resources\Finance\SupplierLedgerResource;
use App\Http\Resources\Finance\BankBookResource;
use App\Services\Customer\CustomerServiceInterface;
use App\Services\Finance\LedgerServiceInterface;
use App\Services\Supplier\SupplierServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinanceLedgerController extends BaseController
{
    public function __construct(
        private readonly LedgerServiceInterface $ledgerService,
        private readonly CustomerServiceInterface $customerService,
        private readonly SupplierServiceInterface $supplierService,
    ) {}

    public function customerLedger(string $customerUuid, Request $request): JsonResponse
    {
        $customer = $this->customerService->findByUuid($customerUuid);
        if (! $customer) return $this->notFoundResponse('Customer not found');

        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['from_date', 'to_date', 'type']);
        $paginator = $this->ledgerService->getCustomerLedger($customer->id, $filters, $perPage);
        return $this->paginatedResponse(CustomerLedgerResource::collection($paginator), 'Customer ledger retrieved successfully');
    }

    public function supplierLedger(string $supplierUuid, Request $request): JsonResponse
    {
        $supplier = $this->supplierService->getByUuid($supplierUuid);
        if (! $supplier) return $this->notFoundResponse('Supplier not found');

        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['from_date', 'to_date', 'type']);
        $paginator = $this->ledgerService->getSupplierLedger($supplier->id, $filters, $perPage);
        return $this->paginatedResponse(SupplierLedgerResource::collection($paginator), 'Supplier ledger retrieved successfully');
    }

    public function cashBook(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['from_date', 'to_date', 'type']);
        $paginator = $this->ledgerService->getCashBook($filters, $perPage);
        return $this->paginatedResponse(CashBookResource::collection($paginator), 'Cash book retrieved successfully');
    }

    public function bankBook(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['bank_account_id', 'from_date', 'to_date', 'type']);
        $paginator = $this->ledgerService->getBankBook(
            (int) $request->input('bank_account_id', 0),
            $filters,
            $perPage,
        );
        return $this->paginatedResponse(BankBookResource::collection($paginator), 'Bank book retrieved successfully');
    }
}
