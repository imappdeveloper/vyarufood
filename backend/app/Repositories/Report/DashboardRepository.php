<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\DTOs\Report\DashboardFilterDTO;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function getExecutiveKPIs(DashboardFilterDTO $filters): array
    {
        $dateFrom = $filters->dateFrom ? Carbon::parse($filters->dateFrom)->startOfDay() : Carbon::now()->startOfDay();
        $dateTo = $filters->dateTo ? Carbon::parse($filters->dateTo)->endOfDay() : Carbon::now()->endOfDay();

        $todayStart = Carbon::now()->startOfDay();
        $todayEnd = Carbon::now()->endOfDay();

        $revenueQuery = DB::table('orders')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->where('order_status', '!=', 'cancelled');

        $ordersQuery = DB::table('orders')
            ->whereBetween('created_at', [$todayStart, $todayEnd]);

        $activeCustomers = DB::table('customers')
            ->where('status', 'active')
            ->count('id');

        $activeSubscriptions = DB::table('customer_subscriptions')
            ->whereIn('subscription_status', ['active', 'paused'])
            ->count('id');

        $pendingOrders = DB::table('orders')
            ->where('order_status', 'pending')
            ->count('id');

        $kitchenProduction = DB::table('production_batches')
            ->whereDate('production_date', Carbon::now()->toDateString())
            ->where('production_status', '!=', 'cancelled')
            ->count('id');

        $inventoryValue = DB::table('inventory_batches')
            ->where('status', 'active')
            ->where('available_quantity', '>', 0)
            ->selectRaw('COALESCE(SUM(available_quantity * unit_cost), 0) as total_value')
            ->value('total_value') ?? 0;

        $lowStockCount = DB::table('inventory_items')
            ->whereColumn('current_stock', '<=', 'reorder_level')
            ->where('status', 'active')
            ->count('id');

        $totalExpenses = DB::table('expenses')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->whereIn('expense_status', ['approved', 'auto_approved'])
            ->selectRaw('COALESCE(SUM(total_amount), 0) as total')
            ->value('total') ?? 0;

        $todayRevenue = (float) $revenueQuery->selectRaw('COALESCE(SUM(total_amount), 0) as revenue')->value('revenue') ?? 0;
        $todayOrders = $ordersQuery->count('id');
        $netProfit = $todayRevenue - (float) $totalExpenses;

        $yesterdayStart = Carbon::now()->subDay()->startOfDay();
        $yesterdayEnd = Carbon::now()->subDay()->endOfDay();

        $yesterdayRevenue = (float) DB::table('orders')
            ->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])
            ->where('order_status', '!=', 'cancelled')
            ->selectRaw('COALESCE(SUM(total_amount), 0) as revenue')
            ->value('revenue') ?? 0;

        $yesterdayOrders = DB::table('orders')
            ->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])
            ->count('id');

        $revenueChange = $yesterdayRevenue > 0
            ? round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 2)
            : 0;

        $ordersChange = $yesterdayOrders > 0
            ? round((($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100, 2)
            : 0;

        return [
            'today_revenue' => round($todayRevenue, 2),
            'today_orders' => $todayOrders,
            'active_customers' => $activeCustomers,
            'active_subscriptions' => $activeSubscriptions,
            'pending_orders' => $pendingOrders,
            'kitchen_production_batches' => $kitchenProduction,
            'inventory_value' => round((float) $inventoryValue, 2),
            'low_stock_items' => $lowStockCount,
            'total_expenses' => round((float) $totalExpenses, 2),
            'net_profit' => round($netProfit, 2),
            'revenue_change_pct' => $revenueChange,
            'orders_change_pct' => $ordersChange,
        ];
    }

    public function getSalesChart(DashboardFilterDTO $filters): array
    {
        $dateFrom = $filters->dateFrom ?? Carbon::now()->subDays(30)->toDateString();
        $dateTo = $filters->dateTo ?? Carbon::now()->toDateString();

        $query = DB::table('orders')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as revenue')
            ->whereBetween('created_at', [
                Carbon::parse($dateFrom)->startOfDay(),
                Carbon::parse($dateTo)->endOfDay(),
            ])
            ->where('order_status', '!=', 'cancelled')
            ->groupBy(DB::raw('DATE(created_at)'));

        if ($filters->kitchenId) {
            $query->where('kitchen_id', $filters->kitchenId);
        }

        $data = $query->orderBy('date')->get()->map(fn ($row) => [
            'date' => $row->date,
            'order_count' => (int) $row->order_count,
            'revenue' => round((float) $row->revenue, 2),
        ])->toArray();

        return ['data' => $data];
    }

    public function getOrderChart(DashboardFilterDTO $filters): array
    {
        $dateFrom = $filters->dateFrom ?? Carbon::now()->subDays(30)->toDateString();
        $dateTo = $filters->dateTo ?? Carbon::now()->toDateString();

        $query = DB::table('orders')
            ->selectRaw('DATE(created_at) as date, order_status, COUNT(*) as count')
            ->whereBetween('created_at', [
                Carbon::parse($dateFrom)->startOfDay(),
                Carbon::parse($dateTo)->endOfDay(),
            ])
            ->groupBy(DB::raw('DATE(created_at)'), 'order_status');

        if ($filters->kitchenId) {
            $query->where('kitchen_id', $filters->kitchenId);
        }

        $data = $query->orderBy('date')->get()->map(fn ($row) => [
            'date' => $row->date,
            'status' => $row->order_status,
            'count' => (int) $row->count,
        ])->toArray();

        return ['data' => $data];
    }

    public function getRevenueChart(DashboardFilterDTO $filters): array
    {
        $dateFrom = $filters->dateFrom ?? Carbon::now()->subDays(30)->toDateString();
        $dateTo = $filters->dateTo ?? Carbon::now()->toDateString();

        $query = DB::table('orders')
            ->selectRaw('DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as revenue')
            ->whereBetween('created_at', [
                Carbon::parse($dateFrom)->startOfDay(),
                Carbon::parse($dateTo)->endOfDay(),
            ])
            ->where('order_status', '!=', 'cancelled')
            ->groupBy(DB::raw('DATE(created_at)'));

        if ($filters->kitchenId) {
            $query->where('kitchen_id', $filters->kitchenId);
        }

        $data = $query->orderBy('date')->get()->map(fn ($row) => [
            'date' => $row->date,
            'revenue' => round((float) $row->revenue, 2),
        ])->toArray();

        return ['data' => $data];
    }

    public function getExpenseChart(DashboardFilterDTO $filters): array
    {
        $dateFrom = $filters->dateFrom ?? Carbon::now()->subDays(30)->toDateString();
        $dateTo = $filters->dateTo ?? Carbon::now()->toDateString();

        $query = DB::table('expenses')
            ->selectRaw('DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as total_expense')
            ->whereBetween('created_at', [
                Carbon::parse($dateFrom)->startOfDay(),
                Carbon::parse($dateTo)->endOfDay(),
            ])
            ->whereIn('expense_status', ['approved', 'auto_approved'])
            ->groupBy(DB::raw('DATE(created_at)'));

        if ($filters->categoryId) {
            $query->where('expense_category_id', $filters->categoryId);
        }

        $data = $query->orderBy('date')->get()->map(fn ($row) => [
            'date' => $row->date,
            'total_expense' => round((float) $row->total_expense, 2),
        ])->toArray();

        return ['data' => $data];
    }
}
