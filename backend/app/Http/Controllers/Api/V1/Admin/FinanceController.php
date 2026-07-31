<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Finance\BulkPostJournalRequest;
use App\Http\Requests\Finance\StoreChartOfAccountRequest;
use App\Http\Requests\Finance\StoreFinancialYearRequest;
use App\Http\Requests\Finance\StoreJournalEntryRequest;
use App\Http\Requests\Finance\UpdateChartOfAccountRequest;
use App\Http\Resources\Finance\ChartOfAccountResource;
use App\Http\Resources\Finance\FinancialYearResource;
use App\Http\Resources\Finance\JournalEntryResource;
use App\Services\Finance\ChartOfAccountServiceInterface;
use App\Services\Finance\FinancialYearServiceInterface;
use App\Services\Finance\JournalServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinanceController extends BaseController
{
    public function __construct(
        private readonly ChartOfAccountServiceInterface $accountService,
        private readonly JournalServiceInterface $journalService,
        private readonly FinancialYearServiceInterface $fyService,
    ) {}

    // === CHART OF ACCOUNTS ===

    public function accounts(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'account_type']);
        $paginator = $this->accountService->getPaginatedCategories($filters, $perPage);
        return $this->paginatedResponse(ChartOfAccountResource::collection($paginator), 'Chart of accounts retrieved successfully');
    }

    public function storeAccount(StoreChartOfAccountRequest $request): JsonResponse
    {
        $account = $this->accountService->createCategory($request->validated());
        return $this->createdResponse(new ChartOfAccountResource($account), 'Chart of account created successfully');
    }

    public function showAccount(string $uuid): JsonResponse
    {
        $account = $this->accountService->getCategoryByUuid($uuid);
        if (! $account) return $this->notFoundResponse('Chart of account not found');
        return $this->successResponse(new ChartOfAccountResource($account), 'Chart of account retrieved successfully');
    }

    public function updateAccount(string $uuid, UpdateChartOfAccountRequest $request): JsonResponse
    {
        $account = $this->accountService->getCategoryByUuid($uuid);
        if (! $account) return $this->notFoundResponse('Chart of account not found');
        $account = $this->accountService->updateCategory($account->id, $request->validated());
        return $this->successResponse(new ChartOfAccountResource($account), 'Chart of account updated successfully');
    }

    public function destroyAccount(string $uuid): JsonResponse
    {
        $account = $this->accountService->getCategoryByUuid($uuid);
        if (! $account) return $this->notFoundResponse('Chart of account not found');
        $this->accountService->deleteCategory($account->id);
        return $this->noContentResponse('Chart of account deleted successfully');
    }

    // === JOURNALS ===

    public function journals(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only([
            'search', 'posting_status', 'financial_year_id',
            'from_date', 'to_date',
        ]);
        $paginator = $this->journalService->getPaginatedJournals($filters, $perPage);
        return $this->paginatedResponse(JournalEntryResource::collection($paginator), 'Journal entries retrieved successfully');
    }

    public function storeJournal(StoreJournalEntryRequest $request): JsonResponse
    {
        $journal = $this->journalService->createJournal($request->validated());
        return $this->createdResponse(new JournalEntryResource($journal), 'Journal entry created successfully');
    }

    public function showJournal(string $uuid): JsonResponse
    {
        $journal = $this->journalService->getJournalByUuid($uuid);
        if (! $journal) return $this->notFoundResponse('Journal entry not found');
        return $this->successResponse(new JournalEntryResource($journal), 'Journal entry retrieved successfully');
    }

    public function postJournal(string $uuid, Request $request): JsonResponse
    {
        $journal = $this->journalService->getJournalByUuid($uuid);
        if (! $journal) return $this->notFoundResponse('Journal entry not found');
        $userId = $request->user()->id;
        $journal = $this->journalService->postJournal($uuid, $userId);
        return $this->successResponse(new JournalEntryResource($journal), 'Journal entry posted successfully');
    }

    public function reverseJournal(string $uuid, Request $request): JsonResponse
    {
        $journal = $this->journalService->getJournalByUuid($uuid);
        if (! $journal) return $this->notFoundResponse('Journal entry not found');
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);
        $journal = $this->journalService->reverseJournal($uuid, $request->input('reason'));
        return $this->successResponse(new JournalEntryResource($journal), 'Journal entry reversed successfully');
    }

    public function bulkPost(BulkPostJournalRequest $request): JsonResponse
    {
        $userId = $request->user()->id;
        $affected = $this->journalService->bulkPost($request->validated('ids'), $userId);
        return $this->bulkResponse(null, 'Bulk post completed successfully', $affected);
    }

    // === REPORTS ===

    public function trialBalance(Request $request): JsonResponse
    {
        $request->validate([
            'financial_year_id' => 'required|integer|exists:financial_years,id',
            'as_of_date' => 'nullable|date',
        ]);
        $data = $this->journalService->getTrialBalance(
            (int) $request->input('financial_year_id'),
            $request->input('as_of_date'),
        );
        return $this->successResponse($data, 'Trial balance retrieved successfully');
    }

    public function profitLoss(Request $request): JsonResponse
    {
        $request->validate([
            'financial_year_id' => 'required|integer|exists:financial_years,id',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
        ]);
        $data = $this->journalService->getProfitAndLoss(
            (int) $request->input('financial_year_id'),
            $request->input('from_date'),
            $request->input('to_date'),
        );
        return $this->successResponse($data, 'Profit & Loss report retrieved successfully');
    }

    public function balanceSheet(Request $request): JsonResponse
    {
        $request->validate([
            'financial_year_id' => 'required|integer|exists:financial_years,id',
            'as_of_date' => 'nullable|date',
        ]);
        $data = $this->journalService->getBalanceSheet(
            (int) $request->input('financial_year_id'),
            $request->input('as_of_date'),
        );
        return $this->successResponse($data, 'Balance sheet retrieved successfully');
    }

    public function cashFlow(Request $request): JsonResponse
    {
        $request->validate([
            'financial_year_id' => 'required|integer|exists:financial_years,id',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
        ]);
        $data = $this->journalService->getCashFlow(
            (int) $request->input('financial_year_id'),
            $request->input('from_date'),
            $request->input('to_date'),
        );
        return $this->successResponse($data, 'Cash flow report retrieved successfully');
    }

    // === DASHBOARD ===

    public function dashboardStats(): JsonResponse
    {
        return $this->successResponse($this->journalService->getDashboardStats(), 'Finance dashboard stats retrieved successfully');
    }

    // === FINANCIAL YEARS ===

    public function financialYears(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'is_current']);
        $paginator = $this->fyService->getPaginated($filters, $perPage);
        return $this->paginatedResponse(FinancialYearResource::collection($paginator), 'Financial years retrieved successfully');
    }

    public function storeFinancialYear(StoreFinancialYearRequest $request): JsonResponse
    {
        $fy = $this->fyService->create($request->validated());
        return $this->createdResponse(new FinancialYearResource($fy), 'Financial year created successfully');
    }

    public function showFinancialYear(string $uuid): JsonResponse
    {
        $fy = $this->fyService->getByUuid($uuid);
        if (! $fy) return $this->notFoundResponse('Financial year not found');
        return $this->successResponse(new FinancialYearResource($fy), 'Financial year retrieved successfully');
    }

    public function closeFinancialYear(string $uuid, Request $request): JsonResponse
    {
        $fy = $this->fyService->getByUuid($uuid);
        if (! $fy) return $this->notFoundResponse('Financial year not found');
        $userId = $request->user()->id;
        $fy = $this->fyService->closeYear($uuid, $userId, $request->input('remarks'));
        return $this->successResponse(new FinancialYearResource($fy), 'Financial year closed successfully');
    }

    public function currentFinancialYear(): JsonResponse
    {
        $fy = $this->fyService->getCurrent();
        if (! $fy) return $this->notFoundResponse('No current financial year found');
        return $this->successResponse(new FinancialYearResource($fy), 'Current financial year retrieved successfully');
    }
}
