<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\Customer;

interface CustomerAuthServiceInterface
{
    public function register(array $data, string $ip, ?string $userAgent): array;
    public function login(array $credentials, string $ip, ?string $userAgent, bool $remember = false): array;
    public function logout(Customer $customer): void;
    public function verifyOtp(Customer $customer, string $otp): array;
    public function resendOtp(Customer $customer): string;
    public function sendOtp(string $phone): string;
    public function registerSendOtp(string $phone): string;
    public function verifyOtpLogin(string $phone, string $otp, string $ip, ?string $userAgent): array;
    public function forgotPassword(string $email): void;
    public function resetPassword(string $token, string $email, string $password): void;
    public function getProfile(Customer $customer): Customer;
    public function updateProfile(Customer $customer, array $data): Customer;
    public function uploadProfilePhoto(Customer $customer, $file): Customer;
    public function deleteProfilePhoto(Customer $customer): Customer;
    public function changePassword(Customer $customer, string $currentPassword, string $newPassword): void;
    public function deleteAccount(Customer $customer, string $password, ?string $reason = null): void;
}
