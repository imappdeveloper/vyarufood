<?php

declare(strict_types=1);

namespace App\Http\Resources\Recipe;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeVersionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'recipe_id' => $this->recipe_id,
            'version' => $this->version,
            'approved_by' => $this->approved_by,
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->approvedBy->name),
            'approved_at' => $this->approved_at?->toISOString(),
            'change_notes' => $this->change_notes,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
