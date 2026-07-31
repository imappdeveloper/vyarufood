<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\DeliveryZone\StoreDeliveryZoneRequest;
use App\Http\Requests\DeliveryZone\UpdateDeliveryZoneRequest;
use App\Models\Master\DeliveryZone;
use App\Services\DeliveryZone\DeliveryZoneServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DeliveryZoneController extends BaseController
{
    public function __construct(
        protected DeliveryZoneServiceInterface $deliveryZoneService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', DeliveryZone::class);

            $filters = $request->only(['search', 'status', 'city_id', 'is_default', 'date_from', 'date_to']);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'priority');
            $order = $request->input('order', 'asc');

            $zones = $this->deliveryZoneService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\DeliveryZone\DeliveryZoneResource::collection($zones),
                'Delivery zones retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreDeliveryZoneRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', DeliveryZone::class);

            $zone = $this->deliveryZoneService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\DeliveryZone\DeliveryZoneResource($zone->load(['country', 'state', 'city', 'area', 'pincodes'])),
                'Delivery zone created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(DeliveryZone $deliveryZone): JsonResponse
    {
        try {
            $this->authorize('view', $deliveryZone);

            return $this->successResponse(
                new \App\Http\Resources\DeliveryZone\DeliveryZoneResource($deliveryZone->load(['country', 'state', 'city', 'area', 'pincodes', 'deliverySlots'])),
                'Delivery zone retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateDeliveryZoneRequest $request, DeliveryZone $deliveryZone): JsonResponse
    {
        try {
            $this->authorize('update', $deliveryZone);

            $zone = $this->deliveryZoneService->update($deliveryZone, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\DeliveryZone\DeliveryZoneResource($zone->load(['country', 'state', 'city', 'area', 'pincodes'])),
                'Delivery zone updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(DeliveryZone $deliveryZone): JsonResponse
    {
        try {
            $this->authorize('delete', $deliveryZone);

            $this->deliveryZoneService->delete($deliveryZone);

            return $this->successResponse(null, 'Delivery zone deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $zone = DeliveryZone::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $zone);

            $result = $this->deliveryZoneService->restore($zone->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore delivery zone', 400);
            }

            return $this->successResponse(null, 'Delivery zone restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Delivery zone not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $zone = DeliveryZone::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $zone);

            $this->deliveryZoneService->forceDelete($zone);

            return $this->successResponse(null, 'Delivery zone permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Delivery zone not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:delivery_zones,id',
            ]);

            $count = $this->deliveryZoneService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} delivery zones deleted successfully");
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
                'ids.*' => 'integer|exists:delivery_zones,id',
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $count = $this->deliveryZoneService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} delivery zones status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['status', 'city_id', 'search']);
            $zones = $this->deliveryZoneService->export($filters);

            $csv = "ID,Zone Name,Zone Code,Country,State,City,Area,Description,Delivery Radius,Min Order,Delivery Charge,Free Delivery Above,Est Time,Max Orders,Priority,Status,Default,Remarks\n";

            foreach ($zones as $zone) {
                $csv .= implode(',', [
                    $zone->id,
                    '"' . str_replace('"', '""', $zone->zone_name ?? '') . '"',
                    '"' . str_replace('"', '""', $zone->zone_code ?? '') . '"',
                    '"' . str_replace('"', '""', $zone->country->name ?? '') . '"',
                    '"' . str_replace('"', '""', $zone->state->name ?? '') . '"',
                    '"' . str_replace('"', '""', $zone->city->name ?? '') . '"',
                    '"' . str_replace('"', '""', $zone->area->name ?? '') . '"',
                    '"' . str_replace('"', '""', $zone->description ?? '') . '"',
                    $zone->delivery_radius ?? '',
                    $zone->minimum_order_amount ?? '',
                    $zone->delivery_charge ?? '',
                    $zone->free_delivery_above ?? '',
                    $zone->estimated_delivery_time ?? '',
                    $zone->maximum_orders_per_slot ?? '',
                    $zone->priority ?? '',
                    $zone->status instanceof \App\Enums\StatusEnum ? $zone->status->value : $zone->status,
                    $zone->is_default ? 'Yes' : 'No',
                    '"' . str_replace('"', '""', $zone->remarks ?? '') . '"',
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="delivery_zones_export_' . now()->format('Y_m_d_His') . '.csv"',
            ]);
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

            $result = $this->deliveryZoneService->import($data);

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
            $csv = "City ID,Zone Name,Zone Code,Description,Latitude,Longitude,Radius (km),Min Order Amount,Delivery Charge,Est Delivery (min),Is Default,Status\n";
            $csv .= "1,Zone A Central,ZAC-001,Core delivery zone,19.0760,72.8777,5.00,150.00,20.00,30,Yes,active\n";
            $csv .= "1,Zone B Extended,ZBE-002,Extended coverage area,19.0596,72.8295,10.00,200.00,30.00,45,No,active\n";

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="delivery_zone_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(DeliveryZone $deliveryZone): JsonResponse
    {
        try {
            $this->authorize('update', $deliveryZone);

            $result = $this->deliveryZoneService->setDefault($deliveryZone);

            if (! $result) {
                return $this->errorResponse('Failed to set delivery zone as default', 400);
            }

            return $this->successResponse(
                new \App\Http\Resources\DeliveryZone\DeliveryZoneResource($deliveryZone->fresh()->load(['country', 'state', 'city', 'area', 'pincodes'])),
                'Delivery zone set as default successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function checkServiceArea(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'city_id' => 'nullable|integer|exists:cities,id',
            ]);

            $result = $this->deliveryZoneService->checkServiceArea([
                'latitude' => $request->input('latitude'),
                'longitude' => $request->input('longitude'),
                'city_id' => $request->input('city_id'),
            ]);

            return $this->successResponse(
                $result,
                'Service area check completed'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
