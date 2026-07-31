<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\DTOs\Report\ReportFilterDTO;
use App\Repositories\Report\ReportRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Support\Facades\Cache;

class ReportService extends BaseService implements ReportServiceInterface
{
    protected string $moduleName = 'ReportService';

    private const CACHE_TTL = 300;

    public function __construct(
        protected ReportRepositoryInterface $repo,
    ) {}

    public function generateReport(string $reportType, ReportFilterDTO $filters): array
    {
        $hash = md5($reportType . serialize($filters->toArray()));

        return Cache::remember("report:{$reportType}:{$hash}", self::CACHE_TTL, function () use ($reportType, $filters) {
            return match ($reportType) {
                'executive' => $this->generateExecutiveReport($filters),
                'sales' => $this->repo->getSalesReport($filters),
                'orders' => $this->repo->getOrderReport($filters),
                'customers' => $this->repo->getCustomerReport($filters),
                'subscriptions' => $this->repo->getSubscriptionReport($filters),
                'kitchen' => $this->repo->getKitchenReport($filters),
                'inventory' => $this->repo->getInventoryReport($filters),
                'purchases' => $this->repo->getPurchaseReport($filters),
                'finance' => $this->repo->getFinanceReport($filters),
                'payments' => $this->repo->getPaymentReport($filters),
                'gst' => $this->repo->getGstReport($filters),
                'expenses' => $this->repo->getExpenseReport($filters),
                'suppliers' => $this->repo->getSupplierReport($filters),
                'notifications' => $this->repo->getNotificationReport($filters),
                default => [],
            };
        });
    }

    private function generateExecutiveReport(ReportFilterDTO $filters): array
    {
        return [
            'sales' => $this->repo->getSalesReport($filters),
            'orders' => $this->repo->getOrderReport($filters),
            'finance' => $this->repo->getFinanceReport($filters),
            'expenses' => $this->repo->getExpenseReport($filters),
        ];
    }
}
