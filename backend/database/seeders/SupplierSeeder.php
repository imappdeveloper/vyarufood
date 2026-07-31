<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\{Supplier, SupplierProduct, SupplierDocument, SupplierContact, SupplierPriceHistory, InventoryItem, Unit};
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = \App\Models\Auth\Admin::first()?->id;

        $suppliers = $this->seedSuppliers($adminId);
        $this->seedProducts($suppliers, $adminId);
        $this->seedDocuments($suppliers, $adminId);
        $this->seedContacts($suppliers, $adminId);

        $this->command->info('Supplier seeder completed successfully.');
    }

    private function seedSuppliers(?int $adminId): \Illuminate\Support\Collection
    {
        $supplierData = [
            [
                'supplier_code' => 'SUP-0001',
                'supplier_name' => 'Fresh Veg Supplies',
                'supplier_type' => 'raw_material',
                'company_name' => 'Fresh Veg Supplies',
                'contact_person' => 'Rajesh Kumar',
                'email' => 'rajesh@freshveg.in',
                'mobile' => '9876543210',
                'gst_number' => '27AABCU9603R1ZM',
                'pan_number' => 'AABCU9603R',
                'address_line_1' => '123 Vegetable Market',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'pincode' => '400001',
                'payment_terms' => 'Net 30',
                'credit_limit' => 500000,
                'rating' => 4,
                'status' => 'active',
                'is_preferred' => true,
            ],
            [
                'supplier_code' => 'SUP-0002',
                'supplier_name' => 'Spice Masters India',
                'supplier_type' => 'raw_material',
                'company_name' => 'Spice Masters India Pvt Ltd',
                'contact_person' => 'Priya Sharma',
                'email' => 'priya@spicemasters.in',
                'mobile' => '9876543211',
                'gst_number' => '09BBBFU1234R1ZP',
                'pan_number' => 'BBBFU1234R',
                'address_line_1' => '456 Spice Hub, Karol Bagh',
                'city' => 'Delhi',
                'state' => 'Delhi',
                'pincode' => '110005',
                'payment_terms' => 'Net 15',
                'credit_limit' => 300000,
                'rating' => 5,
                'status' => 'active',
                'is_preferred' => true,
            ],
            [
                'supplier_code' => 'SUP-0003',
                'supplier_name' => 'Grain and Oil Co',
                'supplier_type' => 'raw_material',
                'company_name' => 'Grain and Oil Co',
                'contact_person' => 'Amit Patel',
                'email' => 'amit@grainoil.in',
                'mobile' => '9876543212',
                'gst_number' => '24CCCDU5678R1ZQ',
                'pan_number' => 'CCCDU5678R',
                'address_line_1' => '789 Grain Market',
                'city' => 'Ahmedabad',
                'state' => 'Gujarat',
                'pincode' => '380001',
                'payment_terms' => 'Net 30',
                'credit_limit' => 750000,
                'rating' => 4,
                'status' => 'active',
                'is_preferred' => false,
            ],
            [
                'supplier_code' => 'SUP-0004',
                'supplier_name' => 'Packaging Solutions',
                'supplier_type' => 'packaging',
                'company_name' => 'Packaging Solutions Ltd',
                'contact_person' => 'Vikram Singh',
                'email' => 'vikram@packsolutions.in',
                'mobile' => '9876543214',
                'gst_number' => '06EEEFU3456R1ZS',
                'pan_number' => 'EEEFU3456R',
                'address_line_1' => '321 Industrial Area Phase 1',
                'city' => 'Gurugram',
                'state' => 'Haryana',
                'pincode' => '122001',
                'payment_terms' => 'Net 30',
                'credit_limit' => 100000,
                'rating' => 3,
                'status' => 'active',
                'is_preferred' => false,
            ],
            [
                'supplier_code' => 'SUP-0005',
                'supplier_name' => 'Gas Supply Co',
                'supplier_type' => 'gas',
                'company_name' => 'Gas Supply Co',
                'contact_person' => 'Mahesh Joshi',
                'email' => 'mahesh@gassupply.in',
                'mobile' => '9876543215',
                'gst_number' => '27FFFGU7890R1ZT',
                'pan_number' => 'FFFGU7890R',
                'address_line_1' => '567 Gas Agency Road',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'pincode' => '400002',
                'payment_terms' => 'Net 15',
                'credit_limit' => 200000,
                'rating' => 4,
                'status' => 'active',
                'is_preferred' => true,
            ],
            [
                'supplier_code' => 'SUP-0006',
                'supplier_name' => 'CleanPro Supplies',
                'supplier_type' => 'cleaning',
                'company_name' => 'CleanPro Supplies Pvt Ltd',
                'contact_person' => 'Neha Gupta',
                'email' => 'neha@cleanpro.in',
                'mobile' => '9876543216',
                'gst_number' => '07GGGHE2345R1ZU',
                'pan_number' => 'GGGHE2345R',
                'address_line_1' => '890 Cleaning Solutions Hub',
                'city' => 'Pune',
                'state' => 'Maharashtra',
                'pincode' => '411001',
                'payment_terms' => 'Net 30',
                'credit_limit' => 150000,
                'rating' => 3,
                'status' => 'active',
                'is_preferred' => false,
            ],
            [
                'supplier_code' => 'SUP-0007',
                'supplier_name' => 'Kitchen Equipment Hub',
                'supplier_type' => 'equipment',
                'company_name' => 'Kitchen Equipment Hub',
                'contact_person' => 'Suresh Reddy',
                'email' => 'suresh@kitchenequip.in',
                'mobile' => '9876543217',
                'gst_number' => '36HHHIF6789R1ZV',
                'pan_number' => 'HHHIF6789R',
                'address_line_1' => '234 Equipment Market',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
                'pincode' => '500001',
                'payment_terms' => 'Net 45',
                'credit_limit' => 1000000,
                'rating' => 5,
                'status' => 'active',
                'is_preferred' => true,
            ],
            [
                'supplier_code' => 'SUP-0008',
                'supplier_name' => 'General Trading Co',
                'supplier_type' => 'general',
                'company_name' => 'General Trading Co',
                'contact_person' => 'Ravi Mehta',
                'email' => 'ravi@generaltrading.in',
                'mobile' => '9876543218',
                'gst_number' => '19IIIJU0123R1ZW',
                'pan_number' => 'IIIJU0123R',
                'address_line_1' => '678 Trade Center',
                'city' => 'Kolkata',
                'state' => 'West Bengal',
                'pincode' => '700001',
                'payment_terms' => 'Net 30',
                'credit_limit' => 500000,
                'rating' => 3,
                'status' => 'inactive',
                'is_preferred' => false,
            ],
        ];

        $suppliers = collect();
        foreach ($supplierData as $data) {
            $supplier = Supplier::firstOrCreate(
                ['supplier_code' => $data['supplier_code']],
                array_merge($data, [
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ])
            );
            $suppliers->push($supplier);
        }

        return $suppliers;
    }

    private function seedProducts(\Illuminate\Support\Collection $suppliers, ?int $adminId): void
    {
        $items = InventoryItem::all();
        $units = Unit::all();
        $kg = $units->firstWhere('symbol', 'kg');
        $l = $units->firstWhere('symbol', 'L');
        $pcs = $units->firstWhere('symbol', 'pcs');

        $rice = $items->firstWhere('name', 'Basmati Rice');
        $dal = $items->firstWhere('name', 'Toor Dal');
        $oil = $items->firstWhere('name', 'Cooking Oil');
        $onion = $items->firstWhere('name', 'Onion');
        $tomato = $items->firstWhere('name', 'Tomato');

        $supplier1 = $suppliers->firstWhere('supplier_code', 'SUP-0001');
        $supplier2 = $suppliers->firstWhere('supplier_code', 'SUP-0002');
        $supplier3 = $suppliers->firstWhere('supplier_code', 'SUP-0003');

        $productData = [
            ['supplier' => $supplier1, 'item' => $onion, 'unit' => $kg, 'price' => 35, 'code' => 'FVS-ON-001'],
            ['supplier' => $supplier1, 'item' => $tomato, 'unit' => $kg, 'price' => 55, 'code' => 'FVS-TM-002'],
            ['supplier' => $supplier2, 'item' => $dal, 'unit' => $kg, 'price' => 145, 'code' => 'SMI-DL-001'],
            ['supplier' => $supplier3, 'item' => $rice, 'unit' => $kg, 'price' => 115, 'code' => 'GOC-RC-001'],
            ['supplier' => $supplier3, 'item' => $oil, 'unit' => $l, 'price' => 175, 'code' => 'GOC-OL-002'],
        ];

        foreach ($productData as $data) {
            if (! $data['supplier'] || ! $data['item']) {
                continue;
            }

            SupplierProduct::firstOrCreate(
                ['supplier_id' => $data['supplier']->id, 'inventory_item_id' => $data['item']->id],
                [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'supplier_product_code' => $data['code'],
                    'supplier_product_name' => $data['item']->name . ' from ' . $data['supplier']->company_name,
                    'purchase_price' => $data['price'],
                    'minimum_order_quantity' => 10,
                    'lead_time_days' => 2,
                    'unit_id' => $data['unit']?->id,
                    'is_primary_supplier' => true,
                    'status' => 'active',
                ]
            );
        }
    }

    private function seedDocuments(\Illuminate\Support\Collection $suppliers, ?int $adminId): void
    {
        foreach ($suppliers as $supplier) {
            SupplierDocument::firstOrCreate(
                ['supplier_id' => $supplier->id, 'document_type' => 'gst_certificate'],
                [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'document_name' => 'GST Certificate - ' . $supplier->company_name,
                    'document_path' => '/documents/suppliers/' . $supplier->supplier_code . '/gst.pdf',
                    'expiry_date' => now()->addYear()->toDateString(),
                    'status' => 'active',
                ]
            );

            if ($supplier->supplier_type === 'raw_material') {
                SupplierDocument::firstOrCreate(
                    ['supplier_id' => $supplier->id, 'document_type' => 'fssai_license'],
                    [
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'document_name' => 'FSSAI License - ' . $supplier->company_name,
                        'document_path' => '/documents/suppliers/' . $supplier->supplier_code . '/fssai.pdf',
                        'expiry_date' => now()->addMonths(6)->toDateString(),
                        'status' => 'active',
                    ]
                );
            }
        }
    }

    private function seedContacts(\Illuminate\Support\Collection $suppliers, ?int $adminId): void
    {
        foreach ($suppliers as $supplier) {
            SupplierContact::firstOrCreate(
                ['supplier_id' => $supplier->id, 'name' => $supplier->contact_person ?? $supplier->company_name],
                [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'designation' => 'Primary Contact',
                    'mobile' => $supplier->mobile,
                    'email' => $supplier->email,
                    'is_primary' => true,
                ]
            );
        }
    }
}
