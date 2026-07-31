<?php

declare(strict_types=1);

namespace App\DTOs\City;

final class CityDTO
{
    public function __construct(
        public readonly int $countryId,
        public readonly int $stateId,
        public readonly string $name,
        public readonly string $cityCode,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?string $timezone = null,
        public readonly ?int $population = null,
        public readonly ?string $pincode = null,
        public readonly ?float $area = null,
        public readonly int $displayOrder = 0,
        public readonly bool $isMetro = false,
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
            name: $data['name'] ?? '',
            cityCode: $data['city_code'] ?? '',
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            timezone: $data['timezone'] ?? null,
            population: isset($data['population']) ? (int) $data['population'] : null,
            pincode: $data['pincode'] ?? null,
            area: isset($data['area']) ? (float) $data['area'] : null,
            displayOrder: (int) ($data['display_order'] ?? $data['sort_order'] ?? 0),
            isMetro: (bool) ($data['is_metro'] ?? false),
            status: $data['status'] ?? 'active',
            isDefault: (bool) ($data['is_default'] ?? false),
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'country_id' => $this->countryId,
            'state_id' => $this->stateId,
            'name' => $this->name,
            'city_code' => $this->cityCode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'timezone' => $this->timezone,
            'population' => $this->population,
            'pincode' => $this->pincode,
            'area' => $this->area,
            'display_order' => $this->displayOrder,
            'is_metro' => $this->isMetro,
            'status' => $this->status,
            'is_default' => $this->isDefault,
            'remarks' => $this->remarks,
        ];
    }
}
