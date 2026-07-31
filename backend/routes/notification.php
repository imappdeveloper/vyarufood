<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\NotificationController;
use App\Http\Controllers\Api\V1\Admin\NotificationLogController;
use App\Http\Controllers\Api\V1\Admin\NotificationTemplateController;
use App\Http\Controllers\Api\V1\Customer\CustomerNotificationController;

Route::prefix('api/v1')->middleware(['web', 'auth:admin'])->group(function () {
    Route::prefix('admin/notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/', [NotificationController::class, 'store']);
        Route::post('/broadcast', [NotificationController::class, 'broadcast']);
        Route::post('/bulk-cancel', [NotificationController::class, 'bulkCancel']);
        Route::get('/dashboard-stats', [NotificationController::class, 'dashboardStats']);
        Route::get('/delivery-stats', [NotificationController::class, 'deliveryStats']);
        Route::get('/queue-stats', [NotificationController::class, 'queueStats']);
        Route::get('/logs', [NotificationLogController::class, 'index']);
        Route::get('/{uuid}', [NotificationController::class, 'show']);
        Route::patch('/{uuid}/cancel', [NotificationController::class, 'cancel']);
    });

    Route::prefix('admin/notification-templates')->group(function () {
        Route::get('/', [NotificationTemplateController::class, 'index']);
        Route::post('/', [NotificationTemplateController::class, 'store']);
        Route::get('/{id}', [NotificationTemplateController::class, 'show']);
        Route::put('/{id}', [NotificationTemplateController::class, 'update']);
        Route::delete('/{id}', [NotificationTemplateController::class, 'destroy']);
    });
});

Route::prefix('api/v1')->middleware(['auth:customer', 'customer.active'])->group(function () {
    Route::prefix('customer/notifications')->group(function () {
        Route::get('/', [CustomerNotificationController::class, 'index']);
        Route::get('/unread-count', [CustomerNotificationController::class, 'unreadCount']);
        Route::get('/preferences', [CustomerNotificationController::class, 'preferences']);
        Route::put('/preferences', [CustomerNotificationController::class, 'updatePreferences']);
        Route::get('/{uuid}', [CustomerNotificationController::class, 'show']);
        Route::patch('/{uuid}/read', [CustomerNotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [CustomerNotificationController::class, 'markAllAsRead']);
    });
});
