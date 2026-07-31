<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Expense\StoreExpenseCategoryRequest;
use App\Http\Requests\Expense\UpdateExpenseCategoryRequest;
use App\Http\Requests\Expense\StoreExpenseRequest;
use App\Http\Requests\Expense\UpdateExpenseRequest;
use App\Http\Requests\Expense\StoreExpenseApprovalRequest;
use App\Http\Resources\Expense\ExpenseCategoryResource;
use App\Http\Resources\Expense\ExpenseResource;
use App\Services\Expense\ExpenseCategoryServiceInterface;
use App\Services\Expense\ExpenseServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends BaseController
{
    public function __construct(
        private readonly ExpenseCategoryServiceInterface $categoryService,
        private readonly ExpenseServiceInterface $expenseService,
    ) {}

    // === CATEGORIES ===
    public function categories(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'is_recurring']);
        $paginator = $this->categoryService->getPaginatedCategories($filters, $perPage);
        return $this->paginatedResponse(ExpenseCategoryResource::collection($paginator), 'Expense categories retrieved successfully');
    }

    public function storeCategory(StoreExpenseCategoryRequest $request): JsonResponse
    {
        $dto = \App\DTOs\Expense\ExpenseCategoryDTO::fromArray($request->validated());
        $category = $this->categoryService->createCategory($dto);
        return $this->createdResponse(new ExpenseCategoryResource($category), 'Expense category created successfully');
    }

    public function showCategory(string $uuid): JsonResponse
    {
        $category = $this->categoryService->getCategoryByUuid($uuid);
        if (! $category) return $this->notFoundResponse('Expense category not found');
        return $this->successResponse(new ExpenseCategoryResource($category), 'Expense category retrieved successfully');
    }

    public function updateCategory(UpdateExpenseCategoryRequest $request, string $uuid): JsonResponse
    {
        $category = $this->categoryService->getCategoryByUuid($uuid);
        if (! $category) return $this->notFoundResponse('Expense category not found');
        $dto = \App\DTOs\Expense\ExpenseCategoryDTO::fromArray($request->validated());
        $category = $this->categoryService->updateCategory($category->id, $dto);
        return $this->successResponse(new ExpenseCategoryResource($category), 'Expense category updated successfully');
    }

    public function destroyCategory(string $uuid): JsonResponse
    {
        $category = $this->categoryService->getCategoryByUuid($uuid);
        if (! $category) return $this->notFoundResponse('Expense category not found');
        $this->categoryService->deleteCategory($category->id);
        return $this->noContentResponse('Expense category deleted successfully');
    }

    public function activeCategories(): JsonResponse
    {
        $categories = $this->categoryService->getAllActive();
        return $this->successResponse(ExpenseCategoryResource::collection($categories), 'Active categories retrieved successfully');
    }

    // === EXPENSES ===
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only([
            'search', 'expense_category_id', 'approval_status', 'expense_status',
            'payment_method', 'supplier_id', 'date_from', 'date_to', 'is_recurring',
            'sort_by', 'sort_dir',
        ]);
        $paginator = $this->expenseService->getPaginatedExpenses($filters, $perPage);
        return $this->paginatedResponse(ExpenseResource::collection($paginator), 'Expenses retrieved successfully');
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $dto = \App\DTOs\Expense\ExpenseDTO::fromArray($request->validated());
        $expense = $this->expenseService->createExpense($dto);
        return $this->createdResponse(new ExpenseResource($expense), 'Expense created successfully');
    }

    public function show(string $uuid): JsonResponse
    {
        $expense = $this->expenseService->getExpenseByUuid($uuid);
        if (! $expense) return $this->notFoundResponse('Expense not found');
        return $this->successResponse(new ExpenseResource($expense), 'Expense retrieved successfully');
    }

    public function update(UpdateExpenseRequest $request, string $uuid): JsonResponse
    {
        $expense = $this->expenseService->getExpenseByUuid($uuid);
        if (! $expense) return $this->notFoundResponse('Expense not found');
        $dto = \App\DTOs\Expense\ExpenseDTO::fromArray($request->validated());
        $expense = $this->expenseService->updateExpense($expense->id, $dto);
        return $this->successResponse(new ExpenseResource($expense), 'Expense updated successfully');
    }

    public function destroy(string $uuid): JsonResponse
    {
        $expense = $this->expenseService->getExpenseByUuid($uuid);
        if (! $expense) return $this->notFoundResponse('Expense not found');
        $this->expenseService->deleteExpense($expense->id);
        return $this->noContentResponse('Expense deleted successfully');
    }

    // === APPROVAL WORKFLOW ===
    public function approve(string $uuid, StoreExpenseApprovalRequest $request): JsonResponse
    {
        $expense = $this->expenseService->getExpenseByUuid($uuid);
        if (! $expense) return $this->notFoundResponse('Expense not found');
        $expense = $this->expenseService->approveExpense($expense->id, auth()->guard('admin')->id());
        return $this->successResponse(new ExpenseResource($expense), 'Expense approved successfully');
    }

    public function reject(string $uuid, StoreExpenseApprovalRequest $request): JsonResponse
    {
        $expense = $this->expenseService->getExpenseByUuid($uuid);
        if (! $expense) return $this->notFoundResponse('Expense not found');
        $expense = $this->expenseService->rejectExpense($expense->id, auth()->guard('admin')->id(), $request->input('remarks'));
        return $this->successResponse(new ExpenseResource($expense), 'Expense rejected successfully');
    }

    public function markPaid(string $uuid): JsonResponse
    {
        $expense = $this->expenseService->getExpenseByUuid($uuid);
        if (! $expense) return $this->notFoundResponse('Expense not found');
        $expense = $this->expenseService->markAsPaid($expense->id);
        return $this->successResponse(new ExpenseResource($expense), 'Expense marked as paid');
    }

    // === STATS & DASHBOARD ===
    public function stats(): JsonResponse
    {
        return $this->successResponse($this->expenseService->getStats(), 'Expense statistics retrieved successfully');
    }

    public function dashboardStats(): JsonResponse
    {
        return $this->successResponse($this->expenseService->getDashboardStats(), 'Expense dashboard stats retrieved successfully');
    }

    public function pendingApprovals(): JsonResponse
    {
        $expenses = $this->expenseService->getPendingApprovals();
        return $this->successResponse(ExpenseResource::collection($expenses), 'Pending approvals retrieved successfully');
    }

    public function monthlySummary(Request $request): JsonResponse
    {
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);
        return $this->successResponse($this->expenseService->getMonthlySummary($year, $month), 'Monthly summary retrieved successfully');
    }

    public function categorySummary(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);
        $summary = $this->expenseService->getCategoryWiseSummary(
            $request->input('date_from'),
            $request->input('date_to')
        );
        return $this->successResponse($summary, 'Category-wise summary retrieved successfully');
    }

    public function recurringDue(): JsonResponse
    {
        $expenses = $this->expenseService->getRecurringExpensesDue();
        return $this->successResponse(ExpenseResource::collection($expenses), 'Recurring expenses due retrieved successfully');
    }
}
