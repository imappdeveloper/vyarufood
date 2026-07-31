export interface ChartOfAccount {
  id: number;
  uuid: string;
  account_code: string;
  account_name: string;
  account_type: string;
  parent_account_id: number | null;
  opening_balance: number;
  current_balance: number;
  currency: string;
  is_system: boolean;
  status: string;
  remarks: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinancialYear {
  id: number;
  uuid: string;
  year_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_closed: boolean;
  closed_by: number | null;
  closed_at: string | null;
  closing_remarks: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryLine {
  id: number;
  uuid: string;
  account_id: number;
  account_code?: string;
  account_name?: string;
  line_number: number;
  description: string | null;
  debit_amount: number;
  credit_amount: number;
  cost_center: string | null;
  project_id: number | null;
}

export interface JournalEntry {
  id: number;
  uuid: string;
  journal_number: string;
  journal_date: string;
  financial_year_id: number;
  financial_year_name?: string;
  entry_type: string;
  reference_type: string | null;
  reference_id: number | null;
  description: string | null;
  total_debit: number;
  total_credit: number;
  posting_status: string;
  posted_by: number | null;
  posted_by_name?: string;
  posted_at: string | null;
  created_by_name: string | null;
  lines: JournalEntryLine[];
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  id: number;
  uuid: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string | null;
  branch: string | null;
  account_type: string;
  account_id: number | null;
  opening_balance: number;
  current_balance: number;
  is_default: boolean;
  status: string;
  remarks: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankReconciliation {
  id: number;
  uuid: string;
  bank_account_id: number;
  reconciliation_date: string;
  statement_date: string;
  opening_balance: number;
  closing_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  adjusted_balance: number;
  difference: number;
  status: string;
  remarks: string | null;
  created_by_name: string | null;
  created_at: string;
}

export interface CustomerLedger {
  id: number;
  uuid: string;
  customer_id: number;
  journal_entry_id: number | null;
  reference_type: string | null;
  reference_id: number | null;
  transaction_date: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  payment_method: string | null;
  transaction_reference: string | null;
  created_at: string;
}

export interface SupplierLedger {
  id: number;
  uuid: string;
  supplier_id: number;
  journal_entry_id: number | null;
  reference_type: string | null;
  reference_id: number | null;
  transaction_date: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  payment_method: string | null;
  transaction_reference: string | null;
  created_at: string;
}

export interface CashBookEntry {
  id: number;
  uuid: string;
  transaction_date: string;
  journal_entry_id: number | null;
  reference_type: string | null;
  reference_id: number | null;
  description: string;
  receipt_number: string | null;
  payment_number: string | null;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  payment_method: string | null;
  created_at: string;
}

export interface BankBookEntry {
  id: number;
  uuid: string;
  bank_account_id: number;
  transaction_date: string;
  journal_entry_id: number | null;
  reference_type: string | null;
  reference_id: number | null;
  description: string;
  cheque_number: string | null;
  transaction_reference: string | null;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  is_reconciled: boolean;
  reconciled_at: string | null;
  created_at: string;
}

export interface TrialBalanceEntry {
  account_id: number;
  account_code: string;
  account_name: string;
  account_type: string;
  debit: number;
  credit: number;
}

export interface TrialBalance {
  accounts: TrialBalanceEntry[];
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
}

export interface PlEntry {
  account_id: number;
  account_code: string;
  account_name: string;
  amount: number;
}

export interface ProfitAndLoss {
  income: PlEntry[];
  total_income: number;
  expenses: PlEntry[];
  total_expenses: number;
  net_profit: number;
}

export interface BalanceSheetItem {
  account_id: number;
  account_code: string;
  account_name: string;
  amount: number;
}

export interface BalanceSheet {
  assets: BalanceSheetItem[];
  total_assets: number;
  liabilities: BalanceSheetItem[];
  total_liabilities: number;
  equity: BalanceSheetItem[];
  total_equity: number;
  is_balanced: boolean;
}

export interface CashFlowMovement {
  account_id: number;
  inflow: number;
  outflow: number;
  net: number;
}

export interface CashFlow {
  movements: CashFlowMovement[];
  total_inflow: number;
  total_outflow: number;
  net_cash_flow: number;
  operating: number;
  investing: number;
  financing: number;
}

export interface FinanceDashboardStats {
  total_journals_this_month: number;
  posted_count: number;
  draft_count: number;
  total_debit: number;
  total_credit: number;
  pending_count: number;
}

export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';
export type JournalEntryType = 'general' | 'payment' | 'receipt' | 'purchase' | 'refund' | 'wallet_recharge' | 'wallet_deduction' | 'inventory_adjustment' | 'reversal';
export type PostingStatus = 'draft' | 'posted' | 'reversed';
export type BankAccountType = 'savings' | 'current' | 'fixed_deposit';

export const BANK_ACCOUNT_TYPES: { value: BankAccountType; label: string }[] = [
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' },
  { value: 'fixed_deposit', label: 'Fixed Deposit' },
];
export type ReconciliationStatus = 'pending' | 'completed' | 'discrepancy';

export const ACCOUNT_TYPES: { value: AccountType; label: string; color: string }[] = [
  { value: 'asset', label: 'Asset', color: 'bg-blue-100 text-blue-800' },
  { value: 'liability', label: 'Liability', color: 'bg-red-100 text-red-800' },
  { value: 'equity', label: 'Equity', color: 'bg-purple-100 text-purple-800' },
  { value: 'income', label: 'Income', color: 'bg-green-100 text-green-800' },
  { value: 'expense', label: 'Expense', color: 'bg-orange-100 text-orange-800' },
];

export const JOURNAL_ENTRY_TYPES: { value: JournalEntryType; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'payment', label: 'Payment' },
  { value: 'receipt', label: 'Receipt' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'refund', label: 'Refund' },
  { value: 'wallet_recharge', label: 'Wallet Recharge' },
  { value: 'wallet_deduction', label: 'Wallet Deduction' },
  { value: 'inventory_adjustment', label: 'Inventory Adjustment' },
  { value: 'reversal', label: 'Reversal' },
];

export const POSTING_STATUSES: { value: PostingStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'posted', label: 'Posted', color: 'bg-green-100 text-green-800' },
  { value: 'reversed', label: 'Reversed', color: 'bg-red-100 text-red-800' },
];
