<?php

declare(strict_types=1);

namespace App\Repositories\Dashboard;

use App\DTOs\Dashboard\DashboardFilterDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function tableExists(string $table): bool
    {
        return Schema::hasTable($table);
    }

    private function safeCount(string $table, callable $modifier = null): int
    {
        if (!$this->tableExists($table)) return 0;
        try {
            $query = DB::table($table);
            if ($modifier) $modifier($query);
            return (int) $query->count();
        } catch (\Exception) {
            return 0;
        }
    }

    private function safeSum(string $table, string $column, callable $modifier = null): float
    {
        if (!$this->tableExists($table)) return 0;
        try {
            $query = DB::table($table);
            if ($modifier) $modifier($query);
            return (float) $query->sum($column);
        } catch (\Exception) {
            return 0;
        }
    }

    private function safeQuery(string $table, callable $callback): mixed
    {
        if (!$this->tableExists($table)) return collect();
        try {
            $result = $callback(DB::table($table));
            return $result instanceof \Illuminate\Database\Query\Builder ? $result->get() : $result;
        } catch (\Exception) {
            return collect();
        }
    }

    public function getSummary(DashboardFilterDTO $filter): array
    {
        $range = $filter->getDateRange();

        return [
            'revenue' => $this->getRevenueSummary($range),
            'orders' => $this->getOrderSummary($range),
            'customers' => $this->getCustomerSummary($range),
            'subscriptions' => $this->getSubscriptionSummary($range),
            'meals' => $this->getMealSummary(),
            'expenses' => $this->getExpenseSummary($range),
        ];
    }

    private function getRevenueSummary(array $range): array
    {
        $orderRevenue = fn($q) => $q->where('payment_status', 'paid');
        $walletCredit = fn($q) => $q->where('transaction_type', 'credit')->whereNotNull('created_by');

        $periodOrder = $this->safeSum('orders', 'total_amount', fn($q) =>
            $orderRevenue($q)->whereBetween('created_at', [$range['start'], $range['end']])
        );
        $periodWallet = $this->safeSum('wallet_transactions', 'amount', fn($q) =>
            $walletCredit($q)->whereBetween('created_at', [$range['start'], $range['end']])
        );
        $periodTotal = $periodOrder + $periodWallet;

        $prevRange = $this->getPreviousRange($range);
        $prevOrder = $this->safeSum('orders', 'total_amount', fn($q) =>
            $orderRevenue($q)->whereBetween('created_at', [$prevRange['start'], $prevRange['end']])
        );
        $prevWallet = $this->safeSum('wallet_transactions', 'amount', fn($q) =>
            $walletCredit($q)->whereBetween('created_at', [$prevRange['start'], $prevRange['end']])
        );
        $prevTotal = $prevOrder + $prevWallet;

        $todayRevenue = $this->safeSum('orders', 'total_amount', fn($q) =>
            $orderRevenue($q)->whereDate('created_at', now()->toDateString())
        ) + $this->safeSum('wallet_transactions', 'amount', fn($q) =>
            $walletCredit($q)->whereDate('created_at', now()->toDateString())
        );

        $monthRevenue = $this->safeSum('orders', 'total_amount', fn($q) =>
            $orderRevenue($q)->whereBetween('created_at', [now()->startOfMonth(), now()->endOfDay()])
        ) + $this->safeSum('wallet_transactions', 'amount', fn($q) =>
            $walletCredit($q)->whereBetween('created_at', [now()->startOfMonth(), now()->endOfDay()])
        );

        $totalRevenue = $this->safeSum('orders', 'total_amount', fn($q) =>
            $orderRevenue($q)
        ) + $this->safeSum('wallet_transactions', 'amount', fn($q) =>
            $walletCredit($q)
        );

        return [
            'today' => $todayRevenue,
            'month' => $monthRevenue,
            'total' => $totalRevenue,
            'period' => $periodTotal,
            'change_percentage' => $prevTotal > 0
                ? round((($periodTotal - $prevTotal) / $prevTotal) * 100, 1)
                : 0,
        ];
    }

    private function getOrderSummary(array $range): array
    {
        $countByStatus = function (string $status) use ($range) {
            return $this->safeCount('orders', fn($q) =>
                $q->where('order_status', $status)
                  ->whereBetween('created_at', [$range['start'], $range['end']])
            );
        };

        $todayTotal = $this->safeCount('orders', fn($q) =>
            $q->whereDate('created_at', now()->toDateString())
        );

        return [
            'today' => $todayTotal,
            'pending' => $countByStatus('pending'),
            'preparing' => $countByStatus('preparing'),
            'ready' => $countByStatus('ready'),
            'out_for_delivery' => $countByStatus('out_for_delivery'),
            'delivered' => $countByStatus('delivered'),
            'cancelled' => $countByStatus('cancelled'),
            'refund_requested' => $countByStatus('refund_requested'),
            'period_total' => $this->safeCount('orders', fn($q) =>
                $q->whereBetween('created_at', [$range['start'], $range['end']])
            ),
        ];
    }

    private function getCustomerSummary(array $range): array
    {
        $todayNew = $this->safeCount('customers', fn($q) =>
            $q->whereDate('created_at', now()->toDateString())
        );

        return [
            'total' => $this->safeCount('customers'),
            'new_today' => $todayNew,
            'active' => $this->safeCount('customers', fn($q) => $q->where('status', 'active')),
            'inactive' => $this->safeCount('customers', fn($q) => $q->where('status', 'inactive')),
            'period_new' => $this->safeCount('customers', fn($q) =>
                $q->whereBetween('created_at', [$range['start'], $range['end']])
            ),
        ];
    }

    private function getSubscriptionSummary(array $range): array
    {
        return [
            'total_plans' => $this->safeCount('subscription_plans'),
            'active' => $this->safeCount('customer_subscriptions', fn($q) => $q->where('subscription_status', 'active')),
            'expired' => $this->safeCount('customer_subscriptions', fn($q) => $q->where('subscription_status', 'expired')),
            'new_today' => $this->safeCount('customer_subscriptions', fn($q) =>
                $q->whereDate('created_at', now()->toDateString())
            ),
            'total' => $this->safeCount('customer_subscriptions'),
        ];
    }

    private function getMealSummary(): array
    {
        return [
            'total' => $this->safeCount('meals'),
            'available' => $this->safeCount('meals', fn($q) => $q->where('status', 'active')),
            'out_of_stock' => $this->safeCount('meals', fn($q) => $q->where('status', 'inactive')),
            'low_stock_ingredients' => $this->safeCount('inventory_items', fn($q) =>
                $q->whereColumn('current_stock', '<=', 'minimum_stock')
            ),
            'kitchen_capacity' => $this->safeCount('meals', fn($q) => $q->where('status', 'active')),
        ];
    }

    private function getExpenseSummary(array $range): array
    {
        $periodExpenses = $this->safeSum('expenses', 'amount', fn($q) =>
            $q->whereBetween('created_at', [$range['start'], $range['end']])
        );

        $todayExpenses = $this->safeSum('expenses', 'amount', fn($q) =>
            $q->whereDate('created_at', now()->toDateString())
        );

        $monthExpenses = $this->safeSum('expenses', 'amount', fn($q) =>
            $q->whereBetween('created_at', [now()->startOfMonth(), now()->endOfDay()])
        );

        $monthRevenue = $this->safeSum('orders', 'total_amount', fn($q) =>
            $q->where('payment_status', 'paid')
              ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfDay()])
        );

        return [
            'today' => $todayExpenses,
            'month' => $monthExpenses,
            'period' => $periodExpenses,
            'net_profit' => $monthRevenue - $monthExpenses,
        ];
    }

    public function getRevenue(DashboardFilterDTO $filter): array
    {
        $range = $filter->getDateRange();

        $dailyOrder = $this->safeQuery('orders', fn($q) =>
            $q->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
              ->where('payment_status', 'paid')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('date')
              ->orderBy('date')
        );

        $dailyWallet = $this->safeQuery('wallet_transactions', fn($q) =>
            $q->selectRaw('DATE(created_at) as date, SUM(amount) as revenue')
              ->where('transaction_type', 'credit')
              ->whereNotNull('created_by')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('date')
              ->orderBy('date')
        );

        $daily = collect();
        $dates = $dailyOrder->pluck('date')->merge($dailyWallet->pluck('date'))->unique()->sort();
        foreach ($dates as $date) {
            $orderRev = (float) ($dailyOrder->firstWhere('date', $date)?->revenue ?? 0);
            $walletRev = (float) ($dailyWallet->firstWhere('date', $date)?->revenue ?? 0);
            $daily->push((object)['date' => $date, 'revenue' => $orderRev + $walletRev]);
        }

        $monthlyOrder = $this->safeQuery('orders', fn($q) =>
            $q->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total_amount) as revenue')
              ->where('payment_status', 'paid')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('year', 'month')
              ->orderBy('year')
              ->orderBy('month')
        );

        $monthlyWallet = $this->safeQuery('wallet_transactions', fn($q) =>
            $q->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(amount) as revenue')
              ->where('transaction_type', 'credit')
              ->whereNotNull('created_by')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('year', 'month')
              ->orderBy('year')
              ->orderBy('month')
        );

        $monthly = collect();
        $months = $monthlyOrder->map(fn($r) => $r->year . '-' . $r->month)
            ->merge($monthlyWallet->map(fn($r) => $r->year . '-' . $r->month))
            ->unique()->sort();
        foreach ($months as $ym) {
            [$y, $m] = explode('-', $ym);
            $orderRev = (float) ($monthlyOrder->firstWhere(fn($r) => $r->year == $y && $r->month == $m)?->revenue ?? 0);
            $walletRev = (float) ($monthlyWallet->firstWhere(fn($r) => $r->year == $y && $r->month == $m)?->revenue ?? 0);
            $monthly->push((object)['year' => (int) $y, 'month' => (int) $m, 'revenue' => $orderRev + $walletRev]);
        }

        return [
            'daily' => $daily->map(fn($row) => ['date' => $row->date, 'revenue' => (float) $row->revenue])->values(),
            'monthly' => $monthly->map(fn($row) => ['year' => $row->year, 'month' => $row->month, 'revenue' => (float) $row->revenue])->values(),
        ];
    }

    public function getOrders(DashboardFilterDTO $filter): array
    {
        $range = $filter->getDateRange();

        $statusDistribution = $this->safeQuery('orders', fn($q) =>
            $q->selectRaw('order_status, COUNT(*) as count')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('order_status')
        );

        $hourly = $this->safeQuery('orders', fn($q) =>
            $q->selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('hour')
              ->orderBy('hour')
        );

        $daily = $this->safeQuery('orders', fn($q) =>
            $q->selectRaw('DATE(created_at) as date, COUNT(*) as count')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('date')
              ->orderBy('date')
        );

        $avgValue = $this->safeQuery('orders', fn($q) =>
            $q->selectRaw('AVG(total_amount) as avg_value')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->where('payment_status', 'paid')
        );

        return [
            'status_distribution' => $statusDistribution->map(fn($r) => ['status' => $r->order_status, 'count' => (int) $r->count])->values(),
            'hourly' => $hourly->map(fn($r) => ['hour' => (int) $r->hour, 'count' => (int) $r->count])->values(),
            'daily' => $daily->map(fn($r) => ['date' => $r->date, 'count' => (int) $r->count])->values(),
            'average_value' => $avgValue->first() ? (float) $avgValue->first()->avg_value : 0,
        ];
    }

    public function getCustomers(DashboardFilterDTO $filter): array
    {
        $range = $filter->getDateRange();

        $growth = $this->safeQuery('customers', fn($q) =>
            $q->selectRaw('DATE(created_at) as date, COUNT(*) as count')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('date')
              ->orderBy('date')
        );

        $topCustomers = $this->safeQuery('orders', fn($q) =>
            $q->selectRaw('customer_id, COUNT(*) as order_count, SUM(total_amount) as total_spent')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('customer_id')
              ->orderByDesc('total_spent')
              ->limit(10)
        );

        return [
            'growth' => $growth->map(fn($r) => ['date' => $r->date, 'count' => (int) $r->count])->values(),
            'top_customers' => $topCustomers->values(),
            'subscription_customers' => $this->safeCount('customer_subscriptions', fn($q) => $q->where('subscription_status', 'active')),
            'retention_rate' => 0,
        ];
    }

    public function getSubscriptions(DashboardFilterDTO $filter): array
    {
        $range = $filter->getDateRange();

        $planDistribution = $this->safeQuery('customer_subscriptions', fn($q) =>
            $q->selectRaw('subscription_plan_id, subscription_status, COUNT(*) as count')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('subscription_plan_id', 'subscription_status')
        );

        return [
            'plan_distribution' => $planDistribution->values(),
            'total_plans' => $this->safeCount('subscription_plans'),
            'active_subscriptions' => $this->safeCount('customer_subscriptions', fn($q) => $q->where('subscription_status', 'active')),
        ];
    }

    public function getInventory(DashboardFilterDTO $filter): array
    {
        $lowStock = $this->safeQuery('inventory_items', fn($q) =>
            $q->whereColumn('current_stock', '<=', 'minimum_stock')
              ->orderBy('current_stock')
              ->limit(10)
        );

        $topConsumed = $this->safeQuery('inventory_consumption_logs', fn($q) =>
            $q->selectRaw('inventory_item_id, SUM(consumed_quantity) as total_used')
              ->groupBy('inventory_item_id')
              ->orderByDesc('total_used')
              ->limit(10)
        );

        $totalValue = $this->safeSum('inventory_items', 'cost_price');

        return [
            'low_stock_items' => $lowStock->values(),
            'top_consumed' => $topConsumed->values(),
            'total_value' => $totalValue,
            'low_stock_count' => $this->safeCount('inventory_items', fn($q) =>
                $q->whereColumn('current_stock', '<=', 'minimum_stock')
            ),
        ];
    }

    public function getCharts(DashboardFilterDTO $filter): array
    {
        $range = $filter->getDateRange();

        $revenueData = $this->getRevenue($filter);
        $orderData = $this->getOrders($filter);

        $expenseTrend = $this->safeQuery('expenses', fn($q) =>
            $q->selectRaw('DATE(created_at) as date, SUM(amount) as total')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('date')
              ->orderBy('date')
        );

        $topMeals = $this->safeQuery('order_items', fn($q) =>
            $q->selectRaw('meal_id, SUM(quantity) as total_qty')
              ->whereBetween('created_at', [$range['start'], $range['end']])
              ->groupBy('meal_id')
              ->orderByDesc('total_qty')
              ->limit(10)
        );

        return [
            'revenue_trend' => $revenueData['daily'],
            'expense_trend' => $expenseTrend->map(fn($r) => ['date' => $r->date, 'amount' => (float) $r->total])->values(),
            'order_status' => $orderData['status_distribution'],
            'orders_by_hour' => $orderData['hourly'],
            'orders_by_day' => $orderData['daily'],
            'sales_by_category' => [],
            'top_meals' => $topMeals->values(),
        ];
    }

    public function getRecentOrders(int $limit): array
    {
        return $this->safeQuery('orders', fn($q) =>
            $q->orderByDesc('created_at')->limit($limit)
        )->toArray();
    }

    public function getRecentCustomers(int $limit): array
    {
        return $this->safeQuery('customers', fn($q) =>
            $q->orderByDesc('created_at')->limit($limit)
        )->toArray();
    }

    public function getRecentSubscriptions(int $limit): array
    {
        return $this->safeQuery('customer_subscriptions', fn($q) =>
            $q->orderByDesc('created_at')->limit($limit)
        )->toArray();
    }

    public function getRecentPayments(int $limit): array
    {
        return $this->safeQuery('payment_transactions', fn($q) =>
            $q->orderByDesc('created_at')->limit($limit)
        )->toArray();
    }

    public function getRecentExpenses(int $limit): array
    {
        return $this->safeQuery('expenses', fn($q) =>
            $q->orderByDesc('created_at')->limit($limit)
        )->toArray();
    }

    public function getRecentActivity(int $limit): array
    {
        try {
            if (!$this->tableExists('activity_log')) return [];
            return DB::table('activity_log')
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception) {
            return [];
        }
    }

    public function getSystemHealth(): array
    {
        $queueSize = 0;
        try {
            if ($this->tableExists('jobs')) {
                $queueSize = (int) DB::table('jobs')->count();
            }
        } catch (\Exception) {}

        $storageUsed = 0;
        try {
            $storagePath = storage_path();
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($storagePath, \RecursiveDirectoryIterator::SKIP_DOTS)
            );
            foreach ($iterator as $file) {
                $storageUsed += $file->getSize();
            }
        } catch (\Exception) {}

        return [
            'app_version' => config('app.version', '1.0.0'),
            'laravel_version' => app()->version(),
            'php_version' => PHP_VERSION,
            'mysql_status' => $this->checkMysqlStatus(),
            'redis_status' => $this->checkRedisStatus(),
            'queue_size' => $queueSize,
            'storage_used' => $storageUsed,
            'server_time' => now()->toDateTimeString(),
            'timezone' => config('app.timezone'),
        ];
    }

    private function getPreviousRange(array $range): array
    {
        $start = \Carbon\Carbon::parse($range['start']);
        $end = \Carbon\Carbon::parse($range['end']);
        $diff = $start->diffInSeconds($end);

        return [
            'start' => $start->subSeconds($diff)->startOfDay()->toDateTimeString(),
            'end' => $end->subSeconds($diff)->endOfDay()->toDateTimeString(),
        ];
    }

    private function checkMysqlStatus(): string
    {
        try {
            DB::select('SELECT 1');
            return 'connected';
        } catch (\Exception) {
            return 'disconnected';
        }
    }

    private function checkRedisStatus(): string
    {
        if (!class_exists('Predis\Client') && !class_exists('Redis')) {
            return 'not_available';
        }
        try {
            \Illuminate\Support\Facades\Redis::ping();
            return 'connected';
        } catch (\Exception) {
            return 'disconnected';
        }
    }
}
