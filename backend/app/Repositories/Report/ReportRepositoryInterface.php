<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\DTOs\Report\ReportFilterDTO;

interface ReportRepositoryInterface
{
    public function getSalesReport(ReportFilterDTO $filters): array;
    public function getOrderReport(ReportFilterDTO $filters): array;
    public function getCustomerReport(ReportFilterDTO $filters): array;
    public function getSubscriptionReport(ReportFilterDTO $filters): array;
    public function getKitchenReport(ReportFilterDTO $filters): array;
    public function getInventoryReport(ReportFilterDTO $filters): array;
    public function getPurchaseReport(ReportFilterDTO $filters): array;
    public function getFinanceReport(ReportFilterDTO $filters): array;
    public function getPaymentReport(ReportFilterDTO $filters): array;
    public function getGstReport(ReportFilterDTO $filters): array;
    public function getExpenseReport(ReportFilterDTO $filters): array;
    public function getSupplierReport(ReportFilterDTO $filters): array;
    public function getNotificationReport(ReportFilterDTO $filters): array;
}
