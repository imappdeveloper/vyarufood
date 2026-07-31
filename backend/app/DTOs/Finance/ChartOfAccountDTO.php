<?php

declare(strict_types=1);

namespace App\DTOs\Finance;

final readonly class ChartOfAccountDTO
{
    public function __construct(
        public string $accountCode,
        public string $accountName,
        public string $accountType,
        public ?int $parentAccountId = null,
        public float $openingBalance = 0,
        public string $currency = 'INR',
        public bool $isSystem = false,
        public string $status = 'active',
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            accountCode: $data['account_code'] ?? '',
            accountName: $data['account_name'] ?? '',
            accountType: $data['account_type'] ?? '',
            parentAccountId: isset($data['parent_account_id']) ? (int) $data['parent_account_id'] : null,
            openingBalance: (float) ($data['opening_balance'] ?? 0),
            currency: $data['currency'] ?? 'INR',
            isSystem: (bool) ($data['is_system'] ?? false),
            status: $data['status'] ?? 'active',
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'account_code' => $this->accountCode,
            'account_name' => $this->accountName,
            'account_type' => $this->accountType,
            'parent_account_id' => $this->parentAccountId,
            'opening_balance' => $this->openingBalance,
            'currency' => $this->currency,
            'is_system' => $this->isSystem,
            'status' => $this->status,
            'remarks' => $this->remarks,
        ];
    }
}
