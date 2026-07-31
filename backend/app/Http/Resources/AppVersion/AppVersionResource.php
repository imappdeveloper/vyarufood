<?php

declare(strict_types=1);

namespace App\Http\Resources\AppVersion;

use App\Support\BaseResource;

class AppVersionResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'platform' => $this->platform,
            'version_name' => $this->version_name,
            'version_code' => $this->version_code,
            'minimum_supported_version' => $this->minimum_supported_version,
            'force_update' => $this->force_update,
            'release_notes' => $this->release_notes,
            'status' => $this->status,
            'status_label' => ucfirst($this->status),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
