<?php

declare(strict_types=1);

namespace App\Jobs\Report;

use App\Models\Report\ReportExport;
use App\Repositories\Report\ReportExportRepositoryInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExportReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(
        public int $exportId,
        public array $exportData,
    ) {}

    public function handle(ReportExportRepositoryInterface $exportRepo): void
    {
        Log::info('Processing ExportReportJob', ['export_id' => $this->exportId]);

        $export = $exportRepo->findById($this->exportId);

        if (! $export) {
            Log::error('Export record not found', ['export_id' => $this->exportId]);
            return;
        }

        try {
            $reportType = $this->exportData['report_type'] ?? 'general';
            $format = $this->exportData['format'] ?? 'pdf';
            $filename = "{$reportType}_export_" . now()->format('Y_m_d_His') . ".{$format}";

            $directory = "reports/{$reportType}";
            $filePath = "{$directory}/{$filename}";

            $content = json_encode([
                'report_type' => $reportType,
                'format' => $format,
                'generated_at' => now()->toISOString(),
                'data' => [],
            ], JSON_PRETTY_PRINT);

            Storage::disk('local')->put($filePath, $content);

            $export->update([
                'file_path' => $filePath,
            ]);

            Log::info('ExportReportJob completed', [
                'export_id' => $this->exportId,
                'file_path' => $filePath,
            ]);
        } catch (\Exception $e) {
            Log::error('ExportReportJob failed', [
                'export_id' => $this->exportId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ExportReportJob permanently failed', [
            'export_id' => $this->exportId,
            'error' => $exception->getMessage(),
        ]);
    }
}
