<?php

declare(strict_types=1);

namespace App\Services\SystemBackup;

use App\Jobs\RunBackupJob;
use App\Models\SystemBackup;
use App\Repositories\SystemBackup\SystemBackupRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SystemBackupService extends BaseService implements SystemBackupServiceInterface
{
    protected string $moduleName = 'system_backup';

    public function __construct(
        protected SystemBackupRepositoryInterface $backupRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->backupRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        return $this->backupRepo->getAll();
    }

    public function getByUuid(string $uuid): ?SystemBackup
    {
        return $this->backupRepo->findByUuid($uuid);
    }

    public function createBackup(array $data): SystemBackup
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;
            $data['status'] = 'pending';

            $backup = $this->backupRepo->create($data);

            $this->logActivity('backup_created', $backup, [
                'backup_name' => $backup->backup_name,
                'backup_type' => $backup->backup_type,
            ]);

            RunBackupJob::dispatch($backup);

            return $backup;
        });
    }

    public function runBackup(SystemBackup $backup): bool
    {
        $backup->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        try {
            $disk = 'backups';
            $fileName = $backup->backup_name . '.sql.gz';
            $filePath = $backup->backup_type . '/' . $fileName;

            $directory = storage_path('app/backups/' . $backup->backup_type);

            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            $fullPath = $directory . '/' . $fileName;

            if ($backup->backup_type === 'database' || $backup->backup_type === 'full') {
                $this->backupDatabase($fullPath);
            }

            if ($backup->backup_type === 'storage' || $backup->backup_type === 'full') {
                $storagePath = $directory . '/storage_backup.tar.gz';
                $this->backupStorage($storagePath);
            }

            $fileSize = file_exists($fullPath) ? filesize($fullPath) : 0;

            $backup->update([
                'status' => 'completed',
                'file_path' => 'backups/' . $filePath,
                'file_size' => $fileSize,
                'completed_at' => now(),
            ]);

            $this->logActivity('backup_completed', $backup, [
                'backup_name' => $backup->backup_name,
                'file_size' => $fileSize,
            ]);

            return true;
        } catch (\Exception $e) {
            $backup->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            $this->logError('backup_failed', $e, [
                'backup_name' => $backup->backup_name,
            ]);

            return false;
        }
    }

    public function delete(SystemBackup $backup): bool
    {
        return $this->transaction(function () use ($backup) {
            $backupName = $backup->backup_name;

            $result = $this->backupRepo->delete($backup);

            $this->logActivity('backup_deleted', null, [
                'backup_name' => $backupName,
            ]);

            return $result;
        });
    }

    public function getLatestCompleted(?string $type = null): ?SystemBackup
    {
        return $this->backupRepo->getLatestCompleted($type);
    }

    public function getStatusCount(): array
    {
        return $this->backupRepo->getStatusCount();
    }

    public function getTypeCount(): array
    {
        return $this->backupRepo->getTypeCount();
    }

    public function getTotalSize(): int
    {
        return $this->backupRepo->getTotalSize();
    }

    public function search(string $query): Collection
    {
        return $this->backupRepo->search($query);
    }

    public function cleanupOldBackups(int $retentionDays): int
    {
        $oldBackups = $this->backupRepo->getOlderThan($retentionDays);
        $count = 0;

        foreach ($oldBackups as $backup) {
            $this->delete($backup);
            $count++;
        }

        return $count;
    }

    private function backupDatabase(string $path): void
    {
        $db = config('database.connections.mysql');
        $host = $db['host'] ?? '127.0.0.1';
        $port = $db['port'] ?? '3306';
        $database = $db['database'] ?? '';
        $username = $db['username'] ?? '';
        $password = $db['password'] ?? '';

        $cmd = sprintf(
            'mysqldump -h %s -P %s -u %s %s > %s 2>&1',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($database),
            escapeshellarg($path),
        );

        if (!empty($password)) {
            $cmd = sprintf(
                'mysqldump -h %s -P %s -u %s --password=%s %s > %s 2>&1',
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($database),
                escapeshellarg($path),
            );
        }

        exec($cmd, $output, $returnCode);

        if ($returnCode !== 0) {
            throw new \RuntimeException('Database backup failed: ' . implode("\n", $output));
        }
    }

    private function backupStorage(string $path): void
    {
        $storagePath = storage_path('app');

        $cmd = sprintf(
            'tar -czf %s -C %s . 2>&1',
            escapeshellarg($path),
            escapeshellarg($storagePath),
        );

        exec($cmd, $output, $returnCode);

        if ($returnCode !== 0) {
            throw new \RuntimeException('Storage backup failed: ' . implode("\n", $output));
        }
    }
}
