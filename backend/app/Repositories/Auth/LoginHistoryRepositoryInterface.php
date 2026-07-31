<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use App\Models\Auth\Admin;
use App\Models\Auth\LoginHistory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LoginHistoryRepositoryInterface
{
    public function recordLogin(Admin $admin, string $ip, ?string $userAgent, bool $successful, ?string $failureReason = null): LoginHistory;
    public function recordLogout(LoginHistory $loginHistory): void;
    public function getAdminLoginHistory(Admin $admin, int $perPage = 15): LengthAwarePaginator;
    public function getAllLoginHistory(int $perPage = 15, ?string $search = null): LengthAwarePaginator;
    public function getRecentLogins(Admin $admin, int $limit = 10): \Illuminate\Database\Eloquent\Collection;
    public function getFailedAttempts(string $email, int $minutes = 15): int;
    public function recordFailedAttempt(string $email, string $ip, ?string $userAgent): void;
    public function clearFailedAttempts(string $email): void;
}
