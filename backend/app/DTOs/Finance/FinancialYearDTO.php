<?php

declare(strict_types=1);

namespace App\DTOs\Finance;

final readonly class FinancialYearDTO
{
    public function __construct(
        public string $yearName,
        public string $startDate,
        public string $endDate,
        public bool $isCurrent = false,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            yearName: $data['year_name'] ?? '',
            startDate: $data['start_date'] ?? '',
            endDate: $data['end_date'] ?? '',
            isCurrent: (bool) ($data['is_current'] ?? false),
        );
    }

    public function toArray(): array
    {
        return [
            'year_name' => $this->yearName,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'is_current' => $this->isCurrent,
        ];
    }
}
