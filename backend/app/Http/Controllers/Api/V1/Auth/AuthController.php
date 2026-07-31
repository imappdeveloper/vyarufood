<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\Auth\AdminResource;
use App\Services\Auth\AuthServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseController
{
    public function __construct(
        protected AuthServiceInterface $authService,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                credentials: $request->validated(),
                ip: $request->ip(),
                userAgent: $request->userAgent(),
                remember: $request->boolean('remember_me', false),
            );

            return $this->successResponse([
                'admin' => new AdminResource($result['admin']),
                'abilities' => $result['abilities'],
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
            // Token deletion may fail on Windows PHP — still proceed with logout
        }
        return $this->successResponse(null, 'Logged out successfully');
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->forgotPassword($request->input('email'));
            return $this->successResponse(null, 'Password reset link sent to your email');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send reset link', 500);
        }
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
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

    public function changePassword(ChangePasswordRequest $request): JsonResponse
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

    public function profile(Request $request): JsonResponse
    {
        $admin = $this->authService->getProfile($request->user());
        return $this->successResponse(new AdminResource($admin), 'Profile retrieved');
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $admin = $this->authService->updateProfile($request->user(), $request->validated());
            return $this->successResponse(new AdminResource($admin), 'Profile updated');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function updateProfilePhoto(Request $request): JsonResponse
    {
        $request->validate([
            'profile_photo' => ['required', 'file', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ]);

        try {
            $admin = $this->authService->updateProfilePhoto($request->user(), $request->file('profile_photo'));
            return $this->successResponse(new AdminResource($admin), 'Profile photo updated');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to upload photo', 500);
        }
    }

    public function logoutAllDevices(Request $request): JsonResponse
    {
        $this->authService->logoutAllDevices($request->user());
        return $this->noContentResponse('Logged out from all devices');
    }
}
