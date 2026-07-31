<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\Auth\Admin;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class AdminUserApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');

        $this->superAdmin = Admin::factory()->create(['status' => StatusEnum::Active]);
        $role = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'admin']);
        $this->superAdmin->assignRole($role);
    }

    public function test_can_list_admin_users(): void
    {
        Admin::factory()->count(3)->create();

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->getJson('/api/v1/admin/admin-users');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_can_create_admin_user(): void
    {
        $role = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'admin']);

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->postJson('/api/v1/admin/admin-users', [
            'first_name' => 'New',
            'last_name' => 'Admin',
            'email' => 'newadmin@test.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role_id' => $role->id,
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('admins', ['email' => 'newadmin@test.com']);
    }

    public function test_can_update_admin_user(): void
    {
        $admin = Admin::factory()->create();

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->putJson("/api/v1/admin/admin-users/{$admin->uuid}", [
            'first_name' => 'Updated',
        ]);

        $response->assertStatus(200);
    }

    public function test_can_delete_admin_user(): void
    {
        $admin = Admin::factory()->create();

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->deleteJson("/api/v1/admin/admin-users/{$admin->uuid}");

        $response->assertStatus(200);
        $this->assertSoftDeletes('admins', ['id' => $admin->id]);
    }

    public function test_can_activate_admin_user(): void
    {
        $admin = Admin::factory()->inactive()->create();

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->postJson("/api/v1/admin/admin-users/{$admin->uuid}/activate");

        $response->assertStatus(200);
        $this->assertDatabaseHas('admins', ['id' => $admin->id, 'status' => 'active']);
    }

    public function test_can_deactivate_admin_user(): void
    {
        $admin = Admin::factory()->create();

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->postJson("/api/v1/admin/admin-users/{$admin->uuid}/deactivate");

        $response->assertStatus(200);
    }

    public function test_can_reset_admin_password(): void
    {
        $admin = Admin::factory()->create();

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->postJson("/api/v1/admin/admin-users/{$admin->uuid}/reset-password");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['password']]);
    }

    public function test_create_admin_validation(): void
    {
        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->postJson('/api/v1/admin/admin-users', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'password', 'role_id']);
    }

    public function test_cannot_create_duplicate_email(): void
    {
        Admin::factory()->create(['email' => 'dupe@test.com']);
        $role = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'admin']);

        Sanctum::actingAs($this->superAdmin, ['*']);

        $response = $this->postJson('/api/v1/admin/admin-users', [
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'email' => 'dupe@test.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role_id' => $role->id,
        ]);

        $response->assertStatus(422);
    }
}
