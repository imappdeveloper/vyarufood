<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\State\StoreStateRequest;
use App\Http\Requests\State\UpdateStateRequest;
use App\Models\Master\State;
use App\Services\State\StateServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StateController extends BaseController
{
    public function __construct(
        protected StateServiceInterface $stateService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', State::class);

            $filters = $request->only(['search', 'status', 'country_id']);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'name');
            $order = $request->input('order', 'asc');

            $states = $this->stateService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\State\StateResource::collection($states),
                'States retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreStateRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', State::class);

            $state = $this->stateService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\State\StateResource($state),
                'State created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(State $state): JsonResponse
    {
        try {
            $this->authorize('view', $state);

            return $this->successResponse(
                new \App\Http\Resources\State\StateResource($state->load('country')),
                'State retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateStateRequest $request, State $state): JsonResponse
    {
        try {
            $this->authorize('update', $state);

            $state = $this->stateService->update($state, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\State\StateResource($state->load('country')),
                'State updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(State $state): JsonResponse
    {
        try {
            $this->authorize('delete', $state);

            $this->stateService->delete($state);

            return $this->successResponse(null, 'State deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $state = State::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $state);

            $result = $this->stateService->restore($state->id);

            if (!$result) {
                return $this->errorResponse('Failed to restore state', 400);
            }

            return $this->successResponse(null, 'State restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('State not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $state = State::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $state);

            $this->stateService->forceDelete($state);

            return $this->successResponse(null, 'State permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('State not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, State $state): JsonResponse
    {
        try {
            $this->authorize('update', $state);

            $request->validate([
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $state = $this->stateService->setStatus($state, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\State\StateResource($state->load('country')),
                'State status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setDefault(State $state): JsonResponse
    {
        try {
            $this->authorize('update', $state);

            $result = $this->stateService->setDefault($state);

            if (!$result) {
                return $this->errorResponse('Failed to set state as default', 400);
            }

            return $this->successResponse(
                new \App\Http\Resources\State\StateResource($state->fresh()->load('country')),
                'State set as default successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:states,id',
            ]);

            $count = $this->stateService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} states deleted successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkStatus(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:states,id',
                'status' => 'required|string|in:active,inactive,pending',
            ]);

            $count = $this->stateService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} states status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function import(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:csv,txt|max:10240',
            ]);

            $file = $request->file('file');
            $rows = array_map('str_getcsv', file($file->getRealPath()));
            $headers = array_shift($rows);

            $data = [];
            foreach ($rows as $row) {
                $data[] = array_combine($headers, $row);
            }

            $result = $this->stateService->import($data);

            return $this->successResponse($result, 'Import completed');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['status', 'country_id', 'search']);
            $states = $this->stateService->export($filters);

            $csv = "Country,State,State Code,Abbreviation,GST Code,Latitude,Longitude,Status,Sort Order,Is Default\n";

            foreach ($states as $state) {
                $csv .= implode(',', [
                    '"' . str_replace('"', '""', $state->country->name ?? '') . '"',
                    '"' . str_replace('"', '""', $state->name) . '"',
                    $state->state_code ?? '',
                    $state->abbreviation ?? '',
                    $state->gst_code ?? '',
                    $state->latitude ?? '',
                    $state->longitude ?? '',
                    $state->status instanceof \App\Enums\StatusEnum ? $state->status->value : $state->status,
                    $state->sort_order,
                    $state->is_default ? 'Yes' : 'No',
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="states_export_' . now()->format('Y_m_d_His') . '.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function downloadTemplate(): Response
    {
        try {
            $csv = "Country ID,Name,State Code,Abbreviation,GST Code,Latitude,Longitude,Status,Sort Order\n";
            $csv .= "1,Maharashtra,MH,MH,27,19.7515,75.7139,active,0\n";
            $csv .= "1,Karnataka,KA,KA,29,15.3173,75.7139,active,0\n";

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="state_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function byCountry(Request $request, string $countryUuid): JsonResponse
    {
        try {
            $country = \App\Models\Master\Country::where('uuid', $countryUuid)->firstOrFail();
            $states = $this->stateService->getActive()->where('country_id', $country->id);

            return $this->successResponse(
                \App\Http\Resources\State\StateResource::collection($states),
                'States retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Country not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
