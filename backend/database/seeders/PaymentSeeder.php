<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\PaymentTransaction;
use App\Models\PaymentRefund;
use App\Models\PaymentWebhookLog;
use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedWallet();
        $this->seedWalletTransactions();
        $this->seedPaymentTransactions();
        $this->seedPaymentRefunds();
        $this->seedWebhookLogs();
    }

    protected function seedWallet(): void
    {
        $customer = Customer::first();

        if (! $customer) {
            $this->command->warn('No customers found. Skipping wallet seeding.');
            return;
        }

        $existingWallet = Wallet::where('customer_id', $customer->id)->first();

        if (! $existingWallet) {
            Wallet::create([
                'uuid' => Str::uuid()->toString(),
                'customer_id' => $customer->id,
                'wallet_number' => 'WAL-' . strtoupper(Str::random(8)),
                'current_balance' => 500.00,
                'blocked_balance' => 0.00,
                'total_credit' => 1000.00,
                'total_debit' => 500.00,
                'status' => 'active',
            ]);

            $this->command->info('Wallet seeded for customer_id=' . $customer->id);
        } else {
            $this->command->info('Wallet already exists for customer_id=' . $customer->id . '. Skipping.');
        }
    }

    protected function seedWalletTransactions(): void
    {
        $wallet = Wallet::first();

        if (! $wallet) {
            $this->command->warn('No wallet found. Skipping wallet transaction seeding.');
            return;
        }

        $offset = WalletTransaction::count();
        $transactions = [
            [
                'uuid' => Str::uuid()->toString(),
                'wallet_id' => $wallet->id,
                'transaction_number' => 'WLT-TXN-' . str_pad((string) ($offset + 1), 6, '0', STR_PAD_LEFT),
                'transaction_type' => 'credit',
                'reference_type' => 'wallet_recharge',
                'reference_id' => null,
                'opening_balance' => 0.00,
                'amount' => 500.00,
                'closing_balance' => 500.00,
                'remarks' => 'Initial wallet recharge',
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'wallet_id' => $wallet->id,
                'transaction_number' => 'WLT-TXN-' . str_pad((string) ($offset + 2), 6, '0', STR_PAD_LEFT),
                'transaction_type' => 'debit',
                'reference_type' => 'order_payment',
                'reference_id' => null,
                'opening_balance' => 500.00,
                'amount' => 200.00,
                'closing_balance' => 300.00,
                'remarks' => 'Payment for order',
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'wallet_id' => $wallet->id,
                'transaction_number' => 'WLT-TXN-' . str_pad((string) ($offset + 3), 6, '0', STR_PAD_LEFT),
                'transaction_type' => 'credit',
                'reference_type' => 'wallet_recharge',
                'reference_id' => null,
                'opening_balance' => 300.00,
                'amount' => 700.00,
                'closing_balance' => 1000.00,
                'remarks' => 'Additional wallet recharge',
            ],
        ];

        foreach ($transactions as $txn) {
            WalletTransaction::create($txn);
        }

        $this->command->info('Wallet transactions seeded (3 records).');
    }

    protected function seedPaymentTransactions(): void
    {
        $customer = Customer::first();

        if (! $customer) {
            $this->command->warn('No customers found. Skipping payment transaction seeding.');
            return;
        }

        $offset = PaymentTransaction::count();
        $transactions = [
            [
                'uuid' => Str::uuid()->toString(),
                'transaction_number' => 'PAY-' . str_pad((string) ($offset + 1), 6, '0', STR_PAD_LEFT),
                'gateway_name' => 'razorpay',
                'gateway_transaction_id' => 'pay_' . Str::random(16),
                'gateway_order_id' => 'order_' . Str::random(16),
                'customer_id' => $customer->id,
                'order_id' => null,
                'subscription_id' => null,
                'payment_type' => 'wallet_recharge',
                'payment_method' => 'upi',
                'amount' => 500.00,
                'currency' => 'INR',
                'gateway_fee' => 5.00,
                'tax_amount' => 0.90,
                'status' => 'success',
                'payment_date' => now()->subDays(2),
                'failure_reason' => null,
                'webhook_verified' => true,
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'transaction_number' => 'PAY-' . str_pad((string) ($offset + 2), 6, '0', STR_PAD_LEFT),
                'gateway_name' => 'razorpay',
                'gateway_transaction_id' => null,
                'gateway_order_id' => 'order_' . Str::random(16),
                'customer_id' => $customer->id,
                'order_id' => null,
                'subscription_id' => null,
                'payment_type' => 'wallet_recharge',
                'payment_method' => 'card',
                'amount' => 1000.00,
                'currency' => 'INR',
                'gateway_fee' => 10.00,
                'tax_amount' => 1.80,
                'status' => 'pending',
                'payment_date' => now(),
                'failure_reason' => null,
                'webhook_verified' => false,
            ],
        ];

        foreach ($transactions as $txn) {
            PaymentTransaction::create($txn);
        }

        $this->command->info('Payment transactions seeded (2 records).');
    }

    protected function seedPaymentRefunds(): void
    {
        $payment = PaymentTransaction::where('status', 'success')->first();

        if (! $payment) {
            $this->command->warn('No successful payment found. Skipping refund seeding.');
            return;
        }

        $offset = PaymentRefund::count();

        PaymentRefund::create([
            'uuid' => Str::uuid()->toString(),
            'refund_number' => 'REF-' . str_pad((string) ($offset + 1), 6, '0', STR_PAD_LEFT),
            'payment_transaction_id' => $payment->id,
            'customer_id' => $payment->customer_id,
            'refund_amount' => 100.00,
            'refund_reason' => 'Customer requested partial refund',
            'gateway_refund_id' => null,
            'status' => 'pending',
            'processed_by' => null,
            'processed_at' => null,
        ]);

        $this->command->info('Payment refund seeded (1 record).');
    }

    protected function seedWebhookLogs(): void
    {
        $offset = PaymentWebhookLog::count();

        PaymentWebhookLog::create([
            'uuid' => Str::uuid()->toString(),
            'gateway_name' => 'razorpay',
            'event_name' => 'payment.captured',
            'payload' => [
                'event' => 'payment.captured',
                'payload' => [
                    'payment' => [
                        'entity' => [
                            'id' => 'pay_' . Str::random(16),
                            'order_id' => 'order_' . Str::random(16),
                            'amount' => 50000,
                            'status' => 'captured',
                        ],
                    ],
                ],
            ],
            'signature' => hash_hmac('sha256', json_encode(['event' => 'payment.captured']), config('razorpay.webhook_secret', 'test_secret')),
            'verification_status' => true,
            'processed_at' => now(),
        ]);

        PaymentWebhookLog::create([
            'uuid' => Str::uuid()->toString(),
            'gateway_name' => 'razorpay',
            'event_name' => 'payment.created',
            'payload' => [
                'event' => 'payment.created',
                'payload' => [
                    'payment' => [
                        'entity' => [
                            'id' => 'pay_' . Str::random(16),
                            'order_id' => 'order_' . Str::random(16),
                            'amount' => 100000,
                            'status' => 'created',
                        ],
                    ],
                ],
            ],
            'signature' => null,
            'verification_status' => false,
            'processed_at' => null,
        ]);

        $this->command->info('Webhook logs seeded (2 records).');
    }
}
