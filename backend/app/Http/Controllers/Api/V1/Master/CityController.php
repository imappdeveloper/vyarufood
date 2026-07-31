<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\City\StoreCityRequest;
use App\Http\Requests\City\UpdateCityRequest;
use App\Models\Master\City;
use App\Services\City\CityServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CityController extends BaseController
{
    public function __construct(
        protected CityServiceInterface $cityService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', City::class);

            $filters = $request->only(['search', 'status', 'country_id', 'state_id', 'is_metro', 'is_default', 'date_from', 'date_to']);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'display_order');
            $order = $request->input('order', 'asc');

            $cities = $this->cityService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\City\CityResource::collection($cities),
                'Cities retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreCityRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', City::class);

            $city = $this->cityService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\City\CityResource($city->load(['country', 'state'])),
                'City created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(City $city): JsonResponse
    {
        try {
            $this->authorize('view', $city);

            return $this->successResponse(
                new \App\Http\Resources\City\CityResource($city->load(['country', 'state'])),
                'City retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateCityRequest $request, City $city): JsonResponse
    {
        try {
            $this->authorize('update', $city);

            $city = $this->cityService->update($city, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\City\CityResource($city->load(['country', 'state'])),
                'City updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(City $city): JsonResponse
    {
        try {
            $this->authorize('delete', $city);

            $this->cityService->delete($city);

            return $this->successResponse(null, 'City deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $city = City::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $city);

            $result = $this->cityService->restore($city->id);

            if (!$result) {
                return $this->errorResponse('Failed to restore city', 400);
            }

            return $this->successResponse(null, 'City restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('City not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $city = City::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $city);

            $this->cityService->forceDelete($city);

            return $this->successResponse(null, 'City permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('City not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, City $city): JsonResponse
    {
        try {
            $this->authorize('update', $city);

            $request->validate([
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $city = $this->cityService->setStatus($city, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\City\CityResource($city->load(['country', 'state'])),
                'City status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(City $city): JsonResponse
    {
        try {
            $this->authorize('update', $city);

            $result = $this->cityService->setDefault($city);

            if (!$result) {
                return $this->errorResponse('Failed to set city as default', 400);
            }

            return $this->successResponse(
                new \App\Http\Resources\City\CityResource($city->fresh()->load(['country', 'state'])),
                'City set as default successfully'
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
                'ids.*' => 'integer|exists:cities,id',
            ]);

            $count = $this->cityService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} cities deleted successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkStatus(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:cities,id',
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $count = $this->cityService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} cities status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
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

            $result = $this->cityService->import($data);

            return $this->successResponse($result, 'Import completed');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['status', 'country_id', 'state_id', 'search']);
            $cities = $this->cityService->export($filters);

            $csv = "Country,State,City,City Code,Latitude,Longitude,Timezone,Population,Display Order,Metro,Status,Is Default\n";

            foreach ($cities as $city) {
                $csv .= implode(',', [
                    '"' . str_replace('"', '""', $city->country->name ?? '') . '"',
                    '"' . str_replace('"', '""', $city->state->name ?? '') . '"',
                    '"' . str_replace('"', '""', $city->name) . '"',
                    $city->city_code,
                    $city->latitude ?? '',
                    $city->longitude ?? '',
                    $city->timezone ?? '',
                    $city->population ?? '',
                    $city->display_order,
                    $city->is_metro ? 'Yes' : 'No',
                    $city->status instanceof \App\Enums\StatusEnum ? $city->status->value : $city->status,
                    $city->is_default ? 'Yes' : 'No',
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="cities_export_' . now()->format('Y_m_d_His') . '.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function downloadTemplate(): Response
    {
        try {
            $csv = "Country ID,State ID,City Name,City Code,Latitude,Longitude,Timezone,Population,Display Order,Is Metro,Status\n";
            $csv .= "1,1,Mumbai,MUM,19.0760,72.8777,Asia/Kolkata,12442373,0,Yes,active\n";
            $csv .= "1,1,Pune,PUN,18.5204,73.8567,Asia/Kolkata,3124458,1,No,active\n";

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="city_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function byCountry(Request $request, string $countryUuid): JsonResponse
    {
        try {
            $country = \App\Models\Master\Country::where('uuid', $countryUuid)->firstOrFail();
            $cities = $this->cityService->getActiveByCountry($country->id);

            return $this->successResponse(
                \App\Http\Resources\City\CityResource::collection($cities),
                'Cities retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Country not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function byState(Request $request, string $stateUuid): JsonResponse
    {
        try {
            $state = \App\Models\Master\State::where('uuid', $stateUuid)->firstOrFail();
            $cities = $this->cityService->getActiveByState($state->id);

            return $this->successResponse(
                \App\Http\Resources\City\CityResource::collection($cities),
                'Cities retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('State not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
