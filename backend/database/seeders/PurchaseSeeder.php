<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\{Supplier, PurchaseRequest, PurchaseRequestItem, PurchaseOrder, PurchaseOrderItem, GoodsReceipt, GoodsReceiptItem, InventoryItem, Unit};
use Illuminate\Database\Seeder;

class PurchaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = \App\Models\Auth\Admin::first()?->id;
        $units = Unit::all();
        $kg = $units->firstWhere('symbol', 'kg');
        $l = $units->firstWhere('symbol', 'L');
        $pcs = $units->firstWhere('symbol', 'pcs');

        $suppliers = $this->seedSuppliers($adminId);
        $items = $this->seedInventoryItems($kg, $l, $pcs);
        $requests = $this->seedPurchaseRequests($adminId, $items, $kg);
        $orders = $this->seedPurchaseOrders($adminId, $suppliers, $items, $kg, $requests);
        $this->seedGoodsReceipt($adminId, $suppliers, $items, $orders, $kg);

        $this->command->info('Purchase seeder completed successfully.');
    }

    private function seedSuppliers(?int $adminId): \Illuminate\Support\Collection
    {
        $supplierData = [
            [
                'supplier_code' => 'SUP-0001',
                'company_name' => 'Fresh Veg Supplies',
                'contact_person' => 'Rajesh Kumar',
                'email' => 'rajesh@freshveg.in',
                'mobile' => '9876543210',
                'gst_number' => '27AABCU9603R1ZM',
                'pan_number' => 'AABCU9603R',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'payment_terms' => 'Net 30',
                'credit_limit' => 500000,
            ],
            [
                'supplier_code' => 'SUP-0002',
                'company_name' => 'Spice Masters India',
                'contact_person' => 'Priya Sharma',
                'email' => 'priya@spicemasters.in',
                'mobile' => '9876543211',
                'gst_number' => '09BBBFU1234R1ZP',
                'pan_number' => 'BBBFU1234R',
                'city' => 'Delhi',
                'state' => 'Delhi',
                'payment_terms' => 'Net 15',
                'credit_limit' => 300000,
            ],
            [
                'supplier_code' => 'SUP-0003',
                'company_name' => 'Grain & Oil Co',
                'contact_person' => 'Amit Patel',
                'email' => 'amit@grainoil.in',
                'mobile' => '9876543212',
                'gst_number' => '24CCCDU5678R1ZQ',
                'pan_number' => 'CCCDU5678R',
                'city' => 'Ahmedabad',
                'state' => 'Gujarat',
                'payment_terms' => 'Net 30',
                'credit_limit' => 750000,
            ],
            [
                'supplier_code' => 'SUP-0004',
                'company_name' => 'Dairy Direct',
                'contact_person' => 'Sneha Reddy',
                'email' => 'sneha@dairydirect.in',
                'mobile' => '9876543213',
                'gst_number' => '36DDDDE9012R1ZR',
                'pan_number' => 'DDDDE9012R',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
                'payment_terms' => 'Net 15',
                'credit_limit' => 200000,
            ],
            [
                'supplier_code' => 'SUP-0005',
                'company_name' => 'Packaging Solutions',
                'contact_person' => 'Vikram Singh',
                'email' => 'vikram@packsolutions.in',
                'mobile' => '9876543214',
                'gst_number' => '06EEEFU3456R1ZS',
                'pan_number' => 'EEEFU3456R',
                'city' => 'Gurugram',
                'state' => 'Haryana',
                'payment_terms' => 'Net 30',
                'credit_limit' => 100000,
            ],
        ];

        $suppliers = collect();
        foreach ($supplierData as $data) {
            $supplier = Supplier::firstOrCreate(
                ['supplier_code' => $data['supplier_code']],
                array_merge($data, [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'status' => 'active',
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ])
            );
            $suppliers->push($supplier);
        }

        return $suppliers;
    }

    private function seedInventoryItems(?Unit $kg, ?Unit $l, ?Unit $pcs): \Illuminate\Support\Collection
    {
        $itemData = [
            ['name' => 'Basmati Rice', 'unit_id' => $kg?->id, 'cost_price' => 120, 'current_stock' => 500, 'minimum_stock' => 100, 'category' => 'Grains'],
            ['name' => 'Toor Dal', 'unit_id' => $kg?->id, 'cost_price' => 150, 'current_stock' => 200, 'minimum_stock' => 50, 'category' => 'Pulses'],
            ['name' => 'Cooking Oil', 'unit_id' => $l?->id, 'cost_price' => 180, 'current_stock' => 100, 'minimum_stock' => 20, 'category' => 'Oils'],
            ['name' => 'Onion', 'unit_id' => $kg?->id, 'cost_price' => 40, 'current_stock' => 150, 'minimum_stock' => 50, 'category' => 'Vegetables'],
            ['name' => 'Tomato', 'unit_id' => $kg?->id, 'cost_price' => 60, 'current_stock' => 100, 'minimum_stock' => 30, 'category' => 'Vegetables'],
        ];

        $items = collect();
        foreach ($itemData as $index => $data) {
            $item = InventoryItem::firstOrCreate(
                ['name' => $data['name']],
                [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'item_code' => 'INV-' . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                    'description' => $data['name'] . ' for tiffin preparation',
                    'category' => $data['category'],
                    'unit_id' => $data['unit_id'] ?? $kg?->id,
                    'current_stock' => $data['current_stock'],
                    'minimum_stock' => $data['minimum_stock'],
                    'maximum_stock' => 1000,
                    'cost_price' => $data['cost_price'],
                    'status' => 'active',
                ]
            );
            $items->push($item);
        }

        return $items;
    }

    private function seedPurchaseRequests(?int $adminId, \Illuminate\Support\Collection $items, ?Unit $kg): \Illuminate\Support\Collection
    {
        $rice = $items->firstWhere('name', 'Basmati Rice');
        $dal = $items->firstWhere('name', 'Toor Dal');
        $oil = $items->firstWhere('name', 'Cooking Oil');

        $pr1 = PurchaseRequest::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'request_number' => 'PR-' . now()->format('Ymd') . '-0001',
            'request_date' => now()->subDays(3)->toDateString(),
            'request_type' => 'manual',
            'requested_by' => 'Kitchen Manager',
            'department' => 'Kitchen',
            'priority' => 'medium',
            'status' => 'draft',
            'remarks' => 'Weekly restocking request',
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        if ($rice && $kg) {
            PurchaseRequestItem::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'purchase_request_id' => $pr1->id,
                'inventory_item_id' => $rice->id,
                'requested_quantity' => 100,
                'unit_id' => $kg->id,
            ]);
        }

        $pr2 = PurchaseRequest::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'request_number' => 'PR-' . now()->format('Ymd') . '-0002',
            'request_date' => now()->subDays(2)->toDateString(),
            'request_type' => 'manual',
            'requested_by' => 'Chef',
            'department' => 'Kitchen',
            'priority' => 'high',
            'status' => 'pending_approval',
            'expected_date' => now()->addDays(5)->toDateString(),
            'remarks' => 'Urgent restocking for dal and oil',
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        if ($dal && $kg) {
            PurchaseRequestItem::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'purchase_request_id' => $pr2->id,
                'inventory_item_id' => $dal->id,
                'requested_quantity' => 50,
                'unit_id' => $kg->id,
            ]);
        }

        if ($oil && $kg) {
            PurchaseRequestItem::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'purchase_request_id' => $pr2->id,
                'inventory_item_id' => $oil->id,
                'requested_quantity' => 20,
                'unit_id' => $kg->id,
            ]);
        }

        $pr3 = PurchaseRequest::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'request_number' => 'PR-' . now()->format('Ymd') . '-0003',
            'request_date' => now()->subDays(1)->toDateString(),
            'request_type' => 'auto_reorder',
            'requested_by' => 'System',
            'department' => 'Inventory',
            'priority' => 'low',
            'status' => 'approved',
            'approved_by' => $adminId,
            'approved_at' => now()->subHours(12),
            'remarks' => 'Auto-generated reorder request',
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        if ($rice && $kg) {
            PurchaseRequestItem::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'purchase_request_id' => $pr3->id,
                'inventory_item_id' => $rice->id,
                'requested_quantity' => 200,
                'approved_quantity' => 200,
                'unit_id' => $kg->id,
            ]);
        }

        return collect([$pr1, $pr2, $pr3]);
    }

    private function seedPurchaseOrders(?int $adminId, \Illuminate\Support\Collection $suppliers, \Illuminate\Support\Collection $items, ?Unit $kg, \Illuminate\Support\Collection $requests): \Illuminate\Support\Collection
    {
        $rice = $items->firstWhere('name', 'Basmati Rice');
        $dal = $items->firstWhere('name', 'Toor Dal');
        $supplier1 = $suppliers->firstWhere('supplier_code', 'SUP-0003');
        $supplier2 = $suppliers->firstWhere('supplier_code', 'SUP-0001');
        $pr3 = $requests->get(2);

        $po1 = PurchaseOrder::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'po_number' => 'PO-' . now()->format('Ymd') . '-0001',
            'supplier_id' => $supplier1?->id,
            'purchase_request_id' => $pr3?->id,
            'order_date' => now()->subDay()->toDateString(),
            'expected_delivery_date' => now()->addDays(3)->toDateString(),
            'subtotal' => 24000,
            'grand_total' => 24000,
            'payment_terms' => 'Net 30',
            'payment_status' => 'pending',
            'order_status' => 'draft',
            'remarks' => 'Order for weekly rice supply',
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        if ($rice && $kg) {
            PurchaseOrderItem::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'purchase_order_id' => $po1->id,
                'inventory_item_id' => $rice->id,
                'ordered_quantity' => 200,
                'received_quantity' => 0,
                'pending_quantity' => 200,
                'unit_price' => 120,
                'line_total' => 24000,
                'unit_id' => $kg->id,
            ]);
        }

        $po2 = PurchaseOrder::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'po_number' => 'PO-' . now()->format('Ymd') . '-0002',
            'supplier_id' => $supplier2?->id,
            'order_date' => now()->toDateString(),
            'expected_delivery_date' => now()->addDays(5)->toDateString(),
            'subtotal' => 7500,
            'grand_total' => 7500,
            'payment_terms' => 'Net 30',
            'payment_status' => 'pending',
            'order_status' => 'approved',
            'approved_by' => $adminId,
            'approved_at' => now(),
            'remarks' => 'Approved order for dal',
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        if ($dal && $kg) {
            PurchaseOrderItem::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'purchase_order_id' => $po2->id,
                'inventory_item_id' => $dal->id,
                'ordered_quantity' => 50,
                'received_quantity' => 0,
                'pending_quantity' => 50,
                'unit_price' => 150,
                'line_total' => 7500,
                'unit_id' => $kg->id,
            ]);
        }

        return collect([$po1, $po2]);
    }

    private function seedGoodsReceipt(?int $adminId, \Illuminate\Support\Collection $suppliers, \Illuminate\Support\Collection $items, \Illuminate\Support\Collection $orders, ?Unit $kg): void
    {
        $rice = $items->firstWhere('name', 'Basmati Rice');
        $supplier1 = $suppliers->firstWhere('supplier_code', 'SUP-0003');
        $po1 = $orders->first();

        if (! $po1 || ! $rice || ! $supplier1) {
            return;
        }

        $grn = GoodsReceipt::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'grn_number' => 'GRN-' . now()->format('Ymd') . '-0001',
            'purchase_order_id' => $po1->id,
            'supplier_id' => $supplier1->id,
            'received_date' => now()->toDateString(),
            'status' => 'accepted',
            'remarks' => 'Full delivery received',
            'received_by' => 'Store Manager',
        ]);

        GoodsReceiptItem::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'goods_receipt_id' => $grn->id,
            'inventory_item_id' => $rice->id,
            'received_quantity' => 200,
            'accepted_quantity' => 200,
            'rejected_quantity' => 0,
            'unit_cost' => 120,
        ]);

        $poItem = PurchaseOrderItem::where('purchase_order_id', $po1->id)
            ->where('inventory_item_id', $rice->id)
            ->first();

        if ($poItem) {
            $poItem->update([
                'received_quantity' => 200,
                'pending_quantity' => 0,
            ]);
        }

        $po1->update([
            'order_status' => 'received',
            'payment_status' => 'pending',
        ]);

        if ($rice) {
            $rice->increment('current_stock', 200);
        }
    }
}
