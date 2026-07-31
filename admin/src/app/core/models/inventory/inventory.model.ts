export interface InventoryItem {
  id: number;
  uuid: string;
  item_code: string;
  item_name: string;
  sku: string | null;
  barcode: string | null;
  hsn_code: string | null;
  description: string | null;
  category_name: string | null;
  unit_id: number | null;
  unit_name?: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  minimum_stock: number;
  maximum_stock: number | null;
  reorder_level: number;
  reorder_quantity: number;
  cost_price: number;
  average_cost: number;
  last_purchase_cost: number | null;
  stock_valuation_method: string;
  expiry_tracking: boolean;
  batch_tracking: boolean;
  serial_tracking: boolean;
  storage_location: string | null;
  shelf_number: string | null;
  rack_number: string | null;
  bin_number: string | null;
  remarks: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryBatch {
  id: number;
  uuid: string;
  batch_number: string;
  inventory_item_id: number;
  inventory_item_name?: string;
  supplier_id: number | null;
  supplier_name?: string;
  quantity: number;
  remaining_quantity: number;
  unit_cost: number;
  manufacturing_date: string | null;
  expiry_date: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: number;
  uuid: string;
  transaction_number: string;
  inventory_item_id: number;
  inventory_item_name?: string;
  batch_id: number | null;
  transaction_type: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reference_type: string | null;
  reference_id: number | null;
  notes: string | null;
  created_at: string;
}

export interface InventoryAdjustment {
  id: number;
  uuid: string;
  adjustment_number: string;
  inventory_item_id: number;
  inventory_item_name?: string;
  adjustment_type: string;
  quantity_before: number;
  quantity_adjusted: number;
  quantity_after: number;
  reason: string;
  approved_by: number | null;
  approved_at: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockAudit {
  id: number;
  uuid: string;
  audit_number: string;
  inventory_item_id: number;
  inventory_item_name?: string;
  system_quantity: number;
  physical_quantity: number;
  variance: number;
  variance_percentage: number;
  status: string;
  audited_by: number | null;
  audited_at: string | null;
  approved_by: number | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type StockValuationMethod = 'fifo' | 'weighted_average' | 'standard_cost';

export const STOCK_VALUATION_METHODS: { value: StockValuationMethod; label: string }[] = [
  { value: 'fifo', label: 'FIFO (First In First Out)' },
  { value: 'weighted_average', label: 'Weighted Average' },
  { value: 'standard_cost', label: 'Standard Cost' },
];

export type InventoryItemStatus = 'active' | 'inactive' | 'discontinued' | 'out_of_stock';

export const INVENTORY_ITEM_STATUSES: { value: InventoryItemStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

export type AdjustmentType = 'increase' | 'decrease' | 'damage' | 'expiry' | 'correction';

export const ADJUSTMENT_TYPES: { value: AdjustmentType; label: string }[] = [
  { value: 'increase', label: 'Increase' },
  { value: 'decrease', label: 'Decrease' },
  { value: 'damage', label: 'Damage' },
  { value: 'expiry', label: 'Expiry' },
  { value: 'correction', label: 'Correction' },
];

export type TransactionType = 'purchase_receipt' | 'consumption' | 'adjustment' | 'return' | 'transfer' | 'opening_balance';

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'purchase_receipt', label: 'Purchase Receipt' },
  { value: 'consumption', label: 'Consumption' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'return', label: 'Return' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'opening_balance', label: 'Opening Balance' },
];

export type AuditStatus = 'pending' | 'approved' | 'rejected';

export const AUDIT_STATUSES: { value: AuditStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export type BatchStatus = 'active' | 'expired' | 'depleted' | 'quarantined';

export const BATCH_STATUSES: { value: BatchStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'depleted', label: 'Depleted' },
  { value: 'quarantined', label: 'Quarantined' },
];
