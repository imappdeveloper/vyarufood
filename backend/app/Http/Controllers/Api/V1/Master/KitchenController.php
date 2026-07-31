<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Kitchen\StoreKitchenRequest;
use App\Http\Requests\Kitchen\UpdateKitchenRequest;
use App\Models\Kitchen;
use App\Services\Kitchen\KitchenServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class KitchenController extends BaseController
{
    public function __construct(
        protected KitchenServiceInterface $kitchenService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Kitchen::class);

            $filters = $request->only([
                'search', 'status', 'kitchen_type', 'is_default',
                'city_id', 'area_id', 'delivery_zone_id', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'created_at');
            $order = $request->input('order', 'desc');

            $kitchens = $this->kitchenService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Kitchen\KitchenResource::collection($kitchens),
                'Kitchens retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreKitchenRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Kitchen::class);

            $kitchen = $this->kitchenService->create($request->validated());

            $relations = ['country', 'state', 'city', 'area', 'deliveryZone'];

            return $this->createdResponse(
                new \App\Http\Resources\Kitchen\KitchenResource($kitchen->load($relations)),
                'Kitchen created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(Kitchen $kitchen): JsonResponse
    {
        try {
            $this->authorize('view', $kitchen);

            $relations = ['country', 'state', 'city', 'area', 'deliveryZone', 'createdBy', 'updatedBy'];
            $kitchen->load($relations);

            return $this->successResponse(
                new \App\Http\Resources\Kitchen\KitchenResource($kitchen),
                'Kitchen retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateKitchenRequest $request, Kitchen $kitchen): JsonResponse
    {
        try {
            $this->authorize('update', $kitchen);

            $kitchen = $this->kitchenService->update($kitchen, $request->validated());

            $relations = ['country', 'state', 'city', 'area', 'deliveryZone'];

            return $this->successResponse(
                new \App\Http\Resources\Kitchen\KitchenResource($kitchen->load($relations)),
                'Kitchen updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(Kitchen $kitchen): JsonResponse
    {
        try {
            $this->authorize('delete', $kitchen);

            if ($this->kitchenService->findByUuid($kitchen->uuid) && $kitchen->is_default) {
                return $this->errorResponse('Default kitchen cannot be deleted', 422);
            }

            $this->kitchenService->delete($kitchen);

            return $this->successResponse(null, 'Kitchen deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $kitchen = Kitchen::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $kitchen);

            $result = $this->kitchenService->restore($kitchen->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore kitchen', 400);
            }

            return $this->successResponse(null, 'Kitchen restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kitchen not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $kitchen = Kitchen::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $kitchen);

            if ($this->kitchenService->hasRelatedData($kitchen)) {
                return $this->errorResponse('Cannot permanently delete kitchen with related data', 422);
            }

            $this->kitchenService->forceDelete($kitchen);

            return $this->successResponse(null, 'Kitchen permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Kitchen not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(Kitchen $kitchen): JsonResponse
    {
        try {
            $this->authorize('update', $kitchen);

            $kitchen = $this->kitchenService->setDefault($kitchen);

            $relations = ['country', 'state', 'city', 'area', 'deliveryZone'];

            return $this->successResponse(
                new \App\Http\Resources\Kitchen\KitchenResource($kitchen->load($relations)),
                'Default kitchen updated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, Kitchen $kitchen): JsonResponse
    {
        try {
            $this->authorize('update', $kitchen);

            $request->validate([
                'status' => 'required|string|in:active,inactive',
            ]);

            $kitchen = $this->kitchenService->setStatus($kitchen, $request->input('status'));

            $relations = ['country', 'state', 'city', 'area', 'deliveryZone'];

            return $this->successResponse(
                new \App\Http\Resources\Kitchen\KitchenResource($kitchen->load($relations)),
                'Kitchen status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:kitchens,id',
            ]);

            $count = $this->kitchenService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} kitchens deleted successfully");
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
                'ids.*' => 'integer|exists:kitchens,id',
                'status' => 'required|string|in:active,inactive',
            ]);

            $count = $this->kitchenService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} kitchens status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['status', 'kitchen_type', 'search']);
            $kitchens = $this->kitchenService->export($filters);

            $headers = [
                'ID', 'UUID', 'Kitchen Code', 'Name', 'Description', 'Kitchen Type',
                'Manager Name', 'Manager Mobile', 'Manager Email',
                'Country', 'State', 'City', 'Area', 'Delivery Zone',
                'Address Line 1', 'Address Line 2', 'Landmark',
                'Latitude', 'Longitude',
                'Opening Time', 'Closing Time', 'Preparation Start Time',
                'Accept Order Start', 'Accept Order End',
                'Daily Capacity', 'Maximum Orders', 'Emergency Contact',
                'License Number', 'FSSAI Number', 'GST Number',
                'Status', 'Is Default', 'Created At',
            ];

            $csv = implode(',', $headers) . "\n";

            foreach ($kitchens as $kitchen) {
                $row = [
                    $kitchen->id,
                    $kitchen->uuid,
                    $kitchen->kitchen_code,
                    '"' . str_replace('"', '""', $kitchen->name) . '"',
                    '"' . str_replace('"', '""', $kitchen->description ?? '') . '"',
                    $kitchen->kitchen_type,
                    '"' . str_replace('"', '""', $kitchen->manager_name ?? '') . '"',
                    $kitchen->manager_mobile ?? '',
                    $kitchen->manager_email ?? '',
                    $kitchen->country?->name ?? '',
                    $kitchen->state?->name ?? '',
                    $kitchen->city?->name ?? '',
                    $kitchen->area?->name ?? '',
                    $kitchen->deliveryZone?->zone_name ?? '',
                    '"' . str_replace('"', '""', $kitchen->address_line_1 ?? '') . '"',
                    '"' . str_replace('"', '""', $kitchen->address_line_2 ?? '') . '"',
                    '"' . str_replace('"', '""', $kitchen->landmark ?? '') . '"',
                    $kitchen->latitude ?? '',
                    $kitchen->longitude ?? '',
                    $kitchen->opening_time ?? '',
                    $kitchen->closing_time ?? '',
                    $kitchen->preparation_start_time ?? '',
                    $kitchen->accept_order_start_time ?? '',
                    $kitchen->accept_order_end_time ?? '',
                    $kitchen->daily_capacity ?? '',
                    $kitchen->maximum_orders ?? '',
                    $kitchen->emergency_contact ?? '',
                    $kitchen->license_number ?? '',
                    $kitchen->fssai_number ?? '',
                    $kitchen->gst_number ?? '',
                    $kitchen->status,
                    $kitchen->is_default ? 'Yes' : 'No',
                    $kitchen->created_at?->format('Y-m-d H:i:s') ?? '',
                ];

                $csv .= implode(',', $row) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="kitchens_export_' . now()->format('Y_m_d_His') . '.csv"',
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

            $result = $this->kitchenService->import($data);

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
            $csv = $this->kitchenService->downloadSampleTemplate();

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="kitchen_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Kitchen::class);

            $stats = $this->kitchenService->getStats();

            return $this->successResponse($stats, 'Kitchen statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Kitchen::class);

            $request->validate([
                'q' => 'nullable|string|max:255',
            ]);

            $kitchens = $this->kitchenService->search($request->input('q'));

            return $this->successResponse(
                \App\Http\Resources\Kitchen\KitchenResource::collection($kitchens),
                'Search results retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
