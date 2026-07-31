<?php
declare(strict_types=1);
namespace App\Listeners\Area;
use App\Support\CacheManager;
class ClearAreaCache { public function handle(object $event): void { CacheManager::flush('area'); } }
