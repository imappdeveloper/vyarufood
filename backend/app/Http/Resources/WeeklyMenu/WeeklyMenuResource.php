<?php

declare(strict_types=1);

namespace App\Http\Resources\WeeklyMenu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeeklyMenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'kitchen_id' => $this->kitchen_id,
            'title' => $this->title,
            'description' => $this->description,
            'week_start_date' => $this->week_start_date?->format('Y-m-d'),
            'week_end_date' => $this->week_end_date?->format('Y-m-d'),
            'status' => $this->status,
            'status_label' => ucfirst($this->status ?? ''),
            'published_at' => $this->published_at?->toISOString(),
            'cut_off_hours' => $this->cut_off_hours,
            'duration_days' => $this->when(
                $this->week_start_date && $this->week_end_date,
                fn () => $this->week_start_date->diffInDays($this->week_end_date) + 1
            ),
            'is_published' => $this->status === 'published',
            'is_editable' => $this->status === 'draft',
            'kitchen_name' => $this->whenLoaded('kitchen', fn () => $this->kitchen->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'kitchen' => $this->whenLoaded('kitchen', fn () => [
                'id' => $this->kitchen->id,
                'uuid' => $this->kitchen->uuid,
                'name' => $this->kitchen->name,
                'kitchen_code' => $this->kitchen->kitchen_code,
            ]),
            'items' => WeeklyMenuItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
