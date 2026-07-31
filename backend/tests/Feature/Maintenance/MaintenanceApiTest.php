<?php
declare(strict_types=1);
namespace Tests\Feature\Maintenance;

use App\Models\Auth\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaintenanceApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Admin::factory()->create([
            'email' => 'superadmin@tiffin.local',
            'password' => 'Admin@1234',
            'status' => 'active',
        ]);
    }

    private function authHeader(): void
    {
        $this->actingAs($this->admin, 'admin');
    }

    public function test_can_enable_maintenance_mode(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/maintenance/enable');
        $response->assertOk()->assertJsonStructure(['success', 'message']);
    }

    public function test_can_disable_maintenance_mode(): void
    {
        $this->authHeader();
        $this->postJson('/api/v1/admin/maintenance/enable');

        $response = $this->postJson('/api/v1/admin/maintenance/disable');
        $response->assertOk()->assertJsonStructure(['success', 'message']);
    }

    public function test_can_get_maintenance_status(): void
    {
        $this->authHeader();
        $response = $this->getJson('/api/v1/admin/maintenance/status');
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->postJson('/api/v1/admin/maintenance/enable');
        $response->assertUnauthorized();
    }
}
