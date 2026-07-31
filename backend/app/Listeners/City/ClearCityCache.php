<?php
declare(strict_types=1);
namespace App\Listeners\City;
use App\Support\BaseListener;
use App\Support\CacheManager;

class ClearCityCache extends BaseListener
{
    public function handle(object $event): void
    {
        CacheManager::flush('city');
    }
}
