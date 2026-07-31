<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\DTOs\MonthlyMenu\MonthlyMenuDTO;
use App\Http\Requests\MonthlyMenu\StoreMonthlyMenuRequest;
use App\Http\Requests\MonthlyMenu\UpdateMonthlyMenuRequest;
use App\Http\Resources\MonthlyMenu\MonthlyMenuResource;
use App\Models\MonthlyMenu;
use App\Services\MonthlyMenu\MonthlyMenuServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MonthlyMenuController extends BaseController
{
    public function __construct(
        private MonthlyMenuServiceInterface $menuService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', MonthlyMenu::class);

            $filters = $request->only([
                'search', 'status', 'month', 'year', 'kitchen_id', 'menu_template_id',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $menus = $this->menuService->getPaginatedMenus($filters, $perPage);

            return $this->paginatedResponse(
                MonthlyMenuResource::collection($menus),
                'Monthly menus retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreMonthlyMenuRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', MonthlyMenu::class);

            $dto = MonthlyMenuDTO::fromArray($request->validated());
            $menu = $this->menuService->createMenu($dto);

            return $this->createdResponse(
                new MonthlyMenuResource($menu->load('kitchen', 'menuTemplate')),
                'Monthly menu created successfully'
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
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $menu);

            $menu->load('kitchen', 'menuTemplate', 'items.meal', 'items.mealCategory', 'items.mealType');

            return $this->successResponse(
                new MonthlyMenuResource($menu),
                'Monthly menu retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateMonthlyMenuRequest $request, string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $menu);

            $dto = MonthlyMenuDTO::fromArray($request->validated());
            $menu = $this->menuService->updateMenu($menu->id, $dto);

            return $this->successResponse(
                new MonthlyMenuResource($menu->load('kitchen', 'menuTemplate', 'items')),
                'Monthly menu updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $menu);

            $this->menuService->deleteMenu($menu->id);

            return $this->successResponse(null, 'Monthly menu deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $menu);

            $result = $this->menuService->restoreMenu($menu->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore monthly menu', 400);
            }

            return $this->successResponse(null, 'Monthly menu restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function publish(string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('publish', $menu);

            $menu = $this->menuService->publishMenu($menu);

            return $this->successResponse(
                new MonthlyMenuResource($menu->load('kitchen', 'menuTemplate', 'items')),
                'Monthly menu published successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function unpublish(string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('publish', $menu);

            $menu = $this->menuService->unpublishMenu($menu);

            return $this->successResponse(
                new MonthlyMenuResource($menu->load('kitchen', 'menuTemplate', 'items')),
                'Monthly menu unpublished successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function approve(string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('approve', $menu);

            $menu = $this->menuService->approveMenu($menu);

            return $this->successResponse(
                new MonthlyMenuResource($menu->load('kitchen', 'menuTemplate', 'items')),
                'Monthly menu approved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function duplicate(Request $request, string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('create', MonthlyMenu::class);

            $request->validate([
                'target_month' => 'required|integer|min:1|max:12',
                'target_year' => 'required|integer|min:2020|max:2030',
            ]);

            $duplicated = $this->menuService->duplicateMenu(
                $menu->id,
                $request->input('target_month'),
                $request->input('target_year')
            );

            if (! $duplicated) {
                return $this->errorResponse('Failed to duplicate monthly menu', 400);
            }

            return $this->createdResponse(
                new MonthlyMenuResource($duplicated->load('kitchen', 'menuTemplate', 'items')),
                'Monthly menu duplicated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function copyPrevious(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', MonthlyMenu::class);

            $request->validate([
                'source_month' => 'required|integer|min:1|max:12',
                'source_year' => 'required|integer|min:2020|max:2030',
                'target_month' => 'required|integer|min:1|max:12',
                'target_year' => 'required|integer|min:2020|max:2030',
                'kitchen_id' => 'nullable|integer|exists:kitchens,id',
            ]);

            $menu = $this->menuService->copyPreviousMonth(
                $request->input('source_month'),
                $request->input('source_year'),
                $request->input('target_month'),
                $request->input('target_year'),
                $request->input('kitchen_id')
            );

            if (! $menu) {
                return $this->errorResponse('Failed to copy from previous month', 400);
            }

            return $this->createdResponse(
                new MonthlyMenuResource($menu->load('kitchen', 'menuTemplate', 'items')),
                'Monthly menu copied from previous month successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function generateWeekly(Request $request, string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $menu);

            $result = $this->menuService->generateWeeklyMenus($menu->id);

            if (! $result) {
                return $this->errorResponse('Failed to generate weekly menus', 400);
            }

            return $this->successResponse(
                new MonthlyMenuResource($menu->load('kitchen', 'menuTemplate', 'items')),
                'Weekly menus generated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getStats(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', MonthlyMenu::class);

            $kitchenId = $request->input('kitchen_id') ? (int) $request->input('kitchen_id') : null;
            $stats = $this->menuService->getMenuStats($kitchenId);

            return $this->successResponse($stats, 'Monthly menu statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getForecast(string $uuid): JsonResponse
    {
        try {
            $menu = MonthlyMenu::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $menu);

            $forecast = $this->menuService->getForecast($menu->id);

            return $this->successResponse($forecast, 'Monthly menu forecast retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Monthly menu not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
