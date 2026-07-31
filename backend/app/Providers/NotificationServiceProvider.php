<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Notification\NotificationTemplateRepositoryInterface::class,
            \App\Repositories\Notification\NotificationTemplateRepository::class
        );
        $this->app->bind(
            \App\Repositories\Notification\NotificationRepositoryInterface::class,
            \App\Repositories\Notification\NotificationRepository::class
        );
        $this->app->bind(
            \App\Repositories\Notification\NotificationLogRepositoryInterface::class,
            \App\Repositories\Notification\NotificationLogRepository::class
        );
        $this->app->bind(
            \App\Repositories\Notification\NotificationPreferenceRepositoryInterface::class,
            \App\Repositories\Notification\NotificationPreferenceRepository::class
        );

        $this->app->bind(
            \App\Services\Notification\NotificationTemplateServiceInterface::class,
            \App\Services\Notification\NotificationTemplateService::class
        );
        $this->app->bind(
            \App\Services\Notification\NotificationServiceInterface::class,
            \App\Services\Notification\NotificationService::class
        );
        $this->app->bind(
            \App\Services\Notification\NotificationPreferenceServiceInterface::class,
            \App\Services\Notification\NotificationPreferenceService::class
        );
        $this->app->bind(
            \App\Services\Notification\Channel\NotificationChannelInterface::class,
            \App\Services\Notification\Channel\NotificationChannelManager::class
        );
    }

    public function boot(): void
    {
        \App\Models\Notification::observe(\App\Observers\NotificationObserver::class);
    }
}
