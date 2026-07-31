<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\JournalEntry;

interface AutomationServiceInterface
{
    public function createPaymentJournal(array $paymentData): JournalEntry;
    public function createExpenseJournal(array $expenseData): JournalEntry;
    public function createPurchaseJournal(array $purchaseData): JournalEntry;
    public function createRefundJournal(array $refundData): JournalEntry;
    public function createWalletRechargeJournal(array $data): JournalEntry;
    public function createWalletDeductionJournal(array $data): JournalEntry;
    public function createInventoryAdjustmentJournal(array $data): JournalEntry;
}
