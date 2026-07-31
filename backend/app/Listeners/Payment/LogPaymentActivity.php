<?php

declare(strict_types=1);

namespace App\Listeners\Payment;

use App\Events\Payment\PaymentCreated;
use App\Events\Payment\PaymentUpdated;
use App\Events\Payment\PaymentSuccessful;
use App\Events\Payment\PaymentFailed;
use App\Events\Payment\WalletRecharged;
use App\Events\Payment\RefundProcessed;
use App\Events\Payment\WalletCreated;
use App\Events\Payment\WalletUpdated;
use Illuminate\Support\Facades\Log;

class LogPaymentActivity
{
    public function handle(
        PaymentCreated|PaymentUpdated|PaymentSuccessful|PaymentFailed|WalletRecharged|RefundProcessed|WalletCreated|WalletUpdated $event,
    ): void {
        if ($event instanceof PaymentCreated) {
            Log::info('[payment] Payment created', [
                'payment_id' => $event->paymentTransaction->id,
                'transaction_number' => $event->paymentTransaction->transaction_number,
                'amount' => $event->paymentTransaction->amount,
            ]);
        } elseif ($event instanceof PaymentUpdated) {
            Log::info('[payment] Payment updated', [
                'payment_id' => $event->paymentTransaction->id,
                'transaction_number' => $event->paymentTransaction->transaction_number,
                'status' => $event->paymentTransaction->status,
            ]);
        } elseif ($event instanceof PaymentSuccessful) {
            Log::info('[payment] Payment successful', [
                'payment_id' => $event->paymentTransaction->id,
                'transaction_number' => $event->paymentTransaction->transaction_number,
                'amount' => $event->paymentTransaction->amount,
            ]);
        } elseif ($event instanceof PaymentFailed) {
            Log::info('[payment] Payment failed', [
                'payment_id' => $event->paymentTransaction->id,
                'transaction_number' => $event->paymentTransaction->transaction_number,
                'failure_reason' => $event->paymentTransaction->failure_reason,
            ]);
        } elseif ($event instanceof WalletRecharged) {
            Log::info('[payment] Wallet recharged', [
                'wallet_id' => $event->wallet->id,
                'wallet_number' => $event->wallet->wallet_number,
                'amount' => $event->walletTransaction->amount,
            ]);
        } elseif ($event instanceof RefundProcessed) {
            Log::info('[payment] Refund processed', [
                'refund_id' => $event->paymentRefund->id,
                'refund_number' => $event->paymentRefund->refund_number,
                'refund_amount' => $event->paymentRefund->refund_amount,
            ]);
        } elseif ($event instanceof WalletCreated) {
            Log::info('[payment] Wallet created', [
                'wallet_id' => $event->wallet->id,
                'wallet_number' => $event->wallet->wallet_number,
            ]);
        } elseif ($event instanceof WalletUpdated) {
            Log::info('[payment] Wallet updated', [
                'wallet_id' => $event->wallet->id,
                'wallet_number' => $event->wallet->wallet_number,
            ]);
        }
    }
}
