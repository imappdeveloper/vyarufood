<?php

declare(strict_types=1);

namespace App\Services\Dashboard;

use App\DTOs\Dashboard\DashboardFilterDTO;
use App\Repositories\Dashboard\DashboardRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;

class DashboardService extends BaseService implements DashboardServiceInterface
{
    protected string $moduleName = 'dashboard';

    public function __construct(
        protected DashboardRepositoryInterface $repo,
    ) {}

    private function cache(string $key, callable $callback, int $ttl = null): mixed
    {
        $ttl = $ttl ?? AppConstants::CACHE_TTL_SHORT;
        return CacheManager::remember(
            CacheManager::cacheKey('dashboard', $key),
            $ttl,
            $callback
        );
    }

    public function getSummary(DashboardFilterDTO $filter): array
    {
        $cacheKey = "summary:{$filter->period}";
        return $this->cache($cacheKey, fn() => $this->repo->getSummary($filter));
    }

    public function getRevenue(DashboardFilterDTO $filter): array
    {
        $cacheKey = "revenue:{$filter->period}";
        return $this->cache($cacheKey, fn() => $this->repo->getRevenue($filter));
    }

    public function getOrders(DashboardFilterDTO $filter): array
    {
        $cacheKey = "orders:{$filter->period}";
        return $this->cache($cacheKey, fn() => $this->repo->getOrders($filter));
    }

    public function getCustomers(DashboardFilterDTO $filter): array
    {
        $cacheKey = "customers:{$filter->period}";
        return $this->cache($cacheKey, fn() => $this->repo->getCustomers($filter));
    }

    public function getSubscriptions(DashboardFilterDTO $filter): array
    {
        $cacheKey = "subscriptions:{$filter->period}";
        return $this->cache($cacheKey, fn() => $this->repo->getSubscriptions($filter));
    }

    public function getInventory(DashboardFilterDTO $filter): array
    {
        $cacheKey = "inventory:{$filter->period}";
        return $this->cache($cacheKey, fn() => $this->repo->getInventory($filter));
    }

    public function getCharts(DashboardFilterDTO $filter): array
    {
        $cacheKey = "charts:{$filter->period}";
        return $this->cache($cacheKey, fn() => $this->repo->getCharts($filter), AppConstants::CACHE_TTL_SHORT * 2);
    }

    public function getRecentOrders(int $limit): array
    {
        return $this->cache("recent:orders:{$limit}", fn() => $this->repo->getRecentOrders($limit));
    }

    public function getRecentCustomers(int $limit): array
    {
        return $this->cache("recent:customers:{$limit}", fn() => $this->repo->getRecentCustomers($limit));
    }

    public function getRecentSubscriptions(int $limit): array
    {
        return $this->cache("recent:subscriptions:{$limit}", fn() => $this->repo->getRecentSubscriptions($limit));
    }

    public function getRecentPayments(int $limit): array
    {
        return $this->cache("recent:payments:{$limit}", fn() => $this->repo->getRecentPayments($limit));
    }

    public function getRecentExpenses(int $limit): array
    {
        return $this->cache("recent:expenses:{$limit}", fn() => $this->repo->getRecentExpenses($limit));
    }

    public function getRecentActivity(int $limit): array
    {
        return $this->cache("recent:activity:{$limit}", fn() => $this->repo->getRecentActivity($limit));
    }

    public function getSystemHealth(): array
    {
        return $this->cache('system:health', fn() => $this->repo->getSystemHealth(), 30);
    }

    public function flushCache(): void
    {
        CacheManager::flush('dashboard');
        $this->logInfo('Dashboard cache flushed');
    }
}
