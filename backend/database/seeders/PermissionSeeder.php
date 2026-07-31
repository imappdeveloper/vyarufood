<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Dashboard
            ['name' => 'view_dashboard', 'group' => 'Dashboard', 'display_name' => 'View Dashboard', 'guard_name' => 'admin'],

            // Admin Management
            ['name' => 'view_admin_users', 'group' => 'Admin Management', 'display_name' => 'View Admin Users', 'guard_name' => 'admin'],
            ['name' => 'create_admin_users', 'group' => 'Admin Management', 'display_name' => 'Create Admin Users', 'guard_name' => 'admin'],
            ['name' => 'update_admin_users', 'group' => 'Admin Management', 'display_name' => 'Update Admin Users', 'guard_name' => 'admin'],
            ['name' => 'delete_admin_users', 'group' => 'Admin Management', 'display_name' => 'Delete Admin Users', 'guard_name' => 'admin'],
            ['name' => 'activate_admin_users', 'group' => 'Admin Management', 'display_name' => 'Activate Admin Users', 'guard_name' => 'admin'],
            ['name' => 'deactivate_admin_users', 'group' => 'Admin Management', 'display_name' => 'Deactivate Admin Users', 'guard_name' => 'admin'],
            ['name' => 'reset_admin_password', 'group' => 'Admin Management', 'display_name' => 'Reset Admin Password', 'guard_name' => 'admin'],

            // Role Management
            ['name' => 'view_roles', 'group' => 'Role Management', 'display_name' => 'View Roles', 'guard_name' => 'admin'],
            ['name' => 'create_roles', 'group' => 'Role Management', 'display_name' => 'Create Roles', 'guard_name' => 'admin'],
            ['name' => 'update_roles', 'group' => 'Role Management', 'display_name' => 'Update Roles', 'guard_name' => 'admin'],
            ['name' => 'delete_roles', 'group' => 'Role Management', 'display_name' => 'Delete Roles', 'guard_name' => 'admin'],
            ['name' => 'assign_permissions', 'group' => 'Role Management', 'display_name' => 'Assign Permissions', 'guard_name' => 'admin'],

            // Permission Management
            ['name' => 'view_permissions', 'group' => 'Permission Management', 'display_name' => 'View Permissions', 'guard_name' => 'admin'],

            // Profile
            ['name' => 'view_profile', 'group' => 'Profile', 'display_name' => 'View Profile', 'guard_name' => 'admin'],
            ['name' => 'update_profile', 'group' => 'Profile', 'display_name' => 'Update Profile', 'guard_name' => 'admin'],
            ['name' => 'change_password', 'group' => 'Profile', 'display_name' => 'Change Password', 'guard_name' => 'admin'],

            // Settings
            ['name' => 'view_settings', 'group' => 'Settings', 'display_name' => 'View Settings', 'guard_name' => 'admin'],
            ['name' => 'update_settings', 'group' => 'Settings', 'display_name' => 'Update Settings', 'guard_name' => 'admin'],

            // Login History
            ['name' => 'view_login_history', 'group' => 'Login History', 'display_name' => 'View Login History', 'guard_name' => 'admin'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name'], 'guard_name' => $permission['guard_name']],
                $permission
            );
        }
    }
}
