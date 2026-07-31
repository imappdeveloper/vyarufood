<?php

declare(strict_types=1);

namespace App\Http\Resources\Auth;

use App\Support\BaseResource;

class PermissionResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'display_name' => $this->display_name,
            'group' => $this->group,
            'guard_name' => $this->guard_name,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
