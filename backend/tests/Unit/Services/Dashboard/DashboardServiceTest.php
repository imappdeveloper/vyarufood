<?php

declare(strict_types=1);

namespace Tests\Unit\Services\Dashboard;

use Tests\TestCase;
use App\Services\Dashboard\DashboardService;
use App\Repositories\Dashboard\DashboardRepositoryInterface;
use App\DTOs\Dashboard\DashboardFilterDTO;
use Mockery;

class DashboardServiceTest extends TestCase
{
    private DashboardService $service;
    private DashboardRepositoryInterface $repoMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repoMock = Mockery::mock(DashboardRepositoryInterface::class);
        $this->service = new DashboardService($this->repoMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_summary_delegates_to_repository(): void
    {
        $filter = DashboardFilterDTO::fromRequest(['period' => 'today']);
        $expected = ['revenue' => [], 'orders' => [], 'customers' => []];

        $this->repoMock->shouldReceive('getSummary')->once()->with($filter)->andReturn($expected);

        $result = $this->service->getSummary($filter);
        $this->assertEquals($expected, $result);
    }

    public function test_get_revenue_delegates_to_repository(): void
    {
        $filter = DashboardFilterDTO::fromRequest(['period' => 'this_month']);
        $expected = ['daily' => [], 'monthly' => []];

        $this->repoMock->shouldReceive('getRevenue')->once()->with($filter)->andReturn($expected);

        $result = $this->service->getRevenue($filter);
        $this->assertEquals($expected, $result);
    }

    public function test_get_system_health_delegates_to_repository(): void
    {
        $expected = ['php_version' => PHP_VERSION, 'mysql_status' => 'connected'];

        $this->repoMock->shouldReceive('getSystemHealth')->once()->andReturn($expected);

        $result = $this->service->getSystemHealth();
        $this->assertEquals($expected, $result);
    }

    public function test_dashboard_filter_dto_defaults(): void
    {
        $dto = DashboardFilterDTO::fromRequest([]);
        $this->assertEquals('today', $dto->period);
        $this->assertNull($dto->startDate);
        $this->assertNull($dto->endDate);
    }

    public function test_dashboard_filter_dto_date_range(): void
    {
        $dto = DashboardFilterDTO::fromRequest(['period' => 'last_7_days']);
        $range = $dto->getDateRange();

        $this->assertArrayHasKey('start', $range);
        $this->assertArrayHasKey('end', $range);
        $this->assertNotNull($range['start']);
        $this->assertNotNull($range['end']);
    }
}
