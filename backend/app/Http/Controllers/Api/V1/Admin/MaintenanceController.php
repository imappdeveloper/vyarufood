<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Services\SystemSetting\SystemSettingServiceInterface;
use Illuminate\Http\JsonResponse;

class MaintenanceController extends BaseController
{
    public function __construct(
        protected SystemSettingServiceInterface $settingService,
    ) {}

    public function enable(): JsonResponse
    {
        try {
            $setting = $this->settingService->setValue('maintenance_mode', 'true');
            if ($setting && $setting->status !== 'active') {
                $setting->status = 'active';
                $setting->save();
            }
            $this->settingService->setValue('maintenance_mode_enabled_at', now()->toIso8601String());

            activity('maintenance')
                ->event('enabled')
                ->log('Maintenance mode enabled');

            \Log::info('Maintenance enabled successfully');
            return $this->successResponse(null, 'Maintenance mode enabled. Customer website will show under maintenance.');
        } catch (\Throwable $e) {
            \Log::error('Maintenance enable failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->errorResponse('Failed to enable maintenance: ' . $e->getMessage(), 500);
        }
    }

    public function disable(): JsonResponse
    {
        try {
            $this->settingService->setValue('maintenance_mode', 'false');

            activity('maintenance')
                ->event('disabled')
                ->log('Maintenance mode disabled');

            \Log::info('Maintenance disabled successfully');
            return $this->successResponse(null, 'Maintenance mode disabled. Customer website is now live.');
        } catch (\Throwable $e) {
            \Log::error('Maintenance disable failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->errorResponse('Failed to disable maintenance: ' . $e->getMessage(), 500);
        }
    }

    public function status(): JsonResponse
    {
        $isEnabled = $this->settingService->getValue('maintenance_mode', 'false') === true;
        $enabledAt = $this->settingService->getValue('maintenance_mode_enabled_at');

        return $this->successResponse([
            'is_enabled' => $isEnabled,
            'enabled_at' => $enabledAt,
        ]);
    }
}
