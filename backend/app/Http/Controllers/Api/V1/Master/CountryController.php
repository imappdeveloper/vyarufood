<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Country\StoreCountryRequest;
use App\Http\Requests\Country\UpdateCountryRequest;
use App\Models\Master\Country;
use App\Services\Country\CountryServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CountryController extends BaseController
{
    public function __construct(
        protected CountryServiceInterface $countryService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Country::class);

            $filters = $request->only(['search', 'status', 'region']);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'name');
            $order = $request->input('order', 'asc');

            $countries = $this->countryService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Country\CountryResource::collection($countries),
                'Countries retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreCountryRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Country::class);

            $country = $this->countryService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\Country\CountryResource($country),
                'Country created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(Country $country): JsonResponse
    {
        try {
            $this->authorize('view', $country);

            return $this->successResponse(
                new \App\Http\Resources\Country\CountryResource($country),
                'Country retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateCountryRequest $request, Country $country): JsonResponse
    {
        try {
            $this->authorize('update', $country);

            $country = $this->countryService->update($country, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\Country\CountryResource($country),
                'Country updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(Country $country): JsonResponse
    {
        try {
            $this->authorize('delete', $country);

            $this->countryService->delete($country);

            return $this->successResponse(null, 'Country deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $country = Country::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $country);

            $result = $this->countryService->restore($country->id);

            if (!$result) {
                return $this->errorResponse('Failed to restore country', 400);
            }

            return $this->successResponse(null, 'Country restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Country not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $country = Country::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $country);

            $this->countryService->forceDelete($country);

            return $this->successResponse(null, 'Country permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Country not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, Country $country): JsonResponse
    {
        try {
            $this->authorize('update', $country);

            $request->validate([
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $country = $this->countryService->setStatus($country, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\Country\CountryResource($country),
                'Country status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(Country $country): JsonResponse
    {
        try {
            $this->authorize('update', $country);

            $result = $this->countryService->setDefault($country);

            if (!$result) {
                return $this->errorResponse('Failed to set country as default', 400);
            }

            return $this->successResponse(
                new \App\Http\Resources\Country\CountryResource($country->fresh()),
                'Country set as default successfully'
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
                'ids.*' => 'integer|exists:countries,id',
            ]);

            $count = $this->countryService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} countries deleted successfully");
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
                'ids.*' => 'integer|exists:countries,id',
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $count = $this->countryService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} countries status updated successfully");
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
                'file' => 'required|file|mimes:csv,txt|max:10240',
            ]);

            $file = $request->file('file');
            $rows = array_map('str_getcsv', file($file->getRealPath()));
            $headers = array_shift($rows);

            $data = [];
            foreach ($rows as $row) {
                $data[] = array_combine($headers, $row);
            }

            $result = $this->countryService->import($data);

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
            $filters = $request->only(['status', 'region', 'search']);
            $countries = $this->countryService->export($filters);

            $csv = "ISO2,ISO3,Name,Numeric Code,Phone Code,Native Name,Capital,Currency Code,Currency Symbol,Currency Name,Emoji,Latitude,Longitude,Region,Subregion,Nationality,Status,Sort Order,Is Default\n";

            foreach ($countries as $country) {
                $csv .= implode(',', [
                    $country->iso2,
                    $country->iso3,
                    '"' . str_replace('"', '""', $country->name) . '"',
                    $country->numeric_code ?? '',
                    $country->phone_code ?? '',
                    '"' . str_replace('"', '""', $country->native_name ?? '') . '"',
                    '"' . str_replace('"', '""', $country->capital ?? '') . '"',
                    $country->currency_code ?? '',
                    $country->currency_symbol ?? '',
                    '"' . str_replace('"', '""', $country->currency_name ?? '') . '"',
                    $country->emoji ?? '',
                    $country->latitude ?? '',
                    $country->longitude ?? '',
                    '"' . str_replace('"', '""', $country->region ?? '') . '"',
                    '"' . str_replace('"', '""', $country->subregion ?? '') . '"',
                    '"' . str_replace('"', '""', $country->nationality ?? '') . '"',
                    $country->status instanceof \App\Enums\StatusEnum ? $country->status->value : $country->status,
                    $country->sort_order,
                    $country->is_default ? 'Yes' : 'No',
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="countries_export_' . now()->format('Y_m_d_His') . '.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function downloadTemplate(): Response
    {
        try {
            $csv = "Name,ISO2,ISO3,Numeric Code,Phone Code,Native Name,Capital,Currency Code,Currency Symbol,Currency Name,Region,Subregion,Nationality,Status,Sort Order,Is Default\n";
            $csv .= "India,IN,IND,356,91,New Delhi,New Delhi,INR,₹,Indian Rupee,Asia,Southern Asia,Indian,active,0,Yes\n";
            $csv .= "United States,US,USA,840,1,Washington D.C.,Washington D.C.,USD,$,United States Dollar,Americas,Northern America,American,active,0,No\n";

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="country_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
