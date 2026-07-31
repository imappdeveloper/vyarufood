<?php
declare(strict_types=1);
namespace App\Events\DeliveryZone;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class DeliverySlotForceDeleted { use Dispatchable, SerializesModels; public function __construct(public int $deliverySlotId) {} }
