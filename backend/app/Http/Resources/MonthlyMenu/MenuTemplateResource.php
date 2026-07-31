<?php

declare(strict_types=1);

namespace App\Http\Resources\MonthlyMenu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'template_name' => $this->template_name,
            'description' => $this->description,
            'kitchen_id' => $this->kitchen_id,
            'is_default' => $this->is_default,
            'status' => $this->status,
            'status_label' => ucfirst($this->status ?? ''),
            'items_count' => $this->whenCounted('items'),
            'kitchen_name' => $this->whenLoaded('kitchen', fn () => $this->kitchen->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'kitchen' => $this->whenLoaded('kitchen', fn () => [
                'id' => $this->kitchen->id,
                'uuid' => $this->kitchen->uuid,
                'name' => $this->kitchen->name,
                'kitchen_code' => $this->kitchen->kitchen_code,
            ]),
            'items' => MenuTemplateItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
