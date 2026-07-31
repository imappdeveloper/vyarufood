<?php
declare(strict_types=1);
namespace App\Events\DeliveryZone;
use App\Models\Master\DeliveryZone;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class DeliveryZoneDeleted { use Dispatchable, SerializesModels; public function __construct(public DeliveryZone $deliveryZone, public int $deletedBy) {} }
