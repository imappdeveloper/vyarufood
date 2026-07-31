<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Payment\WalletRepositoryInterface::class,
            \App\Repositories\Payment\WalletRepository::class
        );
        $this->app->bind(
            \App\Repositories\Payment\WalletTransactionRepositoryInterface::class,
            \App\Repositories\Payment\WalletTransactionRepository::class
        );
        $this->app->bind(
            \App\Repositories\Payment\PaymentTransactionRepositoryInterface::class,
            \App\Repositories\Payment\PaymentTransactionRepository::class
        );
        $this->app->bind(
            \App\Repositories\Payment\PaymentRefundRepositoryInterface::class,
            \App\Repositories\Payment\PaymentRefundRepository::class
        );
        $this->app->bind(
            \App\Repositories\Payment\PaymentWebhookLogRepositoryInterface::class,
            \App\Repositories\Payment\PaymentWebhookLogRepository::class
        );

        $this->app->bind(
            \App\Services\Payment\WalletServiceInterface::class,
            \App\Services\Payment\WalletService::class
        );
        $this->app->bind(
            \App\Services\Payment\PaymentServiceInterface::class,
            \App\Services\Payment\PaymentService::class
        );
        $this->app->bind(
            \App\Services\Payment\PaymentRefundServiceInterface::class,
            \App\Services\Payment\PaymentRefundService::class
        );
        $this->app->bind(
            \App\Services\Payment\WebhookServiceInterface::class,
            \App\Services\Payment\WebhookService::class
        );
    }

    public function boot(): void
    {
        \App\Models\Wallet::observe(\App\Observers\WalletObserver::class);
        \App\Models\PaymentTransaction::observe(\App\Observers\PaymentTransactionObserver::class);
    }
}
