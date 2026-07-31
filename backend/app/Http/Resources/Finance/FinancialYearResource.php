<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FinancialYearResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'year_name' => $this->year_name,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'is_current' => $this->is_current,
            'is_closed' => $this->is_closed,
            'closed_by_name' => $this->whenLoaded('closedBy', fn () => $this->closedBy->full_name ?? null),
            'closed_at' => $this->closed_at?->toISOString(),
            'closing_remarks' => $this->closing_remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name ?? null),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
