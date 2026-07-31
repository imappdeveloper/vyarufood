<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ChartOfAccount;
use App\Models\FinancialYear;
use App\Models\BankAccount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = 1;

        Model::unguard(true);

        // ── Financial Year ───────────────────────────────────────────────
        $fyExists = FinancialYear::where('year_name', 'FY 2025-26')->exists();

        if (! $fyExists) {
            FinancialYear::create([
                'uuid'        => \Illuminate\Support\Str::uuid()->toString(),
                'year_name'   => 'FY 2025-26',
                'start_date'  => '2025-04-01',
                'end_date'    => '2026-03-31',
                'is_current'  => true,
                'is_closed'   => false,
                'created_by'  => $adminId,
                'updated_by'  => $adminId,
            ]);
        }

        // ── Chart of Accounts ────────────────────────────────────────────
        $accounts = [
            // --- Assets ---
            ['account_code' => '1010', 'account_name' => 'Cash in Hand',            'account_type' => 'asset',     'status' => 'active', 'is_system' => true],
            ['account_code' => '1020', 'account_name' => 'Bank Account',            'account_type' => 'asset',     'status' => 'active', 'is_system' => true],
            ['account_code' => '1030', 'account_name' => 'Petty Cash',              'account_type' => 'asset',     'status' => 'active', 'is_system' => true],
            ['account_code' => '1100', 'account_name' => 'Accounts Receivable',     'account_type' => 'asset',     'status' => 'active', 'is_system' => true],
            ['account_code' => '1200', 'account_name' => 'Inventory',               'account_type' => 'asset',     'status' => 'active', 'is_system' => true],
            ['account_code' => '1300', 'account_name' => 'Prepaid Expenses',        'account_type' => 'asset',     'status' => 'active', 'is_system' => true],

            // --- Liabilities ---
            ['account_code' => '2000', 'account_name' => 'Accounts Payable',        'account_type' => 'liability', 'status' => 'active', 'is_system' => true],
            ['account_code' => '2100', 'account_name' => 'GST Payable',             'account_type' => 'liability', 'status' => 'active', 'is_system' => true],
            ['account_code' => '2200', 'account_name' => 'TDS Payable',             'account_type' => 'liability', 'status' => 'active', 'is_system' => true],
            ['account_code' => '2300', 'account_name' => 'Loans',                   'account_type' => 'liability', 'status' => 'active', 'is_system' => true],
            ['account_code' => '2400', 'account_name' => 'Credit Card Payable',     'account_type' => 'liability', 'status' => 'active', 'is_system' => true],

            // --- Equity ---
            ['account_code' => '3000', 'account_name' => "Owner's Equity",          'account_type' => 'equity',    'status' => 'active', 'is_system' => true],
            ['account_code' => '3100', 'account_name' => 'Retained Earnings',       'account_type' => 'equity',    'status' => 'active', 'is_system' => true],
            ['account_code' => '3200', 'account_name' => 'Current Year Earnings',   'account_type' => 'equity',    'status' => 'active', 'is_system' => true],

            // --- Income ---
            ['account_code' => '4000', 'account_name' => 'Sales Revenue',           'account_type' => 'income',    'status' => 'active', 'is_system' => true],
            ['account_code' => '4100', 'account_name' => 'Subscription Revenue',    'account_type' => 'income',    'status' => 'active', 'is_system' => true],
            ['account_code' => '4200', 'account_name' => 'Service Revenue',         'account_type' => 'income',    'status' => 'active', 'is_system' => true],
            ['account_code' => '4300', 'account_name' => 'Discount Earned',         'account_type' => 'income',    'status' => 'active', 'is_system' => true],
            ['account_code' => '4900', 'account_name' => 'Other Income',            'account_type' => 'income',    'status' => 'active', 'is_system' => true],

            // --- Expenses ---
            ['account_code' => '5000', 'account_name' => 'Purchase',                'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5100', 'account_name' => 'Salary',                  'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5200', 'account_name' => 'Rent',                    'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5300', 'account_name' => 'Utilities',               'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5400', 'account_name' => 'Marketing',               'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5500', 'account_name' => 'Office Expenses',         'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5550', 'account_name' => 'Software Subscriptions',  'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5600', 'account_name' => 'Delivery',                'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5700', 'account_name' => 'Packaging',               'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5800', 'account_name' => 'Equipment',               'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
            ['account_code' => '5900', 'account_name' => 'Miscellaneous',           'account_type' => 'expense',   'status' => 'active', 'is_system' => true],
        ];

        foreach ($accounts as $acc) {
            $exists = ChartOfAccount::where('account_code', $acc['account_code'])->exists();

            if (! $exists) {
                ChartOfAccount::create(array_merge($acc, [
                    'uuid'          => \Illuminate\Support\Str::uuid()->toString(),
                    'opening_balance' => 0,
                    'current_balance' => 0,
                    'currency'      => 'INR',
                    'created_by'    => $adminId,
                    'updated_by'    => $adminId,
                ]));
            }
        }

        // ── Bank Account ─────────────────────────────────────────────────
        $bankAccountExists = BankAccount::where('account_name', 'SBI Main Account')->exists();

        if (! $bankAccountExists) {
            $bankChart = ChartOfAccount::where('account_code', '1020')->first();

            BankAccount::create([
                'uuid'            => \Illuminate\Support\Str::uuid()->toString(),
                'account_name'    => 'SBI Main Account',
                'bank_name'       => 'State Bank of India',
                'account_number'  => '30123456789',
                'ifsc_code'       => 'SBIN0001234',
                'branch'          => 'MG Road, New Delhi',
                'account_type'    => 'savings',
                'account_id'      => $bankChart?->id,
                'opening_balance' => 500000.00,
                'current_balance' => 500000.00,
                'is_default'      => true,
                'status'          => 'active',
                'created_by'      => $adminId,
                'updated_by'      => $adminId,
            ]);
        }

        Model::unguard(false);
    }
}
