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

class RoleApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');

        $this->admin = Admin::factory()->create([
            'status' => StatusEnum::Active,
            'email_verified_at' => now(),
        ]);

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'admin']);
        $this->admin->assignRole($superAdmin);
    }

    public function test_can_list_roles(): void
    {
        Role::firstOrCreate(['name' => 'test_role', 'guard_name' => 'admin'], ['display_name' => 'Test']);

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->getJson('/api/v1/admin/roles');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_can_create_role(): void
    {
        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->postJson('/api/v1/admin/roles', [
            'name' => 'new_role',
            'display_name' => 'New Role',
            'description' => 'A new test role',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Role created',
            ]);

        $this->assertDatabaseHas('roles', ['name' => 'new_role']);
    }

    public function test_can_update_role(): void
    {
        $role = Role::firstOrCreate(['name' => 'update_me', 'guard_name' => 'admin']);

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->putJson("/api/v1/admin/roles/{$role->id}", [
            'display_name' => 'Updated Role',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_can_delete_role(): void
    {
        $role = Role::firstOrCreate(['name' => 'delete_me', 'guard_name' => 'admin']);

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->deleteJson("/api/v1/admin/roles/{$role->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('roles', ['name' => 'delete_me']);
    }

    public function test_cannot_create_duplicate_role(): void
    {
        Role::firstOrCreate(['name' => 'duplicate', 'guard_name' => 'admin']);

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->postJson('/api/v1/admin/roles', ['name' => 'duplicate']);

        $response->assertStatus(422);
    }

    public function test_can_assign_permissions_to_role(): void
    {
        $role = Role::firstOrCreate(['name' => 'perm_role', 'guard_name' => 'admin']);
        $perm = Permission::firstOrCreate(['name' => 'test_perm', 'guard_name' => 'admin']);

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->postJson("/api/v1/admin/roles/{$role->id}/permissions", [
            'permission_ids' => [$perm->id],
        ]);

        $response->assertStatus(200);
    }

    public function test_role_validation(): void
    {
        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->postJson('/api/v1/admin/roles', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }
}
