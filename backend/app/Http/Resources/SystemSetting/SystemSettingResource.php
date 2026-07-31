<?php

declare(strict_types=1);

namespace App\Http\Resources\SystemSetting;

use App\Support\BaseResource;

class SystemSettingResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'setting_group' => $this->setting_group,
            'setting_key' => $this->setting_key,
            'setting_value' => $this->value,
            'raw_value' => $this->setting_value,
            'data_type' => $this->data_type,
            'is_encrypted' => $this->is_encrypted,
            'autoload' => $this->autoload,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updater', fn () => $this->updater->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
