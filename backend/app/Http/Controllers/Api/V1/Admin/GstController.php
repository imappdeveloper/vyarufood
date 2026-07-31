<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Finance\GstTransactionResource;
use App\Services\Finance\GstServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GstController extends BaseController
{
    public function __construct(
        private readonly GstServiceInterface $gstService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only([
            'search', 'transaction_type', 'financial_year_id',
            'from_date', 'to_date', 'is_reconciled',
        ]);
        $paginator = $this->gstService->getPaginated($filters, $perPage);
        return $this->paginatedResponse(GstTransactionResource::collection($paginator), 'GST transactions retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'transaction_date' => 'required|date',
            'transaction_type' => 'required|in:input,output',
            'reference_type' => 'nullable|string|max:100',
            'reference_id' => 'nullable|integer',
            'invoice_number' => 'nullable|string|max:50',
            'invoice_date' => 'nullable|date',
            'party_name' => 'required|string|max:200',
            'party_gstin' => 'nullable|string|max:20',
            'gst_rate' => 'required|numeric|min:0|max:100',
            'hsn_code' => 'nullable|string|max:20',
            'taxable_amount' => 'required|numeric|min:0',
            'cgst_amount' => 'required|numeric|min:0',
            'sgst_amount' => 'required|numeric|min:0',
            'igst_amount' => 'required|numeric|min:0',
            'cess_amount' => 'required|numeric|min:0',
            'filing_period' => 'nullable|string|max:20',
            'filing_year' => 'nullable|string|max:10',
        ]);
        $entry = $this->gstService->addEntry($request->validated());
        return $this->createdResponse(new GstTransactionResource($entry), 'GST transaction created successfully');
    }

    public function show(string $uuid): JsonResponse
    {
        $transactions = $this->gstService->getPaginated(['uuid' => $uuid], 1);
        $transaction = $transactions->first();
        if (! $transaction) return $this->notFoundResponse('GST transaction not found');
        return $this->successResponse(new GstTransactionResource($transaction), 'GST transaction retrieved successfully');
    }

    public function summary(Request $request): JsonResponse
    {
        $request->validate([
            'financial_year_id' => 'required|integer|exists:financial_years,id',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
        ]);
        $data = $this->gstService->getGstSummary(
            (int) $request->input('financial_year_id'),
            $request->input('from_date'),
            $request->input('to_date'),
        );
        return $this->successResponse($data, 'GST summary retrieved successfully');
    }

    public function inputTax(): JsonResponse
    {
        $data = $this->gstService->getInputTax();
        return $this->successResponse($data, 'Input tax summary retrieved successfully');
    }

    public function outputTax(): JsonResponse
    {
        $data = $this->gstService->getOutputTax();
        return $this->successResponse($data, 'Output tax summary retrieved successfully');
    }
}
