<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Kitchen\StoreKitchenHolidayRequest;
use App\Http\Requests\Kitchen\UpdateKitchenHolidayRequest;
use App\Models\KitchenHoliday;
use App\Services\Kitchen\KitchenHolidayServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KitchenHolidayController extends BaseController
{
    public function __construct(
        protected KitchenHolidayServiceInterface $holidayService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', KitchenHoliday::class);

            $kitchenId = $request->input('kitchen_id');

            $filters = $request->only([
                'search', 'status', 'holiday_type', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'start_date');
            $order = $request->input('order', 'desc');

            $holidays = $this->holidayService->getPaginated((int) $kitchenId, $filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Kitchen\KitchenHolidayResource::collection($holidays),
                'Kitchen holidays retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreKitchenHolidayRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', KitchenHoliday::class);

            $holiday = $this->holidayService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\Kitchen\KitchenHolidayResource($holiday),
                'Kitchen holiday created successfully'
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
            $holiday = $this->holidayService->findByUuid($uuid);

            if (! $holiday) {
                return $this->notFoundResponse('Kitchen holiday not found');
            }

            $this->authorize('view', $holiday);

            return $this->successResponse(
                new \App\Http\Resources\Kitchen\KitchenHolidayResource($holiday),
                'Kitchen holiday retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateKitchenHolidayRequest $request, string $uuid): JsonResponse
    {
        try {
            $holiday = $this->holidayService->findByUuid($uuid);

            if (! $holiday) {
                return $this->notFoundResponse('Kitchen holiday not found');
            }

            $this->authorize('update', $holiday);

            $holiday = $this->holidayService->update($holiday, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\Kitchen\KitchenHolidayResource($holiday),
                'Kitchen holiday updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $holiday = $this->holidayService->findByUuid($uuid);

            if (! $holiday) {
                return $this->notFoundResponse('Kitchen holiday not found');
            }

            $this->authorize('delete', $holiday);

            $this->holidayService->delete($holiday);

            return $this->successResponse(null, 'Kitchen holiday deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function calendar(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'kitchen_id' => 'required|integer|exists:kitchens,id',
                'year' => 'required|integer|min:2020|max:2030',
                'month' => 'required|integer|min:1|max:12',
            ]);

            $calendar = $this->holidayService->getHolidayCalendar(
                (int) $request->input('kitchen_id'),
                (string) $request->input('year'),
                (string) $request->input('month')
            );

            return $this->successResponse($calendar, 'Holiday calendar retrieved successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
