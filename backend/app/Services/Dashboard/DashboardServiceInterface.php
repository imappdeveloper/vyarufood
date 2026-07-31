<?php

declare(strict_types=1);

namespace App\Services\Dashboard;

use App\DTOs\Dashboard\DashboardFilterDTO;

interface DashboardServiceInterface
{
    public function getSummary(DashboardFilterDTO $filter): array;
    public function getRevenue(DashboardFilterDTO $filter): array;
    public function getOrders(DashboardFilterDTO $filter): array;
    public function getCustomers(DashboardFilterDTO $filter): array;
    public function getSubscriptions(DashboardFilterDTO $filter): array;
    public function getInventory(DashboardFilterDTO $filter): array;
    public function getCharts(DashboardFilterDTO $filter): array;
    public function getRecentOrders(int $limit): array;
    public function getRecentCustomers(int $limit): array;
    public function getRecentSubscriptions(int $limit): array;
    public function getRecentPayments(int $limit): array;
    public function getRecentExpenses(int $limit): array;
    public function getRecentActivity(int $limit): array;
    public function getSystemHealth(): array;
}
