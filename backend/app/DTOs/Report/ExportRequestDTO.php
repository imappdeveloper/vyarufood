<?php

declare(strict_types=1);

namespace App\DTOs\Report;

final class ExportRequestDTO
{
    public function __construct(
        public readonly string $reportType,
        public readonly string $format = 'pdf',
        public readonly array $filters = [],
        public readonly ?string $filename = null,
    ) {
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            reportType: $data['report_type'],
            format: $data['format'] ?? 'pdf',
            filters: $data['filters'] ?? [],
            filename: $data['filename'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'report_type' => $this->reportType,
            'format' => $this->format,
            'filters' => $this->filters,
            'filename' => $this->filename,
        ];
    }
}
