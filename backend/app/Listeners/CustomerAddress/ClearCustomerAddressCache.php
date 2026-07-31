<?php
declare(strict_types=1);
namespace App\Listeners\CustomerAddress;
use App\Support\CacheManager;
class ClearCustomerAddressCache { public function handle(object $event): void { CacheManager::flush('customer_address'); } }
