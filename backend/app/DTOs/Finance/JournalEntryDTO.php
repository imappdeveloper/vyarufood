<?php

declare(strict_types=1);

namespace App\DTOs\Finance;

final readonly class JournalEntryDTO
{
    public function __construct(
        public string $journalDate,
        public int $financialYearId,
        public ?string $referenceType = null,
        public ?int $referenceId = null,
        public ?string $description = null,
        public array $lines = [],
        public string $postingStatus = 'draft',
    ) {}

    public static function fromArray(array $data): self
    {
        $lines = [];
        if (isset($data['lines']) && is_array($data['lines'])) {
            foreach ($data['lines'] as $line) {
                $lines[] = JournalEntryLineDTO::fromArray($line);
            }
        }

        return new self(
            journalDate: $data['journal_date'] ?? '',
            financialYearId: (int) ($data['financial_year_id'] ?? 0),
            referenceType: $data['reference_type'] ?? null,
            referenceId: isset($data['reference_id']) ? (int) $data['reference_id'] : null,
            description: $data['description'] ?? null,
            lines: $lines,
            postingStatus: $data['posting_status'] ?? 'draft',
        );
    }

    public function toArray(): array
    {
        $lines = [];
        foreach ($this->lines as $line) {
            $lines[] = $line->toArray();
        }

        return [
            'journal_date' => $this->journalDate,
            'financial_year_id' => $this->financialYearId,
            'reference_type' => $this->referenceType,
            'reference_id' => $this->referenceId,
            'description' => $this->description,
            'lines' => $lines,
            'posting_status' => $this->postingStatus,
        ];
    }
}
