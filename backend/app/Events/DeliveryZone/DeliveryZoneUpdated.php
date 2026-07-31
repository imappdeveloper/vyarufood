<?php
declare(strict_types=1);
namespace App\Events\DeliveryZone;
use App\Models\Master\DeliveryZone;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class DeliveryZoneUpdated { use Dispatchable, SerializesModels; public function __construct(public DeliveryZone $deliveryZone, public array $oldData, public int $updatedBy) {} }
