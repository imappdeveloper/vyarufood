<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\Auth\Admin;
use Illuminate\Http\JsonResponse;

interface AuthServiceInterface
{
    public function login(array $credentials, string $ip, ?string $userAgent, bool $remember = false): array;
    public function logout(Admin $admin): void;
    public function logoutAllDevices(Admin $admin): void;
    public function forgotPassword(string $email): void;
    public function resetPassword(string $token, string $email, string $password): void;
    public function changePassword(Admin $admin, string $currentPassword, string $newPassword): void;
    public function getProfile(Admin $admin): Admin;
    public function updateProfile(Admin $admin, array $data): Admin;
    public function updateProfilePhoto(Admin $admin, $file): Admin;
    public function checkPassword(Admin $admin, string $password): bool;
    public function isAccountLocked(string $email): bool;
    public function lockAccount(string $email): void;
}
