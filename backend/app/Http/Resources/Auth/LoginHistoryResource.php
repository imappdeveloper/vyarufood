<?php

declare(strict_types=1);

namespace App\Http\Resources\Auth;

use App\Support\BaseResource;

class LoginHistoryResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'admin' => $this->whenLoaded('admin', fn () => [
                'id' => $this->admin->id,
                'full_name' => $this->admin->full_name,
                'email' => $this->admin->email,
            ]),
            'ip_address' => $this->ip_address,
            'device' => $this->device,
            'browser' => $this->browser,
            'os' => $this->os,
            'is_successful' => $this->is_successful,
            'failure_reason' => $this->failure_reason,
            'login_at' => $this->login_at?->toISOString(),
            'logout_at' => $this->logout_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
