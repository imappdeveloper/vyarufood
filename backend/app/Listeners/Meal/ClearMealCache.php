<?php
declare(strict_types=1);
namespace App\Listeners\Meal;
use App\Support\CacheManager;
class ClearMealCache { public function handle(object $event): void { CacheManager::flush('meal'); } }
