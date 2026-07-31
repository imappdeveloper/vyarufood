<?php

declare(strict_types=1);

namespace App\Http\Resources\Meal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'type_code' => $this->type_code,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'display_order' => $this->display_order,
            'icon' => $this->icon,
            'image' => $this->image,
            'color_code' => $this->color_code,
            'status' => $this->status instanceof \App\Enums\StatusEnum ? $this->status->value : $this->status,
            'status_label' => $this->status instanceof \App\Enums\StatusEnum ? $this->status->label() : ucfirst($this->status ?? ''),
            'is_default' => $this->is_default,
            'remarks' => $this->remarks,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->name),
        ];
    }
}
