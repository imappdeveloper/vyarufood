<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Report\DashboardRepositoryInterface;
use App\Repositories\Report\DashboardRepository;
use App\Repositories\Report\ReportRepositoryInterface;
use App\Repositories\Report\ReportRepository;
use App\Repositories\Report\ReportExportRepositoryInterface;
use App\Repositories\Report\ReportExportRepository;
use App\Repositories\Report\ScheduledReportRepositoryInterface;
use App\Repositories\Report\ScheduledReportRepository;
use App\Repositories\Report\SavedReportRepositoryInterface;
use App\Repositories\Report\SavedReportRepository;
use App\Services\Report\DashboardServiceInterface;
use App\Services\Report\DashboardService;
use App\Services\Report\ReportServiceInterface;
use App\Services\Report\ReportService;
use App\Services\Report\ExportServiceInterface;
use App\Services\Report\ExportService;
use App\Services\Report\ScheduleServiceInterface;
use App\Services\Report\ScheduleService;
use App\Services\Report\SavedReportServiceInterface;
use App\Services\Report\SavedReportService;

class ReportServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DashboardRepositoryInterface::class, DashboardRepository::class);
        $this->app->bind(ReportRepositoryInterface::class, ReportRepository::class);
        $this->app->bind(ReportExportRepositoryInterface::class, ReportExportRepository::class);
        $this->app->bind(ScheduledReportRepositoryInterface::class, ScheduledReportRepository::class);
        $this->app->bind(SavedReportRepositoryInterface::class, SavedReportRepository::class);
        $this->app->bind(DashboardServiceInterface::class, DashboardService::class);
        $this->app->bind(ReportServiceInterface::class, ReportService::class);
        $this->app->bind(ExportServiceInterface::class, ExportService::class);
        $this->app->bind(ScheduleServiceInterface::class, ScheduleService::class);
        $this->app->bind(SavedReportServiceInterface::class, SavedReportService::class);
    }

    public function boot(): void
    {
    }
}
