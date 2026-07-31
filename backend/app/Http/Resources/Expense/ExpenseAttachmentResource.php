<?php

declare(strict_types=1);

namespace App\Http\Resources\Expense;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseAttachmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'expense_id' => $this->expense_id,
            'file_name' => $this->file_name,
            'file_path' => $this->file_path,
            'file_size' => $this->file_size,
            'mime_type' => $this->mime_type,
            'uploaded_by_name' => $this->whenLoaded('uploadedBy', fn () => $this->uploadedBy->full_name ?? null),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
