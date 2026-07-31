<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Support\BaseController;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\Wallet;
use App\Services\Customer\CustomerServiceInterface;
use App\Services\Payment\WalletServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerController extends BaseController
{
    public function __construct(
        protected CustomerServiceInterface $customerService,
        protected WalletServiceInterface $walletService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Customer::class);

            $filters = $request->only([
                'search', 'status', 'is_blocked', 'gender', 'city_id',
                'email_verified', 'phone_verified', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'created_at');
            $order = $request->input('order', 'desc');

            $customers = $this->customerService->getPaginated($filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Customer\CustomerResource::collection($customers),
                'Customers retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Customer::class);

            $customer = $this->customerService->create($request->validated());

            return $this->createdResponse(
                new \App\Http\Resources\Customer\CustomerResource($customer),
                'Customer created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(Customer $customer): JsonResponse
    {
        try {
            $this->authorize('view', $customer);

            $customer->load(['country', 'state', 'city', 'area', 'referrer', 'referrals']);

            return $this->successResponse(
                new \App\Http\Resources\Customer\CustomerResource($customer),
                'Customer retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        try {
            $this->authorize('update', $customer);

            $customer = $this->customerService->update($customer, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\Customer\CustomerResource($customer),
                'Customer updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(Customer $customer): JsonResponse
    {
        try {
            $this->authorize('delete', $customer);

            $this->customerService->delete($customer);

            return $this->successResponse(null, 'Customer deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $customer = Customer::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $customer);

            $result = $this->customerService->restore($customer->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore customer', 400);
            }

            return $this->successResponse(null, 'Customer restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $customer = Customer::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $customer);

            $this->customerService->forceDelete($customer);

            return $this->successResponse(null, 'Customer permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Customer not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, Customer $customer): JsonResponse
    {
        try {
            $this->authorize('update', $customer);

            $request->validate([
                'status' => 'required|string|in:active,inactive,suspended',
            ]);

            $customer = $this->customerService->setStatus($customer, $request->input('status'));

            return $this->successResponse(
                new \App\Http\Resources\Customer\CustomerResource($customer),
                'Customer status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function block(Request $request, Customer $customer): JsonResponse
    {
        try {
            $this->authorize('update', $customer);

            $request->validate([
                'reason' => 'nullable|string|max:500',
            ]);

            $customer = $this->customerService->block($customer, $request->input('reason'));

            return $this->successResponse(
                new \App\Http\Resources\Customer\CustomerResource($customer),
                'Customer blocked successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function unblock(Customer $customer): JsonResponse
    {
        try {
            $this->authorize('update', $customer);

            $customer = $this->customerService->unblock($customer);

            return $this->successResponse(
                new \App\Http\Resources\Customer\CustomerResource($customer),
                'Customer unblocked successfully'
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
                'ids.*' => 'integer|exists:customers,id',
            ]);

            $count = $this->customerService->bulkDelete($request->input('ids'));

            return $this->successResponse(['deleted' => $count], "{$count} customers deleted successfully");
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
                'ids.*' => 'integer|exists:customers,id',
                'status' => 'required|string|in:active,inactive,suspended',
            ]);

            $count = $this->customerService->bulkSetStatus(
                $request->input('ids'),
                $request->input('status')
            );

            return $this->successResponse(['updated' => $count], "{$count} customers status updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): Response
    {
        try {
            $filters = $request->only(['status', 'search']);
            $customers = $this->customerService->export($filters);

            $csv = "ID,First Name,Last Name,Email,Phone,Country Code,Gender,DOB,Address,City,Pincode,Status,Blocked,Wallet Balance,Referral Code,Email Verified,Phone Verified,Created At\n";

            foreach ($customers as $customer) {
                $csv .= implode(',', [
                    $customer->id,
                    '"' . str_replace('"', '""', $customer->first_name ?? '') . '"',
                    '"' . str_replace('"', '""', $customer->last_name ?? '') . '"',
                    '"' . str_replace('"', '""', $customer->email ?? '') . '"',
                    '"' . str_replace('"', '""', $customer->phone ?? '') . '"',
                    '"' . str_replace('"', '""', $customer->country_code ?? '') . '"',
                    '"' . str_replace('"', '""', $customer->gender ?? '') . '"',
                    $customer->date_of_birth ? $customer->date_of_birth->format('Y-m-d') : '',
                    '"' . str_replace('"', '""', $customer->address_line_1 ?? '') . '"',
                    '"' . str_replace('"', '""', $customer->city->name ?? '') . '"',
                    '"' . str_replace('"', '""', $customer->pincode ?? '') . '"',
                    $customer->status instanceof \App\Enums\StatusEnum ? $customer->status->value : $customer->status,
                    $customer->is_blocked ? 'Yes' : 'No',
                    $customer->wallet_balance ?? 0,
                    '"' . str_replace('"', '""', $customer->referral_code ?? '') . '"',
                    $customer->email_verified ? 'Yes' : 'No',
                    $customer->phone_verified ? 'Yes' : 'No',
                    $customer->created_at?->format('Y-m-d H:i:s') ?? '',
                ]) . "\n";
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="customers_export_' . now()->format('Y_m_d_His') . '.csv"',
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

            $result = $this->customerService->import($data);

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
            $csv = $this->customerService->downloadSampleTemplate();

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="customer_import_template.csv"',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Customer::class);

            $stats = $this->customerService->getStats();

            return $this->successResponse($stats, 'Customer statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Customer::class);

            $request->validate([
                'q' => 'nullable|string|max:255',
            ]);

            $customers = $this->customerService->search($request->input('q'));

            return $this->successResponse(
                \App\Http\Resources\Customer\CustomerResource::collection($customers),
                'Search results retrieved successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function adjustWallet(Request $request, Customer $customer): JsonResponse
    {
        try {
            $this->authorize('update', $customer);

            $request->validate([
                'amount' => 'required|numeric|not_in:0',
                'remarks' => 'nullable|string|max:500',
            ]);

            $wallet = $this->walletService->getWalletByCustomer($customer->id);
            if (!$wallet) {
                $wallet = $this->walletService->createWalletForCustomer($customer->id);
            }

            $transaction = $this->walletService->adjustWallet(
                $wallet->id,
                (float) $request->input('amount'),
                $request->input('remarks'),
            );

            $wallet->refresh();
            $customer->wallet_balance = $wallet->current_balance;
            $customer->save();
            $customer->refresh();

            return $this->successResponse([
                'transaction' => new \App\Http\Resources\Payment\WalletTransactionResource($transaction),
                'customer' => new \App\Http\Resources\Customer\CustomerResource($customer),
            ], 'Wallet balance adjusted successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function walletTransactions(Request $request, Customer $customer): JsonResponse
    {
        try {
            $this->authorize('view', $customer);

            $wallet = $this->walletService->getWalletByCustomer($customer->id);
            if (!$wallet) {
                $wallet = $this->walletService->createWalletForCustomer($customer->id);
            }

            $perPage = min((int) $request->input('per_page', 15), 100);
            $filters = $request->only(['transaction_type', 'reference_type', 'date_from', 'date_to']);

            $paginator = $this->walletService->getWalletHistory($wallet->id, $filters, $perPage);

            return $this->paginatedResponse(
                \App\Http\Resources\Payment\WalletTransactionResource::collection($paginator),
                'Wallet transactions retrieved successfully',
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
