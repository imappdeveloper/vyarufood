<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\DTOs\WeeklyMenu\CustomerMealSelectionDTO;
use App\Http\Requests\WeeklyMenu\StoreCustomerMealSelectionRequest;
use App\Http\Requests\WeeklyMenu\UpdateCustomerMealSelectionRequest;
use App\Http\Resources\WeeklyMenu\CustomerMealSelectionResource;
use App\Models\CustomerMealSelection;
use App\Services\WeeklyMenu\CustomerMealSelectionServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerMealSelectionController extends BaseController
{
    public function __construct(
        private CustomerMealSelectionServiceInterface $selectionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerMealSelection::class);

            $filters = $request->only([
                'customer_id', 'weekly_menu_id', 'menu_date', 'selection_status',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $selections = $this->selectionService->getPaginatedSelections($filters, $perPage);

            return $this->paginatedResponse(
                CustomerMealSelectionResource::collection($selections),
                'Customer meal selections retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreCustomerMealSelectionRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', CustomerMealSelection::class);

            $dto = CustomerMealSelectionDTO::fromArray($request->validated());
            $selection = $this->selectionService->selectMeal($dto);

            return $this->createdResponse(
                new CustomerMealSelectionResource(
                    $selection->load('customer', 'meal', 'mealCategory', 'weeklyMenuItem')
                ),
                'Customer meal selection created successfully'
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
            $selection = CustomerMealSelection::where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $selection);

            $selection->load('customer', 'meal', 'mealCategory', 'weeklyMenuItem', 'subscription');

            return $this->successResponse(
                new CustomerMealSelectionResource($selection),
                'Customer meal selection retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer meal selection not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateCustomerMealSelectionRequest $request, string $uuid): JsonResponse
    {
        try {
            $selection = CustomerMealSelection::where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $selection);

            $dto = CustomerMealSelectionDTO::fromArray($request->validated());
            $selection = $this->selectionService->updateSelection($selection->id, $dto);

            return $this->successResponse(
                new CustomerMealSelectionResource(
                    $selection->load('customer', 'meal', 'mealCategory', 'weeklyMenuItem')
                ),
                'Customer meal selection updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer meal selection not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $selection = CustomerMealSelection::where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $selection);

            $this->selectionService->cancelSelection($selection->id);

            return $this->successResponse(null, 'Customer meal selection deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer meal selection not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getCustomerSelections(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerMealSelection::class);

            $request->validate([
                'customer_id' => 'required|integer|exists:customers,id',
                'week_start_date' => ['nullable', 'date'],
            ]);

            $selections = $this->selectionService->getCustomerSelections(
                (int) $request->input('customer_id'),
                $request->input('week_start_date')
            );

            return $this->successResponse(
                CustomerMealSelectionResource::collection($selections),
                'Customer selections retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getSelectionSummary(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerMealSelection::class);

            $request->validate([
                'menu_id' => 'required|integer|exists:weekly_menus,id',
            ]);

            $summary = $this->selectionService->getSelectionSummary(
                (int) $request->input('menu_id')
            );

            return $this->successResponse($summary, 'Selection summary retrieved successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function skipMeal(Request $request): JsonResponse
    {
        try {
            $this->authorize('update', CustomerMealSelection::class);

            $request->validate([
                'customer_id' => 'required|integer|exists:customers,id',
                'menu_item_id' => 'required|integer|exists:weekly_menu_items,id',
                'menu_date' => 'required|date',
            ]);

            $selection = $this->selectionService->skipMeal(
                (int) $request->input('customer_id'),
                (int) $request->input('menu_item_id'),
                $request->input('menu_date')
            );

            return $this->successResponse(
                new CustomerMealSelectionResource($selection),
                'Meal skipped successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkAssignDefaults(Request $request): JsonResponse
    {
        try {
            $this->authorize('update', CustomerMealSelection::class);

            $request->validate([
                'menu_id' => 'required|integer|exists:weekly_menus,id',
            ]);

            $count = $this->selectionService->bulkAssignDefaults(
                (int) $request->input('menu_id')
            );

            return $this->successResponse(
                ['assigned' => $count],
                "{$count} default selections assigned successfully"
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getSelectionsByDate(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerMealSelection::class);

            $request->validate([
                'date' => 'required|date',
            ]);

            $selections = $this->selectionService->getSelectionsByDate(
                $request->input('date')
            );

            return $this->successResponse(
                CustomerMealSelectionResource::collection($selections),
                'Selections by date retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function canSelect(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerMealSelection::class);

            $request->validate([
                'customer_id' => 'required|integer|exists:customers,id',
                'menu_item_id' => 'required|integer|exists:weekly_menu_items,id',
            ]);

            $result = $this->selectionService->canCustomerSelect(
                (int) $request->input('customer_id'),
                (int) $request->input('menu_item_id')
            );

            return $this->successResponse(
                $result,
                'Selection availability checked'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
