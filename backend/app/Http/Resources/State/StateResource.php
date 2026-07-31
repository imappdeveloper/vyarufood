<?php

declare(strict_types=1);

namespace App\Http\Resources\State;

use App\Support\BaseResource;

class StateResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'country_id' => $this->country_id,
            'country' => new \App\Http\Resources\Country\CountryResource($this->whenLoaded('country')),
            'name' => $this->name,
            'state_code' => $this->state_code,
            'abbreviation' => $this->abbreviation,
            'gst_code' => $this->gst_code,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
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
