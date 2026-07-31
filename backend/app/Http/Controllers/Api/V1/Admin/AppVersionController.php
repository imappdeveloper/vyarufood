<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\AppVersion\StoreAppVersionRequest;
use App\Http\Requests\AppVersion\UpdateAppVersionRequest;
use App\Http\Resources\AppVersion\AppVersionResource;
use App\Services\AppVersion\AppVersionServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppVersionController extends BaseController
{
    public function __construct(
        protected AppVersionServiceInterface $versionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['platform', 'status', 'search']);
        $perPage = $request->integer('per_page', 25);
        $sort = (string) $request->string('sort', 'version_code');
        $order = (string) $request->string('order', 'desc');

        $versions = $this->versionService->getPaginated($filters, $perPage, $sort, $order);

        return $this->paginatedResponse(AppVersionResource::collection($versions));
    }

    public function store(StoreAppVersionRequest $request): JsonResponse
    {
        $version = $this->versionService->create($request->validated());

        return $this->createdResponse(
            new AppVersionResource($version),
            'App version created successfully',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $version = $this->versionService->getByUuid($uuid);

        if (!$version) {
            return $this->notFoundResponse('App version not found');
        }

        return $this->successResponse(
            new AppVersionResource($version),
        );
    }

    public function update(UpdateAppVersionRequest $request, string $uuid): JsonResponse
    {
        $version = $this->versionService->getByUuid($uuid);

        if (!$version) {
            return $this->notFoundResponse('App version not found');
        }

        $version = $this->versionService->update($version, $request->validated());

        return $this->successResponse(
            new AppVersionResource($version),
            'App version updated successfully',
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $version = $this->versionService->getByUuid($uuid);

        if (!$version) {
            return $this->notFoundResponse('App version not found');
        }

        $this->versionService->delete($version);

        return $this->successResponse(null, 'App version deleted successfully');
    }

    public function setStatus(Request $request, string $uuid): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:active,inactive,deprecated'],
        ]);

        $version = $this->versionService->getByUuid($uuid);

        if (!$version) {
            return $this->notFoundResponse('App version not found');
        }

        $version = $this->versionService->setStatus($version, $request->input('status'));

        return $this->successResponse(
            new AppVersionResource($version),
            'App version status updated successfully',
        );
    }

    public function latestForPlatform(string $platform): JsonResponse
    {
        $version = $this->versionService->getLatestForPlatform($platform);

        if (!$version) {
            return $this->notFoundResponse("No app version found for platform: {$platform}");
        }

        return $this->successResponse(
            new AppVersionResource($version),
        );
    }

    public function checkOutdated(Request $request): JsonResponse
    {
        $request->validate([
            'platform' => ['required', 'string', 'in:android,ios,web'],
            'current_version' => ['required', 'string'],
        ]);

        $outdated = $this->versionService->checkOutdated(
            $request->input('platform'),
            $request->input('current_version'),
        );

        return $this->successResponse([
            'is_outdated' => $outdated !== null,
            'latest_version' => $outdated ? new AppVersionResource($outdated) : null,
            'force_update' => $outdated?->force_update ?? false,
        ]);
    }

    public function stats(): JsonResponse
    {
        return $this->successResponse([
            'platform_counts' => $this->versionService->getPlatformCount(),
            'status_counts' => $this->versionService->getStatusCount(),
        ]);
    }
}
