<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use App\Models\Auth\Admin;
use App\Models\Auth\LoginHistory;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class EloquentLoginHistoryRepository extends BaseRepository implements LoginHistoryRepositoryInterface
{
    protected function model(): LoginHistory
    {
        return new LoginHistory;
    }

    public function recordLogin(Admin $admin, string $ip, ?string $userAgent, bool $successful, ?string $failureReason = null): LoginHistory
    {
        $parsed = $userAgent ? parse_user_agent($userAgent) : [];

        return $this->model->create([
            'admin_id' => $admin->id,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'device' => $parsed['platform'] ?? null,
            'browser' => $parsed['browser'] ?? null,
            'os' => $parsed['platform'] ?? null,
            'is_successful' => $successful,
            'failure_reason' => $failureReason,
            'login_at' => $successful ? now() : null,
        ]);
    }

    public function recordLogout(LoginHistory $loginHistory): void
    {
        $loginHistory->update(['logout_at' => now()]);
    }

    public function getAdminLoginHistory(Admin $admin, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('admin_id', $admin->id)
            ->orderBy('created_at', 'desc')
            ->paginate(min($perPage, 100));
    }

    public function getAllLoginHistory(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = $this->model->with('admin');

        if ($search) {
            $query->whereHas('admin', fn ($q) => $q->search($search));
        }

        return $query->orderBy('created_at', 'desc')->paginate(min($perPage, 100));
    }

    public function getRecentLogins(Admin $admin, int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->where('admin_id', $admin->id)
            ->where('is_successful', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getFailedAttempts(string $email, int $minutes = 15): int
    {
        return $this->model->where('email', $email)
            ->where('is_successful', false)
            ->where('created_at', '>=', now()->subMinutes($minutes))
            ->count();
    }

    public function recordFailedAttempt(string $email, string $ip, ?string $userAgent): void
    {
        $this->model->create([
            'email' => $email,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'is_successful' => false,
            'login_at' => null,
        ]);
    }

    public function clearFailedAttempts(string $email): void
    {
        $this->model->where('email', $email)->where('is_successful', false)->delete();
    }
}
