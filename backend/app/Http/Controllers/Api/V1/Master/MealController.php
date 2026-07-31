<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Meal\StoreMealRequest;
use App\Http\Requests\Meal\UpdateMealRequest;
use App\Models\Meal;
use App\Services\Meal\MealServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class MealController extends BaseController
{
    public function __construct(
        protected MealServiceInterface $mealService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Meal::class);

            $filters = $request->only([
                'search', 'status', 'category_id', 'meal_type_id', 'kitchen_id',
                'is_featured', 'is_recommended', 'is_bestseller', 'is_new',
                'availability_type', 'price_min', 'price_max', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'created_at');
            $order = $request->input('order', 'desc');

            $meals = $this->mealService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Meal\MealResource::collection($meals),
                'Meals retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreMealRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Meal::class);

            $meal = $this->mealService->create($request->validated());

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->createdResponse(
                new \App\Http\Resources\Meal\MealResource($meal->load($relations)),
                'Meal created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(Meal $meal): JsonResponse
    {
        try {
            $this->authorize('view', $meal);

            $relations = ['category', 'mealType', 'kitchen', 'createdBy', 'updatedBy'];
            $meal->load($relations);

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealResource($meal),
                'Meal retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateMealRequest $request, Meal $meal): JsonResponse
    {
        try {
            $this->authorize('update', $meal);

            $meal = $this->mealService->update($meal, $request->validated());

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealResource($meal->load($relations)),
                'Meal updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(Meal $meal): JsonResponse
    {
        try {
            $this->authorize('delete', $meal);

            $this->mealService->delete($meal);

            return $this->successResponse(null, 'Meal deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $meal = Meal::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $meal);

            $result = $this->mealService->restore($meal->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore meal', 400);
            }

            return $this->successResponse(null, 'Meal restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Meal not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $meal = Meal::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $meal);

            if ($this->mealService->hasRelatedData($meal)) {
                return $this->errorResponse('Cannot permanently delete meal with related data', 422);
            }

            $this->mealService->forceDelete($meal);

            return $this->successResponse(null, 'Meal permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Meal not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, Meal $meal): JsonResponse
    {
        try {
            $this->authorize('update', $meal);

            $request->validate([
                'status' => 'required|string|in:active,inactive',
            ]);

            $meal = $this->mealService->setStatus($meal, $request->input('status'));

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealResource($meal->load($relations)),
                'Meal status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setFeatured(Meal $meal): JsonResponse
    {
        try {
            $this->authorize('update', $meal);

            request()->validate([
                'is_featured' => 'required|boolean',
            ]);

            $meal = $this->mealService->setFeatured($meal, request()->input('is_featured'));

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealResource($meal->load($relations)),
                'Meal featured status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setRecommended(Meal $meal): JsonResponse
    {
        try {
            $this->authorize('update', $meal);

            request()->validate([
                'is_recommended' => 'required|boolean',
            ]);

            $meal = $this->mealService->setRecommended($meal, request()->input('is_recommended'));

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealResource($meal->load($relations)),
                'Meal recommendation status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setBestseller(Meal $meal): JsonResponse
    {
        try {
            $this->authorize('update', $meal);

            request()->validate([
                'is_bestseller' => 'required|boolean',
            ]);

            $meal = $this->mealService->setBestseller($meal, request()->input('is_bestseller'));

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealResource($meal->load($relations)),
                'Meal bestseller status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setNewFlag(Meal $meal): JsonResponse
    {
        try {
            $this->authorize('update', $meal);

            request()->validate([
                'is_new' => 'required|boolean',
            ]);

            $meal = $this->mealService->setNewFlag($meal, request()->input('is_new'));

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->successResponse(
                new \App\Http\Resources\Meal\MealResource($meal->load($relations)),
                'Meal new flag updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function duplicate(Meal $meal): JsonResponse
    {
        try {
            $this->authorize('create', Meal::class);

            $newMeal = $this->mealService->duplicate($meal);

            $relations = ['category', 'mealType', 'kitchen'];

            return $this->createdResponse(
                new \App\Http\Resources\Meal\MealResource($newMeal->load($relations)),
                'Meal duplicated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:meals,id',
            ]);

            $count = $this->mealService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} meals deleted successfully");
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
                'ids.*' => 'integer|exists:meals,id',
                'status' => 'required|string|in:active,inactive',
            ]);

            $count = $this->mealService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} meals status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkUpdatePrice(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:meals,id',
                'price' => 'nullable|numeric|min:0',
                'offer_price' => 'nullable|numeric|min:0',
                'cost_price' => 'nullable|numeric|min:0',
            ]);

            $prices = array_filter([
                'price' => $request->input('price'),
                'offer_price' => $request->input('offer_price'),
                'cost_price' => $request->input('cost_price'),
            ], fn ($v) => $v !== null);

            $count = $this->mealService->bulkUpdatePrice($request->input('ids'), $prices);

            return $this->successResponse(['updated' => $count], "{$count} meals price updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkUpdateCategory(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:meals,id',
                'category_id' => 'required|integer|exists:meal_categories,id',
            ]);

            $count = $this->mealService->bulkUpdateCategory(
                $request->input('ids'),
                $request->input('category_id')
            );

            return $this->successResponse(['updated' => $count], "{$count} meals category updated successfully");
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
            $meals = $this->mealService->export($filters);

            $headers = [
                'ID', 'UUID', 'Meal Code', 'Name', 'Slug', 'Category', 'Meal Type', 'Kitchen',
                'Short Description', 'Description',
                'Spice Level', 'Serving Size', 'Unit',
                'Price', 'Offer Price', 'Cost Price', 'Tax Percentage',
                'Calories', 'Protein', 'Carbohydrates', 'Fat', 'Fiber', 'Sugar', 'Sodium',
                'Availability Type', 'Is Featured', 'Is Recommended', 'Is New', 'Is Bestseller',
                'Status', 'Created At',
            ];

            $csv = implode(',', $headers) . "\n";

            foreach ($meals as $meal) {
                $row = [
                    $meal->id,
                    $meal->uuid,
                    $meal->meal_code,
                    '"' . str_replace('"', '""', $meal->name) . '"',
                    $meal->slug,
                    $meal->category?->name ?? '',
                    $meal->mealType?->name ?? '',
                    $meal->kitchen?->name ?? '',
                    '"' . str_replace('"', '""', $meal->short_description ?? '') . '"',
                    '"' . str_replace('"', '""', $meal->description ?? '') . '"',
                    $meal->spice_level,
                    $meal->serving_size ?? '',
                    $meal->unit ?? '',
                    $meal->price,
                    $meal->offer_price ?? '',
                    $meal->cost_price ?? '',
                    $meal->tax_percentage,
                    $meal->calories,
                    $meal->protein,
                    $meal->carbohydrates,
                    $meal->fat,
                    $meal->fiber,
                    $meal->sugar,
                    $meal->sodium,
                    $meal->availability_type,
                    $meal->is_featured ? 'Yes' : 'No',
                    $meal->is_recommended ? 'Yes' : 'No',
                    $meal->is_new ? 'Yes' : 'No',
                    $meal->is_bestseller ? 'Yes' : 'No',
                    $meal->status instanceof \App\Enums\StatusEnum ? $meal->status->value : $meal->status,
                    $meal->created_at?->format('Y-m-d H:i:s') ?? '',
                ];

                $csv .= implode(',', $row) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="meals_export_' . now()->format('Y_m_d_His') . '.csv"',
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

            $result = $this->mealService->import($data);

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
            $csv = $this->mealService->downloadSampleTemplate();

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="meal_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Meal::class);

            $stats = $this->mealService->getStats();

            return $this->successResponse($stats, 'Meal statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Meal::class);

            $request->validate([
                'q' => 'nullable|string|max:255',
            ]);

            $meals = $this->mealService->search($request->input('q'));

            return $this->successResponse(
                \App\Http\Resources\Meal\MealResource::collection($meals),
                'Search results retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function uploadImage(Request $request, Meal $meal): JsonResponse
    {
        try {
            $request->validate([
                'image' => 'required|file|image|max:5120|mimes:jpeg,jpg,png,webp',
            ]);

            $this->authorize('update', $meal);

            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $path = "meals/{$meal->uuid}/main.{$extension}";

                Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

            $meal->meal_image = $path;
            $meal->thumbnail = $path;
            $meal->save();

            return $this->successResponse([
                'path' => Storage::disk('public')->url($path),
                'meal_image' => $path,
            ], 'Image uploaded successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function uploadGallery(Request $request, Meal $meal): JsonResponse
    {
        try {
            $request->validate([
                'files' => 'required|array|max:10',
                'files.*' => 'file|image|max:5120|mimes:jpeg,jpg,png,webp',
            ]);

            $this->authorize('update', $meal);

            $gallery = $meal->gallery ?? [];
            $uploadedPaths = [];

            foreach ($request->file('files') as $file) {
                $extension = $file->getClientOriginalExtension();
                $filename = uniqid() . '.' . $extension;
                $path = "meals/{$meal->uuid}/gallery/{$filename}";

            Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));
                $gallery[] = $path;
                $uploadedPaths[] = Storage::disk('public')->url($path);
            }

            $meal->gallery = $gallery;
            $meal->save();

            return $this->successResponse([
                'paths' => $uploadedPaths,
                'gallery' => $gallery,
            ], 'Gallery images uploaded successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function deleteImage(Request $request, Meal $meal): JsonResponse
    {
        try {
            $request->validate([
                'path' => 'required|string',
            ]);

            $this->authorize('update', $meal);

            $path = $request->input('path');

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            if ($meal->meal_image === $path) {
                $meal->meal_image = null;
                $meal->save();
            }

            if ($meal->gallery) {
                $gallery = array_filter($meal->gallery, fn ($g) => $g !== $path);
                $meal->gallery = array_values($gallery);
                $meal->save();
            }

            return $this->successResponse(null, 'Image deleted successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
