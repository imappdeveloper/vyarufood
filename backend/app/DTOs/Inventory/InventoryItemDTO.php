<?php
declare(strict_types=1);

namespace App\DTOs\Inventory;

final readonly class InventoryItemDTO
{
    public function __construct(
        public string $itemCode,
        public string $itemName,
        public ?int $categoryId = null,
        public ?string $categoryName = null,
        public ?int $unitId = null,
        public ?string $sku = null,
        public ?string $barcode = null,
        public ?string $hsnCode = null,
        public ?string $description = null,
        public float $openingStock = 0,
        public float $currentStock = 0,
        public float $minimumStock = 0,
        public float $maximumStock = 0,
        public float $reorderLevel = 0,
        public float $reorderQuantity = 0,
        public float $costPrice = 0,
        public float $averageCost = 0,
        public float $lastPurchaseCost = 0,
        public string $stockValuationMethod = 'weighted_average',
        public bool $expiryTracking = false,
        public bool $batchTracking = false,
        public bool $serialTracking = false,
        public ?string $storageLocation = null,
        public ?string $shelfNumber = null,
        public ?string $rackNumber = null,
        public ?string $binNumber = null,
        public string $status = 'active',
        public ?string $remarks = null,
    ) {}

    public function toArray(): array
    {
        return [
            'item_code' => $this->itemCode,
            'item_name' => $this->itemName,
            'category_id' => $this->categoryId,
            'category_name' => $this->categoryName,
            'unit_id' => $this->unitId,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'hsn_code' => $this->hsnCode,
            'description' => $this->description,
            'opening_stock' => $this->openingStock,
            'current_stock' => $this->currentStock,
            'minimum_stock' => $this->minimumStock,
            'maximum_stock' => $this->maximumStock,
            'reorder_level' => $this->reorderLevel,
            'reorder_quantity' => $this->reorderQuantity,
            'cost_price' => $this->costPrice,
            'average_cost' => $this->averageCost,
            'last_purchase_cost' => $this->lastPurchaseCost,
            'stock_valuation_method' => $this->stockValuationMethod,
            'expiry_tracking' => $this->expiryTracking,
            'batch_tracking' => $this->batchTracking,
            'serial_tracking' => $this->serialTracking,
            'storage_location' => $this->storageLocation,
            'shelf_number' => $this->shelfNumber,
            'rack_number' => $this->rackNumber,
            'bin_number' => $this->binNumber,
            'status' => $this->status,
            'remarks' => $this->remarks,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            itemCode: $data['item_code'] ?? '',
            itemName: $data['item_name'] ?? $data['name'] ?? '',
            categoryId: isset($data['category_id']) ? (int) $data['category_id'] : null,
            categoryName: $data['category_name'] ?? $data['category'] ?? null,
            unitId: isset($data['unit_id']) ? (int) $data['unit_id'] : null,
            sku: $data['sku'] ?? null,
            barcode: $data['barcode'] ?? null,
            hsnCode: $data['hsn_code'] ?? null,
            description: $data['description'] ?? null,
            openingStock: (float) ($data['opening_stock'] ?? 0),
            currentStock: (float) ($data['current_stock'] ?? 0),
            minimumStock: (float) ($data['minimum_stock'] ?? 0),
            maximumStock: (float) ($data['maximum_stock'] ?? 0),
            reorderLevel: (float) ($data['reorder_level'] ?? 0),
            reorderQuantity: (float) ($data['reorder_quantity'] ?? 0),
            costPrice: (float) ($data['cost_price'] ?? 0),
            averageCost: (float) ($data['average_cost'] ?? 0),
            lastPurchaseCost: (float) ($data['last_purchase_cost'] ?? 0),
            stockValuationMethod: $data['stock_valuation_method'] ?? 'weighted_average',
            expiryTracking: (bool) ($data['expiry_tracking'] ?? false),
            batchTracking: (bool) ($data['batch_tracking'] ?? false),
            serialTracking: (bool) ($data['serial_tracking'] ?? false),
            storageLocation: $data['storage_location'] ?? null,
            shelfNumber: $data['shelf_number'] ?? null,
            rackNumber: $data['rack_number'] ?? null,
            binNumber: $data['bin_number'] ?? null,
            status: $data['status'] ?? 'active',
            remarks: $data['remarks'] ?? null,
        );
    }
}
