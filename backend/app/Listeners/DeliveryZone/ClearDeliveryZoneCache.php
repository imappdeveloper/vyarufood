<?php
declare(strict_types=1);
namespace App\Listeners\DeliveryZone;
use App\Support\CacheManager;
class ClearDeliveryZoneCache { public function handle(object $event): void { CacheManager::flush('delivery_zone'); } }
