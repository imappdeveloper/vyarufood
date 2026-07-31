<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\SystemBackup\SystemBackupResource;
use App\Services\SystemBackup\SystemBackupServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemBackupController extends BaseController
{
    public function __construct(
        protected SystemBackupServiceInterface $backupService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['backup_type', 'status', 'search']);
        $perPage = $request->integer('per_page', 25);
        $sort = (string) $request->string('sort', 'created_at');
        $order = (string) $request->string('order', 'desc');

        $backups = $this->backupService->getPaginated($filters, $perPage, $sort, $order);

        return $this->paginatedResponse(SystemBackupResource::collection($backups));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'backup_name' => ['required', 'string', 'max:255'],
            'backup_type' => ['required', 'string', 'in:database,storage,full'],
        ]);

        $backup = $this->backupService->createBackup($request->only(['backup_name', 'backup_type']));

        return $this->createdResponse(
            new SystemBackupResource($backup),
            'Backup initiated successfully',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $backup = $this->backupService->getByUuid($uuid);

        if (!$backup) {
            return $this->notFoundResponse('Backup not found');
        }

        return $this->successResponse(
            new SystemBackupResource($backup),
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $backup = $this->backupService->getByUuid($uuid);

        if (!$backup) {
            return $this->notFoundResponse('Backup not found');
        }

        $this->backupService->delete($backup);

        return $this->successResponse(null, 'Backup deleted successfully');
    }

    public function stats(): JsonResponse
    {
        return $this->successResponse([
            'status_counts' => $this->backupService->getStatusCount(),
            'type_counts' => $this->backupService->getTypeCount(),
            'total_size' => $this->backupService->getTotalSize(),
        ]);
    }
}
