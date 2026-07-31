<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Support\BaseController;
use App\Http\Requests\CustomerAddress\StoreCustomerAddressRequest;
use App\Http\Requests\CustomerAddress\UpdateCustomerAddressRequest;
use App\Models\CustomerAddress;
use App\Services\CustomerAddress\CustomerAddressServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerAddressController extends BaseController
{
    public function __construct(
        protected CustomerAddressServiceInterface $addressService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerAddress::class);

            $filters = $request->only([
                'search', 'status', 'customer_id', 'city_id', 'area_id',
                'delivery_zone_id', 'address_type', 'is_default', 'is_verified',
                'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'created_at');
            $order = $request->input('order', 'desc');

            $addresses = $this->addressService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\CustomerAddress\CustomerAddressResource::collection($addresses),
                'Customer addresses retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreCustomerAddressRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', CustomerAddress::class);

            $address = $this->addressService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\CustomerAddress\CustomerAddressResource($address->load(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode'])),
                'Customer address created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(CustomerAddress $customerAddress): JsonResponse
    {
        try {
            $this->authorize('view', $customerAddress);

            $customerAddress->load(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode', 'createdBy', 'updatedBy']);

            return $this->successResponse(
                new \App\Http\Resources\CustomerAddress\CustomerAddressResource($customerAddress),
                'Customer address retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateCustomerAddressRequest $request, CustomerAddress $customerAddress): JsonResponse
    {
        try {
            $this->authorize('update', $customerAddress);

            $address = $this->addressService->update($customerAddress, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\CustomerAddress\CustomerAddressResource($address->load(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode'])),
                'Customer address updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(CustomerAddress $customerAddress): JsonResponse
    {
        try {
            $this->authorize('delete', $customerAddress);

            $this->addressService->delete($customerAddress);

            return $this->successResponse(null, 'Customer address deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $address = CustomerAddress::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $address);

            $result = $this->addressService->restore($address->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore customer address', 400);
            }

            return $this->successResponse(null, 'Customer address restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer address not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $address = CustomerAddress::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $address);

            $this->addressService->forceDelete($address);

            return $this->successResponse(null, 'Customer address permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer address not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(CustomerAddress $customerAddress): JsonResponse
    {
        try {
            $this->authorize('update', $customerAddress);

            $address = $this->addressService->setDefault($customerAddress);

            return $this->successResponse(
                new \App\Http\Resources\CustomerAddress\CustomerAddressResource($address->load(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode'])),
                'Default address updated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function verify(CustomerAddress $customerAddress): JsonResponse
    {
        try {
            $this->authorize('update', $customerAddress);

            $address = $this->addressService->verify($customerAddress);

            return $this->successResponse(
                new \App\Http\Resources\CustomerAddress\CustomerAddressResource($address->load(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode'])),
                'Customer address verified successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, CustomerAddress $customerAddress): JsonResponse
    {
        try {
            $this->authorize('update', $customerAddress);

            $request->validate([
                'status' => 'required|string|in:active,inactive',
            ]);

            $address = $this->addressService->setStatus($customerAddress, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\CustomerAddress\CustomerAddressResource($address->load(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode'])),
                'Customer address status updated successfully'
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
                'ids.*' => 'integer|exists:customer_addresses,id',
            ]);

            $count = $this->addressService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} customer addresses deleted successfully");
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
                'ids.*' => 'integer|exists:customer_addresses,id',
                'status' => 'required|string|in:active,inactive',
            ]);

            $count = $this->addressService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} customer addresses status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['customer_id', 'status', 'address_type', 'search']);
            $addresses = $this->addressService->export($filters);

            $csv = "ID,Customer,Address Type,House No,Building,Floor,Street,Landmark,Address Line 1,Address Line 2,City,Area,Delivery Zone,Pincode,Lat,Lng,Contact Person,Contact Mobile,Instruction,Default,Verified,Status\n";

            foreach ($addresses as $address) {
                $csv .= implode(',', [
                    $address->id,
                    '"' . str_replace('"', '""', $address->customer?->full_name ?? '') . '"',
                    $address->address_type,
                    '"' . str_replace('"', '""', $address->house_no ?? '') . '"',
                    '"' . str_replace('"', '""', $address->building_name ?? '') . '"',
                    '"' . str_replace('"', '""', $address->floor ?? '') . '"',
                    '"' . str_replace('"', '""', $address->street ?? '') . '"',
                    '"' . str_replace('"', '""', $address->landmark ?? '') . '"',
                    '"' . str_replace('"', '""', $address->address_line_1 ?? '') . '"',
                    '"' . str_replace('"', '""', $address->address_line_2 ?? '') . '"',
                    '"' . str_replace('"', '""', $address->city?->name ?? '') . '"',
                    '"' . str_replace('"', '""', $address->area?->name ?? '') . '"',
                    '"' . str_replace('"', '""', $address->deliveryZone?->zone_name ?? '') . '"',
                    $address->pincode_id ?? '',
                    $address->latitude ?? '',
                    $address->longitude ?? '',
                    '"' . str_replace('"', '""', $address->contact_person ?? '') . '"',
                    '"' . str_replace('"', '""', $address->contact_mobile ?? '') . '"',
                    '"' . str_replace('"', '""', $address->delivery_instruction ?? '') . '"',
                    $address->is_default ? 'Yes' : 'No',
                    $address->is_verified ? 'Yes' : 'No',
                    $address->status instanceof \App\Enums\StatusEnum ? $address->status->value : $address->status,
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="customer_addresses_export_' . now()->format('Y_m_d_His') . '.csv"',
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

            $result = $this->addressService->import($data);

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
            $csv = $this->addressService->downloadSampleTemplate();

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="customer_address_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerAddress::class);

            $stats = $this->addressService->getStats();

            return $this->successResponse($stats, 'Customer address statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', CustomerAddress::class);

            $request->validate([
                'q' => 'nullable|string|max:255',
            ]);

            $addresses = $this->addressService->search($request->input('q'));

            return $this->successResponse(
                \App\Http\Resources\CustomerAddress\CustomerAddressResource::collection($addresses),
                'Search results retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function checkService(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'pincode_id' => 'nullable|integer|exists:pincodes,id',
                'delivery_zone_id' => 'nullable|integer|exists:delivery_zones,id',
                'city_id' => 'nullable|integer|exists:cities,id',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
            ]);

            $result = $this->addressService->checkServiceAvailability($request->only([
                'pincode_id', 'delivery_zone_id', 'city_id', 'latitude', 'longitude',
            ]));

            return $this->successResponse($result, 'Service availability checked');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
