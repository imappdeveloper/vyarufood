<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Pincode\StorePincodeRequest;
use App\Http\Requests\Pincode\UpdatePincodeRequest;
use App\Models\Master\Pincode;
use App\Services\Pincode\PincodeServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PincodeController extends BaseController
{
    public function __construct(
        protected PincodeServiceInterface $pincodeService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Pincode::class);

            $filters = $request->only(['search', 'status', 'city_id', 'delivery_zone_id', 'is_serviceable', 'date_from', 'date_to']);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'display_order');
            $order = $request->input('order', 'asc');

            $pincodes = $this->pincodeService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Pincode\PincodeResource::collection($pincodes),
                'Pincodes retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StorePincodeRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Pincode::class);

            $pincode = $this->pincodeService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\Pincode\PincodeResource($pincode->load(['country', 'state', 'city', 'area', 'deliveryZone'])),
                'Pincode created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(Pincode $pincode): JsonResponse
    {
        try {
            $this->authorize('view', $pincode);

            return $this->successResponse(
                new \App\Http\Resources\Pincode\PincodeResource($pincode->load(['country', 'state', 'city', 'area', 'deliveryZone'])),
                'Pincode retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdatePincodeRequest $request, Pincode $pincode): JsonResponse
    {
        try {
            $this->authorize('update', $pincode);

            $pincode = $this->pincodeService->update($pincode, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\Pincode\PincodeResource($pincode->load(['country', 'state', 'city', 'area', 'deliveryZone'])),
                'Pincode updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(Pincode $pincode): JsonResponse
    {
        try {
            $this->authorize('delete', $pincode);

            $this->pincodeService->delete($pincode);

            return $this->successResponse(null, 'Pincode deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $pincode = Pincode::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $pincode);

            $result = $this->pincodeService->restore($pincode->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore pincode', 400);
            }

            return $this->successResponse(null, 'Pincode restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Pincode not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $pincode = Pincode::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $pincode);

            $this->pincodeService->forceDelete($pincode);

            return $this->successResponse(null, 'Pincode permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Pincode not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:pincodes,id',
            ]);

            $count = $this->pincodeService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} pincodes deleted successfully");
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
                'ids.*' => 'integer|exists:pincodes,id',
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $count = $this->pincodeService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} pincodes status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['status', 'city_id', 'delivery_zone_id', 'search']);
            $pincodes = $this->pincodeService->export($filters);

            $csv = "City,Delivery Zone,Pincode,Pincode Name,Latitude,Longitude,Is Serviceable,Status\n";

            foreach ($pincodes as $pincode) {
                $csv .= implode(',', [
                    '"' . str_replace('"', '""', $pincode->city->name ?? '') . '"',
                    '"' . str_replace('"', '""', $pincode->deliveryZone->name ?? '') . '"',
                    $pincode->pincode,
                    '"' . str_replace('"', '""', $pincode->name ?? '') . '"',
                    $pincode->latitude ?? '',
                    $pincode->longitude ?? '',
                    $pincode->is_serviceable ? 'Yes' : 'No',
                    $pincode->status instanceof \App\Enums\StatusEnum ? $pincode->status->value : $pincode->status,
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="pincodes_export_' . now()->format('Y_m_d_His') . '.csv"',
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

            $result = $this->pincodeService->import($data);

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
            $csv = "City ID,Delivery Zone ID,Pincode,Pincode Name,Latitude,Longitude,Is Serviceable,Status\n";
            $csv .= "1,1,400058,Andheri West,19.1364,72.8296,Yes,active\n";
            $csv .= "1,1,400051,Bandra East,19.0596,72.8295,Yes,active\n";

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="pincode_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
