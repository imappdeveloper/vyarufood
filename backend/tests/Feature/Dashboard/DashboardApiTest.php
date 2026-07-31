<?php

declare(strict_types=1);

namespace Tests\Feature\Dashboard;

use Tests\TestCase;
use App\Models\Auth\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    private Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Admin::factory()->create(['status' => 'active']);
    }

    public function test_dashboard_summary_returns_200(): void
    {
        $response = $this->actingAs($this->admin, 'web')
            ->getJson('/api/v1/admin/dashboard/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'revenue',
                    'orders',
                    'customers',
                    'subscriptions',
                    'meals',
                    'expenses',
                ],
            ]);
    }

    public function test_dashboard_revenue_returns_200(): void
    {
        $response = $this->actingAs($this->admin, 'web')
            ->getJson('/api/v1/admin/dashboard/revenue?period=today');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['daily', 'monthly'],
            ]);
    }

    public function test_dashboard_orders_returns_200(): void
    {
        $response = $this->actingAs($this->admin, 'web')
            ->getJson('/api/v1/admin/dashboard/orders');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['status_distribution', 'hourly', 'daily', 'average_value'],
            ]);
    }

    public function test_dashboard_charts_returns_200(): void
    {
        $response = $this->actingAs($this->admin, 'web')
            ->getJson('/api/v1/admin/dashboard/charts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['revenue_trend', 'expense_trend', 'order_status', 'orders_by_hour'],
            ]);
    }

    public function test_dashboard_system_health_returns_200(): void
    {
        $response = $this->actingAs($this->admin, 'web')
            ->getJson('/api/v1/admin/dashboard/system-health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'app_version',
                    'laravel_version',
                    'php_version',
                    'mysql_status',
                    'redis_status',
                    'server_time',
                    'timezone',
                ],
            ]);
    }

    public function test_dashboard_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard/summary');
        $response->assertStatus(401);
    }

    public function test_dashboard_filter_periods(): void
    {
        foreach (['today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', 'last_month'] as $period) {
            $response = $this->actingAs($this->admin, 'web')
                ->getJson("/api/v1/admin/dashboard/summary?period={$period}");
            $response->assertStatus(200);
        }
    }

    public function test_dashboard_custom_date_range(): void
    {
        $response = $this->actingAs($this->admin, 'web')
            ->getJson('/api/v1/admin/dashboard/summary?period=custom&start_date=2026-01-01&end_date=2026-12-31');

        $response->assertStatus(200);
    }
}
