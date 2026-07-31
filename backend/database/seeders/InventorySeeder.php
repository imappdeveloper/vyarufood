<?php
declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InventoryItem;
use App\Models\InventoryBatch;
use App\Models\InventoryTransaction;
use App\Models\InventoryAdjustment;
use App\Models\StockAudit;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $adminId = \App\Models\Auth\Admin::first()?->id;
        $kgUnit = \App\Models\Unit::where('symbol', 'kg')->first()?->id ?? 1;
        $lUnit = \App\Models\Unit::where('symbol', 'L')->first()?->id ?? 2;
        $pcUnit = \App\Models\Unit::where('symbol', 'pc')->first()?->id ?? 3;

        $items = [
            ['item_code' => 'INV-001', 'item_name' => 'Rice', 'category_name' => 'Grains & Cereals', 'unit_id' => $kgUnit, 'sku' => 'SKU-RICE-001', 'barcode' => '8901234567001', 'hsn_code' => '1006', 'current_stock' => 250.0, 'minimum_stock' => 50.0, 'maximum_stock' => 500.0, 'reorder_level' => 50.0, 'reorder_quantity' => 100.0, 'cost_price' => 45.0, 'average_cost' => 45.0, 'last_purchase_cost' => 48.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Warehouse A', 'shelf_number' => 'S01', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-002', 'item_name' => 'Toor Dal', 'category_name' => 'Pulses & Legumes', 'unit_id' => $kgUnit, 'sku' => 'SKU-DAL-002', 'barcode' => '8901234567002', 'hsn_code' => '0713', 'current_stock' => 120.0, 'minimum_stock' => 30.0, 'maximum_stock' => 300.0, 'reorder_level' => 30.0, 'reorder_quantity' => 50.0, 'cost_price' => 140.0, 'average_cost' => 140.0, 'last_purchase_cost' => 145.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Warehouse A', 'shelf_number' => 'S01', 'rack_number' => 'R02', 'bin_number' => 'B01'],
            ['item_code' => 'INV-003', 'item_name' => 'Cooking Oil', 'category_name' => 'Oils & Fats', 'unit_id' => $lUnit, 'sku' => 'SKU-OIL-003', 'barcode' => '8901234567003', 'hsn_code' => '1507', 'current_stock' => 80.0, 'minimum_stock' => 20.0, 'maximum_stock' => 200.0, 'reorder_level' => 20.0, 'reorder_quantity' => 40.0, 'cost_price' => 120.0, 'average_cost' => 120.0, 'last_purchase_cost' => 125.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Warehouse A', 'shelf_number' => 'S02', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-004', 'item_name' => 'Turmeric Powder', 'category_name' => 'Spices', 'unit_id' => $kgUnit, 'sku' => 'SKU-TUR-004', 'barcode' => '8901234567004', 'hsn_code' => '0910', 'current_stock' => 15.0, 'minimum_stock' => 5.0, 'maximum_stock' => 50.0, 'reorder_level' => 5.0, 'reorder_quantity' => 10.0, 'cost_price' => 250.0, 'average_cost' => 250.0, 'last_purchase_cost' => 260.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Warehouse B', 'shelf_number' => 'S01', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-005', 'item_name' => 'Salt', 'category_name' => 'Essentials', 'unit_id' => $kgUnit, 'sku' => 'SKU-SLT-005', 'barcode' => '8901234567005', 'hsn_code' => '2501', 'current_stock' => 50.0, 'minimum_stock' => 15.0, 'maximum_stock' => 150.0, 'reorder_level' => 15.0, 'reorder_quantity' => 30.0, 'cost_price' => 20.0, 'average_cost' => 20.0, 'last_purchase_cost' => 22.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => false, 'batch_tracking' => false, 'storage_location' => 'Warehouse A', 'shelf_number' => 'S03', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-006', 'item_name' => 'Sugar', 'category_name' => 'Essentials', 'unit_id' => $kgUnit, 'sku' => 'SKU-SUG-006', 'barcode' => '8901234567006', 'hsn_code' => '1701', 'current_stock' => 40.0, 'minimum_stock' => 15.0, 'maximum_stock' => 120.0, 'reorder_level' => 15.0, 'reorder_quantity' => 25.0, 'cost_price' => 55.0, 'average_cost' => 55.0, 'last_purchase_cost' => 58.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => false, 'batch_tracking' => false, 'storage_location' => 'Warehouse A', 'shelf_number' => 'S03', 'rack_number' => 'R01', 'bin_number' => 'B02'],
            ['item_code' => 'INV-007', 'item_name' => 'Milk', 'category_name' => 'Dairy', 'unit_id' => $lUnit, 'sku' => 'SKU-MLK-007', 'barcode' => '8901234567007', 'hsn_code' => '0401', 'current_stock' => 60.0, 'minimum_stock' => 20.0, 'maximum_stock' => 150.0, 'reorder_level' => 20.0, 'reorder_quantity' => 50.0, 'cost_price' => 62.0, 'average_cost' => 62.0, 'last_purchase_cost' => 65.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Cold Storage', 'shelf_number' => 'S01', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-008', 'item_name' => 'Onions', 'category_name' => 'Vegetables', 'unit_id' => $kgUnit, 'sku' => 'SKU-ONI-008', 'barcode' => '8901234567008', 'hsn_code' => '0712', 'current_stock' => 100.0, 'minimum_stock' => 25.0, 'maximum_stock' => 300.0, 'reorder_level' => 25.0, 'reorder_quantity' => 50.0, 'cost_price' => 35.0, 'average_cost' => 35.0, 'last_purchase_cost' => 38.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => false, 'storage_location' => 'Warehouse C', 'shelf_number' => 'S01', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-009', 'item_name' => 'Tomatoes', 'category_name' => 'Vegetables', 'unit_id' => $kgUnit, 'sku' => 'SKU-TMT-009', 'barcode' => '8901234567009', 'hsn_code' => '0702', 'current_stock' => 80.0, 'minimum_stock' => 20.0, 'maximum_stock' => 250.0, 'reorder_level' => 20.0, 'reorder_quantity' => 40.0, 'cost_price' => 40.0, 'average_cost' => 40.0, 'last_purchase_cost' => 42.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => false, 'storage_location' => 'Warehouse C', 'shelf_number' => 'S01', 'rack_number' => 'R02', 'bin_number' => 'B01'],
            ['item_code' => 'INV-010', 'item_name' => 'Potatoes', 'category_name' => 'Vegetables', 'unit_id' => $kgUnit, 'sku' => 'SKU-POT-010', 'barcode' => '8901234567010', 'hsn_code' => '0701', 'current_stock' => 150.0, 'minimum_stock' => 30.0, 'maximum_stock' => 400.0, 'reorder_level' => 30.0, 'reorder_quantity' => 60.0, 'cost_price' => 30.0, 'average_cost' => 30.0, 'last_purchase_cost' => 32.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => false, 'storage_location' => 'Warehouse C', 'shelf_number' => 'S02', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-011', 'item_name' => 'Paneer', 'category_name' => 'Dairy', 'unit_id' => $kgUnit, 'sku' => 'SKU-PAN-011', 'barcode' => '8901234567011', 'hsn_code' => '0406', 'current_stock' => 25.0, 'minimum_stock' => 10.0, 'maximum_stock' => 80.0, 'reorder_level' => 10.0, 'reorder_quantity' => 20.0, 'cost_price' => 320.0, 'average_cost' => 320.0, 'last_purchase_cost' => 340.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Cold Storage', 'shelf_number' => 'S02', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-012', 'item_name' => 'Chicken', 'category_name' => 'Meat', 'unit_id' => $kgUnit, 'sku' => 'SKU-CHK-012', 'barcode' => '8901234567012', 'hsn_code' => '0207', 'current_stock' => 35.0, 'minimum_stock' => 15.0, 'maximum_stock' => 100.0, 'reorder_level' => 15.0, 'reorder_quantity' => 25.0, 'cost_price' => 280.0, 'average_cost' => 280.0, 'last_purchase_cost' => 300.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Cold Storage', 'shelf_number' => 'S03', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-013', 'item_name' => 'Bread', 'category_name' => 'Bakery', 'unit_id' => $pcUnit, 'sku' => 'SKU-BRD-013', 'barcode' => '8901234567013', 'hsn_code' => '1905', 'current_stock' => 40.0, 'minimum_stock' => 15.0, 'maximum_stock' => 100.0, 'reorder_level' => 15.0, 'reorder_quantity' => 30.0, 'cost_price' => 25.0, 'average_cost' => 25.0, 'last_purchase_cost' => 28.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => false, 'storage_location' => 'Warehouse B', 'shelf_number' => 'S03', 'rack_number' => 'R01', 'bin_number' => 'B01'],
            ['item_code' => 'INV-014', 'item_name' => 'Ghee', 'category_name' => 'Dairy', 'unit_id' => $kgUnit, 'sku' => 'SKU-GHE-014', 'barcode' => '8901234567014', 'hsn_code' => '0405', 'current_stock' => 20.0, 'minimum_stock' => 8.0, 'maximum_stock' => 60.0, 'reorder_level' => 8.0, 'reorder_quantity' => 15.0, 'cost_price' => 450.0, 'average_cost' => 450.0, 'last_purchase_cost' => 480.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Cold Storage', 'shelf_number' => 'S02', 'rack_number' => 'R02', 'bin_number' => 'B01'],
            ['item_code' => 'INV-015', 'item_name' => 'Cumin Seeds', 'category_name' => 'Spices', 'unit_id' => $kgUnit, 'sku' => 'SKU-CMN-015', 'barcode' => '8901234567015', 'hsn_code' => '0909', 'current_stock' => 10.0, 'minimum_stock' => 3.0, 'maximum_stock' => 30.0, 'reorder_level' => 3.0, 'reorder_quantity' => 5.0, 'cost_price' => 350.0, 'average_cost' => 350.0, 'last_purchase_cost' => 365.0, 'stock_valuation_method' => 'weighted_average', 'expiry_tracking' => true, 'batch_tracking' => true, 'storage_location' => 'Warehouse B', 'shelf_number' => 'S01', 'rack_number' => 'R02', 'bin_number' => 'B01'],
        ];

        $skus = [];
        foreach ($items as $itemData) {
            $itemData['reserved_stock'] = 0;
            $itemData['available_stock'] = $itemData['current_stock'];
            $itemData['status'] = 'active';
            $itemData['created_by'] = $adminId;
            $itemData['updated_by'] = $adminId;
            $existing = InventoryItem::where('sku', $itemData['sku'])->first();
            if ($existing) { $skus[$itemData['sku']] = $existing; continue; }
            $item = InventoryItem::create($itemData);
            $skus[$itemData['sku']] = $item;
        }

        $categories = ['Grains & Cereals', 'Pulses & Legumes', 'Dairy', 'Vegetables', 'Spices'];
        for ($i = 1; $i <= 20; $i++) {
            $itemIdx = ($i - 1) % 15;
            $item = $skus[$items[$itemIdx]['sku']] ?? null;
            if (!$item) continue;
            $batchNum = sprintf('BATCH-20260725-%04d', $i);
            if (InventoryBatch::where('batch_number', $batchNum)->exists()) continue;
            $cat = $items[$itemIdx]['category_name'];
            $expiryDays = match (true) {
                str_contains($cat, 'Dairy') || str_contains($cat, 'Meat') => rand(3, 14),
                str_contains($cat, 'Vegetables') || str_contains($cat, 'Bakery') => rand(5, 10),
                default => rand(90, 365),
            };
            InventoryBatch::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'inventory_item_id' => $item->id,
                'batch_number' => $batchNum,
                'lot_number' => 'LOT-' . str_pad((string) $i, 3, '0', STR_PAD_LEFT),
                'manufacturing_date' => now()->subDays(rand(1, 15))->format('Y-m-d'),
                'expiry_date' => now()->addDays($expiryDays)->format('Y-m-d'),
                'received_date' => now()->subDays(rand(1, 5))->format('Y-m-d'),
                'available_quantity' => (float) rand(10, 50),
                'reserved_quantity' => 0.0,
                'unit_cost' => $item->average_cost,
                'status' => 'active',
            ]);
        }

        $types = ['opening_stock', 'purchase_receipt', 'production_consumption'];
        $stockBefore = $items[0]['current_stock'];
        for ($i = 1; $i <= 30; $i++) {
            $itemIdx = ($i - 1) % 15;
            $item = $skus[$items[$itemIdx]['sku']] ?? null;
            if (!$item) continue;
            $type = $types[$i % 3];
            $txnNum = sprintf('TXN-20260725-%04d', $i);
            if (InventoryTransaction::where('transaction_number', $txnNum)->exists()) continue;
            $qty = match ($type) {
                'opening_stock' => (float) rand(20, 100),
                'purchase_receipt' => (float) rand(10, 50),
                'production_consumption' => (float) -rand(5, 25),
                default => (float) rand(1, 20),
            };
            $stockAfter = $stockBefore + $qty;
            InventoryTransaction::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'transaction_number' => $txnNum,
                'inventory_item_id' => $item->id,
                'transaction_type' => $type,
                'quantity' => $qty,
                'unit_cost' => $item->average_cost,
                'total_cost' => abs($qty) * $item->average_cost,
                'stock_before' => $stockBefore,
                'stock_after' => max(0, $stockAfter),
                'remarks' => ucfirst(str_replace('_', ' ', $type)) . " - #$i",
                'created_by' => $adminId,
                'created_at' => now()->subDays(rand(0, 30)),
            ]);
            $stockBefore = max(0, $stockAfter);
        }

        $adjItems = ['INV-001', 'INV-003', 'INV-007', 'INV-009', 'INV-012'];
        $adjReasons = ['Stock received from late delivery', 'Found unrecorded stock in storage', 'Spoiled milk discarded', 'Damaged during unloading', 'Expired chicken disposed'];
        $adjTypes = ['addition', 'addition', 'subtraction', 'subtraction', 'subtraction'];
        $adjQtys = [30.0, 10.0, 8.0, 5.0, 3.0];
        for ($i = 0; $i < 5; $i++) {
            $item = $skus[$adjItems[$i]] ?? null;
            if (!$item) continue;
            $adjNum = sprintf('ADJ-20260725-%04d', $i + 1);
            if (InventoryAdjustment::where('adjustment_number', $adjNum)->exists()) continue;
            $isApproved = $i < 3;
            InventoryAdjustment::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'adjustment_number' => $adjNum,
                'inventory_item_id' => $item->id,
                'adjustment_type' => $adjTypes[$i],
                'adjustment_quantity' => $adjQtys[$i],
                'reason' => $adjReasons[$i],
                'status' => $isApproved ? 'approved' : 'pending',
                'approved_by' => $isApproved ? $adminId : null,
                'approved_at' => $isApproved ? now()->subDays(5 - $i) : null,
                'created_by' => $adminId,
            ]);
        }

        $auditStatuses = ['pending', 'approved', 'rejected'];
        $auditRemarks = ['Weekly scheduled inventory audit', 'Monthly stock reconciliation - all items verified', 'Spot audit - discrepancies found in dairy items'];
        for ($i = 0; $i < 3; $i++) {
            $auditNum = sprintf('AUD-20260725-%04d', $i + 1);
            if (StockAudit::where('audit_number', $auditNum)->exists()) continue;
            $item = $skus[$items[$i]['sku']] ?? null;
            if (!$item) continue;
            $sysQty = $item->current_stock;
            $physQty = $auditStatuses[$i] === 'rejected' ? $sysQty - rand(2, 5) : ($auditStatuses[$i] === 'approved' ? $sysQty : $sysQty);
            StockAudit::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'audit_number' => $auditNum,
                'audit_date' => $i === 0 ? now()->addDays(7)->format('Y-m-d') : now()->subDays(7 * ($i + 1))->format('Y-m-d'),
                'inventory_item_id' => $item->id,
                'system_quantity' => $sysQty,
                'physical_quantity' => $physQty,
                'difference_quantity' => $physQty - $sysQty,
                'status' => $auditStatuses[$i],
                'remarks' => $auditRemarks[$i],
                'created_by' => $adminId,
                'approved_by' => $auditStatuses[$i] !== 'pending' ? $adminId : null,
            ]);
        }

        $this->command->info('Inventory seeded: 15 items, 20 batches, 30 transactions, 5 adjustments, 3 audits');
    }
}
