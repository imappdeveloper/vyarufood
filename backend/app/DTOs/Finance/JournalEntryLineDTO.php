<?php

declare(strict_types=1);

namespace App\DTOs\Finance;

final readonly class JournalEntryLineDTO
{
    public function __construct(
        public int $accountId,
        public float $debitAmount = 0,
        public float $creditAmount = 0,
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            accountId: (int) ($data['account_id'] ?? 0),
            debitAmount: (float) ($data['debit_amount'] ?? 0),
            creditAmount: (float) ($data['credit_amount'] ?? 0),
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'account_id' => $this->accountId,
            'debit_amount' => $this->debitAmount,
            'credit_amount' => $this->creditAmount,
            'remarks' => $this->remarks,
        ];
    }
}
