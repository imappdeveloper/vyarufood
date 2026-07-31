<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\SystemSettingController;
use App\Http\Controllers\Api\V1\Admin\CmsPageController;
use App\Http\Controllers\Api\V1\Admin\AppVersionController;
use App\Http\Controllers\Api\V1\Admin\SystemBackupController;
use App\Http\Controllers\Api\V1\Admin\MaintenanceController;

Route::prefix('api/v1')->middleware(['web', 'auth:admin'])->group(function () {

    // System Settings
    Route::prefix('admin/settings')->group(function () {
        Route::get('/', [SystemSettingController::class, 'index']);
        Route::post('/', [SystemSettingController::class, 'store']);
        Route::get('/groups', [SystemSettingController::class, 'groups']);
        Route::get('/group/{group}', [SystemSettingController::class, 'getByGroup']);
        Route::patch('/bulk-update', [SystemSettingController::class, 'bulkUpdate']);
        Route::get('/{uuid}', [SystemSettingController::class, 'show']);
        Route::put('/{uuid}', [SystemSettingController::class, 'update']);
        Route::delete('/{uuid}', [SystemSettingController::class, 'destroy']);
    });

    // CMS Pages
    Route::prefix('admin/cms-pages')->group(function () {
        Route::get('/', [CmsPageController::class, 'index']);
        Route::post('/', [CmsPageController::class, 'store']);
        Route::get('/stats', [CmsPageController::class, 'stats']);
        Route::get('/public/{slug}', [CmsPageController::class, 'publicShow']);
        Route::get('/{uuid}', [CmsPageController::class, 'show']);
        Route::put('/{uuid}', [CmsPageController::class, 'update']);
        Route::delete('/{uuid}', [CmsPageController::class, 'destroy']);
        Route::patch('/{uuid}/publish', [CmsPageController::class, 'publish']);
        Route::patch('/{uuid}/archive', [CmsPageController::class, 'archive']);
    });

    // App Versions
    Route::prefix('admin/app-versions')->group(function () {
        Route::get('/', [AppVersionController::class, 'index']);
        Route::post('/', [AppVersionController::class, 'store']);
        Route::get('/stats', [AppVersionController::class, 'stats']);
        Route::get('/latest/{platform}', [AppVersionController::class, 'latestForPlatform']);
        Route::post('/check-outdated', [AppVersionController::class, 'checkOutdated']);
        Route::get('/{uuid}', [AppVersionController::class, 'show']);
        Route::put('/{uuid}', [AppVersionController::class, 'update']);
        Route::delete('/{uuid}', [AppVersionController::class, 'destroy']);
        Route::patch('/{uuid}/status', [AppVersionController::class, 'setStatus']);
    });

    // Backups
    Route::prefix('admin/backups')->group(function () {
        Route::get('/', [SystemBackupController::class, 'index']);
        Route::post('/', [SystemBackupController::class, 'store']);
        Route::get('/stats', [SystemBackupController::class, 'stats']);
        Route::get('/{uuid}', [SystemBackupController::class, 'show']);
        Route::delete('/{uuid}', [SystemBackupController::class, 'destroy']);
    });

    // Maintenance Mode
    Route::prefix('admin/maintenance')->group(function () {
        Route::post('/enable', [MaintenanceController::class, 'enable']);
        Route::post('/disable', [MaintenanceController::class, 'disable']);
        Route::get('/status', [MaintenanceController::class, 'status']);
    });
});
