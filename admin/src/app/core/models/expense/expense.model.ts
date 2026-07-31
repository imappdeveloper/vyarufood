export interface ExpenseCategory {
  id: number;
  uuid: string;
  category_code: string;
  category_name: string;
  parent_category_id: number | null;
  parent_category_name: string | null;
  icon: string | null;
  color: string | null;
  is_recurring: boolean;
  is_taxable: boolean;
  status: string;
  display_order: number | null;
  remarks: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  uuid: string;
  expense_number: string;
  expense_category_id: number;
  category_name: string;
  category_icon: string;
  expense_date: string;
  expense_title: string;
  expense_description: string | null;
  vendor_name: string | null;
  supplier_id: number | null;
  supplier_name: string | null;
  amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_account: string | null;
  transaction_reference: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  bill_attachment: string | null;
  is_recurring: boolean;
  recurring_frequency: string | null;
  next_due_date: string | null;
  approval_status: string;
  expense_status: string;
  approved_at: string | null;
  remarks: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseAttachment {
  id: number;
  uuid: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by_name: string | null;
  created_at: string;
}

export interface ExpenseApproval {
  id: number;
  uuid: string;
  expense_id: number;
  action: string;
  remarks: string | null;
  approved_by_name: string | null;
  created_at: string;
}

export type ExpenseStatus = 'draft' | 'pending_approval' | 'approved' | 'paid' | 'rejected' | 'cancelled';

export const EXPENSE_STATUSES: { value: ExpenseStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'pending_approval', label: 'Pending Approval', color: 'amber' },
  { value: 'approved', label: 'Approved', color: 'blue' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
];

export type PaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'credit_card' | 'debit_card' | 'cheque' | 'wallet';

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'wallet', label: 'Wallet' },
];

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export const RECURRING_FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];
