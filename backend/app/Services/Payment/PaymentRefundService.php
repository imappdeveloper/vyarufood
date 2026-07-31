<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Events\Payment\RefundProcessed;
use App\Models\PaymentRefund;
use App\Repositories\Payment\PaymentRefundRepositoryInterface;
use App\Repositories\Payment\PaymentTransactionRepositoryInterface;
use App\Repositories\Payment\WalletRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class PaymentRefundService extends BaseService implements PaymentRefundServiceInterface
{
    protected string $moduleName = 'payment_refund';

    public function __construct(
        protected PaymentRefundRepositoryInterface $refundRepo,
        protected PaymentTransactionRepositoryInterface $paymentRepo,
        protected WalletRepositoryInterface $walletRepo,
        protected WalletServiceInterface $walletService,
    ) {}

    public function getPaginatedRefunds(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->refundRepo->getPaginated($filters, $perPage);
    }

    public function getRefundById(int $id): ?PaymentRefund
    {
        return $this->refundRepo->findById($id);
    }

    public function getRefundByUuid(string $uuid): ?PaymentRefund
    {
        return $this->refundRepo->findByUuid($uuid);
    }

    public function processRefund(array $data): PaymentRefund
    {
        return $this->transaction(function () use ($data) {
            $payment = $this->paymentRepo->findById($data['payment_transaction_id']);

            if (!$payment) {
                throw new \DomainException('Payment transaction not found.');
            }

            if ($payment->status !== 'success') {
                throw new \DomainException('Only successful payments can be refunded.');
            }

            $refundAmount = (float) $data['refund_amount'];

            $existingRefunds = $this->refundRepo->getTotalRefundedForPayment($payment->id);
            if ($existingRefunds + $refundAmount > (float) $payment->amount) {
                throw new \DomainException('Refund amount exceeds the refundable balance.');
            }

            $refund = $this->refundRepo->create([
                'refund_number' => 'REF-' . strtoupper(Str::random(8)),
                'payment_transaction_id' => $payment->id,
                'customer_id' => $payment->customer_id,
                'refund_amount' => $refundAmount,
                'refund_reason' => $data['refund_reason'] ?? null,
                'status' => 'processed',
                'processed_by' => auth()->guard('admin')->id(),
                'processed_at' => now(),
            ]);

            $this->paymentRepo->updateStatus($payment, 'refunded');

            if ($payment->payment_method === 'wallet') {
                $this->walletService->rechargeWallet([
                    'customer_id' => $payment->customer_id,
                    'amount' => $refundAmount,
                    'reference_type' => 'refund',
                    'reference_id' => $refund->id,
                    'remarks' => 'Refund for payment: ' . $payment->transaction_number,
                ]);
            }

            event(new RefundProcessed($refund));

            $this->logInfo('Refund processed', [
                'refund_id' => $refund->id,
                'payment_id' => $payment->id,
                'amount' => $refundAmount,
            ]);

            return $refund;
        });
    }

    public function updateRefundStatus(int $id, string $status): PaymentRefund
    {
        return $this->transaction(function () use ($id, $status) {
            $refund = $this->refundRepo->findById($id);

            if (!$refund) {
                throw new \DomainException('Refund not found.');
            }

            $refund = $this->refundRepo->updateStatus($refund, $status);

            $this->logInfo('Refund status updated', [
                'refund_id' => $refund->id,
                'status' => $status,
            ]);

            return $refund;
        });
    }
}
