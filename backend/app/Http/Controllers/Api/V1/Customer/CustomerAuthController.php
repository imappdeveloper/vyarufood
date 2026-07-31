<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CustomerAuth\CustomerLoginRequest;
use App\Http\Requests\CustomerAuth\CustomerRegisterRequest;
use App\Http\Requests\CustomerAuth\CustomerSendOtpRequest;
use App\Http\Requests\CustomerAuth\CustomerGuestVerifyOtpRequest;
use App\Http\Requests\CustomerAuth\CustomerForgotPasswordRequest;
use App\Http\Requests\CustomerAuth\CustomerResetPasswordRequest;
use App\Http\Requests\CustomerAuth\CustomerVerifyOtpRequest;
use App\Http\Requests\CustomerAuth\CustomerChangePasswordRequest;
use App\Http\Requests\CustomerAuth\CustomerProfileUpdateRequest;
use App\Http\Requests\CustomerAuth\CustomerPhotoUploadRequest;
use App\Http\Requests\CustomerAuth\CustomerDeleteAccountRequest;
use App\Http\Resources\Customer\CustomerResource;
use App\Services\Auth\CustomerAuthServiceInterface;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerAuthController extends BaseController
{
    public function __construct(
        protected CustomerAuthServiceInterface $authService,
    ) {}

    public function register(CustomerRegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register(
                data: $request->validated(),
                ip: $request->ip(),
                userAgent: $request->userAgent(),
            );

            return $this->createdResponse([
                'customer' => new CustomerResource($result['customer']),
                'message' => $result['message'],
            ], 'Registration successful');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function login(CustomerLoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                credentials: $request->validated(),
                ip: $request->ip(),
                userAgent: $request->userAgent(),
                remember: $request->boolean('remember_me', false),
            );

            return $this->successResponse([
                'customer' => new CustomerResource($result['customer']),
            ], 'Login successful');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request->user());
        } catch (\Exception $e) {
            // Proceed with logout even if session cleanup fails
        }
        return $this->successResponse(null, 'Logged out successfully');
    }

    public function verifyOtp(CustomerVerifyOtpRequest $request): JsonResponse
    {
        try {
            $customer = $request->user();
            $result = $this->authService->verifyOtp($customer, $request->input('otp'));

            return $this->successResponse([
                'customer' => new CustomerResource($result['customer']),
                'message' => $result['message'],
            ], 'OTP verified successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function resendOtp(Request $request): JsonResponse
    {
        try {
            $customer = $request->user();
            $this->authService->resendOtp($customer);

            return $this->successResponse(null, 'OTP resent successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function sendOtp(CustomerSendOtpRequest $request): JsonResponse
    {
        try {
            $otp = $this->authService->sendOtp($request->input('phone'));

            return $this->successResponse([
                'otp' => $otp,
            ], 'OTP sent successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function registerSendOtp(CustomerSendOtpRequest $request): JsonResponse
    {
        try {
            $otp = $this->authService->registerSendOtp($request->input('phone'));

            return $this->successResponse([
                'otp' => $otp,
            ], 'OTP sent successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function guestVerifyOtp(CustomerGuestVerifyOtpRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->verifyOtpLogin(
                phone: $request->input('phone'),
                otp: $request->input('otp'),
                ip: $request->ip(),
                userAgent: $request->userAgent(),
            );

            return $this->successResponse([
                'customer' => new CustomerResource($result['customer']),
            ], 'Login successful');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function guestRegisterVerifyOtp(CustomerGuestVerifyOtpRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->verifyOtpLogin(
                phone: $request->input('phone'),
                otp: $request->input('otp'),
                ip: $request->ip(),
                userAgent: $request->userAgent(),
            );

            $customer = $result['customer'];

            $updateData = array_filter([
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
            ], fn ($v) => $v !== null && $v !== '');

            if (! empty($updateData)) {
                $customer->update($updateData);
            }

            return $this->successResponse([
                'customer' => new CustomerResource($customer->fresh()),
            ], 'Registration successful');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function profile(Request $request): JsonResponse
    {
        $customer = $this->authService->getProfile($request->user());
        return $this->successResponse(new CustomerResource($customer), 'Profile retrieved');
    }

    public function forgotPassword(CustomerForgotPasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->forgotPassword($request->input('email'));
            return $this->successResponse(null, 'Password reset link sent to your email');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send reset link', 500);
        }
    }

    public function resetPassword(CustomerResetPasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->resetPassword(
                $request->input('token'),
                $request->input('email'),
                $request->input('password'),
            );
            return $this->successResponse(null, 'Password reset successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function changePassword(CustomerChangePasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->changePassword(
                $request->user(),
                $request->input('current_password'),
                $request->input('password'),
            );
            return $this->successResponse(null, 'Password changed successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function updateProfile(CustomerProfileUpdateRequest $request): JsonResponse
    {
        try {
            $customer = $this->authService->updateProfile($request->user(), $request->validated());
            return $this->successResponse(new CustomerResource($customer), 'Profile updated successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function uploadProfilePhoto(CustomerPhotoUploadRequest $request): JsonResponse
    {
        try {
            $customer = $this->authService->uploadProfilePhoto(
                $request->user(),
                $request->file('profile_photo'),
            );
            return $this->successResponse(new CustomerResource($customer), 'Profile photo updated successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to upload profile photo.', 500);
        }
    }

    public function deleteProfilePhoto(Request $request): JsonResponse
    {
        try {
            $customer = $this->authService->deleteProfilePhoto($request->user());
            return $this->successResponse(new CustomerResource($customer), 'Profile photo removed');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to remove profile photo.', 500);
        }
    }

    public function deleteAccount(CustomerDeleteAccountRequest $request): JsonResponse
    {
        try {
            $this->authService->deleteAccount(
                $request->user(),
                $request->input('password'),
                $request->input('reason'),
            );
            return $this->successResponse(null, 'Account deleted successfully');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }
}
