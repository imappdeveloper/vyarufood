<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\SystemSetting\SystemSettingRepository;
use App\Repositories\SystemSetting\SystemSettingRepositoryInterface;
use App\Repositories\CmsPage\CmsPageRepository;
use App\Repositories\CmsPage\CmsPageRepositoryInterface;
use App\Repositories\AppVersion\AppVersionRepository;
use App\Repositories\AppVersion\AppVersionRepositoryInterface;
use App\Repositories\SystemBackup\SystemBackupRepository;
use App\Repositories\SystemBackup\SystemBackupRepositoryInterface;
use App\Services\SystemSetting\SystemSettingService;
use App\Services\SystemSetting\SystemSettingServiceInterface;
use App\Services\CmsPage\CmsPageService;
use App\Services\CmsPage\CmsPageServiceInterface;
use App\Services\AppVersion\AppVersionService;
use App\Services\AppVersion\AppVersionServiceInterface;
use App\Services\SystemBackup\SystemBackupService;
use App\Services\SystemBackup\SystemBackupServiceInterface;
use Illuminate\Support\ServiceProvider;

class CmsSettingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SystemSettingRepositoryInterface::class, SystemSettingRepository::class);
        $this->app->bind(CmsPageRepositoryInterface::class, CmsPageRepository::class);
        $this->app->bind(AppVersionRepositoryInterface::class, AppVersionRepository::class);
        $this->app->bind(SystemBackupRepositoryInterface::class, SystemBackupRepository::class);

        $this->app->bind(SystemSettingServiceInterface::class, SystemSettingService::class);
        $this->app->bind(CmsPageServiceInterface::class, CmsPageService::class);
        $this->app->bind(AppVersionServiceInterface::class, AppVersionService::class);
        $this->app->bind(SystemBackupServiceInterface::class, SystemBackupService::class);
    }

    public function boot(): void
    {
        //
    }
}
