<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Auth\AdminRepositoryInterface;
use App\Repositories\Auth\EloquentAdminRepository;
use App\Repositories\Auth\RoleRepositoryInterface;
use App\Repositories\Auth\EloquentRoleRepository;
use App\Repositories\Auth\PermissionRepositoryInterface;
use App\Repositories\Auth\EloquentPermissionRepository;
use App\Repositories\Auth\LoginHistoryRepositoryInterface;
use App\Repositories\Auth\EloquentLoginHistoryRepository;
use App\Services\Auth\AuthServiceInterface;
use App\Services\Auth\AuthService;
use App\Services\Auth\CustomerAuthServiceInterface;
use App\Services\Auth\CustomerAuthService;
use App\Services\Auth\RoleServiceInterface;
use App\Services\Auth\RoleService;
use App\Services\Auth\AdminUserServiceInterface;
use App\Services\Auth\AdminUserService;
use App\Services\Auth\PermissionServiceInterface;
use App\Services\Auth\PermissionService;
use App\Repositories\Country\CountryRepositoryInterface;
use App\Repositories\Country\CountryRepository;
use App\Services\Country\CountryServiceInterface;
use App\Services\Country\CountryService;
use App\Services\Cart\CartServiceInterface;
use App\Services\Cart\CartService;
use App\Services\Checkout\CheckoutServiceInterface;
use App\Services\Checkout\CheckoutService;
use App\Services\Payment\PaymentServiceInterface;
use App\Services\Payment\PaymentService;
use App\Services\Payment\WalletServiceInterface;
use App\Services\Payment\WalletService;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repositories
        $this->app->bind(AdminRepositoryInterface::class, EloquentAdminRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, EloquentRoleRepository::class);
        $this->app->bind(PermissionRepositoryInterface::class, EloquentPermissionRepository::class);
        $this->app->bind(LoginHistoryRepositoryInterface::class, EloquentLoginHistoryRepository::class);

        // Services
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
        $this->app->bind(CustomerAuthServiceInterface::class, CustomerAuthService::class);
        $this->app->bind(RoleServiceInterface::class, RoleService::class);
        $this->app->bind(AdminUserServiceInterface::class, AdminUserService::class);
        $this->app->bind(PermissionServiceInterface::class, PermissionService::class);
        $this->app->bind(CountryRepositoryInterface::class, CountryRepository::class);
        $this->app->bind(CountryServiceInterface::class, CountryService::class);
        $this->app->bind(CartServiceInterface::class, CartService::class);
        $this->app->bind(CheckoutServiceInterface::class, CheckoutService::class);
        $this->app->bind(PaymentServiceInterface::class, PaymentService::class);
        $this->app->bind(WalletServiceInterface::class, WalletService::class);
    }

    public function boot(): void
    {
        //
    }
}
