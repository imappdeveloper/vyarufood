<?php

declare(strict_types=1);

namespace App\DTOs\CustomerAddress;

final class CustomerAddressDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?int $customerId = null,
        public readonly ?int $countryId = null,
        public readonly ?int $stateId = null,
        public readonly ?int $cityId = null,
        public readonly ?int $areaId = null,
        public readonly ?int $deliveryZoneId = null,
        public readonly ?int $pincodeId = null,
        public readonly string $addressType = 'home',
        public readonly ?string $houseNo = null,
        public readonly ?string $buildingName = null,
        public readonly ?string $floor = null,
        public readonly ?string $street = null,
        public readonly ?string $landmark = null,
        public readonly ?string $addressLine1 = null,
        public readonly ?string $addressLine2 = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?string $googlePlaceId = null,
        public readonly ?string $contactPerson = null,
        public readonly ?string $contactMobile = null,
        public readonly ?string $deliveryInstruction = null,
        public readonly bool $isDefault = false,
        public readonly bool $isVerified = false,
        public readonly ?string $status = 'active',
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
            customerId: isset($data['customer_id']) ? (int) $data['customer_id'] : null,
            countryId: isset($data['country_id']) ? (int) $data['country_id'] : null,
            stateId: isset($data['state_id']) ? (int) $data['state_id'] : null,
            cityId: isset($data['city_id']) ? (int) $data['city_id'] : null,
            areaId: isset($data['area_id']) ? (int) $data['area_id'] : null,
            deliveryZoneId: isset($data['delivery_zone_id']) ? (int) $data['delivery_zone_id'] : null,
            pincodeId: isset($data['pincode_id']) ? (int) $data['pincode_id'] : null,
            addressType: $data['address_type'] ?? 'home',
            houseNo: $data['house_no'] ?? null,
            buildingName: $data['building_name'] ?? null,
            floor: $data['floor'] ?? null,
            street: $data['street'] ?? null,
            landmark: $data['landmark'] ?? null,
            addressLine1: $data['address_line_1'] ?? null,
            addressLine2: $data['address_line_2'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            googlePlaceId: $data['google_place_id'] ?? null,
            contactPerson: $data['contact_person'] ?? null,
            contactMobile: $data['contact_mobile'] ?? null,
            deliveryInstruction: $data['delivery_instruction'] ?? null,
            isDefault: (bool) ($data['is_default'] ?? false),
            isVerified: (bool) ($data['is_verified'] ?? false),
            status: $data['status'] ?? 'active',
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
            'customer_id' => $this->customerId,
            'country_id' => $this->countryId,
            'state_id' => $this->stateId,
            'city_id' => $this->cityId,
            'area_id' => $this->areaId,
            'delivery_zone_id' => $this->deliveryZoneId,
            'pincode_id' => $this->pincodeId,
            'address_type' => $this->addressType,
            'house_no' => $this->houseNo,
            'building_name' => $this->buildingName,
            'floor' => $this->floor,
            'street' => $this->street,
            'landmark' => $this->landmark,
            'address_line_1' => $this->addressLine1,
            'address_line_2' => $this->addressLine2,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'google_place_id' => $this->googlePlaceId,
            'contact_person' => $this->contactPerson,
            'contact_mobile' => $this->contactMobile,
            'delivery_instruction' => $this->deliveryInstruction,
            'is_default' => $this->isDefault,
            'is_verified' => $this->isVerified,
            'status' => $this->status,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'deleted_by' => $this->deletedBy,
        ];
    }
}
