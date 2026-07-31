<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\AppVersion\AppVersionServiceInterface;
use Illuminate\Console\Command;

class CheckAppVersionCommand extends Command
{
    protected $signature = 'app:check-version {platform} {current_version}';
    protected $description = 'Check if a mobile app version is outdated';

    public function __construct(private AppVersionServiceInterface $versionService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $platform = $this->argument('platform');
        $currentVersion = $this->argument('current_version');

        $outdated = $this->versionService->checkOutdated($platform, $currentVersion);

        if ($outdated) {
            $this->warn("App version {$currentVersion} on {$platform} is outdated.");
            $this->info("Latest version: {$outdated->version_name} (code: {$outdated->version_code})");
            $this->info("Minimum supported: {$outdated->minimum_supported_version}");

            if ($outdated->force_update) {
                $this->error("FORCE UPDATE REQUIRED");
            }

            return Command::SUCCESS;
        }

        $this->info("App version {$currentVersion} on {$platform} is up to date.");
        return Command::SUCCESS;
    }
}
