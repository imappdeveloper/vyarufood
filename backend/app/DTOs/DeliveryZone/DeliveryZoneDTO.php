<?php

declare(strict_types=1);

namespace App\DTOs\DeliveryZone;

/**
 * Data Transfer Object for Delivery Zone entity.
 *
 * Represents a delivery zone configuration including geographic boundaries,
 * delivery charges, order constraints, and priority settings.
 */
final class DeliveryZoneDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly int $countryId = 0,
        public readonly int $stateId = 0,
        public readonly int $cityId = 0,
        public readonly ?int $areaId = null,
        public readonly string $zoneName = '',
        public readonly string $zoneCode = '',
        public readonly ?string $description = null,
        public readonly ?float $deliveryRadius = null,
        public readonly float $minimumOrderAmount = 0,
        public readonly float $deliveryCharge = 0,
        public readonly ?float $freeDeliveryAbove = null,
        public readonly ?int $estimatedDeliveryTime = null,
        public readonly ?int $maximumOrdersPerSlot = null,
        public readonly int $priority = 0,
        public readonly ?string $status = 'active',
        public readonly ?bool $isDefault = false,
        public readonly ?string $remarks = null,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
        public readonly ?int $deletedBy = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            countryId: (int) ($data['country_id'] ?? 0),
            stateId: (int) ($data['state_id'] ?? 0),
            cityId: (int) ($data['city_id'] ?? 0),
            areaId: isset($data['area_id']) ? (int) $data['area_id'] : null,
            zoneName: $data['zone_name'] ?? '',
            zoneCode: $data['zone_code'] ?? '',
            description: $data['description'] ?? null,
            deliveryRadius: isset($data['delivery_radius']) ? (float) $data['delivery_radius'] : null,
            minimumOrderAmount: isset($data['minimum_order_amount']) ? (float) $data['minimum_order_amount'] : 0,
            deliveryCharge: isset($data['delivery_charge']) ? (float) $data['delivery_charge'] : 0,
            freeDeliveryAbove: isset($data['free_delivery_above']) ? (float) $data['free_delivery_above'] : null,
            estimatedDeliveryTime: isset($data['estimated_delivery_time']) ? (int) $data['estimated_delivery_time'] : null,
            maximumOrdersPerSlot: isset($data['maximum_orders_per_slot']) ? (int) $data['maximum_orders_per_slot'] : null,
            priority: (int) ($data['priority'] ?? $data['sort_order'] ?? 0),
            status: $data['status'] ?? 'active',
            isDefault: (bool) ($data['is_default'] ?? false),
            remarks: $data['remarks'] ?? null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
            deletedBy: isset($data['deleted_by']) ? (int) $data['deleted_by'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'country_id' => $this->countryId,
            'state_id' => $this->stateId,
            'city_id' => $this->cityId,
            'area_id' => $this->areaId,
            'zone_name' => $this->zoneName,
            'zone_code' => $this->zoneCode,
            'description' => $this->description,
            'delivery_radius' => $this->deliveryRadius,
            'minimum_order_amount' => $this->minimumOrderAmount,
            'delivery_charge' => $this->deliveryCharge,
            'free_delivery_above' => $this->freeDeliveryAbove,
            'estimated_delivery_time' => $this->estimatedDeliveryTime,
            'maximum_orders_per_slot' => $this->maximumOrdersPerSlot,
            'priority' => $this->priority,
            'status' => $this->status,
            'is_default' => $this->isDefault,
            'remarks' => $this->remarks,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'deleted_by' => $this->deletedBy,
        ];
    }
}
