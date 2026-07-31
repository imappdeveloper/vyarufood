<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Events\Payment\PaymentSuccessful;
use App\Events\Payment\PaymentFailed;
use App\Models\PaymentTransaction;
use App\Repositories\Payment\PaymentTransactionRepositoryInterface;
use App\Repositories\Payment\PaymentWebhookLogRepositoryInterface;
use App\Repositories\Payment\WalletRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class PaymentService extends BaseService implements PaymentServiceInterface
{
    protected string $moduleName = 'payment';

    public function __construct(
        protected PaymentTransactionRepositoryInterface $paymentRepo,
        protected WalletRepositoryInterface $walletRepo,
        protected WalletServiceInterface $walletService,
        protected PaymentWebhookLogRepositoryInterface $webhookRepo,
    ) {}

    public function getPaginatedPayments(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->paymentRepo->getPaginated($filters, $perPage);
    }

    public function getPaymentById(int $id): ?PaymentTransaction
    {
        return $this->paymentRepo->findById($id);
    }

    public function getPaymentByUuid(string $uuid): ?PaymentTransaction
    {
        return $this->paymentRepo->findByUuid($uuid);
    }

    public function createPayment(array $data): PaymentTransaction
    {
        return $this->transaction(function () use ($data) {
            $transactionNumber = 'PAY-' . strtoupper(Str::random(10));

            $payment = $this->paymentRepo->create([
                'transaction_number' => $transactionNumber,
                'gateway_name' => $data['gateway_name'],
                'gateway_order_id' => $data['gateway_order_id'] ?? null,
                'customer_id' => $data['customer_id'],
                'order_id' => $data['order_id'] ?? null,
                'subscription_id' => $data['subscription_id'] ?? null,
                'payment_type' => $data['payment_type'],
                'payment_method' => $data['payment_method'] ?? null,
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'INR',
                'gateway_fee' => $data['gateway_fee'] ?? 0,
                'tax_amount' => $data['tax_amount'] ?? 0,
                'status' => 'pending',
                'payment_date' => now(),
            ]);

            $this->logInfo('Payment created', [
                'payment_id' => $payment->id,
                'transaction_number' => $transactionNumber,
                'amount' => $data['amount'],
            ]);

            return $payment;
        });
    }

    public function verifyPayment(
        string $gatewayOrderId,
        string $gatewayTransactionId,
        array $gatewayResponse,
    ): PaymentTransaction {
        return $this->transaction(function () use ($gatewayOrderId, $gatewayTransactionId, $gatewayResponse) {
            $payment = $this->paymentRepo->findByGatewayOrderId($gatewayOrderId);

            if (!$payment) {
                throw new \DomainException('Payment not found for gateway order: ' . $gatewayOrderId);
            }

            $payment = $this->paymentRepo->updateStatus($payment, 'success');
            $this->paymentRepo->update($payment, [
                'gateway_transaction_id' => $gatewayTransactionId,
                'webhook_verified' => true,
            ]);

            if ($payment->payment_type === 'wallet_recharge') {
                $this->walletService->rechargeWallet([
                    'customer_id' => $payment->customer_id,
                    'amount' => (float) $payment->amount,
                    'reference_type' => 'payment',
                    'reference_id' => $payment->id,
                    'remarks' => 'Wallet recharge via ' . $payment->gateway_name,
                ]);
            }

            event(new PaymentSuccessful($payment));

            $this->logInfo('Payment verified', [
                'payment_id' => $payment->id,
                'gateway_transaction_id' => $gatewayTransactionId,
            ]);

            return $payment;
        });
    }

    public function markPaymentFailed(int $id, string $reason): PaymentTransaction
    {
        return $this->transaction(function () use ($id, $reason) {
            $payment = $this->paymentRepo->findById($id);

            if (!$payment) {
                throw new \DomainException('Payment not found.');
            }

            $payment = $this->paymentRepo->updateStatus($payment, 'failed');
            $this->paymentRepo->update($payment, [
                'failure_reason' => $reason,
            ]);

            event(new PaymentFailed($payment));

            $this->logInfo('Payment marked as failed', [
                'payment_id' => $payment->id,
                'reason' => $reason,
            ]);

            return $payment;
        });
    }

    public function cancelPayment(int $id): PaymentTransaction
    {
        return $this->transaction(function () use ($id) {
            $payment = $this->paymentRepo->findById($id);

            if (!$payment) {
                throw new \DomainException('Payment not found.');
            }

            $payment = $this->paymentRepo->updateStatus($payment, 'cancelled');

            $this->logInfo('Payment cancelled', ['payment_id' => $payment->id]);

            return $payment;
        });
    }

    public function getDashboardStats(): array
    {
        return $this->paymentRepo->getDashboardStats();
    }

    public function getRevenueSummary(array $filters): array
    {
        return $this->paymentRepo->getRevenueSummary($filters);
    }

    public function getPaymentHistory(int $customerId, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->paymentRepo->getPaginatedByCustomer($customerId, $filters, $perPage);
    }

    public function getWebhookLogs(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->webhookRepo->getPaginated($filters, $perPage);
    }
}
