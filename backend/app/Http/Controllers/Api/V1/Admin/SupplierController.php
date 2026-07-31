<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\Http\Requests\Supplier\{StoreSupplierRequest, UpdateSupplierRequest, ChangeSupplierStatusRequest, BlacklistSupplierRequest, StoreSupplierProductRequest, UpdateSupplierProductRequest, StoreSupplierDocumentRequest, StoreSupplierContactRequest, UpdateSupplierContactRequest};
use App\Http\Resources\Supplier\{SupplierResource, SupplierProductResource, SupplierDocumentResource, SupplierContactResource, SupplierPriceHistoryResource};
use App\Models\Supplier;
use App\Services\Supplier\{SupplierServiceInterface, SupplierProductServiceInterface, SupplierDocumentServiceInterface, SupplierContactServiceInterface};
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends BaseController
{
    public function __construct(
        private SupplierServiceInterface $supplierService,
        private SupplierProductServiceInterface $productService,
        private SupplierDocumentServiceInterface $documentService,
        private SupplierContactServiceInterface $contactService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Supplier::class);

            $filters = $request->only([
                'search', 'supplier_type', 'status', 'is_preferred', 'rating', 'city_id',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $suppliers = $this->supplierService->getPaginated($filters, $perPage);

            return $this->paginatedResponse(
                SupplierResource::collection($suppliers),
                'Suppliers retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreSupplierRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Supplier::class);

            $dto = \App\DTOs\Supplier\SupplierDTO::fromArray($request->validated());
            $supplier = $this->supplierService->create($dto);

            return $this->createdResponse(
                new SupplierResource($supplier->load('country', 'state', 'city')),
                'Supplier created successfully'
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
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $this->authorize('view', $supplier);

            return $this->successResponse(
                new SupplierResource($supplier->load('country', 'state', 'city', 'products.inventoryItem', 'products.unit', 'documents', 'contacts', 'createdBy', 'updatedBy')),
                'Supplier retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateSupplierRequest $request, string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $this->authorize('update', $supplier);

            $dto = \App\DTOs\Supplier\SupplierDTO::fromArray($request->validated());
            $supplier = $this->supplierService->update($supplier->id, $dto);

            return $this->successResponse(
                new SupplierResource($supplier->load('country', 'state', 'city')),
                'Supplier updated successfully'
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
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $this->authorize('delete', $supplier);

            $this->supplierService->delete($supplier->id);

            return $this->successResponse(null, 'Supplier deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function changeStatus(ChangeSupplierStatusRequest $request, string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $supplier = $this->supplierService->changeStatus($supplier->id, $request->input('status'));

            return $this->successResponse(
                new SupplierResource($supplier->load('country', 'state', 'city')),
                'Supplier status updated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function blacklist(BlacklistSupplierRequest $request, string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $supplier = $this->supplierService->blacklist($supplier->id, $request->input('reason'));

            return $this->successResponse(
                new SupplierResource($supplier->load('country', 'state', 'city')),
                'Supplier blacklisted successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $supplier = $this->supplierService->restore($supplier->id);

            return $this->successResponse(
                new SupplierResource($supplier->load('country', 'state', 'city')),
                'Supplier restored successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getStats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Supplier::class);

            $stats = $this->supplierService->getStats();

            return $this->successResponse($stats, 'Supplier statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getDashboardStats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Supplier::class);

            $stats = $this->supplierService->getDashboardStats();

            return $this->successResponse($stats, 'Supplier dashboard statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getProducts(string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $products = $this->productService->getBySupplier($supplier->id);

            return $this->successResponse(
                SupplierProductResource::collection($products),
                'Supplier products retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function storeProduct(StoreSupplierProductRequest $request, string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $data = $request->validated();
            $data['supplier_id'] = $supplier->id;

            $dto = \App\DTOs\Supplier\SupplierProductDTO::fromArray($data);
            $product = $this->productService->create($dto);

            return $this->createdResponse(
                new SupplierProductResource($product->load('inventoryItem', 'unit')),
                'Supplier product created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function updateProduct(UpdateSupplierProductRequest $request, string $productUuid): JsonResponse
    {
        try {
            $product = \App\Models\SupplierProduct::where('uuid', $productUuid)->first();

            if (! $product) {
                return $this->notFoundResponse('Supplier product not found');
            }

            $dto = \App\DTOs\Supplier\SupplierProductDTO::fromArray(array_merge($request->validated(), ['id' => $product->id]));
            $product = $this->productService->update($product->id, $dto);

            return $this->successResponse(
                new SupplierProductResource($product->load('inventoryItem', 'unit')),
                'Supplier product updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroyProduct(string $productUuid): JsonResponse
    {
        try {
            $product = \App\Models\SupplierProduct::where('uuid', $productUuid)->first();

            if (! $product) {
                return $this->notFoundResponse('Supplier product not found');
            }

            $this->productService->delete($product->id);

            return $this->successResponse(null, 'Supplier product deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getDocuments(string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $documents = $this->documentService->getBySupplier($supplier->id);

            return $this->successResponse(
                SupplierDocumentResource::collection($documents),
                'Supplier documents retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function storeDocument(StoreSupplierDocumentRequest $request, string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $data = $request->validated();
            $data['supplier_id'] = $supplier->id;

            $dto = \App\DTOs\Supplier\SupplierDocumentDTO::fromArray($data);
            $document = $this->documentService->create($dto);

            return $this->createdResponse(
                new SupplierDocumentResource($document->load('supplier')),
                'Supplier document created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroyDocument(string $documentUuid): JsonResponse
    {
        try {
            $document = \App\Models\SupplierDocument::where('uuid', $documentUuid)->first();

            if (! $document) {
                return $this->notFoundResponse('Supplier document not found');
            }

            $this->documentService->delete($document->id);

            return $this->successResponse(null, 'Supplier document deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getContacts(string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $contacts = $this->contactService->getBySupplier($supplier->id);

            return $this->successResponse(
                SupplierContactResource::collection($contacts),
                'Supplier contacts retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function storeContact(StoreSupplierContactRequest $request, string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $data = $request->validated();
            $data['supplier_id'] = $supplier->id;

            $dto = \App\DTOs\Supplier\SupplierContactDTO::fromArray($data);
            $contact = $this->contactService->create($dto);

            return $this->createdResponse(
                new SupplierContactResource($contact),
                'Supplier contact created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function updateContact(UpdateSupplierContactRequest $request, string $contactUuid): JsonResponse
    {
        try {
            $contact = \App\Models\SupplierContact::where('uuid', $contactUuid)->first();

            if (! $contact) {
                return $this->notFoundResponse('Supplier contact not found');
            }

            $dto = \App\DTOs\Supplier\SupplierContactDTO::fromArray(array_merge($request->validated(), ['id' => $contact->id]));
            $contact = $this->contactService->update($contact->id, $dto);

            return $this->successResponse(
                new SupplierContactResource($contact),
                'Supplier contact updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroyContact(string $contactUuid): JsonResponse
    {
        try {
            $contact = \App\Models\SupplierContact::where('uuid', $contactUuid)->first();

            if (! $contact) {
                return $this->notFoundResponse('Supplier contact not found');
            }

            $this->contactService->delete($contact->id);

            return $this->successResponse(null, 'Supplier contact deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getPriceHistory(string $uuid): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getByUuid($uuid);

            if (! $supplier) {
                return $this->notFoundResponse('Supplier not found');
            }

            $history = $supplier->priceHistory()->with(['inventoryItem', 'supplier'])->orderBy('created_at', 'desc')->get();

            return $this->successResponse(
                SupplierPriceHistoryResource::collection($history),
                'Supplier price history retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
