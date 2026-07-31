<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Dashboard\DashboardFilterRequest;
use App\Services\Dashboard\DashboardServiceInterface;
use App\DTOs\Dashboard\DashboardFilterDTO;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends BaseController
{
    use ApiResponse;

    public function __construct(
        protected DashboardServiceInterface $dashboardService,
    ) {}

    private function getFilter(DashboardFilterRequest $request): DashboardFilterDTO
    {
        return DashboardFilterDTO::fromRequest($request->validated());
    }

    public function summary(DashboardFilterRequest $request): JsonResponse
    {
        $data = $this->dashboardService->getSummary($this->getFilter($request));
        return $this->successResponse($data, 'Dashboard summary retrieved');
    }

    public function revenue(DashboardFilterRequest $request): JsonResponse
    {
        $data = $this->dashboardService->getRevenue($this->getFilter($request));
        return $this->successResponse($data, 'Revenue data retrieved');
    }

    public function orders(DashboardFilterRequest $request): JsonResponse
    {
        $data = $this->dashboardService->getOrders($this->getFilter($request));
        return $this->successResponse($data, 'Order analytics retrieved');
    }

    public function customers(DashboardFilterRequest $request): JsonResponse
    {
        $data = $this->dashboardService->getCustomers($this->getFilter($request));
        return $this->successResponse($data, 'Customer analytics retrieved');
    }

    public function subscriptions(DashboardFilterRequest $request): JsonResponse
    {
        $data = $this->dashboardService->getSubscriptions($this->getFilter($request));
        return $this->successResponse($data, 'Subscription analytics retrieved');
    }

    public function inventory(DashboardFilterRequest $request): JsonResponse
    {
        $data = $this->dashboardService->getInventory($this->getFilter($request));
        return $this->successResponse($data, 'Inventory analytics retrieved');
    }

    public function charts(DashboardFilterRequest $request): JsonResponse
    {
        $data = $this->dashboardService->getCharts($this->getFilter($request));
        return $this->successResponse($data, 'Chart data retrieved');
    }

    public function recentOrders(): JsonResponse
    {
        $data = $this->dashboardService->getRecentOrders(10);
        return $this->successResponse($data, 'Recent orders retrieved');
    }

    public function recentCustomers(): JsonResponse
    {
        $data = $this->dashboardService->getRecentCustomers(10);
        return $this->successResponse($data, 'Recent customers retrieved');
    }

    public function systemHealth(): JsonResponse
    {
        $data = $this->dashboardService->getSystemHealth();
        return $this->successResponse($data, 'System health retrieved');
    }

    public function exportSummary(Request $request): JsonResponse
    {
        $filter = DashboardFilterDTO::fromRequest($request->only(['period', 'start_date', 'end_date']));
        $data = $this->dashboardService->getSummary($filter);

        $this->logInfo('Dashboard summary exported', ['period' => $filter->period]);

        return $this->successResponse([
            'exported_at' => now()->toDateTimeString(),
            'filter' => $filter->period,
            'data' => $data,
        ], 'Dashboard summary exported');
    }

    public function exportRevenue(Request $request): JsonResponse
    {
        $filter = DashboardFilterDTO::fromRequest($request->only(['period', 'start_date', 'end_date']));
        $data = $this->dashboardService->getRevenue($filter);

        $this->logInfo('Revenue data exported', ['period' => $filter->period]);

        return $this->successResponse([
            'exported_at' => now()->toDateTimeString(),
            'filter' => $filter->period,
            'data' => $data,
        ], 'Revenue data exported');
    }
}
