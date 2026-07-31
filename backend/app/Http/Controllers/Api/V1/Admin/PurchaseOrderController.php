<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Purchase\{StorePurchaseOrderRequest, UpdatePurchaseOrderRequest};
use App\Http\Resources\Purchase\{PurchaseOrderResource, PurchaseOrderItemResource};
use App\Services\Purchase\PurchaseOrderServiceInterface;
use App\DTOs\Purchase\PurchaseOrderDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseOrderController extends BaseController
{
    public function __construct(
        protected PurchaseOrderServiceInterface $poService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['search', 'order_status', 'payment_status', 'supplier_id']);

        $orders = $this->poService->getPaginatedOrders($filters, $perPage);

        return $this->paginatedResponse(
            PurchaseOrderResource::collection($orders),
            'Purchase orders retrieved successfully'
        );
    }

    public function store(StorePurchaseOrderRequest $request): JsonResponse
    {
        $dto = PurchaseOrderDTO::fromArray($request->validated());

        $po = $this->poService->createOrder($dto);

        return $this->createdResponse(
            new PurchaseOrderResource($po),
            'Purchase order created successfully.',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $po = $this->poService->getOrderByUuid($uuid);

        if (! $po) {
            return $this->notFoundResponse('Purchase order not found.');
        }

        return $this->successResponse(
            new PurchaseOrderResource($po),
        );
    }

    public function update(UpdatePurchaseOrderRequest $request, string $uuid): JsonResponse
    {
        $po = $this->poService->getOrderByUuid($uuid);

        if (! $po) {
            return $this->notFoundResponse('Purchase order not found.');
        }

        $dto = PurchaseOrderDTO::fromArray($request->validated() + [
            'id' => $po->id,
        ]);

        $updated = $this->poService->updateOrder($po->id, $dto);

        return $this->successResponse(
            new PurchaseOrderResource($updated),
            'Purchase order updated successfully.',
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $po = $this->poService->getOrderByUuid($uuid);

        if (! $po) {
            return $this->notFoundResponse('Purchase order not found.');
        }

        $this->poService->cancelOrder($po->id);

        return $this->successResponse(null, 'Purchase order cancelled successfully.');
    }

    public function approve(string $uuid): JsonResponse
    {
        $po = $this->poService->getOrderByUuid($uuid);

        if (! $po) {
            return $this->notFoundResponse('Purchase order not found.');
        }

        $adminId = auth()->guard('admin')->id();
        $updated = $this->poService->approveOrder($po->id, $adminId);

        return $this->successResponse(
            new PurchaseOrderResource($updated),
            'Purchase order approved successfully.',
        );
    }

    public function close(string $uuid): JsonResponse
    {
        $po = $this->poService->getOrderByUuid($uuid);

        if (! $po) {
            return $this->notFoundResponse('Purchase order not found.');
        }

        $updated = $this->poService->closeOrder($po->id);

        return $this->successResponse(
            new PurchaseOrderResource($updated),
            'Purchase order closed successfully.',
        );
    }

    public function cancel(string $uuid): JsonResponse
    {
        $po = $this->poService->getOrderByUuid($uuid);

        if (! $po) {
            return $this->notFoundResponse('Purchase order not found.');
        }

        $updated = $this->poService->cancelOrder($po->id);

        return $this->successResponse(
            new PurchaseOrderResource($updated),
            'Purchase order cancelled successfully.',
        );
    }

    public function convertFromRequest(string $requestUuid): JsonResponse
    {
        $pr = app(\App\Services\Purchase\PurchaseRequestServiceInterface::class)
            ->getRequestByUuid($requestUuid);

        if (! $pr) {
            return $this->notFoundResponse('Purchase request not found.');
        }

        $request = request();
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        $adminId = auth()->guard('admin')->id();
        $po = $this->poService->convertRequestToOrder(
            $pr->id,
            $request->input('supplier_id'),
            $adminId,
        );

        return $this->createdResponse(
            new PurchaseOrderResource($po),
            'Purchase order created from request successfully.',
        );
    }

    public function getStats(): JsonResponse
    {
        $stats = $this->poService->getStats();

        return $this->successResponse($stats);
    }
}
