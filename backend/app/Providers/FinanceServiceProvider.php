<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class FinanceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repositories
        $this->app->bind(
            \App\Repositories\Finance\ChartOfAccountRepositoryInterface::class,
            \App\Repositories\Finance\ChartOfAccountRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\JournalEntryRepositoryInterface::class,
            \App\Repositories\Finance\JournalEntryRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\BankAccountRepositoryInterface::class,
            \App\Repositories\Finance\BankAccountRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\BankReconciliationRepositoryInterface::class,
            \App\Repositories\Finance\BankReconciliationRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\FinancialYearRepositoryInterface::class,
            \App\Repositories\Finance\FinancialYearRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\CustomerLedgerRepositoryInterface::class,
            \App\Repositories\Finance\CustomerLedgerRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\SupplierLedgerRepositoryInterface::class,
            \App\Repositories\Finance\SupplierLedgerRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\CashBookRepositoryInterface::class,
            \App\Repositories\Finance\CashBookRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\BankBookRepositoryInterface::class,
            \App\Repositories\Finance\BankBookRepository::class
        );
        $this->app->bind(
            \App\Repositories\Finance\GstTransactionRepositoryInterface::class,
            \App\Repositories\Finance\GstTransactionRepository::class
        );

        // Services
        $this->app->bind(
            \App\Services\Finance\ChartOfAccountServiceInterface::class,
            \App\Services\Finance\ChartOfAccountService::class
        );
        $this->app->bind(
            \App\Services\Finance\JournalServiceInterface::class,
            \App\Services\Finance\JournalService::class
        );
        $this->app->bind(
            \App\Services\Finance\FinancialYearServiceInterface::class,
            \App\Services\Finance\FinancialYearService::class
        );
        $this->app->bind(
            \App\Services\Finance\BankAccountServiceInterface::class,
            \App\Services\Finance\BankAccountService::class
        );
        $this->app->bind(
            \App\Services\Finance\BankReconciliationServiceInterface::class,
            \App\Services\Finance\BankReconciliationService::class
        );
        $this->app->bind(
            \App\Services\Finance\LedgerServiceInterface::class,
            \App\Services\Finance\LedgerService::class
        );
        $this->app->bind(
            \App\Services\Finance\GstServiceInterface::class,
            \App\Services\Finance\GstService::class
        );
        $this->app->bind(
            \App\Services\Finance\AutomationServiceInterface::class,
            \App\Services\Finance\AutomationService::class
        );
    }

    public function boot(): void
    {
        \App\Models\ChartOfAccount::observe(\App\Observers\ChartOfAccountObserver::class);
        \App\Models\JournalEntry::observe(\App\Observers\JournalEntryObserver::class);
        \App\Models\FinancialYear::observe(\App\Observers\FinancialYearObserver::class);
    }
}
