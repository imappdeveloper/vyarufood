<?php

declare(strict_types=1);

namespace App\DTOs\DeliveryZone;

/**
 * Data Transfer Object for Delivery Slot entity.
 *
 * Represents a time-based delivery slot within a delivery zone,
 * including order limits, scheduling, and cutoff configuration.
 */
final class DeliverySlotDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly int $deliveryZoneId = 0,
        public readonly string $slotName = '',
        public readonly string $startTime = '',
        public readonly string $endTime = '',
        public readonly int $maximumOrders = 50,
        public readonly ?string $cutoffTime = null,
        public readonly ?string $status = 'active',
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            deliveryZoneId: (int) ($data['delivery_zone_id'] ?? 0),
            slotName: $data['slot_name'] ?? '',
            startTime: $data['start_time'] ?? '',
            endTime: $data['end_time'] ?? '',
            maximumOrders: isset($data['maximum_orders']) ? (int) $data['maximum_orders'] : 50,
            cutoffTime: $data['cutoff_time'] ?? null,
            status: $data['status'] ?? 'active',
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'delivery_zone_id' => $this->deliveryZoneId,
            'slot_name' => $this->slotName,
            'start_time' => $this->startTime,
            'end_time' => $this->endTime,
            'maximum_orders' => $this->maximumOrders,
            'cutoff_time' => $this->cutoffTime,
            'status' => $this->status,
        ];
    }
}
