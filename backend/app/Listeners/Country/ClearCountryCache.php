<?php
declare(strict_types=1);
namespace App\Listeners\Country;
use App\Support\BaseListener;
use App\Support\CacheManager;

class ClearCountryCache extends BaseListener
{
    public function handle(object $event): void
    {
        CacheManager::flush('country');
    }
}
