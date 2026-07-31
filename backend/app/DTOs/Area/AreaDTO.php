<?php

declare(strict_types=1);

namespace App\DTOs\Area;

final class AreaDTO
{
    public function __construct(
        public readonly int $countryId,
        public readonly int $stateId,
        public readonly int $cityId,
        public readonly string $name,
        public readonly string $areaCode,
        public readonly ?string $postalZone = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?float $deliveryRadius = null,
        public readonly ?float $minimumOrderAmount = 0,
        public readonly ?float $deliveryCharge = 0,
        public readonly ?int $estimatedDeliveryTime = null,
        public readonly bool $isServiceable = true,
        public readonly int $displayOrder = 0,
        public readonly string $status = 'active',
        public readonly bool $isDefault = false,
        public readonly ?string $remarks = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            countryId: (int) ($data['country_id'] ?? 0),
            stateId: (int) ($data['state_id'] ?? 0),
            cityId: (int) ($data['city_id'] ?? 0),
            name: $data['name'] ?? '',
            areaCode: $data['area_code'] ?? '',
            postalZone: $data['postal_zone'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            deliveryRadius: isset($data['delivery_radius']) ? (float) $data['delivery_radius'] : null,
            minimumOrderAmount: isset($data['minimum_order_amount']) ? (float) $data['minimum_order_amount'] : 0,
            deliveryCharge: isset($data['delivery_charge']) ? (float) $data['delivery_charge'] : 0,
            estimatedDeliveryTime: isset($data['estimated_delivery_time']) ? (int) $data['estimated_delivery_time'] : null,
            isServiceable: (bool) ($data['is_serviceable'] ?? true),
            displayOrder: (int) ($data['display_order'] ?? $data['sort_order'] ?? 0),
            isDefault: (bool) ($data['is_default'] ?? false),
            status: $data['status'] ?? 'active',
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'country_id' => $this->countryId,
            'state_id' => $this->stateId,
            'city_id' => $this->cityId,
            'name' => $this->name,
            'area_code' => $this->areaCode,
            'postal_zone' => $this->postalZone,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'delivery_radius' => $this->deliveryRadius,
            'minimum_order_amount' => $this->minimumOrderAmount,
            'delivery_charge' => $this->deliveryCharge,
            'estimated_delivery_time' => $this->estimatedDeliveryTime,
            'is_serviceable' => $this->isServiceable,
            'display_order' => $this->displayOrder,
            'is_default' => $this->isDefault,
            'status' => $this->status,
            'remarks' => $this->remarks,
        ];
    }
}
