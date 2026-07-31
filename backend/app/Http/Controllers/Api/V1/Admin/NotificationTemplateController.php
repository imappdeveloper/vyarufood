<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\StoreNotificationTemplateRequest;
use App\Http\Requests\Notification\UpdateNotificationTemplateRequest;
use App\Http\Resources\Notification\NotificationTemplateResource;
use App\Models\NotificationTemplate;
use App\Services\Notification\NotificationTemplateServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationTemplateController extends BaseController
{
    public function __construct(
        private readonly NotificationTemplateServiceInterface $templateService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $filters = $request->only([
                'search', 'template_code', 'template_name',
                'notification_type', 'channel', 'status', 'language',
            ]);

            $templates = $this->templateService->getPaginatedTemplates($filters, $perPage);

            return $this->paginatedResponse(
                JsonResource::collection($templates),
                'Notification templates retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $template = $this->templateService->getTemplateById($id);
            if (! $template) {
                return $this->notFoundResponse('Notification template not found');
            }

            $template->load('createdBy', 'updatedBy');

            return $this->successResponse(
                new NotificationTemplateResource($template),
                'Notification template retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreNotificationTemplateRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $template = $this->templateService->createTemplate($validated);

            return $this->createdResponse(
                new NotificationTemplateResource($template),
                'Notification template created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateNotificationTemplateRequest $request, int $id): JsonResponse
    {
        try {
            $template = $this->templateService->updateTemplate($id, $request->validated());
            if (! $template) {
                return $this->notFoundResponse('Notification template not found');
            }

            return $this->successResponse(
                new NotificationTemplateResource($template),
                'Notification template updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->templateService->deleteTemplate($id);
            if (! $deleted) {
                return $this->notFoundResponse('Notification template not found');
            }

            return $this->noContentResponse('Notification template deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
