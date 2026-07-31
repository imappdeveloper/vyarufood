<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\DTOs\MonthlyMenu\MenuTemplateDTO;
use App\Http\Requests\MonthlyMenu\StoreMenuTemplateRequest;
use App\Http\Requests\MonthlyMenu\UpdateMenuTemplateRequest;
use App\Http\Resources\MonthlyMenu\MenuTemplateResource;
use App\Models\MenuTemplate;
use App\Services\MonthlyMenu\MenuTemplateServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuTemplateController extends BaseController
{
    public function __construct(
        private MenuTemplateServiceInterface $templateService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', MenuTemplate::class);

            $filters = $request->only([
                'search', 'status', 'kitchen_id', 'is_default',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $templates = $this->templateService->getPaginatedTemplates($filters, $perPage);

            return $this->paginatedResponse(
                MenuTemplateResource::collection($templates),
                'Menu templates retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreMenuTemplateRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', MenuTemplate::class);

            $dto = MenuTemplateDTO::fromArray($request->validated());
            $template = $this->templateService->createTemplate($dto);

            return $this->createdResponse(
                new MenuTemplateResource($template->load('kitchen')),
                'Menu template created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $uuid): JsonResponse
    {
        try {
            $template = MenuTemplate::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $template);

            $template->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType');

            return $this->successResponse(
                new MenuTemplateResource($template),
                'Menu template retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Menu template not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateMenuTemplateRequest $request, string $uuid): JsonResponse
    {
        try {
            $template = MenuTemplate::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $template);

            $dto = MenuTemplateDTO::fromArray($request->validated());
            $template = $this->templateService->updateTemplate($template->id, $dto);

            return $this->successResponse(
                new MenuTemplateResource($template->load('kitchen', 'items')),
                'Menu template updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Menu template not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $template = MenuTemplate::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $template);

            $this->templateService->deleteTemplate($template->id);

            return $this->successResponse(null, 'Menu template deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Menu template not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $template = MenuTemplate::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $template);

            $result = $this->templateService->restoreTemplate($template->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore menu template', 400);
            }

            return $this->successResponse(null, 'Menu template restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Menu template not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function duplicate(string $uuid): JsonResponse
    {
        try {
            $template = MenuTemplate::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('create', MenuTemplate::class);

            $duplicated = $this->templateService->duplicateTemplate($template->id);

            if (! $duplicated) {
                return $this->errorResponse('Failed to duplicate menu template', 400);
            }

            return $this->createdResponse(
                new MenuTemplateResource($duplicated->load('kitchen', 'items')),
                'Menu template duplicated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Menu template not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(string $uuid): JsonResponse
    {
        try {
            $template = MenuTemplate::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $template);

            $template = $this->templateService->setDefault($template->id);

            return $this->successResponse(
                new MenuTemplateResource($template->load('kitchen')),
                'Default menu template updated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Menu template not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
