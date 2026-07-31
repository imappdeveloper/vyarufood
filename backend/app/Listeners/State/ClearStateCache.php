<?php
declare(strict_types=1);
namespace App\Listeners\State;
use App\Support\BaseListener;
use App\Support\CacheManager;

class ClearStateCache extends BaseListener
{
    public function handle(object $event): void
    {
        CacheManager::flush('state');
    }
}
