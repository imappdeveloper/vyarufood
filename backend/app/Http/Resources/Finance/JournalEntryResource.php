<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JournalEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'journal_number' => $this->journal_number,
            'journal_date' => $this->journal_date?->toDateString(),
            'financial_year_id' => $this->financial_year_id,
            'financial_year_name' => $this->whenLoaded('financialYear', fn () => $this->financialYear->year_name ?? null),
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'description' => $this->description,
            'total_debit' => (float) $this->total_debit,
            'total_credit' => (float) $this->total_credit,
            'posting_status' => $this->posting_status,
            'posted_by' => $this->posted_by,
            'posted_by_name' => $this->whenLoaded('postedBy', fn () => $this->postedBy->full_name ?? null),
            'posted_at' => $this->posted_at?->toISOString(),
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name ?? null),
            'lines' => JournalEntryLineResource::collection($this->whenLoaded('lines')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
