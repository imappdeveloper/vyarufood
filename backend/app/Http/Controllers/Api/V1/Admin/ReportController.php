<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\DTOs\Report\ExportRequestDTO;
use App\DTOs\Report\ReportFilterDTO;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Report\ExportReportRequest;
use App\Http\Requests\Report\SaveReportRequest;
use App\Http\Requests\Report\ScheduleReportRequest;
use App\Http\Resources\Report\ReportExportResource;
use App\Http\Resources\Report\SavedReportResource;
use App\Http\Resources\Report\ScheduledReportResource;
use App\Services\Report\ExportServiceInterface;
use App\Services\Report\ReportServiceInterface;
use App\Services\Report\SavedReportServiceInterface;
use App\Services\Report\ScheduleServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends BaseController
{
    public function __construct(
        private readonly ReportServiceInterface $reportService,
        private readonly ExportServiceInterface $exportService,
        private readonly SavedReportServiceInterface $savedReportService,
        private readonly ScheduleServiceInterface $scheduleService,
    ) {}

    private function buildReportFilter(Request $request): ReportFilterDTO
    {
        return ReportFilterDTO::fromRequest($request->only([
            'date_from', 'date_to', 'group_by', 'kitchen_id', 'city_id', 'meal_id',
            'meal_category_id', 'customer_id', 'status', 'channel', 'gateway_name',
            'payment_status', 'supplier_id', 'category_id', 'search', 'page', 'per_page',
        ]));
    }

    public function executive(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('executive', $filters);

        return $this->successResponse($data, 'Executive report generated successfully');
    }

    public function sales(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('sales', $filters);

        return $this->successResponse($data, 'Sales report generated successfully');
    }

    public function orders(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('orders', $filters);

        return $this->successResponse($data, 'Orders report generated successfully');
    }

    public function customers(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('customers', $filters);

        return $this->successResponse($data, 'Customers report generated successfully');
    }

    public function subscriptions(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('subscriptions', $filters);

        return $this->successResponse($data, 'Subscriptions report generated successfully');
    }

    public function kitchen(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('kitchen', $filters);

        return $this->successResponse($data, 'Kitchen report generated successfully');
    }

    public function inventory(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('inventory', $filters);

        return $this->successResponse($data, 'Inventory report generated successfully');
    }

    public function purchases(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('purchases', $filters);

        return $this->successResponse($data, 'Purchases report generated successfully');
    }

    public function finance(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('finance', $filters);

        return $this->successResponse($data, 'Finance report generated successfully');
    }

    public function payments(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('payments', $filters);

        return $this->successResponse($data, 'Payments report generated successfully');
    }

    public function gst(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('gst', $filters);

        return $this->successResponse($data, 'GST report generated successfully');
    }

    public function expenses(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('expenses', $filters);

        return $this->successResponse($data, 'Expenses report generated successfully');
    }

    public function suppliers(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('suppliers', $filters);

        return $this->successResponse($data, 'Suppliers report generated successfully');
    }

    public function notifications(Request $request): JsonResponse
    {
        $filters = $this->buildReportFilter($request);
        $data = $this->reportService->generateReport('notifications', $filters);

        return $this->successResponse($data, 'Notifications report generated successfully');
    }

    public function export(ExportReportRequest $request): JsonResponse
    {
        $dto = ExportRequestDTO::fromRequest($request->validated());
        $export = $this->exportService->exportReport($dto);

        return $this->createdResponse(new ReportExportResource($export), 'Report export initiated successfully');
    }

    public function exportHistory(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $paginator = $this->exportService->getExportHistory($perPage);

        return $this->paginatedResponse(ReportExportResource::collection($paginator), 'Export history retrieved successfully');
    }

    public function savedReports(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'report_type', 'is_public']);
        $paginator = $this->savedReportService->getSavedReports($filters, $perPage);

        return $this->paginatedResponse(SavedReportResource::collection($paginator), 'Saved reports retrieved successfully');
    }

    public function saveReport(SaveReportRequest $request): JsonResponse
    {
        $report = $this->savedReportService->createSavedReport($request->validated());

        return $this->createdResponse(new SavedReportResource($report), 'Report saved successfully');
    }

    public function deleteSavedReport(int $id): JsonResponse
    {
        $report = $this->savedReportService->getSavedReport($id);
        if (! $report) {
            return $this->notFoundResponse('Saved report not found');
        }

        $this->savedReportService->deleteSavedReport($id);

        return $this->noContentResponse('Saved report deleted successfully');
    }

    public function scheduledReports(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'report_type', 'frequency', 'status']);
        $paginator = $this->scheduleService->getScheduledReports($filters, $perPage);

        return $this->paginatedResponse(ScheduledReportResource::collection($paginator), 'Scheduled reports retrieved successfully');
    }

    public function scheduleReport(ScheduleReportRequest $request): JsonResponse
    {
        $report = $this->scheduleService->createScheduledReport($request->validated());

        return $this->createdResponse(new ScheduledReportResource($report), 'Report scheduled successfully');
    }

    public function updateScheduledReport(ScheduleReportRequest $request, int $id): JsonResponse
    {
        $existing = $this->scheduleService->getScheduledReports([], 1);
        $report = $this->scheduleService->updateScheduledReport($id, $request->validated());

        return $this->successResponse(new ScheduledReportResource($report), 'Scheduled report updated successfully');
    }

    public function deleteScheduledReport(int $id): JsonResponse
    {
        $this->scheduleService->deleteScheduledReport($id);

        return $this->noContentResponse('Scheduled report deleted successfully');
    }
}
