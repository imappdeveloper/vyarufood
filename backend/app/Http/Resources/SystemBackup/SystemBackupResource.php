<?php

declare(strict_types=1);

namespace App\Http\Resources\SystemBackup;

use App\Support\BaseResource;

class SystemBackupResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'backup_name' => $this->backup_name,
            'backup_type' => $this->backup_type,
            'backup_type_label' => ucfirst(str_replace('_', ' ', $this->backup_type)),
            'file_path' => $this->file_path,
            'file_size' => $this->file_size,
            'file_size_formatted' => $this->formatBytes($this->file_size),
            'status' => $this->status,
            'status_label' => ucfirst(str_replace('_', ' ', $this->status)),
            'started_at' => $this->started_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'error_message' => $this->error_message,
            'duration' => $this->started_at && $this->completed_at
                ? $this->started_at->diffForHumans($this->completed_at, true)
                : null,
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('creator', fn () => $this->creator->name),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
