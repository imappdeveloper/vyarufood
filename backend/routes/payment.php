<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\PaymentController;
use App\Http\Controllers\Api\V1\Admin\AdminWalletController;
use App\Http\Controllers\Api\V1\Customer\CustomerWalletController;
use App\Http\Controllers\Api\V1\Admin\PaymentGatewayController;

Route::prefix('api/v1')->middleware(['web', 'auth:admin'])->group(function () {
    Route::prefix('admin/payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::get('/dashboard-stats', [PaymentController::class, 'dashboardStats']);
        Route::get('/revenue-summary', [PaymentController::class, 'revenueSummary']);
        Route::get('/webhook-logs', [PaymentController::class, 'webhookLogs']);
        Route::get('/refunds', [PaymentController::class, 'refunds']);
        Route::post('/refunds', [PaymentController::class, 'processRefund']);
        Route::get('/{uuid}', [PaymentController::class, 'show']);
    });

    Route::prefix('admin/wallets')->group(function () {
        Route::get('/', [AdminWalletController::class, 'index']);
        Route::get('/{uuid}', [AdminWalletController::class, 'show']);
        Route::get('/{uuid}/transactions', [AdminWalletController::class, 'transactions']);
        Route::patch('/{uuid}/adjust', [AdminWalletController::class, 'adjustBalance']);
    });
});

Route::prefix('api/v1')->middleware(['auth:customer', 'customer.active'])->group(function () {
    Route::prefix('customer/wallet')->group(function () {
        Route::get('/', [CustomerWalletController::class, 'index']);
        Route::post('/recharge', [CustomerWalletController::class, 'recharge']);
        Route::post('/pay', [CustomerWalletController::class, 'pay']);
        Route::get('/history', [CustomerWalletController::class, 'history']);
        Route::get('/payment-history', [CustomerWalletController::class, 'paymentHistory']);
    });
});

Route::prefix('api/v1')->middleware('web')->group(function () {
    Route::prefix('payment/razorpay')->group(function () {
        Route::post('/create-order', [PaymentGatewayController::class, 'createOrder']);
        Route::post('/verify', [PaymentGatewayController::class, 'verifyPayment']);
        Route::post('/webhook', [PaymentGatewayController::class, 'razorpayWebhook'])->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);
    });
});
