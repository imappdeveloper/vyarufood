<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\Customer;
use App\Support\BaseService;
use App\Exceptions\BusinessException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomerAuthService extends BaseService implements CustomerAuthServiceInterface
{
    protected string $moduleName = 'customer_auth';

    public function __construct(
        protected FirebasePhoneVerifier $firebasePhoneVerifier,
    ) {}

    public function register(array $data, string $ip, ?string $userAgent): array
    {
        $existingCustomer = Customer::where('email', $data['email'])->orWhere('phone', $data['phone'])->first();

        if ($existingCustomer) {
            if ($existingCustomer->email === $data['email']) {
                throw new BusinessException('An account with this email already exists.', 422);
            }
            throw new BusinessException('An account with this phone number already exists.', 422);
        }

        $customer = Customer::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'] ?? '',
            'email' => $data['email'],
            'phone' => $data['phone'],
            'country_code' => $data['country_code'] ?? '+91',
            'password' => $data['password'],
            'referral_code' => strtoupper(Str::random(8)),
            'referred_by' => ! empty($data['referral_code']) ? Customer::where('referral_code', $data['referral_code'])->value('id') : null,
        ]);

        $otp = $customer->generateOtp();

        Auth::guard('customer')->login($customer);

        $customer->recordLogin($ip, null, $userAgent);

        $this->logInfo('Customer registered', ['customer_id' => $customer->id, 'otp' => $otp]);

        return [
            'customer' => $customer,
            'otp' => $otp,
            'message' => 'OTP sent to your phone number.',
        ];
    }

    public function login(array $credentials, string $ip, ?string $userAgent, bool $remember = false): array
    {
        $email = $credentials['email'] ?? '';

        $customer = Customer::where('email', $email)->orWhere('phone', $email)->orWhere('phone', $credentials['phone'] ?? '')->first();

        if (! $customer || ! Hash::check($credentials['password'], $customer->password)) {
            throw new BusinessException('Invalid credentials.', 401);
        }

        if ($customer->isBlocked()) {
            throw new BusinessException('Your account has been blocked. Please contact support.', 403);
        }

        if (! $customer->isActive()) {
            throw new BusinessException('Your account is not active. Please contact support.', 403);
        }

        Auth::guard('customer')->login($customer, $remember);

        $customer->recordLogin($ip, null, $userAgent);

        $this->logInfo('Customer logged in', ['customer_id' => $customer->id, 'ip' => $ip]);

        return [
            'customer' => $customer,
        ];
    }

    public function logout(Customer $customer): void
    {
        Auth::guard('customer')->logout();
        $this->logInfo('Customer logged out', ['customer_id' => $customer->id]);
    }

    public function verifyOtp(Customer $customer, string $otp): array
    {
        if (! $customer->verifyOtp($otp)) {
            throw new BusinessException('Invalid or expired OTP.', 422);
        }

        $this->logInfo('Customer OTP verified', ['customer_id' => $customer->id]);

        return [
            'customer' => $customer->fresh(),
            'message' => 'OTP verified successfully.',
        ];
    }

    public function resendOtp(Customer $customer): string
    {
        if ($customer->hasVerifiedPhone()) {
            throw new BusinessException('Phone number is already verified.', 422);
        }

        $otp = $customer->generateOtp();

        $this->logInfo('OTP resent to customer', ['customer_id' => $customer->id, 'otp' => $otp]);

        return $otp;
    }

    public function sendOtp(string $phone): string
    {
        $customer = Customer::where('phone', $phone)->first();

        if (! $customer) {
            throw new BusinessException('No account found with this phone number. Please register first.', 404);
        }

        $otp = $customer->generateOtp();

        $this->logInfo('OTP sent to customer', ['customer_id' => $customer->id, 'otp' => $otp]);

        return $otp;
    }

    public function registerSendOtp(string $phone): string
    {
        $customer = Customer::where('phone', $phone)->first();

        if (! $customer) {
            // Reuse a soft-deleted account so the unique phone/email keys don't collide.
            $customer = Customer::withTrashed()->where('phone', $phone)->first();

            if ($customer) {
                $customer->restore();
            }
        }

        if (! $customer) {
            $customer = Customer::create([
                'phone' => $phone,
                'country_code' => '+91',
                'first_name' => '',
                'last_name' => '',
                'email' => $phone . '@placeholder.local',
                'password' => \Illuminate\Support\Str::random(32),
            ]);
        }

        $otp = $customer->generateOtp();

        $this->logInfo('OTP sent for registration', ['customer_id' => $customer->id, 'otp' => $otp]);

        return $otp;
    }

    public function verifyOtpLogin(string $phone, string $otp, string $ip, ?string $userAgent, ?string $firebaseToken = null): array
    {
        $customer = Customer::where('phone', $phone)->first();

        if (! $customer) {
            throw new BusinessException('No account found with this phone number. Please register first.', 404);
        }

        if ($customer->isBlocked()) {
            throw new BusinessException('Your account has been blocked. Please contact support.', 403);
        }

        if (! $customer->isActive()) {
            throw new BusinessException('Your account is not active. Please contact support.', 403);
        }

        $firebaseVerified = false;
        if ($firebaseToken) {
            $firebaseVerified = $this->firebasePhoneVerifier->verify($firebaseToken, $phone);
        }

        if (! $firebaseVerified && ! $customer->verifyOtp($otp)) {
            throw new BusinessException('Invalid or expired OTP.', 422);
        }

        if ($firebaseVerified) {
            $customer->update([
                'phone_verified' => true,
                'otp_code' => null,
                'otp_expires_at' => null,
            ]);
        }

        Auth::guard('customer')->login($customer);

        $customer->recordLogin($ip, null, $userAgent);

        $this->logInfo('Customer logged in via OTP', ['customer_id' => $customer->id, 'ip' => $ip]);

        return [
            'customer' => $customer,
        ];
    }

    public function googleLogin(string $idToken, string $ip, ?string $userAgent): array
    {
        $firebaseUser = $this->firebasePhoneVerifier->lookup($idToken);

        if (! $firebaseUser || empty($firebaseUser['email'])) {
            throw new BusinessException('Unable to verify your Google sign-in. Please try again.', 422);
        }

        $email = strtolower((string) $firebaseUser['email']);

        $customer = Customer::where('email', $email)->first();

        if (! $customer) {
            $customer = Customer::withTrashed()->where('email', $email)->first();

            if ($customer) {
                $customer->restore();
            }
        }

        $isNew = false;

        if (! $customer) {
            $isNew = true;

            $displayName = $firebaseUser['displayName'] ?? '';
            $nameParts = $displayName ? array_values(array_filter(explode(' ', $displayName))) : [];

            $customer = Customer::create([
                'first_name' => $nameParts[0] ?? '',
                'last_name' => $nameParts[1] ?? '',
                'email' => $email,
                'phone' => $firebaseUser['phoneNumber'] ?? '',
                'country_code' => '+91',
                'password' => \Illuminate\Support\Str::random(32),
                'email_verified' => true,
                'profile_photo' => $firebaseUser['photoUrl'] ?? null,
                'referral_code' => strtoupper(Str::random(8)),
            ])->refresh();
        }

        if ($customer->isBlocked()) {
            throw new BusinessException('Your account has been blocked. Please contact support.', 403);
        }

        if (! $customer->isActive()) {
            throw new BusinessException('Your account is not active. Please contact support.', 403);
        }

        Auth::guard('customer')->login($customer);

        $customer->recordLogin($ip, null, $userAgent);

        $this->logInfo('Customer logged in via Google', ['customer_id' => $customer->id, 'is_new' => $isNew]);

        return [
            'customer' => $customer,
            'is_new' => $isNew,
        ];
    }

    public function forgotPassword(string $email): void
    {
        $customer = Customer::where('email', $email)->first();

        if (! $customer || ! $customer->isActive()) {
            return;
        }

        Password::sendResetLink(
            ['email' => $email],
            function ($customer, $token) {
                $this->logInfo('Password reset link sent', ['customer_id' => $customer->id]);
            }
        );
    }

    public function resetPassword(string $token, string $email, string $password): void
    {
        $status = Password::reset(
            ['email' => $email, 'token' => $token, 'password' => $password, 'password_confirmation' => $password],
            function ($customer, $password) {
                $customer->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new BusinessException('Invalid or expired reset token.', 422);
        }

        $this->logInfo('Customer password reset successfully', ['email' => $email]);
    }

    public function getProfile(Customer $customer): Customer
    {
        return $customer->fresh(['country', 'state', 'city', 'area']);
    }

    public function changePassword(Customer $customer, string $currentPassword, string $newPassword): void
    {
        if (! Hash::check($currentPassword, $customer->password)) {
            throw new BusinessException('Current password is incorrect.', 422);
        }

        $customer->update(['password' => Hash::make($newPassword)]);
        $this->logInfo('Customer password changed', ['customer_id' => $customer->id]);
    }

    public function updateProfile(Customer $customer, array $data): Customer
    {
        $customer->update($data);
        $this->logInfo('Customer profile updated', ['customer_id' => $customer->id, 'fields' => array_keys($data)]);

        return $customer->fresh();
    }

    public function uploadProfilePhoto(Customer $customer, $file): Customer
    {
        if ($customer->profile_photo) {
            \Storage::disk('public')->delete($customer->profile_photo);
        }

        $path = $file->store('customer-profile-photos', 'public');
        $customer->update(['profile_photo' => $path]);
        $this->logInfo('Customer profile photo uploaded', ['customer_id' => $customer->id, 'path' => $path]);

        return $customer->fresh();
    }

    public function deleteProfilePhoto(Customer $customer): Customer
    {
        if ($customer->profile_photo) {
            \Storage::disk('public')->delete($customer->profile_photo);
            $customer->update(['profile_photo' => null]);
            $this->logInfo('Customer profile photo deleted', ['customer_id' => $customer->id]);
        }

        return $customer->fresh();
    }

    public function deleteAccount(Customer $customer, string $password, ?string $reason = null): void
    {
        if (! Hash::check($password, $customer->password)) {
            throw new BusinessException('Incorrect password. Account deletion requires password confirmation.', 422);
        }

        if ($customer->profile_photo) {
            \Storage::disk('public')->delete($customer->profile_photo);
        }

        Auth::guard('customer')->logout();

        $customer->delete();
        $this->logInfo('Customer account deleted', ['customer_id' => $customer->id, 'reason' => $reason]);
    }
}
