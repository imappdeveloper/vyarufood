<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CmsPage\StoreCmsPageRequest;
use App\Http\Requests\CmsPage\UpdateCmsPageRequest;
use App\Http\Resources\CmsPage\CmsPageResource;
use App\Services\CmsPage\CmsPageServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsPageController extends BaseController
{
    public function __construct(
        protected CmsPageServiceInterface $cmsPageService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'page_code', 'search']);
        $perPage = $request->integer('per_page', 25);
        $sort = (string) $request->string('sort', 'created_at');
        $order = (string) $request->string('order', 'desc');

        $pages = $this->cmsPageService->getPaginated($filters, $perPage, $sort, $order);

        return $this->paginatedResponse(CmsPageResource::collection($pages));
    }

    public function store(StoreCmsPageRequest $request): JsonResponse
    {
        $page = $this->cmsPageService->create($request->validated());

        return $this->createdResponse(
            new CmsPageResource($page->fresh(['creator', 'updater'])),
            'CMS page created successfully',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $page = $this->cmsPageService->getByUuid($uuid);

        if (!$page) {
            return $this->notFoundResponse('CMS page not found');
        }

        return $this->successResponse(
            new CmsPageResource($page),
        );
    }

    public function publicShow(string $slug): JsonResponse
    {
        $page = $this->cmsPageService->getBySlug($slug);

        if (!$page || $page->status !== 'published') {
            return $this->notFoundResponse('Page not found');
        }

        return $this->successResponse(
            new CmsPageResource($page),
        );
    }

    public function update(UpdateCmsPageRequest $request, string $uuid): JsonResponse
    {
        $page = $this->cmsPageService->getByUuid($uuid);

        if (!$page) {
            return $this->notFoundResponse('CMS page not found');
        }

        $page = $this->cmsPageService->update($page, $request->validated());

        return $this->successResponse(
            new CmsPageResource($page),
            'CMS page updated successfully',
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $page = $this->cmsPageService->getByUuid($uuid);

        if (!$page) {
            return $this->notFoundResponse('CMS page not found');
        }

        $this->cmsPageService->delete($page);

        return $this->successResponse(null, 'CMS page deleted successfully');
    }

    public function publish(string $uuid): JsonResponse
    {
        $page = $this->cmsPageService->getByUuid($uuid);

        if (!$page) {
            return $this->notFoundResponse('CMS page not found');
        }

        $page = $this->cmsPageService->publish($page);

        return $this->successResponse(
            new CmsPageResource($page),
            'CMS page published successfully',
        );
    }

    public function archive(string $uuid): JsonResponse
    {
        $page = $this->cmsPageService->getByUuid($uuid);

        if (!$page) {
            return $this->notFoundResponse('CMS page not found');
        }

        $page = $this->cmsPageService->archive($page);

        return $this->successResponse(
            new CmsPageResource($page),
            'CMS page archived successfully',
        );
    }

    public function stats(): JsonResponse
    {
        $statusCount = $this->cmsPageService->getStatusCount();

        return $this->successResponse([
            'status_counts' => $statusCount,
            'total' => array_sum($statusCount),
        ]);
    }
}
