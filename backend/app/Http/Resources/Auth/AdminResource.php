<?php

declare(strict_types=1);

namespace App\Http\Resources\Auth;

use App\Support\BaseResource;

class AdminResource extends BaseResource
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
            'mobile' => $this->mobile,
            'profile_photo' => $this->profile_photo,
            'status' => $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst($this->status),
            'last_login_at' => $this->last_login_at?->toISOString(),
            'last_login_ip' => $this->last_login_ip,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
