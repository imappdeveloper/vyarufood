<?php
define('LARAVEL_START', microtime(true));
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

// Check if admins already exist
$exists = DB::table('admins')->where('email', 'superadmin@tiffin.local')->exists();
if ($exists) {
    echo "Super admin already exists\n";
} else {
    $uuid = Str::uuid()->toString();
    DB::table('admins')->insert([
        'uuid' => $uuid,
        'first_name' => 'Super',
        'last_name' => 'Admin',
        'email' => 'superadmin@tiffin.local',
        'password' => bcrypt('Admin@1234'),
        'status' => 'active',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $adminId = DB::getPdo()->lastInsertId();
    echo "Super Admin created (id: $adminId)\n";

    // Assign super_admin role
    $role = DB::table('roles')->where('name', 'super_admin')->where('guard_name', 'admin')->first();
    if ($role) {
        DB::table('model_has_roles')->insert([
            'role_id' => $role->id,
            'model_type' => 'App\\Models\\Auth\\Admin',
            'model_id' => $adminId,
        ]);
        echo "Assigned super_admin role\n";
    }
}

$exists2 = DB::table('admins')->where('email', 'admin@tiffin.local')->exists();
if ($exists2) {
    echo "Default admin already exists\n";
} else {
    $uuid2 = Str::uuid()->toString();
    DB::table('admins')->insert([
        'uuid' => $uuid2,
        'first_name' => 'Default',
        'last_name' => 'Admin',
        'email' => 'admin@tiffin.local',
        'password' => bcrypt('Admin@1234'),
        'status' => 'active',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $adminId2 = DB::getPdo()->lastInsertId();
    echo "Default Admin created (id: $adminId2)\n";

    $role2 = DB::table('roles')->where('name', 'admin')->where('guard_name', 'admin')->first();
    if ($role2) {
        DB::table('model_has_roles')->insert([
            'role_id' => $role2->id,
            'model_type' => 'App\\Models\\Auth\\Admin',
            'model_id' => $adminId2,
        ]);
        echo "Assigned admin role\n";
    }
}

echo "All done!\n";
