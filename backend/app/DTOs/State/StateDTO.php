<?php

declare(strict_types=1);

namespace App\DTOs\State;

final class StateDTO
{
    public function __construct(
        public readonly int $countryId,
        public readonly string $name,
        public readonly ?string $stateCode = null,
        public readonly ?string $abbreviation = null,
        public readonly ?string $gstCode = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly string $status = 'active',
        public readonly int $sortOrder = 0,
        public readonly bool $isDefault = false,
        public readonly ?string $remarks = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            countryId: (int) ($data['country_id'] ?? 0),
            name: $data['name'] ?? '',
            stateCode: $data['state_code'] ?? null,
            abbreviation: $data['abbreviation'] ?? null,
            gstCode: $data['gst_code'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            status: $data['status'] ?? 'active',
            sortOrder: (int) ($data['sort_order'] ?? 0),
            isDefault: (bool) ($data['is_default'] ?? false),
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'country_id' => $this->countryId,
            'name' => $this->name,
            'state_code' => $this->stateCode,
            'abbreviation' => $this->abbreviation,
            'gst_code' => $this->gstCode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'sort_order' => $this->sortOrder,
            'is_default' => $this->isDefault,
            'remarks' => $this->remarks,
        ];
    }
}
