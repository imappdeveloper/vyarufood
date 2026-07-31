<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin - all permissions
        $superAdmin = Role::firstOrCreate(
            ['name' => 'super_admin', 'guard_name' => 'admin'],
            ['display_name' => 'Super Admin', 'description' => 'Full system access', 'is_default' => false, 'sort_order' => 1]
        );
        $superAdmin->syncPermissions(Permission::where('guard_name', 'admin')->get());

        // Admin - most permissions
        $admin = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'admin'],
            ['display_name' => 'Admin', 'description' => 'Administrative access', 'is_default' => false, 'sort_order' => 2]
        );
        $admin->syncPermissions(Permission::where('guard_name', 'admin')
            ->whereNotIn('name', ['delete_admin_users', 'delete_roles'])
            ->get());

        // Manager
        $manager = Role::firstOrCreate(
            ['name' => 'manager', 'guard_name' => 'admin'],
            ['display_name' => 'Manager', 'description' => 'Management access', 'is_default' => false, 'sort_order' => 3]
        );
        $manager->syncPermissions(Permission::where('guard_name', 'admin')
            ->whereIn('name', [
                'view_dashboard', 'view_admin_users', 'view_roles', 'view_permissions',
                'view_profile', 'update_profile', 'change_password', 'view_settings', 'view_login_history',
            ])
            ->get());

        // Staff
        $staff = Role::firstOrCreate(
            ['name' => 'staff', 'guard_name' => 'admin'],
            ['display_name' => 'Staff', 'description' => 'Basic access', 'is_default' => true, 'sort_order' => 4]
        );
        $staff->syncPermissions(Permission::where('guard_name', 'admin')
            ->whereIn('name', ['view_dashboard', 'view_profile', 'update_profile', 'change_password'])
            ->get());
    }
}
