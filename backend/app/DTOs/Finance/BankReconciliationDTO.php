<?php

declare(strict_types=1);

namespace App\DTOs\Finance;

final readonly class BankReconciliationDTO
{
    public function __construct(
        public int $bankAccountId,
        public string $reconciliationDate,
        public string $statementDate,
        public float $openingBalance = 0,
        public float $closingBalance = 0,
        public float $totalDeposits = 0,
        public float $totalWithdrawals = 0,
        public float $adjustedBalance = 0,
        public float $difference = 0,
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            bankAccountId: (int) ($data['bank_account_id'] ?? 0),
            reconciliationDate: $data['reconciliation_date'] ?? '',
            statementDate: $data['statement_date'] ?? '',
            openingBalance: (float) ($data['opening_balance'] ?? 0),
            closingBalance: (float) ($data['closing_balance'] ?? 0),
            totalDeposits: (float) ($data['total_deposits'] ?? 0),
            totalWithdrawals: (float) ($data['total_withdrawals'] ?? 0),
            adjustedBalance: (float) ($data['adjusted_balance'] ?? 0),
            difference: (float) ($data['difference'] ?? 0),
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'bank_account_id' => $this->bankAccountId,
            'reconciliation_date' => $this->reconciliationDate,
            'statement_date' => $this->statementDate,
            'opening_balance' => $this->openingBalance,
            'closing_balance' => $this->closingBalance,
            'total_deposits' => $this->totalDeposits,
            'total_withdrawals' => $this->totalWithdrawals,
            'adjusted_balance' => $this->adjustedBalance,
            'difference' => $this->difference,
            'remarks' => $this->remarks,
        ];
    }
}
