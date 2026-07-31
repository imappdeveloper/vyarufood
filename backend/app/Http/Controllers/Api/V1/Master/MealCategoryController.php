<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Meal\StoreMealCategoryRequest;
use App\Http\Requests\Meal\UpdateMealCategoryRequest;
use App\Models\MealCategory;
use App\Services\Meal\MealCategoryServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MealCategoryController extends BaseController
{
    public function __construct(
        protected MealCategoryServiceInterface $mealCategoryService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', MealCategory::class);

            $filters = $request->only([
                'search', 'status', 'is_default', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'display_order');
            $order = $request->input('order', 'asc');

            $mealCategories = $this->mealCategoryService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Meal\MealCategoryResource::collection($mealCategories),
                'Meal categories retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreMealCategoryRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', MealCategory::class);

            $mealCategory = $this->mealCategoryService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\Meal\MealCategoryResource($mealCategory->load(['createdBy', 'updatedBy'])),
                'Meal category created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(MealCategory $mealCategory): JsonResponse
    {
        try {
            $this->authorize('view', $mealCategory);

            $mealCategory->load(['createdBy', 'updatedBy']);

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealCategoryResource($mealCategory),
                'Meal category retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateMealCategoryRequest $request, MealCategory $mealCategory): JsonResponse
    {
        try {
            $this->authorize('update', $mealCategory);

            $mealCategory = $this->mealCategoryService->update($mealCategory, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealCategoryResource($mealCategory->load(['createdBy', 'updatedBy'])),
                'Meal category updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(MealCategory $mealCategory): JsonResponse
    {
        try {
            $this->authorize('delete', $mealCategory);

            if ($this->mealCategoryService->findByUuid($mealCategory->uuid) && $mealCategory->is_default) {
                return $this->errorResponse('Default meal category cannot be deleted', 422);
            }

            $this->mealCategoryService->delete($mealCategory);

            return $this->successResponse(null, 'Meal category deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $mealCategory = MealCategory::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $mealCategory);

            $result = $this->mealCategoryService->restore($mealCategory->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore meal category', 400);
            }

            return $this->successResponse(null, 'Meal category restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Meal category not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $mealCategory = MealCategory::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $mealCategory);

            if ($this->mealCategoryService->hasRelatedData($mealCategory)) {
                return $this->errorResponse('Cannot permanently delete meal category with related data', 422);
            }

            $this->mealCategoryService->forceDelete($mealCategory);

            return $this->successResponse(null, 'Meal category permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Meal category not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(MealCategory $mealCategory): JsonResponse
    {
        try {
            $this->authorize('update', $mealCategory);

            $mealCategory = $this->mealCategoryService->setDefault($mealCategory);

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealCategoryResource($mealCategory),
                'Default meal category updated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, MealCategory $mealCategory): JsonResponse
    {
        try {
            $this->authorize('update', $mealCategory);

            $request->validate([
                'status' => 'required|string|in:active,inactive',
            ]);

            $mealCategory = $this->mealCategoryService->setStatus($mealCategory, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealCategoryResource($mealCategory),
                'Meal category status updated successfully'
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
                'ids.*' => 'integer|exists:meal_categories,id',
            ]);

            $count = $this->mealCategoryService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} meal categories deleted successfully");
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
                'ids.*' => 'integer|exists:meal_categories,id',
                'status' => 'required|string|in:active,inactive',
            ]);

            $count = $this->mealCategoryService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} meal categories status updated successfully");
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
            $mealCategories = $this->mealCategoryService->export($filters);

            $headers = [
                'ID', 'UUID', 'Category Code', 'Name', 'Slug', 'Description',
                'Display Order', 'Icon', 'Image', 'Color Code',
                'Status', 'Is Default', 'Remarks', 'Created At',
            ];

            $csv = implode(',', $headers) . "\n";

            foreach ($mealCategories as $mealCategory) {
                $row = [
                    $mealCategory->id,
                    $mealCategory->uuid,
                    $mealCategory->category_code,
                    '"' . str_replace('"', '""', $mealCategory->name) . '"',
                    $mealCategory->slug,
                    '"' . str_replace('"', '""', $mealCategory->description ?? '') . '"',
                    $mealCategory->display_order,
                    $mealCategory->icon ?? '',
                    $mealCategory->image ?? '',
                    $mealCategory->color_code ?? '',
                    $mealCategory->status,
                    $mealCategory->is_default ? 'Yes' : 'No',
                    '"' . str_replace('"', '""', $mealCategory->remarks ?? '') . '"',
                    $mealCategory->created_at?->format('Y-m-d H:i:s') ?? '',
                ];

                $csv .= implode(',', $row) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="meal_categories_export_' . now()->format('Y_m_d_His') . '.csv"',
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

            $result = $this->mealCategoryService->import($data);

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
            $csv = $this->mealCategoryService->downloadSampleTemplate();

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="meal_category_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', MealCategory::class);

            $stats = $this->mealCategoryService->getStats();

            return $this->successResponse($stats, 'Meal category statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', MealCategory::class);

            $request->validate([
                'q' => 'nullable|string|max:255',
            ]);

            $mealCategories = $this->mealCategoryService->search($request->input('q'));

            return $this->successResponse(
                \App\Http\Resources\Meal\MealCategoryResource::collection($mealCategories),
                'Search results retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
