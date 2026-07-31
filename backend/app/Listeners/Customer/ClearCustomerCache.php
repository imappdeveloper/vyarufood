<?php
declare(strict_types=1);
namespace App\Listeners\Customer;
use App\Support\CacheManager;
class ClearCustomerCache { public function handle(object $event): void { CacheManager::flush('customer'); } }
