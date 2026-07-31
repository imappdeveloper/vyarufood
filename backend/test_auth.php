<?php

declare(strict_types=1);

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Test 1: Can we resolve an admin?
$admin = App\Models\Auth\Admin::first();
echo "Admin: {$admin->email}\n";

// Test 2: Can we load roles?
echo "Roles: " . $admin->roles->pluck('name')->implode(', ') . "\n";

// Test 3: Can we resolve a token?
$token = Laravel\Sanctum\PersonalAccessToken::where('tokenable_id', $admin->id)->first();
if ($token) {
    echo "Token found: {$token->id}\n";
    
    // Test 4: Can we resolve the tokenable?
    $tokenable = $token->tokenable;
    echo "Tokenable: " . ($tokenable ? $tokenable->email : 'null') . "\n";
} else {
    echo "No token found\n";
}

// Test 5: Can we simulate auth resolution?
$tokenStr = $admin->createToken('test', ['*'])->plainTextToken;
echo "Created token: " . substr($tokenStr, 0, 15) . "...\n";

// Now try resolving it like Sanctum would
$parts = explode('|', $tokenStr);
$rawToken = $parts[1] ?? '';
$hashedToken = hash('sha256', $rawToken);
echo "Hashed token: " . substr($hashedToken, 0, 15) . "...\n";

$resolved = Laravel\Sanctum\PersonalAccessToken::find($hashedToken);
echo "Resolved token: " . ($resolved ? 'found' : 'null') . "\n";

if ($resolved) {
    echo "Resolved user: " . $resolved->tokenable->email . "\n";
}

// Test 6: Simulate what auth middleware does
$request = Illuminate\Http\Request::create('/api/v1/admin/profile', 'GET', [], [], [], [
    'HTTP_AUTHORIZATION' => 'Bearer ' . $tokenStr,
    'HTTP_ACCEPT' => 'application/json',
]);

$guard = auth()->guard('admin');
echo "Guard class: " . get_class($guard) . "\n";

$user = $guard->user();
echo "Guard user: " . ($user ? $user->email : 'null') . "\n";

echo "ALL TESTS PASSED\n";
