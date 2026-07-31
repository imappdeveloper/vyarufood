<?php

declare(strict_types=1);

namespace App\Http\Resources\MonthlyMenu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MonthlyMenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'month' => $this->month,
            'year' => $this->year,
            'month_name' => $this->when(
                $this->month,
                fn () => now()->setMonth($this->month)->format('F')
            ),
            'kitchen_id' => $this->kitchen_id,
            'title' => $this->title,
            'description' => $this->description,
            'menu_template_id' => $this->menu_template_id,
            'status' => $this->status,
            'status_label' => ucfirst($this->status ?? ''),
            'published_at' => $this->published_at?->toISOString(),
            'published_by' => $this->published_by,
            'approved_at' => $this->approved_at?->toISOString(),
            'approved_by' => $this->approved_by,
            'is_published' => $this->status === 'published',
            'is_approved' => $this->status === 'approved',
            'is_editable' => in_array($this->status, ['draft', 'archived']),
            'days_in_month' => $this->when(
                $this->month && $this->year,
                fn () => (int) cal_days_in_month(CAL_GREGORIAN, $this->month, $this->year)
            ),
            'items_count' => $this->whenCounted('items'),
            'kitchen_name' => $this->whenLoaded('kitchen', fn () => $this->kitchen->name),
            'template_name' => $this->whenLoaded('menuTemplate', fn () => $this->menuTemplate->template_name),
            'published_by_name' => $this->whenLoaded('publishedBy', fn () => $this->publishedBy->name),
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->approvedBy->name),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'kitchen' => $this->whenLoaded('kitchen', fn () => [
                'id' => $this->kitchen->id,
                'uuid' => $this->kitchen->uuid,
                'name' => $this->kitchen->name,
                'kitchen_code' => $this->kitchen->kitchen_code,
            ]),
            'menu_template' => $this->whenLoaded('menuTemplate', fn () => [
                'id' => $this->menuTemplate->id,
                'uuid' => $this->menuTemplate->uuid,
                'template_name' => $this->menuTemplate->template_name,
            ]),
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->name),
            'items' => MonthlyMenuItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
