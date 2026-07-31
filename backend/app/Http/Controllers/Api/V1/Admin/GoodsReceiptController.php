<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Purchase\StoreGoodsReceiptRequest;
use App\Http\Resources\Purchase\{GoodsReceiptResource, GoodsReceiptItemResource};
use App\Services\Purchase\GoodsReceiptServiceInterface;
use App\DTOs\Purchase\GoodsReceiptDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoodsReceiptController extends BaseController
{
    public function __construct(
        protected GoodsReceiptServiceInterface $grnService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['search', 'status', 'supplier_id']);

        $receipts = $this->grnService->getPaginatedReceipts($filters, $perPage);

        return $this->paginatedResponse(
            GoodsReceiptResource::collection($receipts),
            'Goods receipts retrieved successfully'
        );
    }

    public function store(StoreGoodsReceiptRequest $request): JsonResponse
    {
        $dto = GoodsReceiptDTO::fromArray($request->validated());

        $grn = $this->grnService->createReceipt($dto);

        return $this->createdResponse(
            new GoodsReceiptResource($grn),
            'Goods receipt created successfully.',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $grn = $this->grnService->getReceiptByUuid($uuid);

        if (! $grn) {
            return $this->notFoundResponse('Goods receipt not found.');
        }

        return $this->successResponse(
            new GoodsReceiptResource($grn),
        );
    }

    public function getStats(): JsonResponse
    {
        $stats = $this->grnService->getStats();

        return $this->successResponse($stats);
    }
}
