<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admins')->delete();

        $adminId = DB::table('admins')->insertGetId([
            'uuid' => (string) Str::uuid(),
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'superadmin@tiffin.local',
            'password' => Hash::make('Admin@1234'),
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $superAdminRole = DB::table('roles')->where('name', 'super_admin')->where('guard_name', 'admin')->first();
        if ($superAdminRole) {
            DB::table('model_has_roles')->insert([
                'role_id' => $superAdminRole->id,
                'model_type' => 'App\\Models\\Auth\\Admin',
                'model_id' => $adminId,
            ]);
        }

        $this->command?->info('Super Admin created: superadmin@tiffin.local');

        $adminId2 = DB::table('admins')->insertGetId([
            'uuid' => (string) Str::uuid(),
            'first_name' => 'Default',
            'last_name' => 'Admin',
            'email' => 'admin@tiffin.local',
            'password' => Hash::make('Admin@1234'),
            'status' => 'active',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $adminRole = DB::table('roles')->where('name', 'admin')->where('guard_name', 'admin')->first();
        if ($adminRole) {
            DB::table('model_has_roles')->insert([
                'role_id' => $adminRole->id,
                'model_type' => 'App\\Models\\Auth\\Admin',
                'model_id' => $adminId2,
            ]);
        }

        $this->command?->info('Default Admin created: admin@tiffin.local');
    }
}
