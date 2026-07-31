<?php

declare(strict_types=1);

namespace App\Http\Resources\Auth;

use App\Support\BaseResource;

class RoleResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'display_name' => $this->display_name,
            'description' => $this->description,
            'guard_name' => $this->guard_name,
            'is_default' => $this->is_default,
            'sort_order' => $this->sort_order,
            'admins_count' => $this->whenCounted('admins'),
            'permissions' => $this->whenLoaded('permissions', function () {
                return $this->permissions->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'display_name' => $p->display_name,
                    'group' => $p->group,
                ]);
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
