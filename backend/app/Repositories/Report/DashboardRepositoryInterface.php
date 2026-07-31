<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\DTOs\Report\DashboardFilterDTO;

interface DashboardRepositoryInterface
{
    public function getExecutiveKPIs(DashboardFilterDTO $filters): array;
    public function getSalesChart(DashboardFilterDTO $filters): array;
    public function getOrderChart(DashboardFilterDTO $filters): array;
    public function getRevenueChart(DashboardFilterDTO $filters): array;
    public function getExpenseChart(DashboardFilterDTO $filters): array;
}
