<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\ReportController;

Route::prefix('api/v1')->middleware(['web', 'auth:admin'])->group(function () {
    Route::prefix('admin/dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
        Route::get('/sales-chart', [DashboardController::class, 'salesChart']);
        Route::get('/order-chart', [DashboardController::class, 'orderChart']);
        Route::get('/revenue-chart', [DashboardController::class, 'revenueChart']);
        Route::get('/expense-chart', [DashboardController::class, 'expenseChart']);
    });

    Route::prefix('admin/reports')->group(function () {
        Route::get('/executive', [ReportController::class, 'executive']);
        Route::get('/sales', [ReportController::class, 'sales']);
        Route::get('/orders', [ReportController::class, 'orders']);
        Route::get('/customers', [ReportController::class, 'customers']);
        Route::get('/subscriptions', [ReportController::class, 'subscriptions']);
        Route::get('/kitchen', [ReportController::class, 'kitchen']);
        Route::get('/inventory', [ReportController::class, 'inventory']);
        Route::get('/purchases', [ReportController::class, 'purchases']);
        Route::get('/finance', [ReportController::class, 'finance']);
        Route::get('/payments', [ReportController::class, 'payments']);
        Route::get('/gst', [ReportController::class, 'gst']);
        Route::get('/expenses', [ReportController::class, 'expenses']);
        Route::get('/suppliers', [ReportController::class, 'suppliers']);
        Route::get('/notifications', [ReportController::class, 'notifications']);
        Route::post('/export', [ReportController::class, 'export']);
        Route::get('/export-history', [ReportController::class, 'exportHistory']);
        Route::get('/saved', [ReportController::class, 'savedReports']);
        Route::post('/saved', [ReportController::class, 'saveReport']);
        Route::delete('/saved/{id}', [ReportController::class, 'deleteSavedReport']);
        Route::get('/scheduled', [ReportController::class, 'scheduledReports']);
        Route::post('/scheduled', [ReportController::class, 'scheduleReport']);
        Route::put('/scheduled/{id}', [ReportController::class, 'updateScheduledReport']);
        Route::delete('/scheduled/{id}', [ReportController::class, 'deleteScheduledReport']);
    });
});
