<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\DTOs\Report\DashboardFilterDTO;
use App\Http\Controllers\BaseController;
use App\Services\Report\DashboardServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends BaseController
{
    public function __construct(
        private readonly DashboardServiceInterface $dashboardService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = DashboardFilterDTO::fromRequest($request->only([
            'date_from', 'date_to', 'kitchen_id', 'city_id', 'meal_category_id', 'customer_id',
        ]));

        $data = $this->dashboardService->getExecutiveDashboard($filters);

        return $this->successResponse($data, 'Executive dashboard retrieved successfully');
    }

    public function salesChart(Request $request): JsonResponse
    {
        $filters = DashboardFilterDTO::fromRequest($request->only([
            'date_from', 'date_to', 'kitchen_id', 'city_id', 'meal_category_id', 'customer_id',
        ]));

        $data = $this->dashboardService->getSalesChart($filters);

        return $this->successResponse($data, 'Sales chart retrieved successfully');
    }

    public function orderChart(Request $request): JsonResponse
    {
        $filters = DashboardFilterDTO::fromRequest($request->only([
            'date_from', 'date_to', 'kitchen_id', 'city_id', 'meal_category_id', 'customer_id',
        ]));

        $data = $this->dashboardService->getOrderChart($filters);

        return $this->successResponse($data, 'Order chart retrieved successfully');
    }

    public function revenueChart(Request $request): JsonResponse
    {
        $filters = DashboardFilterDTO::fromRequest($request->only([
            'date_from', 'date_to', 'kitchen_id', 'city_id', 'meal_category_id', 'customer_id',
        ]));

        $data = $this->dashboardService->getRevenueChart($filters);

        return $this->successResponse($data, 'Revenue chart retrieved successfully');
    }

    public function expenseChart(Request $request): JsonResponse
    {
        $filters = DashboardFilterDTO::fromRequest($request->only([
            'date_from', 'date_to', 'kitchen_id', 'city_id', 'meal_category_id', 'customer_id',
        ]));

        $data = $this->dashboardService->getExpenseChart($filters);

        return $this->successResponse($data, 'Expense chart retrieved successfully');
    }
}
