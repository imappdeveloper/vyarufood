<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\SystemSetting\BulkUpdateSystemSettingRequest;
use App\Http\Requests\SystemSetting\StoreSystemSettingRequest;
use App\Http\Requests\SystemSetting\UpdateSystemSettingRequest;
use App\Http\Resources\SystemSetting\SystemSettingResource;
use App\Models\SystemSetting;
use App\Services\SystemSetting\SystemSettingServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends BaseController
{
    public function __construct(
        protected SystemSettingServiceInterface $settingService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['group', 'status', 'data_type', 'is_encrypted', 'search']);
        $perPage = $request->integer('per_page', 25);
        $sort = (string) $request->string('sort', 'setting_key');
        $order = (string) $request->string('order', 'asc');

        $settings = $this->settingService->getPaginated($filters, $perPage, $sort, $order);

        return $this->paginatedResponse(SystemSettingResource::collection($settings));
    }

    public function store(StoreSystemSettingRequest $request): JsonResponse
    {
        $setting = $this->settingService->create($request->validated());

        return $this->createdResponse(
            new SystemSettingResource($setting),
            'System setting created successfully',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $setting = $this->settingService->getByUuid($uuid);

        if (!$setting) {
            return $this->notFoundResponse('System setting not found');
        }

        return $this->successResponse(
            new SystemSettingResource($setting),
        );
    }

    public function update(UpdateSystemSettingRequest $request, string $uuid): JsonResponse
    {
        $setting = $this->settingService->getByUuid($uuid);

        if (!$setting) {
            return $this->notFoundResponse('System setting not found');
        }

        $setting = $this->settingService->update($setting, $request->validated());

        return $this->successResponse(
            new SystemSettingResource($setting),
            'System setting updated successfully',
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $setting = $this->settingService->getByUuid($uuid);

        if (!$setting) {
            return $this->notFoundResponse('System setting not found');
        }

        $this->settingService->delete($setting);

        return $this->successResponse(null, 'System setting deleted successfully');
    }

    public function bulkUpdate(BulkUpdateSystemSettingRequest $request): JsonResponse
    {
        $results = $this->settingService->bulkUpdate($request->validated('settings'));

        return $this->successResponse($results, 'Settings bulk updated successfully');
    }

    public function groups(): JsonResponse
    {
        $groups = $this->settingService->getGroupCount();
        $statusCount = $this->settingService->getStatusCount();

        return $this->successResponse([
            'groups' => $groups,
            'status_counts' => $statusCount,
        ]);
    }

    public function getByGroup(string $group): JsonResponse
    {
        $settings = $this->settingService->getByGroup($group);

        return $this->successResponse(
            SystemSettingResource::collection($settings),
        );
    }
}
