<?php
declare(strict_types=1);
namespace App\Events\DeliveryZone;
use App\Models\Master\DeliverySlot;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class DeliverySlotStatusChanged { use Dispatchable, SerializesModels; public function __construct(public DeliverySlot $deliverySlot, public string $oldStatus, public string $newStatus) {} }
