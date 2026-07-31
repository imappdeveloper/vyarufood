<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\JournalEntry;
use App\Repositories\Finance\ChartOfAccountRepositoryInterface;
use App\Repositories\Finance\JournalEntryRepositoryInterface;
use App\Repositories\Finance\FinancialYearRepositoryInterface;
use App\Support\BaseService;

class AutomationService extends BaseService implements AutomationServiceInterface
{
    protected string $moduleName = 'Finance';

    private const ACCOUNT_CODE_CASH = '1010';
    private const ACCOUNT_CODE_BANK = '1020';
    private const ACCOUNT_CODE_ACCOUNTS_RECEIVABLE = '1100';
    private const ACCOUNT_CODE_INVENTORY = '1200';
    private const ACCOUNT_CODE_ACCOUNTS_PAYABLE = '2000';
    private const ACCOUNT_CODE_REVENUE = '4000';
    private const ACCOUNT_CODE_PURCHASE = '5000';
    private const ACCOUNT_CODE_EXPENSE = '5010';
    private const ACCOUNT_CODE_REFUND = '5020';
    private const ACCOUNT_CODE_WALLET = '2100';

    public function __construct(
        private readonly JournalEntryRepositoryInterface $journalRepo,
        private readonly ChartOfAccountRepositoryInterface $chartRepo,
        private readonly FinancialYearRepositoryInterface $fyRepo,
    ) {}

    public function createPaymentJournal(array $paymentData): JournalEntry
    {
        return $this->transaction(function () use ($paymentData) {
            $financialYear = $this->getCurrentFinancialYear();

            $bankAccountCode = ! empty($paymentData['payment_method']) && $paymentData['payment_method'] === 'cash'
                ? self::ACCOUNT_CODE_CASH
                : self::ACCOUNT_CODE_BANK;

            $debitAccount = $this->chartRepo->getByAccountCode($bankAccountCode);
            $creditAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_ACCOUNTS_RECEIVABLE);

            $amount = (float) $paymentData['amount'];
            $adminId = auth()->guard('admin')->id();

            $journal = $this->journalRepo->create([
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $paymentData['payment_date'] ?? now()->toDateString(),
                'entry_type' => 'payment',
                'reference_type' => $paymentData['reference_type'] ?? 'customer_payment',
                'reference_id' => $paymentData['reference_id'] ?? null,
                'description' => $paymentData['description'] ?? 'Customer payment received',
                'total_debit' => round($amount, 2),
                'total_credit' => round($amount, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->createJournalLine($journal->id, $debitAccount->id, 1, $amount, 0, 'Payment received');
            $this->createJournalLine($journal->id, $creditAccount->id, 2, 0, $amount, 'Customer ledger credit');

            $this->chartRepo->updateBalance($debitAccount->id, $amount, 0);
            $this->chartRepo->updateBalance($creditAccount->id, 0, $amount);

            $posted = $this->journalRepo->postJournal($journal->id, $adminId);

            $this->logInfo('Payment journal auto-created', ['journal_id' => $posted->id, 'amount' => $amount]);

            return $posted;
        });
    }

    public function createExpenseJournal(array $expenseData): JournalEntry
    {
        return $this->transaction(function () use ($expenseData) {
            $financialYear = $this->getCurrentFinancialYear();

            $debitAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_EXPENSE);
            $creditAccountCode = ! empty($expenseData['payment_method']) && $expenseData['payment_method'] === 'cash'
                ? self::ACCOUNT_CODE_CASH
                : self::ACCOUNT_CODE_BANK;
            $creditAccount = $this->chartRepo->getByAccountCode($creditAccountCode);

            $amount = (float) $expenseData['amount'];
            $adminId = auth()->guard('admin')->id();

            $journal = $this->journalRepo->create([
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $expenseData['expense_date'] ?? now()->toDateString(),
                'entry_type' => 'expense',
                'reference_type' => $expenseData['reference_type'] ?? 'expense',
                'reference_id' => $expenseData['reference_id'] ?? null,
                'description' => $expenseData['description'] ?? 'Expense recorded',
                'total_debit' => round($amount, 2),
                'total_credit' => round($amount, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->createJournalLine($journal->id, $debitAccount->id, 1, $amount, 0, $expenseData['description'] ?? 'Expense');
            $this->createJournalLine($journal->id, $creditAccount->id, 2, 0, $amount, 'Payment made');

            $this->chartRepo->updateBalance($debitAccount->id, $amount, 0);
            $this->chartRepo->updateBalance($creditAccount->id, 0, $amount);

            $posted = $this->journalRepo->postJournal($journal->id, $adminId);

            $this->logInfo('Expense journal auto-created', ['journal_id' => $posted->id, 'amount' => $amount]);

            return $posted;
        });
    }

    public function createPurchaseJournal(array $purchaseData): JournalEntry
    {
        return $this->transaction(function () use ($purchaseData) {
            $financialYear = $this->getCurrentFinancialYear();

            $debitAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_PURCHASE);
            $creditAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_ACCOUNTS_PAYABLE);

            $amount = (float) $purchaseData['amount'];
            $adminId = auth()->guard('admin')->id();

            $journal = $this->journalRepo->create([
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $purchaseData['purchase_date'] ?? now()->toDateString(),
                'entry_type' => 'purchase',
                'reference_type' => $purchaseData['reference_type'] ?? 'purchase_invoice',
                'reference_id' => $purchaseData['reference_id'] ?? null,
                'description' => $purchaseData['description'] ?? 'Purchase invoice recorded',
                'total_debit' => round($amount, 2),
                'total_credit' => round($amount, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->createJournalLine($journal->id, $debitAccount->id, 1, $amount, 0, $purchaseData['description'] ?? 'Purchase');
            $this->createJournalLine($journal->id, $creditAccount->id, 2, 0, $amount, 'Supplier ledger credit');

            $this->chartRepo->updateBalance($debitAccount->id, $amount, 0);
            $this->chartRepo->updateBalance($creditAccount->id, 0, $amount);

            $posted = $this->journalRepo->postJournal($journal->id, $adminId);

            $this->logInfo('Purchase journal auto-created', ['journal_id' => $posted->id, 'amount' => $amount]);

            return $posted;
        });
    }

    public function createRefundJournal(array $refundData): JournalEntry
    {
        return $this->transaction(function () use ($refundData) {
            $financialYear = $this->getCurrentFinancialYear();

            $debitAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_ACCOUNTS_RECEIVABLE);
            $creditAccountCode = ! empty($refundData['payment_method']) && $refundData['payment_method'] === 'cash'
                ? self::ACCOUNT_CODE_CASH
                : self::ACCOUNT_CODE_BANK;
            $creditAccount = $this->chartRepo->getByAccountCode($creditAccountCode);

            $amount = (float) $refundData['amount'];
            $adminId = auth()->guard('admin')->id();

            $journal = $this->journalRepo->create([
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $refundData['refund_date'] ?? now()->toDateString(),
                'entry_type' => 'refund',
                'reference_type' => $refundData['reference_type'] ?? 'refund',
                'reference_id' => $refundData['reference_id'] ?? null,
                'description' => $refundData['description'] ?? 'Customer refund processed',
                'total_debit' => round($amount, 2),
                'total_credit' => round($amount, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->createJournalLine($journal->id, $debitAccount->id, 1, $amount, 0, 'Customer ledger debit');
            $this->createJournalLine($journal->id, $creditAccount->id, 2, 0, $amount, 'Refund paid');

            $this->chartRepo->updateBalance($debitAccount->id, $amount, 0);
            $this->chartRepo->updateBalance($creditAccount->id, 0, $amount);

            $posted = $this->journalRepo->postJournal($journal->id, $adminId);

            $this->logInfo('Refund journal auto-created', ['journal_id' => $posted->id, 'amount' => $amount]);

            return $posted;
        });
    }

    public function createWalletRechargeJournal(array $data): JournalEntry
    {
        return $this->transaction(function () use ($data) {
            $financialYear = $this->getCurrentFinancialYear();

            $bankAccountCode = ! empty($data['payment_method']) && $data['payment_method'] === 'cash'
                ? self::ACCOUNT_CODE_CASH
                : self::ACCOUNT_CODE_BANK;

            $debitAccount = $this->chartRepo->getByAccountCode($bankAccountCode);
            $creditAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_WALLET);

            $amount = (float) $data['amount'];
            $adminId = auth()->guard('admin')->id();

            $journal = $this->journalRepo->create([
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $data['transaction_date'] ?? now()->toDateString(),
                'entry_type' => 'wallet_recharge',
                'reference_type' => $data['reference_type'] ?? 'wallet_recharge',
                'reference_id' => $data['reference_id'] ?? null,
                'description' => $data['description'] ?? 'Wallet recharge received',
                'total_debit' => round($amount, 2),
                'total_credit' => round($amount, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->createJournalLine($journal->id, $debitAccount->id, 1, $amount, 0, 'Payment received');
            $this->createJournalLine($journal->id, $creditAccount->id, 2, 0, $amount, 'Wallet liability credited');

            $this->chartRepo->updateBalance($debitAccount->id, $amount, 0);
            $this->chartRepo->updateBalance($creditAccount->id, 0, $amount);

            $posted = $this->journalRepo->postJournal($journal->id, $adminId);

            $this->logInfo('Wallet recharge journal auto-created', ['journal_id' => $posted->id, 'amount' => $amount]);

            return $posted;
        });
    }

    public function createWalletDeductionJournal(array $data): JournalEntry
    {
        return $this->transaction(function () use ($data) {
            $financialYear = $this->getCurrentFinancialYear();

            $debitAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_WALLET);
            $creditAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_REVENUE);

            $amount = (float) $data['amount'];
            $adminId = auth()->guard('admin')->id();

            $journal = $this->journalRepo->create([
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $data['transaction_date'] ?? now()->toDateString(),
                'entry_type' => 'wallet_deduction',
                'reference_type' => $data['reference_type'] ?? 'wallet_deduction',
                'reference_id' => $data['reference_id'] ?? null,
                'description' => $data['description'] ?? 'Wallet deduction for order',
                'total_debit' => round($amount, 2),
                'total_credit' => round($amount, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->createJournalLine($journal->id, $debitAccount->id, 1, $amount, 0, 'Wallet liability reduced');
            $this->createJournalLine($journal->id, $creditAccount->id, 2, 0, $amount, 'Revenue earned');

            $this->chartRepo->updateBalance($debitAccount->id, $amount, 0);
            $this->chartRepo->updateBalance($creditAccount->id, 0, $amount);

            $posted = $this->journalRepo->postJournal($journal->id, $adminId);

            $this->logInfo('Wallet deduction journal auto-created', ['journal_id' => $posted->id, 'amount' => $amount]);

            return $posted;
        });
    }

    public function createInventoryAdjustmentJournal(array $data): JournalEntry
    {
        return $this->transaction(function () use ($data) {
            $financialYear = $this->getCurrentFinancialYear();

            $debitAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_EXPENSE);
            $creditAccount = $this->chartRepo->getByAccountCode(self::ACCOUNT_CODE_INVENTORY);

            $amount = (float) $data['amount'];
            $adminId = auth()->guard('admin')->id();

            $journal = $this->journalRepo->create([
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $data['adjustment_date'] ?? now()->toDateString(),
                'entry_type' => 'inventory_adjustment',
                'reference_type' => $data['reference_type'] ?? 'inventory_adjustment',
                'reference_id' => $data['reference_id'] ?? null,
                'description' => $data['description'] ?? 'Inventory adjustment',
                'total_debit' => round($amount, 2),
                'total_credit' => round($amount, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->createJournalLine($journal->id, $debitAccount->id, 1, $amount, 0, 'Adjustment expense');
            $this->createJournalLine($journal->id, $creditAccount->id, 2, 0, $amount, 'Inventory reduced');

            $this->chartRepo->updateBalance($debitAccount->id, $amount, 0);
            $this->chartRepo->updateBalance($creditAccount->id, 0, $amount);

            $posted = $this->journalRepo->postJournal($journal->id, $adminId);

            $this->logInfo('Inventory adjustment journal auto-created', ['journal_id' => $posted->id, 'amount' => $amount]);

            return $posted;
        });
    }

    private function getCurrentFinancialYear()
    {
        $financialYear = $this->fyRepo->getCurrent();

        if (! $financialYear) {
            throw new \RuntimeException('No active financial year found.');
        }

        if ($financialYear->is_closed) {
            throw new \RuntimeException('Current financial year is closed.');
        }

        return $financialYear;
    }

    private function createJournalLine(int $journalEntryId, int $accountId, int $lineNumber, float $debit, float $credit, string $description): void
    {
        \App\Models\JournalEntryLine::create([
            'journal_entry_id' => $journalEntryId,
            'account_id' => $accountId,
            'line_number' => $lineNumber,
            'description' => $description,
            'debit_amount' => round($debit, 2),
            'credit_amount' => round($credit, 2),
        ]);
    }
}
