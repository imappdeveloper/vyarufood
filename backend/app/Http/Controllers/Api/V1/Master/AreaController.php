<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Area\StoreAreaRequest;
use App\Http\Requests\Area\UpdateAreaRequest;
use App\Models\Master\Area;
use App\Services\Area\AreaServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AreaController extends BaseController
{
    public function __construct(
        protected AreaServiceInterface $areaService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Area::class);

            $filters = $request->only(['search', 'status', 'country_id', 'state_id', 'city_id', 'is_serviceable', 'is_default', 'date_from', 'date_to']);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'display_order');
            $order = $request->input('order', 'asc');

            $areas = $this->areaService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Area\AreaResource::collection($areas),
                'Areas retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreAreaRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Area::class);

            $area = $this->areaService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\Area\AreaResource($area->load(['country', 'state', 'city'])),
                'Area created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(Area $area): JsonResponse
    {
        try {
            $this->authorize('view', $area);

            return $this->successResponse(
                new \App\Http\Resources\Area\AreaResource($area->load(['country', 'state', 'city'])),
                'Area retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateAreaRequest $request, Area $area): JsonResponse
    {
        try {
            $this->authorize('update', $area);

            $area = $this->areaService->update($area, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\Area\AreaResource($area->load(['country', 'state', 'city'])),
                'Area updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(Area $area): JsonResponse
    {
        try {
            $this->authorize('delete', $area);

            $this->areaService->delete($area);

            return $this->successResponse(null, 'Area deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $area = Area::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $area);

            $result = $this->areaService->restore($area->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore area', 400);
            }

            return $this->successResponse(null, 'Area restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Area not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $area = Area::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $area);

            $this->areaService->forceDelete($area);

            return $this->successResponse(null, 'Area permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Area not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, Area $area): JsonResponse
    {
        try {
            $this->authorize('update', $area);

            $request->validate([
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $area = $this->areaService->setStatus($area, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\Area\AreaResource($area->load(['country', 'state', 'city'])),
                'Area status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setService(Request $request, Area $area): JsonResponse
    {
        try {
            $this->authorize('update', $area);

            $request->validate([
                'is_serviceable' => 'required|boolean',
            ]);

            $area = $this->areaService->setServiceable($area, $request->boolean('is_serviceable'));

            return $this->successResponse(
                new \App\Http\Resources\Area\AreaResource($area->load(['country', 'state', 'city'])),
                'Area service status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(Area $area): JsonResponse
    {
        try {
            $this->authorize('update', $area);

            $result = $this->areaService->setDefault($area);

            if (! $result) {
                return $this->errorResponse('Failed to set area as default', 400);
            }

            return $this->successResponse(
                new \App\Http\Resources\Area\AreaResource($area->fresh()->load(['country', 'state', 'city'])),
                'Area set as default successfully'
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
                'ids.*' => 'integer|exists:areas,id',
            ]);

            $count = $this->areaService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} areas deleted successfully");
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
                'ids.*' => 'integer|exists:areas,id',
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $count = $this->areaService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} areas status updated successfully");
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

            $result = $this->areaService->import($data);

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
            $filters = $request->only(['status', 'country_id', 'state_id', 'city_id', 'search']);
            $areas = $this->areaService->export($filters);

            $csv = "Country,State,City,Area,Area Code,Postal Zone,Latitude,Longitude,Delivery Radius,Min Order,Delivery Charge,Est. Delivery (min),Serviceable,Status,Is Default\n";

            foreach ($areas as $area) {
                $csv .= implode(',', [
                    '"' . str_replace('"', '""', $area->country->name ?? '') . '"',
                    '"' . str_replace('"', '""', $area->state->name ?? '') . '"',
                    '"' . str_replace('"', '""', $area->city->name ?? '') . '"',
                    '"' . str_replace('"', '""', $area->name) . '"',
                    $area->area_code,
                    $area->postal_zone ?? '',
                    $area->latitude ?? '',
                    $area->longitude ?? '',
                    $area->delivery_radius ?? '',
                    $area->minimum_order_amount ?? '',
                    $area->delivery_charge ?? '',
                    $area->estimated_delivery_time ?? '',
                    $area->is_serviceable ? 'Yes' : 'No',
                    $area->status instanceof \App\Enums\StatusEnum ? $area->status->value : $area->status,
                    $area->is_default ? 'Yes' : 'No',
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="areas_export_' . now()->format('Y_m_d_His') . '.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function downloadTemplate(): Response
    {
        try {
            $csv = "Country ID,State ID,City ID,Area Name,Area Code,Postal Zone,Latitude,Longitude,Delivery Radius,Min Order,Delivery Charge,Est Delivery (min),Is Serviceable,Status\n";
            $csv .= "1,1,1,Andheri West,AND-W,400058,19.1364,72.8296,5.00,150.00,20.00,30,Yes,active\n";
            $csv .= "1,1,1,Bandra East,BND-E,400051,19.0596,72.8295,3.00,200.00,15.00,25,Yes,active\n";

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="area_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function byCity(Request $request, string $cityUuid): JsonResponse
    {
        try {
            $city = \App\Models\Master\City::where('uuid', $cityUuid)->firstOrFail();
            $areas = $this->areaService->getActiveByCity($city->id);

            return $this->successResponse(
                \App\Http\Resources\Area\AreaResource::collection($areas),
                'Areas retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('City not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
