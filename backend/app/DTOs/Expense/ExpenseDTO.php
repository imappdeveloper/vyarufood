<?php

declare(strict_types=1);

namespace App\DTOs\Expense;

final readonly class ExpenseDTO
{
    public function __construct(
        public string $expenseNumber,
        public int $expenseCategoryId,
        public string $expenseDate,
        public string $expenseTitle,
        public ?string $expenseDescription = null,
        public ?string $vendorName = null,
        public ?int $supplierId = null,
        public float $amount = 0,
        public float $taxAmount = 0,
        public float $discountAmount = 0,
        public float $totalAmount = 0,
        public string $paymentMethod = 'cash',
        public ?string $paymentAccount = null,
        public ?string $transactionReference = null,
        public ?string $invoiceNumber = null,
        public ?string $invoiceDate = null,
        public ?string $billAttachment = null,
        public bool $isRecurring = false,
        public ?string $recurringFrequency = null,
        public ?string $nextDueDate = null,
        public string $approvalStatus = 'draft',
        public string $expenseStatus = 'draft',
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            expenseNumber: $data['expense_number'] ?? '',
            expenseCategoryId: (int) ($data['expense_category_id'] ?? 0),
            expenseDate: $data['expense_date'] ?? '',
            expenseTitle: $data['expense_title'] ?? '',
            expenseDescription: $data['expense_description'] ?? null,
            vendorName: $data['vendor_name'] ?? null,
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            amount: (float) ($data['amount'] ?? 0),
            taxAmount: (float) ($data['tax_amount'] ?? 0),
            discountAmount: (float) ($data['discount_amount'] ?? 0),
            totalAmount: (float) ($data['total_amount'] ?? 0),
            paymentMethod: $data['payment_method'] ?? 'cash',
            paymentAccount: $data['payment_account'] ?? null,
            transactionReference: $data['transaction_reference'] ?? null,
            invoiceNumber: $data['invoice_number'] ?? null,
            invoiceDate: $data['invoice_date'] ?? null,
            billAttachment: $data['bill_attachment'] ?? null,
            isRecurring: (bool) ($data['is_recurring'] ?? false),
            recurringFrequency: $data['recurring_frequency'] ?? null,
            nextDueDate: $data['next_due_date'] ?? null,
            approvalStatus: $data['approval_status'] ?? 'draft',
            expenseStatus: $data['expense_status'] ?? 'draft',
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'expense_number' => $this->expenseNumber,
            'expense_category_id' => $this->expenseCategoryId,
            'expense_date' => $this->expenseDate,
            'expense_title' => $this->expenseTitle,
            'expense_description' => $this->expenseDescription,
            'vendor_name' => $this->vendorName,
            'supplier_id' => $this->supplierId,
            'amount' => $this->amount,
            'tax_amount' => $this->taxAmount,
            'discount_amount' => $this->discountAmount,
            'total_amount' => $this->totalAmount,
            'payment_method' => $this->paymentMethod,
            'payment_account' => $this->paymentAccount,
            'transaction_reference' => $this->transactionReference,
            'invoice_number' => $this->invoiceNumber,
            'invoice_date' => $this->invoiceDate,
            'bill_attachment' => $this->billAttachment,
            'is_recurring' => $this->isRecurring,
            'recurring_frequency' => $this->recurringFrequency,
            'next_due_date' => $this->nextDueDate,
            'approval_status' => $this->approvalStatus,
            'expense_status' => $this->expenseStatus,
            'remarks' => $this->remarks,
        ];
    }
}
