<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Report\SavedReport;
use App\Models\Report\ScheduledReport;
use App\Models\Report\ReportExport;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = 1;

        $savedReports = [
            [
                'report_code' => 'RPT-SALES-001',
                'report_name' => 'Daily Sales Summary',
                'report_type' => 'sales',
                'filters' => ['group_by' => 'day', 'date_from' => null, 'date_to' => null],
                'is_public' => true,
                'created_by' => $adminId,
            ],
            [
                'report_code' => 'RPT-FIN-002',
                'report_name' => 'Monthly Finance Report',
                'report_type' => 'finance',
                'filters' => ['group_by' => 'month'],
                'is_public' => true,
                'created_by' => $adminId,
            ],
            [
                'report_code' => 'RPT-ORD-003',
                'report_name' => 'Weekly Order Analysis',
                'report_type' => 'order',
                'filters' => ['group_by' => 'week'],
                'is_public' => false,
                'created_by' => $adminId,
            ],
            [
                'report_code' => 'RPT-INV-004',
                'report_name' => 'Inventory Stock Report',
                'report_type' => 'inventory',
                'filters' => ['search' => null],
                'is_public' => true,
                'created_by' => $adminId,
            ],
            [
                'report_code' => 'RPT-CUST-005',
                'report_name' => 'Customer Retention Report',
                'report_type' => 'customer',
                'filters' => ['group_by' => 'month'],
                'is_public' => false,
                'created_by' => $adminId,
            ],
        ];

        foreach ($savedReports as $report) {
            $existing = SavedReport::where('report_code', $report['report_code'])->first();
            if (! $existing) {
                SavedReport::create($report);
            }
        }

        $scheduledReports = [
            [
                'report_name' => 'Daily Sales Report',
                'report_type' => 'sales',
                'frequency' => 'daily',
                'export_format' => 'pdf',
                'email_recipients' => ['admin@vyarufood.com', 'manager@vyarufood.com'],
                'next_run' => now()->addDay(),
                'status' => 'active',
                'created_by' => $adminId,
            ],
            [
                'report_name' => 'Weekly Finance Summary',
                'report_type' => 'finance',
                'frequency' => 'weekly',
                'export_format' => 'excel',
                'email_recipients' => ['finance@vyarufood.com'],
                'next_run' => now()->addWeek(),
                'status' => 'active',
                'created_by' => $adminId,
            ],
        ];

        foreach ($scheduledReports as $report) {
            $existing = ScheduledReport::where('report_name', $report['report_name'])->first();
            if (! $existing) {
                ScheduledReport::create($report);
            }
        }

        $exportReports = [
            [
                'report_name' => 'Sales_Report_2025_01',
                'export_format' => 'pdf',
                'file_path' => 'reports/sales/Sales_Report_2025_01.pdf',
                'generated_by' => $adminId,
                'generated_at' => now()->subDays(5),
            ],
            [
                'report_name' => 'Finance_Report_2025_Q1',
                'export_format' => 'excel',
                'file_path' => 'reports/finance/Finance_Report_2025_Q1.xlsx',
                'generated_by' => $adminId,
                'generated_at' => now()->subDays(2),
            ],
        ];

        foreach ($exportReports as $export) {
            $existing = ReportExport::where('report_name', $export['report_name'])->first();
            if (! $existing) {
                ReportExport::create($export);
            }
        }
    }
}
