<?php

declare(strict_types=1);

namespace App\Http\Resources\Expense;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'expense_number' => $this->expense_number,
            'expense_category_id' => $this->expense_category_id,
            'category_name' => $this->whenLoaded('category', fn () => $this->category->category_name ?? null),
            'category_icon' => $this->whenLoaded('category', fn () => $this->category->icon ?? null),
            'expense_date' => $this->expense_date?->toDateString(),
            'expense_title' => $this->expense_title,
            'expense_description' => $this->expense_description,
            'vendor_name' => $this->vendor_name,
            'supplier_id' => $this->supplier_id,
            'supplier_name' => $this->whenLoaded('supplier', fn () => $this->supplier->supplier_name ?? null),
            'amount' => (float) $this->amount,
            'tax_amount' => (float) $this->tax_amount,
            'discount_amount' => (float) $this->discount_amount,
            'total_amount' => (float) $this->total_amount,
            'payment_method' => $this->payment_method,
            'payment_account' => $this->payment_account,
            'transaction_reference' => $this->transaction_reference,
            'invoice_number' => $this->invoice_number,
            'invoice_date' => $this->invoice_date?->toDateString(),
            'bill_attachment' => $this->bill_attachment,
            'is_recurring' => $this->is_recurring,
            'recurring_frequency' => $this->recurring_frequency,
            'next_due_date' => $this->next_due_date?->toDateString(),
            'approval_status' => $this->approval_status,
            'expense_status' => $this->expense_status,
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->approvedBy->full_name ?? null),
            'approved_at' => $this->approved_at?->toISOString(),
            'remarks' => $this->remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name ?? null),
            'attachments' => ExpenseAttachmentResource::collection($this->whenLoaded('attachments')),
            'approvals' => ExpenseApprovalResource::collection($this->whenLoaded('approvals')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
