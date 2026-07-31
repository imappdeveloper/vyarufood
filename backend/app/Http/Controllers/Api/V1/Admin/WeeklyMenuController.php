<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\DTOs\WeeklyMenu\WeeklyMenuDTO;
use App\Http\Requests\WeeklyMenu\StoreWeeklyMenuRequest;
use App\Http\Requests\WeeklyMenu\UpdateWeeklyMenuRequest;
use App\Http\Resources\WeeklyMenu\WeeklyMenuResource;
use App\Models\WeeklyMenu;
use App\Services\WeeklyMenu\WeeklyMenuServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeeklyMenuController extends BaseController
{
    public function __construct(
        private WeeklyMenuServiceInterface $menuService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenu::class);

            $filters = $request->only([
                'search', 'status', 'week_start_date', 'week_end_date', 'kitchen_id',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $menus = $this->menuService->getPaginatedMenus($filters, $perPage);

            return $this->paginatedResponse(
                WeeklyMenuResource::collection($menus),
                'Weekly menus retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreWeeklyMenuRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', WeeklyMenu::class);

            $dto = WeeklyMenuDTO::fromArray($request->validated());
            $menu = $this->menuService->createMenu($dto);

            return $this->createdResponse(
                new WeeklyMenuResource($menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType')),
                'Weekly menu created successfully'
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
            $menu = WeeklyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $menu);

            $menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType');

            return $this->successResponse(
                new WeeklyMenuResource($menu),
                'Weekly menu retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateWeeklyMenuRequest $request, string $uuid): JsonResponse
    {
        try {
            $menu = WeeklyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $menu);

            $dto = WeeklyMenuDTO::fromArray($request->validated());
            $menu = $this->menuService->updateMenu($menu->id, $dto);

            return $this->successResponse(
                new WeeklyMenuResource($menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType')),
                'Weekly menu updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $menu = WeeklyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $menu);

            $this->menuService->deleteMenu($menu->id);

            return $this->successResponse(null, 'Weekly menu deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $menu = WeeklyMenu::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $menu);

            $result = $this->menuService->restoreMenu($menu->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore weekly menu', 400);
            }

            return $this->successResponse(null, 'Weekly menu restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function publish(string $uuid): JsonResponse
    {
        try {
            $menu = WeeklyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('publish', $menu);

            $menu = $this->menuService->publishMenu($menu);

            return $this->successResponse(
                new WeeklyMenuResource($menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType')),
                'Weekly menu published successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function unpublish(string $uuid): JsonResponse
    {
        try {
            $menu = WeeklyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('unpublish', $menu);

            $menu = $this->menuService->unpublishMenu($menu);

            return $this->successResponse(
                new WeeklyMenuResource($menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType')),
                'Weekly menu unpublished successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Weekly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function copyPreviousWeek(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', WeeklyMenu::class);

            $request->validate([
                'from_week_start' => 'required|date',
                'to_week_start' => 'required|date|after:from_week_start',
            ]);

            $menu = $this->menuService->copyPreviousWeek(
                $request->input('from_week_start'),
                $request->input('to_week_start')
            );

            return $this->createdResponse(
                new WeeklyMenuResource($menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType')),
                'Weekly menu copied from previous week successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function autoGenerate(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', WeeklyMenu::class);

            $request->validate([
                'week_start' => 'required|date|after_or_equal:today',
                'week_end' => 'required|date|after_or_equal:week_start',
            ]);

            $menu = $this->menuService->autoGenerateMenu(
                $request->input('week_start'),
                $request->input('week_end')
            );

            return $this->createdResponse(
                new WeeklyMenuResource($menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType')),
                'Weekly menu auto-generated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getStats(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenu::class);

            $stats = $this->menuService->getMenuStats();

            return $this->successResponse($stats, 'Weekly menu statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getUpcoming(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenu::class);

            $menus = $this->menuService->getUpcomingMenus();

            return $this->successResponse(
                WeeklyMenuResource::collection($menus),
                'Upcoming weekly menus retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getPublished(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenu::class);

            $menus = $this->menuService->getPublishedMenus();

            return $this->successResponse(
                WeeklyMenuResource::collection($menus),
                'Published weekly menus retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getByWeek(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', WeeklyMenu::class);

            $request->validate([
                'week_start_date' => 'required|date',
            ]);

            $menu = $this->menuService->getMenuByWeek($request->input('week_start_date'));

            if (! $menu) {
                return $this->notFoundResponse('No weekly menu found for the given week');
            }

            return $this->successResponse(
                new WeeklyMenuResource($menu->load('kitchen', 'items.meal', 'items.mealCategory', 'items.mealType')),
                'Weekly menu retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
