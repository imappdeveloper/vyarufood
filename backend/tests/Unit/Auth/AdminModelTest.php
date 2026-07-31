<?php

declare(strict_types=1);

namespace Tests\Unit\Auth;

use App\Models\Auth\Admin;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class AdminModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_has_uuid(): void
    {
        $admin = Admin::factory()->create();
        $this->assertNotEmpty($admin->uuid);
    }

    public function test_admin_full_name_accessor(): void
    {
        $admin = Admin::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $this->assertEquals('John Doe', $admin->full_name);
    }

    public function test_admin_is_active(): void
    {
        $admin = Admin::factory()->create(['status' => StatusEnum::Active]);
        $this->assertTrue($admin->isActive());
    }

    public function test_admin_is_not_active(): void
    {
        $admin = Admin::factory()->inactive()->create();
        $this->assertFalse($admin->isActive());
    }

    public function test_admin_password_is_hashed(): void
    {
        $admin = Admin::factory()->create(['password' => Hash::make('test-password')]);
        $this->assertNotEquals('test-password', $admin->getOriginal('password'));
    }

    public function test_admin_can_assign_role(): void
    {
        $admin = Admin::factory()->create();
        $role = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'admin']);
        $admin->assignRole($role);

        $this->assertTrue($admin->hasRole('staff', 'admin'));
    }

    public function test_admin_has_relationships(): void
    {
        $admin = Admin::factory()->create();
        $this->assertNotNull($admin->loginHistories());
        $this->assertNotNull($admin->sessions());
    }

    public function test_admin_route_binding_by_uuid(): void
    {
        $admin = Admin::factory()->create();
        $found = Admin::where('uuid', $admin->uuid)->first();
        $this->assertNotNull($found);
        $this->assertEquals($admin->id, $found->id);
    }
}
