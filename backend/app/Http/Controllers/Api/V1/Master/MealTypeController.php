<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Meal\StoreMealTypeRequest;
use App\Http\Requests\Meal\UpdateMealTypeRequest;
use App\Models\MealType;
use App\Services\Meal\MealTypeServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MealTypeController extends BaseController
{
    public function __construct(
        protected MealTypeServiceInterface $mealTypeService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', MealType::class);

            $filters = $request->only([
                'search', 'status', 'is_default', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'display_order');
            $order = $request->input('order', 'asc');

            $mealTypes = $this->mealTypeService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Meal\MealTypeResource::collection($mealTypes),
                'Meal types retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreMealTypeRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', MealType::class);

            $mealType = $this->mealTypeService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\Meal\MealTypeResource($mealType->load(['createdBy', 'updatedBy'])),
                'Meal type created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(MealType $mealType): JsonResponse
    {
        try {
            $this->authorize('view', $mealType);

            $mealType->load(['createdBy', 'updatedBy']);

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealTypeResource($mealType),
                'Meal type retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateMealTypeRequest $request, MealType $mealType): JsonResponse
    {
        try {
            $this->authorize('update', $mealType);

            $mealType = $this->mealTypeService->update($mealType, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealTypeResource($mealType->load(['createdBy', 'updatedBy'])),
                'Meal type updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(MealType $mealType): JsonResponse
    {
        try {
            $this->authorize('delete', $mealType);

            if ($this->mealTypeService->findByUuid($mealType->uuid) && $mealType->is_default) {
                return $this->errorResponse('Default meal type cannot be deleted', 422);
            }

            $this->mealTypeService->delete($mealType);

            return $this->successResponse(null, 'Meal type deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $mealType = MealType::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $mealType);

            $result = $this->mealTypeService->restore($mealType->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore meal type', 400);
            }

            return $this->successResponse(null, 'Meal type restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Meal type not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $mealType = MealType::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $mealType);

            if ($this->mealTypeService->hasRelatedData($mealType)) {
                return $this->errorResponse('Cannot permanently delete meal type with related data', 422);
            }

            $this->mealTypeService->forceDelete($mealType);

            return $this->successResponse(null, 'Meal type permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Meal type not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(MealType $mealType): JsonResponse
    {
        try {
            $this->authorize('update', $mealType);

            $mealType = $this->mealTypeService->setDefault($mealType);

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealTypeResource($mealType),
                'Default meal type updated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, MealType $mealType): JsonResponse
    {
        try {
            $this->authorize('update', $mealType);

            $request->validate([
                'status' => 'required|string|in:active,inactive',
            ]);

            $mealType = $this->mealTypeService->setStatus($mealType, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealTypeResource($mealType),
                'Meal type status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:meal_types,id',
            ]);

            $count = $this->mealTypeService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} meal types deleted successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkSetStatus(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:meal_types,id',
                'status' => 'required|string|in:active,inactive',
            ]);

            $count = $this->mealTypeService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} meal types status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['status', 'search']);
            $mealTypes = $this->mealTypeService->export($filters);

            $headers = [
                'ID', 'UUID', 'Type Code', 'Name', 'Slug', 'Description',
                'Display Order', 'Icon', 'Image', 'Color Code',
                'Status', 'Is Default', 'Remarks', 'Created At',
            ];

            $csv = implode(',', $headers) . "\n";

            foreach ($mealTypes as $mealType) {
                $row = [
                    $mealType->id,
                    $mealType->uuid,
                    $mealType->type_code,
                    '"' . str_replace('"', '""', $mealType->name) . '"',
                    $mealType->slug,
                    '"' . str_replace('"', '""', $mealType->description ?? '') . '"',
                    $mealType->display_order,
                    $mealType->icon ?? '',
                    $mealType->image ?? '',
                    $mealType->color_code ?? '',
                    $mealType->status,
                    $mealType->is_default ? 'Yes' : 'No',
                    '"' . str_replace('"', '""', $mealType->remarks ?? '') . '"',
                    $mealType->created_at?->format('Y-m-d H:i:s') ?? '',
                ];

                $csv .= implode(',', $row) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="meal_types_export_' . now()->format('Y_m_d_His') . '.csv"',
            ]);
        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function import(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
            ]);

            $file = $request->file('file');
            $rows = array_map('str_getcsv', file($file->getRealPath()));
            $headers = array_shift($rows);

            $data = [];
            foreach ($rows as $row) {
                $data[] = array_combine($headers, $row);
            }

            $result = $this->mealTypeService->import($data);

            return $this->successResponse($result, 'Import completed');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function downloadSampleTemplate(): Response
    {
        try {
            $csv = $this->mealTypeService->downloadSampleTemplate();

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="meal_type_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', MealType::class);

            $stats = $this->mealTypeService->getStats();

            return $this->successResponse($stats, 'Meal type statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', MealType::class);

            $request->validate([
                'q' => 'nullable|string|max:255',
            ]);

            $mealTypes = $this->mealTypeService->search($request->input('q'));

            return $this->successResponse(
                \App\Http\Resources\Meal\MealTypeResource::collection($mealTypes),
                'Search results retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
