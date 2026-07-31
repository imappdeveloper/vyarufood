<?php

declare(strict_types=1);

namespace App\DTOs\Country;

final class CountryDTO
{
    public function __construct(
        public readonly string $iso2,
        public readonly string $iso3,
        public readonly string $name,
        public readonly ?string $numericCode = null,
        public readonly ?string $phoneCode = null,
        public readonly ?string $nativeName = null,
        public readonly ?string $capital = null,
        public readonly ?string $currencyCode = null,
        public readonly ?string $currencySymbol = null,
        public readonly ?string $currencyName = null,
        public readonly ?string $emoji = null,
        public readonly ?string $emojiUnicode = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?string $region = null,
        public readonly ?string $subregion = null,
        public readonly ?string $nationality = null,
        public readonly ?string $flagImage = null,
        public readonly string $status = 'active',
        public readonly int $sortOrder = 0,
        public readonly bool $isDefault = false,
        public readonly ?string $remarks = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            iso2: strtoupper($data['iso2'] ?? ''),
            iso3: strtoupper($data['iso3'] ?? ''),
            name: $data['name'] ?? '',
            numericCode: $data['numeric_code'] ?? null,
            phoneCode: $data['phone_code'] ?? null,
            nativeName: $data['native_name'] ?? null,
            capital: $data['capital'] ?? null,
            currencyCode: $data['currency_code'] ?? null,
            currencySymbol: $data['currency_symbol'] ?? null,
            currencyName: $data['currency_name'] ?? null,
            emoji: $data['emoji'] ?? null,
            emojiUnicode: $data['emoji_unicode'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            region: $data['region'] ?? null,
            subregion: $data['subregion'] ?? null,
            nationality: $data['nationality'] ?? null,
            flagImage: $data['flag_image'] ?? null,
            status: $data['status'] ?? 'active',
            sortOrder: (int) ($data['sort_order'] ?? 0),
            isDefault: (bool) ($data['is_default'] ?? false),
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'iso2' => $this->iso2,
            'iso3' => $this->iso3,
            'name' => $this->name,
            'numeric_code' => $this->numericCode,
            'phone_code' => $this->phoneCode,
            'native_name' => $this->nativeName,
            'capital' => $this->capital,
            'currency_code' => $this->currencyCode,
            'currency_symbol' => $this->currencySymbol,
            'currency_name' => $this->currencyName,
            'emoji' => $this->emoji,
            'emoji_unicode' => $this->emojiUnicode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'region' => $this->region,
            'subregion' => $this->subregion,
            'nationality' => $this->nationality,
            'flag_image' => $this->flagImage,
            'status' => $this->status,
            'sort_order' => $this->sortOrder,
            'is_default' => $this->isDefault,
            'remarks' => $this->remarks,
        ];
    }
}
