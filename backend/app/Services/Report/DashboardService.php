<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\DTOs\Report\DashboardFilterDTO;
use App\Repositories\Report\DashboardRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Support\Facades\Cache;

class DashboardService extends BaseService implements DashboardServiceInterface
{
    protected string $moduleName = 'ReportDashboard';

    private const CACHE_TTL = 300;

    public function __construct(
        protected DashboardRepositoryInterface $repo,
    ) {}

    public function getExecutiveDashboard(DashboardFilterDTO $filters): array
    {
        $hash = md5(serialize($filters->toArray()));

        return Cache::remember("dashboard:executive:{$hash}", self::CACHE_TTL, fn () => $this->repo->getExecutiveKPIs($filters));
    }

    public function getSalesChart(DashboardFilterDTO $filters): array
    {
        $hash = md5(serialize($filters->toArray()));

        return Cache::remember("dashboard:sales:{$hash}", self::CACHE_TTL, fn () => $this->repo->getSalesChart($filters));
    }

    public function getOrderChart(DashboardFilterDTO $filters): array
    {
        $hash = md5(serialize($filters->toArray()));

        return Cache::remember("dashboard:orders:{$hash}", self::CACHE_TTL, fn () => $this->repo->getOrderChart($filters));
    }

    public function getRevenueChart(DashboardFilterDTO $filters): array
    {
        $hash = md5(serialize($filters->toArray()));

        return Cache::remember("dashboard:revenue:{$hash}", self::CACHE_TTL, fn () => $this->repo->getRevenueChart($filters));
    }

    public function getExpenseChart(DashboardFilterDTO $filters): array
    {
        $hash = md5(serialize($filters->toArray()));

        return Cache::remember("dashboard:expense:{$hash}", self::CACHE_TTL, fn () => $this->repo->getExpenseChart($filters));
    }
}
