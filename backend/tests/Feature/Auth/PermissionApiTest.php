<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\Auth\Admin;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');

        $this->admin = Admin::factory()->create(['status' => StatusEnum::Active]);
        $role = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'admin']);
        $this->admin->assignRole($role);
    }

    public function test_can_list_permissions(): void
    {
        Permission::firstOrCreate(['name' => 'test_perm', 'guard_name' => 'admin']);

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->getJson('/api/v1/admin/permissions');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_can_list_grouped_permissions(): void
    {
        Permission::firstOrCreate(
            ['name' => 'test_grouped', 'guard_name' => 'admin'],
            ['group' => 'Test Group', 'display_name' => 'Test']
        );

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->getJson('/api/v1/admin/permissions/grouped');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_unauthorized_cannot_list_permissions(): void
    {
        $basicAdmin = Admin::factory()->create(['status' => StatusEnum::Active]);
        $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'admin']);
        $basicAdmin->assignRole($staffRole);

        Sanctum::actingAs($basicAdmin, ['*']);

        $response = $this->getJson('/api/v1/admin/permissions');

        $response->assertStatus(403);
    }
}
