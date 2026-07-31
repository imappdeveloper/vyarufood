<?php

declare(strict_types=1);

namespace App\Http\Resources\Country;

use App\Support\BaseResource;

class CountryResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'iso2' => $this->iso2,
            'iso3' => $this->iso3,
            'name' => $this->name,
            'numeric_code' => $this->numeric_code,
            'phone_code' => $this->phone_code,
            'native_name' => $this->native_name,
            'capital' => $this->capital,
            'currency_code' => $this->currency_code,
            'currency_symbol' => $this->currency_symbol,
            'currency_name' => $this->currency_name,
            'emoji' => $this->emoji,
            'emoji_unicode' => $this->emoji_unicode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'region' => $this->region,
            'subregion' => $this->subregion,
            'nationality' => $this->nationality,
            'flag_image' => $this->flag_image,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst($this->status),
            'sort_order' => $this->sort_order,
            'is_default' => $this->is_default,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
