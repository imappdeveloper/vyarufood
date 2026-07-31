<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Purchase\{StorePurchaseRequestRequest, UpdatePurchaseRequestRequest};
use App\Http\Resources\Purchase\{PurchaseRequestResource, PurchaseRequestItemResource};
use App\Services\Purchase\PurchaseRequestServiceInterface;
use App\DTOs\Purchase\PurchaseRequestDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseRequestController extends BaseController
{
    public function __construct(
        protected PurchaseRequestServiceInterface $prService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['search', 'status', 'priority', 'request_type']);

        $requests = $this->prService->getPaginatedRequests($filters, $perPage);

        return $this->paginatedResponse(
            PurchaseRequestResource::collection($requests),
            'Purchase requests retrieved successfully'
        );
    }

    public function store(StorePurchaseRequestRequest $request): JsonResponse
    {
        $dto = PurchaseRequestDTO::fromArray($request->validated());

        $purchaseRequest = $this->prService->createRequest($dto);

        return $this->createdResponse(
            new PurchaseRequestResource($purchaseRequest),
            'Purchase request created successfully.',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $purchaseRequest = $this->prService->getRequestByUuid($uuid);

        if (! $purchaseRequest) {
            return $this->notFoundResponse('Purchase request not found.');
        }

        return $this->successResponse(
            new PurchaseRequestResource($purchaseRequest),
        );
    }

    public function update(UpdatePurchaseRequestRequest $request, string $uuid): JsonResponse
    {
        $purchaseRequest = $this->prService->getRequestByUuid($uuid);

        if (! $purchaseRequest) {
            return $this->notFoundResponse('Purchase request not found.');
        }

        $dto = PurchaseRequestDTO::fromArray($request->validated() + [
            'id' => $purchaseRequest->id,
        ]);

        $updated = $this->prService->updateRequest($purchaseRequest->id, $dto);

        return $this->successResponse(
            new PurchaseRequestResource($updated),
            'Purchase request updated successfully.',
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $purchaseRequest = $this->prService->getRequestByUuid($uuid);

        if (! $purchaseRequest) {
            return $this->notFoundResponse('Purchase request not found.');
        }

        $this->prService->deleteRequest($purchaseRequest->id);

        return $this->successResponse(null, 'Purchase request deleted successfully.');
    }

    public function approve(string $uuid): JsonResponse
    {
        $purchaseRequest = $this->prService->getRequestByUuid($uuid);

        if (! $purchaseRequest) {
            return $this->notFoundResponse('Purchase request not found.');
        }

        $adminId = auth()->guard('admin')->id();
        $updated = $this->prService->approveRequest($purchaseRequest->id, $adminId);

        return $this->successResponse(
            new PurchaseRequestResource($updated),
            'Purchase request approved successfully.',
        );
    }

    public function reject(Request $request, string $uuid): JsonResponse
    {
        $purchaseRequest = $this->prService->getRequestByUuid($uuid);

        if (! $purchaseRequest) {
            return $this->notFoundResponse('Purchase request not found.');
        }

        $adminId = auth()->guard('admin')->id();
        $updated = $this->prService->rejectRequest(
            $purchaseRequest->id,
            $adminId,
            $request->input('reason'),
        );

        return $this->successResponse(
            new PurchaseRequestResource($updated),
            'Purchase request rejected successfully.',
        );
    }

    public function cancel(string $uuid): JsonResponse
    {
        $purchaseRequest = $this->prService->getRequestByUuid($uuid);

        if (! $purchaseRequest) {
            return $this->notFoundResponse('Purchase request not found.');
        }

        $updated = $this->prService->cancelRequest($purchaseRequest->id);

        return $this->successResponse(
            new PurchaseRequestResource($updated),
            'Purchase request cancelled successfully.',
        );
    }

    public function getStats(): JsonResponse
    {
        $stats = $this->prService->getStats();

        return $this->successResponse($stats);
    }
}
