<?php

declare(strict_types=1);

namespace App\DTOs\Pincode;

/**
 * Data Transfer Object for Pincode entity.
 *
 * Represents a pincode entry linked to a delivery zone,
 * including geographic coordinates and serviceability status.
 */
final class PincodeDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly int $deliveryZoneId = 0,
        public readonly int $countryId = 0,
        public readonly int $stateId = 0,
        public readonly int $cityId = 0,
        public readonly ?int $areaId = null,
        public readonly string $pincode = '',
        public readonly ?string $officeName = null,
        public readonly ?string $district = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?string $status = 'active',
        public readonly ?bool $isServiceable = true,
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
            deliveryZoneId: (int) ($data['delivery_zone_id'] ?? 0),
            countryId: (int) ($data['country_id'] ?? 0),
            stateId: (int) ($data['state_id'] ?? 0),
            cityId: (int) ($data['city_id'] ?? 0),
            areaId: isset($data['area_id']) ? (int) $data['area_id'] : null,
            pincode: $data['pincode'] ?? '',
            officeName: $data['office_name'] ?? null,
            district: $data['district'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            status: $data['status'] ?? 'active',
            isServiceable: (bool) ($data['is_serviceable'] ?? true),
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
            'delivery_zone_id' => $this->deliveryZoneId,
            'country_id' => $this->countryId,
            'state_id' => $this->stateId,
            'city_id' => $this->cityId,
            'area_id' => $this->areaId,
            'pincode' => $this->pincode,
            'office_name' => $this->officeName,
            'district' => $this->district,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'is_serviceable' => $this->isServiceable,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'deleted_by' => $this->deletedBy,
        ];
    }
}
