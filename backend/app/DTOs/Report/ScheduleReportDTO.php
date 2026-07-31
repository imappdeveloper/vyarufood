<?php

declare(strict_types=1);

namespace App\DTOs\Report;

final class ScheduleReportDTO
{
    public function __construct(
        public readonly string $reportName,
        public readonly string $reportType,
        public readonly string $frequency = 'daily',
        public readonly string $exportFormat = 'pdf',
        public readonly array $emailRecipients = [],
        public readonly array $filters = [],
    ) {
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            reportName: $data['report_name'],
            reportType: $data['report_type'],
            frequency: $data['frequency'] ?? 'daily',
            exportFormat: $data['export_format'] ?? 'pdf',
            emailRecipients: $data['email_recipients'] ?? [],
            filters: $data['filters'] ?? [],
        );
    }

    public function toArray(): array
    {
        return [
            'report_name' => $this->reportName,
            'report_type' => $this->reportType,
            'frequency' => $this->frequency,
            'export_format' => $this->exportFormat,
            'email_recipients' => $this->emailRecipients,
            'filters' => $this->filters,
        ];
    }
}
