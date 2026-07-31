export interface PurchaseRequest {
  id: number;
  uuid: string;
  request_number: string;
  request_date: string;
  request_type: string;
  requested_by: string;
  department: string;
  priority: string;
  status: string;
  expected_date: string | null;
  remarks: string | null;
  approved_by: number | null;
  approved_by_name: string | null;
  approved_at: string | null;
  items_count: number;
  items?: PurchaseRequestItem[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PurchaseRequestItem {
  id: number;
  uuid: string;
  purchase_request_id: number;
  inventory_item_id: number;
  inventory_item_name?: string;
  requested_quantity: number;
  approved_quantity: number | null;
  unit_id: number;
  unit_name?: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: number;
  uuid: string;
  po_number: string;
  supplier_id: number;
  supplier_name?: string;
  purchase_request_id: number | null;
  purchase_request_number: string | null;
  order_date: string;
  expected_delivery_date: string | null;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_charge: number;
  other_charges: number;
  grand_total: number;
  payment_terms: string | null;
  payment_status: string;
  order_status: string;
  remarks: string | null;
  approved_by_name: string | null;
  approved_at: string | null;
  items_count: number;
  items?: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: number;
  uuid: string;
  purchase_order_id: number;
  inventory_item_id: number;
  inventory_item_name?: string;
  ordered_quantity: number;
  received_quantity: number;
  pending_quantity: number;
  unit_price: number;
  tax_percentage: number;
  discount: number;
  line_total: number;
  unit_id: number;
  unit_name?: string;
  remarks: string | null;
}

export interface GoodsReceipt {
  id: number;
  uuid: string;
  grn_number: string;
  purchase_order_id: number;
  po_number?: string;
  supplier_id: number;
  supplier_name?: string;
  received_date: string;
  status: string;
  remarks: string | null;
  received_by: string;
  items_count: number;
  items?: GoodsReceiptItem[];
  created_at: string;
}

export interface GoodsReceiptItem {
  id: number;
  uuid: string;
  goods_receipt_id: number;
  inventory_item_id: number;
  inventory_item_name?: string;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  unit_cost: number;
  remarks: string | null;
}

export interface Supplier {
  id: number;
  uuid: string;
  supplier_code: string;
  company_name: string;
  contact_person: string;
  email: string;
  mobile: string;
  status: string;
}

export type PurchaseRequestStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'converted_to_po' | 'cancelled';

export const PURCHASE_REQUEST_STATUSES: { value: PurchaseRequestStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'converted_to_po', label: 'Converted to PO' },
  { value: 'cancelled', label: 'Cancelled' },
];

export type PurchaseOrderStatus = 'draft' | 'approved' | 'sent' | 'partially_received' | 'received' | 'closed' | 'cancelled';

export const PURCHASE_ORDER_STATUSES: { value: PurchaseOrderStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'sent', label: 'Sent' },
  { value: 'partially_received', label: 'Partially Received' },
  { value: 'received', label: 'Received' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export const PRIORITY_LEVELS: { value: PriorityLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export type ReceiptStatus = 'pending' | 'accepted' | 'rejected' | 'partial';

export const RECEIPT_STATUSES: { value: ReceiptStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'partial', label: 'Partial' },
];
