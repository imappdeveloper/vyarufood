<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\Auth\Admin;
use App\Repositories\Auth\AdminRepositoryInterface;
use App\Repositories\Auth\LoginHistoryRepositoryInterface;
use App\Support\BaseService;
use App\Support\UploadManager;
use App\Constants\AppConstants;
use App\Exceptions\BusinessException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthService extends BaseService implements AuthServiceInterface
{
    protected string $moduleName = 'auth';

    public function __construct(
        protected AdminRepositoryInterface $adminRepo,
        protected LoginHistoryRepositoryInterface $loginHistoryRepo,
        protected UploadManager $uploadManager,
    ) {}

    public function login(array $credentials, string $ip, ?string $userAgent, bool $remember = false): array
    {
        $email = $credentials['email'] ?? '';

        if ($this->isAccountLocked($email)) {
            throw new BusinessException('Account is temporarily locked. Please try again later.', 423);
        }

        $admin = $this->adminRepo->findByEmail($email);

        if (!$admin || !Hash::check($credentials['password'], $admin->password)) {
            $this->loginHistoryRepo->recordFailedAttempt($email, $ip, $userAgent);
            $this->handleFailedLogin($email);
            throw new BusinessException('Invalid email or password.', 401);
        }

        if (!$admin->isActive()) {
            throw new BusinessException('Your account is not active. Please contact administrator.', 403);
        }

        Auth::guard('admin')->login($admin, $remember);

        $admin->recordLogin($ip, $userAgent, $this->parseDevice($userAgent), $this->parseBrowser($userAgent));

        $this->loginHistoryRepo->recordLogin($admin, $ip, $userAgent, true);
        $this->loginHistoryRepo->clearFailedAttempts($email);

        $this->logInfo('Admin logged in', ['admin_id' => $admin->id, 'ip' => $ip]);

        return [
            'admin' => $admin,
            'abilities' => ['*'],
        ];
    }

    public function logout(Admin $admin): void
    {
        Auth::guard('admin')->logout();
        $this->logInfo('Admin logged out', ['admin_id' => $admin->id]);
    }

    public function logoutAllDevices(Admin $admin): void
    {
        Auth::guard('admin')->logout();
        $this->logInfo('Admin logged out from all devices', ['admin_id' => $admin->id]);
    }

    public function forgotPassword(string $email): void
    {
        $admin = $this->adminRepo->findByEmail($email);
        if (!$admin || !$admin->isActive()) {
            return;
        }

        Password::sendResetLink(
            ['email' => $email],
            function ($admin, $token) {
                $this->logInfo('Password reset link sent', ['admin_id' => $admin->id]);
            }
        );
    }

    public function resetPassword(string $token, string $email, string $password): void
    {
        $status = Password::reset(
            ['email' => $email, 'token' => $token, 'password' => $password, 'password_confirmation' => $password],
            function ($admin, $password) {
                $admin->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new BusinessException('Invalid or expired reset token.', 422);
        }

        $this->logInfo('Password reset successfully', ['email' => $email]);
    }

    public function changePassword(Admin $admin, string $currentPassword, string $newPassword): void
    {
        if (!Hash::check($currentPassword, $admin->password)) {
            throw new BusinessException('Current password is incorrect.', 422);
        }

        $admin->update(['password' => Hash::make($newPassword)]);

        $this->logInfo('Password changed', ['admin_id' => $admin->id]);
    }

    public function getProfile(Admin $admin): Admin
    {
        return $admin;
    }

    public function updateProfile(Admin $admin, array $data): Admin
    {
        $admin->update($data);
        return $admin->fresh();
    }

    public function updateProfilePhoto(Admin $admin, $file): Admin
    {
        if ($admin->profile_photo) {
            $this->uploadManager->deleteFile($admin->profile_photo, 'public');
        }

        $uploaded = $this->uploadManager->uploadImage($file, 'avatars', 400, 400, 90);
        $admin->update(['profile_photo' => $uploaded['url']]);

        return $admin->fresh();
    }

    public function checkPassword(Admin $admin, string $password): bool
    {
        return Hash::check($password, $admin->password);
    }

    public function isAccountLocked(string $email): bool
    {
        $failedAttempts = $this->loginHistoryRepo->getFailedAttempts($email, AppConstants::LOCKOUT_DURATION);
        return $failedAttempts >= AppConstants::MAX_LOGIN_ATTEMPTS;
    }

    protected function handleFailedLogin(string $email): void
    {
        $failedAttempts = $this->loginHistoryRepo->getFailedAttempts($email, AppConstants::LOCKOUT_DURATION);
        if ($failedAttempts >= AppConstants::MAX_LOGIN_ATTEMPTS) {
            $this->lockAccount($email);
        }
    }

    public function lockAccount(string $email): void
    {
        $this->logWarning('Account locked due to failed login attempts', ['email' => $email]);
    }

    protected function parseDevice(?string $userAgent): ?string
    {
        if (!$userAgent) return null;
        if (str_contains($userAgent, 'Windows')) return 'Windows';
        if (str_contains($userAgent, 'Mac')) return 'Mac';
        if (str_contains($userAgent, 'Linux')) return 'Linux';
        if (str_contains($userAgent, 'Android')) return 'Android';
        if (str_contains($userAgent, 'iPhone') || str_contains($userAgent, 'iPad')) return 'iOS';
        return 'Unknown';
    }

    protected function parseBrowser(?string $userAgent): ?string
    {
        if (!$userAgent) return null;
        if (str_contains($userAgent, 'Firefox')) return 'Firefox';
        if (str_contains($userAgent, 'Edg')) return 'Edge';
        if (str_contains($userAgent, 'Chrome')) return 'Chrome';
        if (str_contains($userAgent, 'Safari')) return 'Safari';
        return 'Unknown';
    }
}
