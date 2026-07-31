<?php

declare(strict_types=1);

namespace App\DTOs\Finance;

final readonly class BankAccountDTO
{
    public function __construct(
        public string $accountName,
        public string $bankName,
        public string $accountNumber,
        public ?string $ifscCode = null,
        public ?string $branch = null,
        public string $accountType = 'savings',
        public ?int $chartOfAccountId = null,
        public float $openingBalance = 0,
        public bool $isDefault = false,
        public string $status = 'active',
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            accountName: $data['account_name'] ?? '',
            bankName: $data['bank_name'] ?? '',
            accountNumber: $data['account_number'] ?? '',
            ifscCode: $data['ifsc_code'] ?? null,
            branch: $data['branch'] ?? null,
            accountType: $data['account_type'] ?? 'savings',
            chartOfAccountId: isset($data['chart_of_account_id']) ? (int) $data['chart_of_account_id'] : null,
            openingBalance: (float) ($data['opening_balance'] ?? 0),
            isDefault: (bool) ($data['is_default'] ?? false),
            status: $data['status'] ?? 'active',
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'account_name' => $this->accountName,
            'bank_name' => $this->bankName,
            'account_number' => $this->accountNumber,
            'ifsc_code' => $this->ifscCode,
            'branch' => $this->branch,
            'account_type' => $this->accountType,
            'chart_of_account_id' => $this->chartOfAccountId,
            'opening_balance' => $this->openingBalance,
            'is_default' => $this->isDefault,
            'status' => $this->status,
            'remarks' => $this->remarks,
        ];
    }
}
