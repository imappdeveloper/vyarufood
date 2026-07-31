<?php

declare(strict_types=1);

namespace App\Http\Resources\Expense;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'category_code' => $this->category_code,
            'category_name' => $this->category_name,
            'parent_category_id' => $this->parent_category_id,
            'parent_category_name' => $this->whenLoaded('parentCategory', fn () => $this->parentCategory->category_name ?? null),
            'icon' => $this->icon,
            'color' => $this->color,
            'is_recurring' => $this->is_recurring,
            'is_taxable' => $this->is_taxable,
            'status' => $this->status,
            'display_order' => $this->display_order,
            'remarks' => $this->remarks,
            'children_count' => $this->whenCounted('childCategories'),
            'expenses_count' => $this->whenCounted('expenses'),
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name ?? null),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
