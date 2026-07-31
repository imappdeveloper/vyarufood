<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Finance\BankAccountResource;
use App\Http\Resources\Finance\BankReconciliationResource;
use App\Services\Finance\BankAccountServiceInterface;
use App\Services\Finance\BankReconciliationServiceInterface;
use App\Http\Requests\Finance\StoreBankAccountRequest;
use App\Http\Requests\Finance\UpdateBankAccountRequest;
use App\Http\Requests\Finance\StoreBankReconciliationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinanceBankController extends BaseController
{
    public function __construct(
        private readonly BankAccountServiceInterface $bankAccountService,
        private readonly BankReconciliationServiceInterface $reconciliationService,
    ) {}

    // === BANK ACCOUNTS ===

    public function bankAccounts(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'account_type', 'is_default']);
        $paginator = $this->bankAccountService->getPaginated($filters, $perPage);
        return $this->paginatedResponse(BankAccountResource::collection($paginator), 'Bank accounts retrieved successfully');
    }

    public function storeBankAccount(StoreBankAccountRequest $request): JsonResponse
    {
        $bankAccount = $this->bankAccountService->create($request->validated());
        return $this->createdResponse(new BankAccountResource($bankAccount), 'Bank account created successfully');
    }

    public function showBankAccount(string $uuid): JsonResponse
    {
        $bankAccount = $this->bankAccountService->getByUuid($uuid);
        if (! $bankAccount) return $this->notFoundResponse('Bank account not found');
        return $this->successResponse(new BankAccountResource($bankAccount), 'Bank account retrieved successfully');
    }

    public function updateBankAccount(string $uuid, UpdateBankAccountRequest $request): JsonResponse
    {
        $bankAccount = $this->bankAccountService->getByUuid($uuid);
        if (! $bankAccount) return $this->notFoundResponse('Bank account not found');
        $bankAccount = $this->bankAccountService->update($bankAccount->id, $request->validated());
        return $this->successResponse(new BankAccountResource($bankAccount), 'Bank account updated successfully');
    }

    public function destroyBankAccount(string $uuid): JsonResponse
    {
        $bankAccount = $this->bankAccountService->getByUuid($uuid);
        if (! $bankAccount) return $this->notFoundResponse('Bank account not found');
        $this->bankAccountService->delete($bankAccount->id);
        return $this->noContentResponse('Bank account deleted successfully');
    }

    // === RECONCILIATIONS ===

    public function reconciliations(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['bank_account_id', 'status', 'from_date', 'to_date']);
        $paginator = $this->reconciliationService->getPaginated($filters, $perPage);
        return $this->paginatedResponse(BankReconciliationResource::collection($paginator), 'Bank reconciliations retrieved successfully');
    }

    public function storeReconciliation(StoreBankReconciliationRequest $request): JsonResponse
    {
        $reconciliation = $this->reconciliationService->create($request->validated());
        return $this->createdResponse(new BankReconciliationResource($reconciliation), 'Bank reconciliation created successfully');
    }

    public function showReconciliation(string $uuid): JsonResponse
    {
        $reconciliation = $this->reconciliationService->getByUuid($uuid);
        if (! $reconciliation) return $this->notFoundResponse('Bank reconciliation not found');
        return $this->successResponse(new BankReconciliationResource($reconciliation), 'Bank reconciliation retrieved successfully');
    }

    public function completeReconciliation(string $uuid, Request $request): JsonResponse
    {
        $reconciliation = $this->reconciliationService->getByUuid($uuid);
        if (! $reconciliation) return $this->notFoundResponse('Bank reconciliation not found');
        $userId = $request->user()->id;
        $reconciliation = $this->reconciliationService->completeReconciliation($uuid, $userId);
        return $this->successResponse(new BankReconciliationResource($reconciliation), 'Bank reconciliation completed successfully');
    }
}
