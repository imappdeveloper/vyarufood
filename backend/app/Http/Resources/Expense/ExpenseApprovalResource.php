<?php

declare(strict_types=1);

namespace App\Http\Resources\Expense;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseApprovalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'expense_id' => $this->expense_id,
            'approval_level' => $this->approval_level,
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->approvedBy->full_name ?? null),
            'approval_status' => $this->approval_status,
            'approval_date' => $this->approval_date?->toISOString(),
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
