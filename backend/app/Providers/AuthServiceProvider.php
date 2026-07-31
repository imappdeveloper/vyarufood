<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Auth\Admin;
use App\Policies\Auth\AdminPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Admin::class => AdminPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::before(function ($user, $ability) {
            if ($user && $user->id !== null) {
                return true;
            }
        });
    }
}
