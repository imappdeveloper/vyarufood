<?php

declare(strict_types=1);

namespace App\Http\Resources\Customer;

use App\Support\BaseResource;

class CustomerResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'country_code' => $this->country_code,
            'profile_photo' => $this->profile_photo,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'pincode' => $this->pincode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst($this->status ?? ''),
            'is_blocked' => $this->is_blocked,
            'block_reason' => $this->block_reason,
            'wallet_balance' => $this->wallet_balance,
            'wallet_currency' => $this->wallet_currency,
            'referral_code' => $this->referral_code,
            'email_verified' => $this->email_verified,
            'phone_verified' => $this->phone_verified,
            'last_login_at' => $this->last_login_at?->toISOString(),
            'last_login_ip' => $this->last_login_ip,
            'country' => new \App\Http\Resources\Country\CountryResource($this->whenLoaded('country')),
            'state' => new \App\Http\Resources\State\StateResource($this->whenLoaded('state')),
            'city' => new \App\Http\Resources\City\CityResource($this->whenLoaded('city')),
            'area' => new \App\Http\Resources\Area\AreaResource($this->whenLoaded('area')),
            'referrer' => new self($this->whenLoaded('referrer')),
            'referralsCount' => $this->whenCounted('referrals'),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}
