<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\DTOs\Report\ReportFilterDTO;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportRepository implements ReportRepositoryInterface
{
    private function getPeriodColumn(ReportFilterDTO $filters, string $alias = ''): string
    {
        $col = $alias ? "{$alias}.created_at" : 'created_at';

        return match ($filters->groupBy) {
            'week' => "YEARWEEK($col, 1)",
            'month' => "DATE_FORMAT($col, '%Y-%m')",
            'year' => "YEAR($col)",
            default => "DATE($col)",
        };
    }

    private function applyDateFilters($query, ReportFilterDTO $filters, string $table = 'orders'): void
    {
        if ($filters->dateFrom) {
            $query->where("{$table}.created_at", '>=', Carbon::parse($filters->dateFrom)->startOfDay());
        }
        if ($filters->dateTo) {
            $query->where("{$table}.created_at", '<=', Carbon::parse($filters->dateTo)->endOfDay());
        }
    }

    public function getSalesReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters);

        $query = DB::table('orders')
            ->selectRaw("{$periodCol} as period, COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_revenue, COALESCE(SUM(discount_amount), 0) as total_discount, COALESCE(AVG(total_amount), 0) as avg_order_value")
            ->where('order_status', '!=', 'cancelled');

        $this->applyDateFilters($query, $filters);

        if ($filters->kitchenId) {
            $query->where('kitchen_id', $filters->kitchenId);
        }
        if ($filters->status) {
            $query->where('order_status', $filters->status);
        }
        if ($filters->channel) {
            $query->where('channel', $filters->channel);
        }

        $data = $query->groupBy('period')->orderBy('period')->get()->toArray();

        $summary = DB::table('orders')
            ->selectRaw('COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_revenue, COALESCE(SUM(discount_amount), 0) as total_discount, COALESCE(AVG(total_amount), 0) as avg_order_value, COUNT(DISTINCT customer_id) as unique_customers')
            ->where('order_status', '!=', 'cancelled');

        $this->applyDateFilters($summary, $filters);

        if ($filters->kitchenId) {
            $summary->where('kitchen_id', $filters->kitchenId);
        }

        $summaryRow = $summary->first();

        $chart = DB::table('orders')
            ->selectRaw("{$periodCol} as period, COALESCE(SUM(total_amount), 0) as revenue")
            ->where('order_status', '!=', 'cancelled');

        $this->applyDateFilters($chart, $filters);

        if ($filters->kitchenId) {
            $chart->where('kitchen_id', $filters->kitchenId);
        }

        $chartData = $chart->groupBy('period')->orderBy('period')->pluck('revenue', 'period')->toArray();

        return [
            'data' => $data,
            'summary' => $summaryRow,
            'chart' => $chartData,
        ];
    }

    public function getOrderReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'o');

        $query = DB::table('orders as o')
            ->join('order_items as oi', 'o.id', '=', 'oi.order_id')
            ->selectRaw("{$periodCol} as period, o.order_status, COUNT(DISTINCT o.id) as order_count, COUNT(oi.id) as item_count, COALESCE(SUM(o.total_amount), 0) as total_amount")
            ->where('o.order_status', '!=', 'cancelled');

        $this->applyDateFilters($query, $filters, 'o');

        if ($filters->kitchenId) {
            $query->where('o.kitchen_id', $filters->kitchenId);
        }
        if ($filters->status) {
            $query->where('o.order_status', $filters->status);
        }

        $data = $query->groupBy('period', 'o.order_status')->orderBy('period')->get()->toArray();

        $summary = DB::table('orders')
            ->selectRaw("order_status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_amount")
            ->where('order_status', '!=', 'cancelled');

        $this->applyDateFilters($summary, $filters);

        if ($filters->kitchenId) {
            $summary->where('kitchen_id', $filters->kitchenId);
        }

        $summaryData = $summary->groupBy('order_status')->get()->toArray();

        $chart = DB::table('orders')
            ->selectRaw("order_status, COUNT(*) as count")
            ->where('order_status', '!=', 'cancelled');

        $this->applyDateFilters($chart, $filters);

        $chartData = $chart->groupBy('order_status')->pluck('count', 'order_status')->toArray();

        return [
            'data' => $data,
            'summary' => $summaryData,
            'chart' => $chartData,
        ];
    }

    public function getCustomerReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'c');

        $query = DB::table('customers as c')
            ->leftJoin('orders as o', 'c.id', '=', 'o.customer_id')
            ->selectRaw("{$periodCol} as period, COUNT(DISTINCT c.id) as total_customers, COUNT(DISTINCT CASE WHEN o.id IS NOT NULL THEN c.id END) as active_customers, COUNT(DISTINCT CASE WHEN o.id IS NULL THEN c.id END) as inactive_customers")
            ->groupBy('period')
            ->orderBy('period');

        if ($filters->dateFrom) {
            $query->where('c.created_at', '>=', Carbon::parse($filters->dateFrom)->startOfDay());
        }
        if ($filters->dateTo) {
            $query->where('c.created_at', '<=', Carbon::parse($filters->dateTo)->endOfDay());
        }

        $data = $query->get()->toArray();

        $summary = DB::table('customers')
            ->selectRaw("COUNT(*) as total_customers, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count, SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_count")
            ->first();

        $topCustomers = DB::table('orders as o')
            ->join('customers as c', 'c.id', '=', 'o.customer_id')
            ->selectRaw('c.id, CONCAT(c.first_name, \' \', c.last_name) as customer_name, c.email, COUNT(o.id) as order_count, COALESCE(SUM(o.total_amount), 0) as total_spent')
            ->where('o.order_status', '!=', 'cancelled')
            ->groupBy('c.id', 'c.first_name', 'c.last_name', 'c.email')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get()
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => ['top_customers' => $topCustomers],
        ];
    }

    public function getSubscriptionReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'cs');

        $query = DB::table('customer_subscriptions as cs')
            ->join('subscription_plans as sp', 'sp.id', '=', 'cs.subscription_plan_id')
            ->selectRaw("{$periodCol} as period, cs.subscription_status, sp.plan_name, COUNT(*) as subscription_count, COALESCE(SUM(sp.price), 0) as total_amount")
            ->groupBy('period', 'cs.subscription_status', 'sp.plan_name')
            ->orderBy('period');

        $this->applyDateFilters($query, $filters, 'cs');

        if ($filters->status) {
            $query->where('cs.subscription_status', $filters->status);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('customer_subscriptions as cs')
            ->selectRaw("cs.subscription_status, COUNT(*) as count, COALESCE(SUM(cs.remaining_meals), 0) as total_remaining")
            ->groupBy('cs.subscription_status')
            ->get()
            ->toArray();

        $chart = DB::table('customer_subscriptions as cs')
            ->selectRaw("cs.subscription_status, COUNT(*) as count")
            ->groupBy('cs.subscription_status')
            ->pluck('count', 'subscription_status')
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }

    public function getKitchenReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'pb');

        $query = DB::table('production_batches as pb')
            ->join('kitchens as k', 'k.id', '=', 'pb.kitchen_id')
            ->selectRaw("{$periodCol} as period, k.name as kitchen_name, pb.production_status, COUNT(*) as batch_count, COALESCE(SUM(pb.total_meals), 0) as total_produced")
            ->groupBy('period', 'k.name', 'pb.production_status')
            ->orderBy('period');

        $this->applyDateFilters($query, $filters, 'pb');

        if ($filters->kitchenId) {
            $query->where('pb.kitchen_id', $filters->kitchenId);
        }
        if ($filters->status) {
            $query->where('pb.production_status', $filters->status);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('production_batches as pb')
            ->selectRaw("pb.production_status, COUNT(*) as count, COALESCE(SUM(pb.total_meals), 0) as total_produced")
            ->groupBy('pb.production_status')
            ->get()
            ->toArray();

        $chart = DB::table('production_batches as pb')
            ->selectRaw("pb.production_status, COUNT(*) as count")
            ->groupBy('pb.production_status')
            ->pluck('count', 'production_status')
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }

    public function getInventoryReport(ReportFilterDTO $filters): array
    {
        $query = DB::table('inventory_items as ii')
            ->leftJoin('inventory_batches as ib', function ($join) {
                $join->on('ii.id', '=', 'ib.inventory_item_id')
                    ->where('ib.status', '=', 'active');
            })
            ->selectRaw('ii.id, ii.item_name, ii.sku, ii.unit_id, ii.current_stock, ii.reorder_level, COALESCE(SUM(ib.available_quantity), 0) as available_stock, COALESCE(SUM(ib.available_quantity * ib.unit_cost), 0) as stock_value')
            ->groupBy('ii.id', 'ii.item_name', 'ii.sku', 'ii.unit_id', 'ii.current_stock', 'ii.reorder_level');

        if ($filters->search) {
            $query->where(function ($q) use ($filters) {
                $q->where('ii.item_name', 'LIKE', "%{$filters->search}%")
                    ->orWhere('ii.sku', 'LIKE', "%{$filters->search}%");
            });
        }

        $data = $query->get()->toArray();

        $summary = DB::table('inventory_items')
            ->selectRaw('COUNT(*) as total_items, SUM(CASE WHEN current_stock <= reorder_level THEN 1 ELSE 0 END) as low_stock_count, SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock_count')
            ->first();

        $stockValue = DB::table('inventory_batches')
            ->where('status', 'active')
            ->where('available_quantity', '>', 0)
            ->selectRaw('COALESCE(SUM(available_quantity * unit_cost), 0) as total_stock_value')
            ->value('total_stock_value') ?? 0;

        $expiringBatches = DB::table('inventory_batches')
            ->where('status', 'active')
            ->where('available_quantity', '>', 0)
            ->whereBetween('expiry_date', [Carbon::now(), Carbon::now()->addDays(30)])
            ->selectRaw('id, inventory_item_id, batch_number, available_quantity, expiry_date')
            ->orderBy('expiry_date')
            ->get()
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => [
                'stock_value' => round((float) $stockValue, 2),
                'expiring_soon' => $expiringBatches,
            ],
        ];
    }

    public function getPurchaseReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'po');

        $query = DB::table('purchase_orders as po')
            ->join('suppliers as s', 's.id', '=', 'po.supplier_id')
            ->selectRaw("{$periodCol} as period, s.supplier_name, po.order_status, COUNT(*) as order_count, COALESCE(SUM(po.grand_total), 0) as total_amount")
            ->groupBy('period', 's.supplier_name', 'po.order_status')
            ->orderBy('period');

        $this->applyDateFilters($query, $filters, 'po');

        if ($filters->supplierId) {
            $query->where('po.supplier_id', $filters->supplierId);
        }
        if ($filters->status) {
            $query->where('po.order_status', $filters->status);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('purchase_orders as po')
            ->selectRaw("po.order_status, COUNT(*) as count, COALESCE(SUM(po.grand_total), 0) as total_amount")
            ->groupBy('po.order_status')
            ->get()
            ->toArray();

        $chart = DB::table('purchase_orders as po')
            ->selectRaw("po.order_status, COUNT(*) as count")
            ->groupBy('po.order_status')
            ->pluck('count', 'order_status')
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }

    public function getFinanceReport(ReportFilterDTO $filters): array
    {
        $periodCol = match ($filters->groupBy) {
            'week' => "YEARWEEK(je.journal_date, 1)",
            'month' => "DATE_FORMAT(je.journal_date, '%Y-%m')",
            'year' => "YEAR(je.journal_date)",
            default => "DATE(je.journal_date)",
        };

        $query = DB::table('journal_entries as je')
            ->join('journal_entry_lines as jel', 'je.id', '=', 'jel.journal_entry_id')
            ->selectRaw("{$periodCol} as period, CASE WHEN jel.debit_amount > 0 THEN 'debit' ELSE 'credit' END as type, COALESCE(SUM(CASE WHEN jel.debit_amount > 0 THEN jel.debit_amount ELSE jel.credit_amount END), 0) as total_amount")
            ->groupBy(DB::raw("{$periodCol}"), DB::raw("CASE WHEN jel.debit_amount > 0 THEN 'debit' ELSE 'credit' END"))
            ->orderBy('period');

        if ($filters->dateFrom) {
            $query->where('je.journal_date', '>=', $filters->dateFrom);
        }
        if ($filters->dateTo) {
            $query->where('je.journal_date', '<=', $filters->dateTo);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('journal_entry_lines')
            ->selectRaw("CASE WHEN debit_amount > 0 THEN 'debit' ELSE 'credit' END as type, COALESCE(SUM(CASE WHEN debit_amount > 0 THEN debit_amount ELSE credit_amount END), 0) as total_amount")
            ->groupBy(DB::raw("CASE WHEN debit_amount > 0 THEN 'debit' ELSE 'credit' END"))
            ->pluck('total_amount', 'type')
            ->toArray();

        $totalDebit = $summary['debit'] ?? 0;
        $totalCredit = $summary['credit'] ?? 0;

        $chart = DB::table('journal_entries as je')
            ->join('journal_entry_lines as jel', 'je.id', '=', 'jel.journal_entry_id')
            ->selectRaw("je.journal_date as date, CASE WHEN jel.debit_amount > 0 THEN 'debit' ELSE 'credit' END as type, COALESCE(SUM(CASE WHEN jel.debit_amount > 0 THEN jel.debit_amount ELSE jel.credit_amount END), 0) as amount")
            ->groupBy('je.journal_date', DB::raw("CASE WHEN jel.debit_amount > 0 THEN 'debit' ELSE 'credit' END"));

        if ($filters->dateFrom) {
            $chart->where('je.journal_date', '>=', $filters->dateFrom);
        }
        if ($filters->dateTo) {
            $chart->where('je.journal_date', '<=', $filters->dateTo);
        }

        $chartData = $chart->orderBy('je.journal_date')->get()->toArray();

        return [
            'data' => $data,
            'summary' => array_merge($summary, [
                'total_debit' => round((float) $totalDebit, 2),
                'total_credit' => round((float) $totalCredit, 2),
            ]),
            'chart' => $chartData,
        ];
    }

    public function getPaymentReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'pt');

        $query = DB::table('payment_transactions as pt')
            ->selectRaw("{$periodCol} as period, pt.gateway_name, pt.payment_method, pt.status, COUNT(*) as transaction_count, COALESCE(SUM(pt.amount), 0) as total_amount")
            ->groupBy('period', 'pt.gateway_name', 'pt.payment_method', 'pt.status')
            ->orderBy('period');

        $this->applyDateFilters($query, $filters, 'pt');

        if ($filters->gatewayName) {
            $query->where('pt.gateway_name', $filters->gatewayName);
        }
        if ($filters->status) {
            $query->where('pt.status', $filters->status);
        }
        if ($filters->paymentStatus) {
            $query->where('pt.status', $filters->paymentStatus);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('payment_transactions as pt')
            ->selectRaw("pt.status, COUNT(*) as count, COALESCE(SUM(pt.amount), 0) as total_amount")
            ->groupBy('pt.status')
            ->get()
            ->toArray();

        $chart = DB::table('payment_transactions as pt')
            ->selectRaw("pt.gateway_name, COUNT(*) as count, COALESCE(SUM(pt.amount), 0) as total_amount")
            ->groupBy('pt.gateway_name')
            ->pluck('total_amount', 'gateway_name')
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }

    public function getGstReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'gt');

        $query = DB::table('gst_transactions as gt')
            ->selectRaw("{$periodCol} as period, gt.gst_type, COALESCE(SUM(gt.taxable_amount), 0) as taxable_amount, COALESCE(SUM(gt.cgst_amount), 0) as cgst_amount, COALESCE(SUM(gt.sgst_amount), 0) as sgst_amount, COALESCE(SUM(gt.igst_amount), 0) as igst_amount, COALESCE(SUM(gt.total_tax), 0) as total_tax, COALESCE(SUM(gt.taxable_amount + gt.total_tax), 0) as total_amount")
            ->groupBy('period', 'gt.gst_type')
            ->orderBy('period');

        if ($filters->dateFrom) {
            $query->where('gt.created_at', '>=', Carbon::parse($filters->dateFrom)->startOfDay());
        }
        if ($filters->dateTo) {
            $query->where('gt.created_at', '<=', Carbon::parse($filters->dateTo)->endOfDay());
        }
        if ($filters->status) {
            $query->where('gt.gst_type', $filters->status);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('gst_transactions as gt')
            ->selectRaw("gt.gst_type, COALESCE(SUM(gt.taxable_amount), 0) as taxable_amount, COALESCE(SUM(gt.cgst_amount), 0) as cgst_amount, COALESCE(SUM(gt.sgst_amount), 0) as sgst_amount, COALESCE(SUM(gt.igst_amount), 0) as igst_amount, COALESCE(SUM(gt.total_tax), 0) as total_tax, COALESCE(SUM(gt.taxable_amount + gt.total_tax), 0) as total_amount")
            ->groupBy('gt.gst_type')
            ->get()
            ->toArray();

        $chart = DB::table('gst_transactions as gt')
            ->selectRaw("gt.gst_type, COALESCE(SUM(gt.total_tax), 0) as total_tax")
            ->groupBy('gt.gst_type')
            ->pluck('total_tax', 'gst_type')
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }

    public function getExpenseReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'e');

        $query = DB::table('expenses as e')
            ->join('expense_categories as ec', 'ec.id', '=', 'e.expense_category_id')
            ->selectRaw("{$periodCol} as period, ec.category_name as category_name, e.expense_status, COUNT(*) as expense_count, COALESCE(SUM(e.total_amount), 0) as total_amount")
            ->groupBy('period', 'ec.category_name', 'e.expense_status')
            ->orderBy('period');

        $this->applyDateFilters($query, $filters, 'e');

        if ($filters->categoryId) {
            $query->where('e.expense_category_id', $filters->categoryId);
        }
        if ($filters->status) {
            $query->where('e.expense_status', $filters->status);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('expenses as e')
            ->selectRaw("e.expense_status, COUNT(*) as count, COALESCE(SUM(e.total_amount), 0) as total_amount")
            ->groupBy('e.expense_status')
            ->get()
            ->toArray();

        $chart = DB::table('expenses as e')
            ->join('expense_categories as ec', 'ec.id', '=', 'e.expense_category_id')
            ->selectRaw("ec.category_name as category, COALESCE(SUM(e.total_amount), 0) as total_amount")
            ->where('e.expense_status', 'approved')
            ->groupBy('ec.category_name')
            ->pluck('total_amount', 'category')
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }

    public function getSupplierReport(ReportFilterDTO $filters): array
    {
        $query = DB::table('suppliers as s')
            ->leftJoin('purchase_orders as po', 's.id', '=', 'po.supplier_id')
            ->selectRaw('s.id, s.supplier_name, COUNT(po.id) as order_count, COALESCE(SUM(po.grand_total), 0) as total_purchased')
            ->groupBy('s.id', 's.supplier_name')
            ->orderByDesc('total_purchased');

        if ($filters->supplierId) {
            $query->where('s.id', $filters->supplierId);
        }
        if ($filters->search) {
            $query->where('s.name', 'LIKE', "%{$filters->search}%");
        }

        $data = $query->get()->toArray();

        $summary = DB::table('suppliers as s')
            ->leftJoin('purchase_orders as po', 's.id', '=', 'po.supplier_id')
            ->selectRaw('COUNT(DISTINCT s.id) as total_suppliers, COUNT(po.id) as total_orders, COALESCE(SUM(po.grand_total), 0) as total_purchased')
            ->first();

        $chartQuery = DB::table('suppliers as s')
            ->join('purchase_orders as po', 's.id', '=', 'po.supplier_id')
            ->selectRaw('s.supplier_name as supplier_name, COALESCE(SUM(po.grand_total), 0) as total_amount')
            ->groupBy('s.supplier_name')
            ->orderByDesc('total_amount')
            ->limit(10);

        if ($filters->dateFrom) {
            $chartQuery->where('po.created_at', '>=', Carbon::parse($filters->dateFrom)->startOfDay());
        }
        if ($filters->dateTo) {
            $chartQuery->where('po.created_at', '<=', Carbon::parse($filters->dateTo)->endOfDay());
        }

        $chart = $chartQuery->pluck('total_amount', 'supplier_name')->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }

    public function getNotificationReport(ReportFilterDTO $filters): array
    {
        $periodCol = $this->getPeriodColumn($filters, 'n');

        $query = DB::table('notifications as n')
            ->selectRaw("{$periodCol} as period, n.channel, n.delivery_status, COUNT(*) as notification_count")
            ->groupBy('period', 'n.channel', 'n.delivery_status')
            ->orderBy('period');

        if ($filters->dateFrom) {
            $query->where('n.created_at', '>=', Carbon::parse($filters->dateFrom)->startOfDay());
        }
        if ($filters->dateTo) {
            $query->where('n.created_at', '<=', Carbon::parse($filters->dateTo)->endOfDay());
        }
        if ($filters->channel) {
            $query->where('n.channel', $filters->channel);
        }
        if ($filters->status) {
            $query->where('n.delivery_status', $filters->status);
        }

        $data = $query->get()->toArray();

        $summary = DB::table('notifications as n')
            ->selectRaw("n.delivery_status, COUNT(*) as count")
            ->groupBy('n.delivery_status')
            ->get()
            ->toArray();

        $chart = DB::table('notifications as n')
            ->selectRaw("n.channel, COUNT(*) as count")
            ->groupBy('n.channel')
            ->pluck('count', 'channel')
            ->toArray();

        return [
            'data' => $data,
            'summary' => $summary,
            'chart' => $chart,
        ];
    }
}
