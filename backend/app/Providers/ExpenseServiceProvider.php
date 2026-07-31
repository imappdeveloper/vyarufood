<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Expense\ExpenseCategoryRepositoryInterface;
use App\Repositories\Expense\ExpenseCategoryRepository;
use App\Repositories\Expense\ExpenseRepositoryInterface;
use App\Repositories\Expense\ExpenseRepository;
use App\Services\Expense\ExpenseCategoryServiceInterface;
use App\Services\Expense\ExpenseCategoryService;
use App\Services\Expense\ExpenseServiceInterface;
use App\Services\Expense\ExpenseService;

class ExpenseServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ExpenseCategoryRepositoryInterface::class, ExpenseCategoryRepository::class);
        $this->app->bind(ExpenseRepositoryInterface::class, ExpenseRepository::class);

        $this->app->bind(ExpenseCategoryServiceInterface::class, ExpenseCategoryService::class);
        $this->app->bind(ExpenseServiceInterface::class, ExpenseService::class);
    }

    public function boot(): void {}
}
