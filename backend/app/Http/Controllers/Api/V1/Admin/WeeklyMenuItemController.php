<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\DTOs\WeeklyMenu\WeeklyMenuItemDTO;
use App\Http\Requests\WeeklyMenu\StoreWeeklyMenuItemRequest;
use App\Http\Requests\WeeklyMenu\UpdateWeeklyMenuItemRequest;
use App\Http\Resources\WeeklyMenu\WeeklyMenuItemResource;
use App\Models\WeeklyMenuItem;
use App\Services\WeeklyMenu\WeeklyMenuItemServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeeklyMenuItemController extends BaseController
{
    public function __construct(
        private WeeklyMenuItemServiceInterface $menuItemService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenuItem::class);

            $filters = $request->only([
                'weekly_menu_id', 'menu_date', 'meal_category_id',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $items = $this->menuItemService->getPaginatedItems($filters, $perPage);

            return $this->paginatedResponse(
                WeeklyMenuItemResource::collection($items),
                'Weekly menu items retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreWeeklyMenuItemRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', WeeklyMenuItem::class);

            $dto = WeeklyMenuItemDTO::fromArray($request->validated());
            $item = $this->menuItemService->createItem($dto);

            return $this->createdResponse(
                new WeeklyMenuItemResource($item->load('mealCategory', 'meal', 'mealType')),
                'Weekly menu item created successfully'
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
            $item = WeeklyMenuItem::where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $item);

            $item->load('mealCategory', 'meal', 'mealType', 'weeklyMenu');

            return $this->successResponse(
                new WeeklyMenuItemResource($item),
                'Weekly menu item retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu item not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateWeeklyMenuItemRequest $request, string $uuid): JsonResponse
    {
        try {
            $item = WeeklyMenuItem::where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $item);

            $dto = WeeklyMenuItemDTO::fromArray($request->validated());
            $item = $this->menuItemService->updateItem($item->id, $dto);

            return $this->successResponse(
                new WeeklyMenuItemResource($item->load('mealCategory', 'meal', 'mealType')),
                'Weekly menu item updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu item not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $item = WeeklyMenuItem::where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $item);

            $this->menuItemService->deleteItem($item->id);

            return $this->successResponse(null, 'Weekly menu item deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu item not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkStore(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', WeeklyMenuItem::class);

            $request->validate([
                'menu_id' => 'required|integer|exists:weekly_menus,id',
                'items' => 'required|array|min:1',
                'items.*.menu_date' => 'required|date',
                'items.*.meal_category_id' => 'required|integer|exists:meal_categories,id',
                'items.*.meal_id' => 'required|integer|exists:meals,id',
                'items.*.meal_type_id' => ['nullable', 'integer', 'exists:meal_types,id'],
                'items.*.display_order' => ['nullable', 'integer', 'min:0'],
                'items.*.meal_limit' => ['nullable', 'integer', 'min:0'],
                'items.*.is_default' => ['nullable', 'boolean'],
                'items.*.is_optional' => ['nullable', 'boolean'],
                'items.*.is_recommended' => ['nullable', 'boolean'],
            ]);

            $items = $this->menuItemService->bulkAddItems(
                $request->input('menu_id'),
                $request->input('items')
            );

            return $this->createdResponse(
                WeeklyMenuItemResource::collection($items),
                'Weekly menu items bulk created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function reorder(Request $request): JsonResponse
    {
        try {
            $this->authorize('update', WeeklyMenuItem::class);

            $request->validate([
                'menu_id' => 'required|integer|exists:weekly_menus,id',
                'order' => 'required|array|min:1',
                'order.*.id' => 'required|integer|exists:weekly_menu_items,id',
                'order.*.display_order' => 'required|integer|min:0',
            ]);

            $this->menuItemService->reorderItems(
                $request->input('menu_id'),
                $request->input('order')
            );

            return $this->successResponse(null, 'Weekly menu items reordered successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function assignDefaults(Request $request): JsonResponse
    {
        try {
            $this->authorize('update', WeeklyMenuItem::class);

            $request->validate([
                'menu_id' => 'required|integer|exists:weekly_menus,id',
                'date' => 'required|date',
            ]);

            $items = $this->menuItemService->assignDefaults(
                $request->input('menu_id'),
                $request->input('date')
            );

            return $this->successResponse(
                WeeklyMenuItemResource::collection($items),
                'Default meal items assigned successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getByDate(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenuItem::class);

            $request->validate([
                'menu_id' => 'required|integer|exists:weekly_menus,id',
                'date' => 'required|date',
            ]);

            $items = $this->menuItemService->getItemsByDate(
                $request->input('menu_id'),
                $request->input('date')
            );

            return $this->successResponse(
                WeeklyMenuItemResource::collection($items),
                'Weekly menu items retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getDefaults(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenuItem::class);

            $request->validate([
                'menu_id' => 'required|integer|exists:weekly_menus,id',
                'date' => 'required|date',
            ]);

            $items = $this->menuItemService->getDefaults(
                $request->input('menu_id'),
                $request->input('date')
            );

            return $this->successResponse(
                WeeklyMenuItemResource::collection($items),
                'Default menu items retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
