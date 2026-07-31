<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\DTOs\Report\DashboardFilterDTO;

interface DashboardServiceInterface
{
    public function getExecutiveDashboard(DashboardFilterDTO $filters): array;
    public function getSalesChart(DashboardFilterDTO $filters): array;
    public function getOrderChart(DashboardFilterDTO $filters): array;
    public function getRevenueChart(DashboardFilterDTO $filters): array;
    public function getExpenseChart(DashboardFilterDTO $filters): array;
}
