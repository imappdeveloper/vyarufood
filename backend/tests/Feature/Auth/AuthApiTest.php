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

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $admin = Admin::factory()->create([
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'status' => StatusEnum::Active,
            'email_verified_at' => now(),
        ]);

        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'admin']);
        $admin->assignRole($role);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login successful',
            ])
            ->assertJsonStructure([
                'data' => ['token', 'admin', 'abilities', 'token_type'],
            ]);
    }

    public function test_admin_cannot_login_with_invalid_credentials(): void
    {
        Admin::factory()->create([
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid email or password.',
            ]);
    }

    public function test_inactive_admin_cannot_login(): void
    {
        Admin::factory()->create([
            'email' => 'inactive@test.com',
            'password' => Hash::make('password'),
            'status' => StatusEnum::Inactive,
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'inactive@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_logout(): void
    {
        $admin = Admin::factory()->create();
        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'admin']);
        $admin->assignRole($role);

        Sanctum::actingAs($admin, ['*']);

        $response = $this->postJson('/api/v1/admin/logout');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_admin_can_get_profile(): void
    {
        $admin = Admin::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'Admin',
        ]);

        Sanctum::actingAs($admin, ['*']);

        $response = $this->getJson('/api/v1/admin/profile');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'first_name' => 'Test',
                    'last_name' => 'Admin',
                ],
            ]);
    }

    public function test_admin_can_update_profile(): void
    {
        $admin = Admin::factory()->create();

        Sanctum::actingAs($admin, ['*']);

        $response = $this->putJson('/api/v1/admin/profile', [
            'first_name' => 'Updated',
            'last_name' => 'Name',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'first_name' => 'Updated',
                    'last_name' => 'Name',
                ],
            ]);
    }

    public function test_admin_can_change_password(): void
    {
        $admin = Admin::factory()->create([
            'password' => Hash::make('OldPass123!'),
        ]);

        Sanctum::actingAs($admin, ['*']);

        $response = $this->postJson('/api/v1/admin/change-password', [
            'current_password' => 'OldPass123!',
            'password' => 'NewPass123!',
            'password_confirmation' => 'NewPass123!',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_unauthenticated_cannot_access_profile(): void
    {
        $response = $this->getJson('/api/v1/admin/profile');
        $response->assertStatus(401);
    }

    public function test_login_validation(): void
    {
        $response = $this->postJson('/api/v1/admin/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
