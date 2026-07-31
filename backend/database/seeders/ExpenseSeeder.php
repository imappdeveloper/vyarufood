<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use App\Models\Expense;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['category_code' => 'EC-001', 'category_name' => 'Kitchen Expenses', 'icon' => 'restaurant', 'color' => '#4F46E5', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 1],
            ['category_code' => 'EC-002', 'category_name' => 'Raw Material Purchase', 'icon' => 'inventory_2', 'color' => '#059669', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 2],
            ['category_code' => 'EC-003', 'category_name' => 'Staff Salary', 'icon' => 'payments', 'color' => '#D97706', 'is_recurring' => true, 'is_taxable' => false, 'display_order' => 3],
            ['category_code' => 'EC-004', 'category_name' => 'Rent', 'icon' => 'home', 'color' => '#DC2626', 'is_recurring' => true, 'is_taxable' => false, 'display_order' => 4],
            ['category_code' => 'EC-005', 'category_name' => 'Electricity', 'icon' => 'bolt', 'color' => '#F59E0B', 'is_recurring' => true, 'is_taxable' => true, 'display_order' => 5],
            ['category_code' => 'EC-006', 'category_name' => 'Gas', 'icon' => 'local_fire_department', 'color' => '#EA580C', 'is_recurring' => true, 'is_taxable' => true, 'display_order' => 6],
            ['category_code' => 'EC-007', 'category_name' => 'Water', 'icon' => 'water_drop', 'color' => '#0284C7', 'is_recurring' => true, 'is_taxable' => true, 'display_order' => 7],
            ['category_code' => 'EC-008', 'category_name' => 'Internet', 'icon' => 'wifi', 'color' => '#7C3AED', 'is_recurring' => true, 'is_taxable' => true, 'display_order' => 8],
            ['category_code' => 'EC-009', 'category_name' => 'Packaging', 'icon' => 'inventory', 'color' => '#0891B2', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 9],
            ['category_code' => 'EC-010', 'category_name' => 'Delivery', 'icon' => 'local_shipping', 'color' => '#4338CA', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 10],
            ['category_code' => 'EC-011', 'category_name' => 'Fuel', 'icon' => 'local_gas_station', 'color' => '#B45309', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 11],
            ['category_code' => 'EC-012', 'category_name' => 'Vehicle Maintenance', 'icon' => 'car_repair', 'color' => '#9333EA', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 12],
            ['category_code' => 'EC-013', 'category_name' => 'Equipment Maintenance', 'icon' => 'build', 'color' => '#16A34A', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 13],
            ['category_code' => 'EC-014', 'category_name' => 'Cleaning Supplies', 'icon' => 'cleaning_services', 'color' => '#2563EB', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 14],
            ['category_code' => 'EC-015', 'category_name' => 'Office Expenses', 'icon' => 'business_center', 'color' => '#7C2D12', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 15],
            ['category_code' => 'EC-016', 'category_name' => 'Marketing', 'icon' => 'campaign', 'color' => '#DB2777', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 16],
            ['category_code' => 'EC-017', 'category_name' => 'Software Subscription', 'icon' => 'cloud', 'color' => '#4F46E5', 'is_recurring' => true, 'is_taxable' => true, 'display_order' => 17],
            ['category_code' => 'EC-018', 'category_name' => 'Taxes', 'icon' => 'receipt_long', 'color' => '#991B1B', 'is_recurring' => true, 'is_taxable' => false, 'display_order' => 18],
            ['category_code' => 'EC-019', 'category_name' => 'Bank Charges', 'icon' => 'account_balance', 'color' => '#1D4ED8', 'is_recurring' => true, 'is_taxable' => false, 'display_order' => 19],
            ['category_code' => 'EC-020', 'category_name' => 'Miscellaneous', 'icon' => 'more_horiz', 'color' => '#6B7280', 'is_recurring' => false, 'is_taxable' => true, 'display_order' => 20],
        ];

        $adminId = 1;

        foreach ($categories as $cat) {
            $existing = ExpenseCategory::where('category_code', $cat['category_code'])->first();
            if (! $existing) {
                ExpenseCategory::create(array_merge($cat, [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ]));
            }
        }

        $paymentMethods = ['cash', 'bank_transfer', 'upi', 'credit_card', 'debit_card', 'cheque', 'wallet'];
        $statuses = ['draft', 'pending_approval', 'approved', 'paid'];

        $expenseTemplates = [
            ['title' => 'Monthly Kitchen Rent Payment', 'category' => 'Rent', 'amount' => 35000, 'payment' => 'bank_transfer', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Electricity Bill - January', 'category' => 'Electricity', 'amount' => 8500, 'payment' => 'upi', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'LPG Gas Cylinders', 'category' => 'Gas', 'amount' => 3200, 'payment' => 'cash', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Internet & WiFi - Monthly', 'category' => 'Internet', 'amount' => 1500, 'payment' => 'upi', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Water Tanker Supply', 'category' => 'Water', 'amount' => 2500, 'payment' => 'cash', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Staff Salary - Week 1', 'category' => 'Staff Salary', 'amount' => 45000, 'payment' => 'bank_transfer', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Raw Material Purchase - Vegetables', 'category' => 'Raw Material Purchase', 'amount' => 12000, 'payment' => 'cash', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Packaging Material Order', 'category' => 'Packaging', 'amount' => 5500, 'payment' => 'upi', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Delivery Vehicle Fuel', 'category' => 'Fuel', 'amount' => 4000, 'payment' => 'credit_card', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Kitchen Equipment Repair', 'category' => 'Equipment Maintenance', 'amount' => 3500, 'payment' => 'cash', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Cleaning Supplies Monthly', 'category' => 'Cleaning Supplies', 'amount' => 2200, 'payment' => 'upi', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Office Stationery Purchase', 'category' => 'Office Expenses', 'amount' => 1800, 'payment' => 'cash', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Social Media Marketing', 'category' => 'Marketing', 'amount' => 8000, 'payment' => 'upi', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Vehicle Maintenance - Delivery Van', 'category' => 'Vehicle Maintenance', 'amount' => 6500, 'payment' => 'bank_transfer', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Raw Material - Spices & Lentils', 'category' => 'Raw Material Purchase', 'amount' => 9500, 'payment' => 'cash', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'Kitchen Staff Overtime', 'category' => 'Staff Salary', 'amount' => 8000, 'payment' => 'cash', 'status' => 'pending_approval', 'approval' => 'pending_approval'],
            ['title' => 'Software Subscription - Tally', 'category' => 'Software Subscription', 'amount' => 3000, 'payment' => 'bank_transfer', 'status' => 'pending_approval', 'approval' => 'pending_approval'],
            ['title' => 'Miscellaneous Repair Work', 'category' => 'Miscellaneous', 'amount' => 1500, 'payment' => 'cash', 'status' => 'draft', 'approval' => 'draft'],
            ['title' => 'Bank Processing Charges', 'category' => 'Bank Charges', 'amount' => 500, 'payment' => 'bank_transfer', 'status' => 'paid', 'approval' => 'approved'],
            ['title' => 'GST Payment - Quarterly', 'category' => 'Taxes', 'amount' => 25000, 'payment' => 'bank_transfer', 'status' => 'paid', 'approval' => 'approved'],
        ];

        $dateOffset = 0;
        foreach ($expenseTemplates as $idx => $exp) {
            $category = ExpenseCategory::where('category_name', $exp['category'])->first();
            if (! $category) continue;

            $expenseDate = now()->subDays($dateOffset)->toDateString();
            $amount = $exp['amount'];
            $tax = round($amount * 0.18, 2);
            $total = $amount + $tax;

            $existing = Expense::where('expense_title', $exp['title'])->first();
            if (! $existing) {
                Expense::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'expense_number' => 'EXP-' . now()->subDays($dateOffset)->format('Ymd') . '-' . str_pad((string) ($idx + 1), 4, '0', STR_PAD_LEFT),
                    'expense_category_id' => $category->id,
                    'expense_date' => $expenseDate,
                    'expense_title' => $exp['title'],
                    'expense_description' => "Sample expense for {$exp['category']}",
                    'vendor_name' => 'Sample Vendor ' . ($idx + 1),
                    'amount' => $amount,
                    'tax_amount' => $tax,
                    'discount_amount' => 0,
                    'total_amount' => $total,
                    'payment_method' => $exp['payment'],
                    'payment_account' => $exp['payment'] === 'bank_transfer' ? 'SBI Main Account' : null,
                    'invoice_number' => $exp['status'] !== 'draft' ? 'INV-' . str_pad((string) ($idx + 100), 4, '0', STR_PAD_LEFT) : null,
                    'invoice_date' => $exp['status'] !== 'draft' ? $expenseDate : null,
                    'approval_status' => $exp['approval'],
                    'expense_status' => $exp['status'],
                    'approved_by' => $exp['approval'] === 'approved' ? $adminId : null,
                    'approved_at' => $exp['approval'] === 'approved' ? now()->subDays(max(0, $dateOffset - 1)) : null,
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ]);
            }
            $dateOffset += 2;
        }
    }
}
