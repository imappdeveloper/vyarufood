<?php
declare(strict_types=1);
namespace App\Listeners\Pincode;
use App\Support\CacheManager;
class ClearPincodeCache { public function handle(object $event): void { CacheManager::flush('pincode'); } }
