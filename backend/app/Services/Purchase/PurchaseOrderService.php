<?php

declare(strict_types=1);

namespace App\Services\Purchase;

use App\DTOs\Purchase\PurchaseOrderDTO;
use App\Models\{PurchaseOrder, PurchaseOrderItem, PurchaseRequest, PurchaseRequestItem};
use App\Repositories\Purchase\PurchaseOrderRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PurchaseOrderService extends BaseService implements PurchaseOrderServiceInterface
{
    protected string $moduleName = 'purchase_order';

    public function __construct(
        protected PurchaseOrderRepositoryInterface $poRepo,
    ) {}

    public function getPaginatedOrders(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->poRepo->getPaginated($filters, $perPage);
    }

    public function getOrderById(int $id): ?PurchaseOrder
    {
        return $this->poRepo->getById($id);
    }

    public function getOrderByUuid(string $uuid): ?PurchaseOrder
    {
        return $this->poRepo->getByUuid($uuid);
    }

    public function createOrder(PurchaseOrderDTO $dto): PurchaseOrder
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $subtotal = 0;
            foreach ($dto->items as $itemDto) {
                $lineTotal = ($itemDto->orderedQuantity ?? 0) * ($itemDto->unitPrice ?? 0);
                $taxAmount = $lineTotal * (($itemDto->taxPercentage ?? 0) / 100);
                $lineTotal += $taxAmount - ($itemDto->discount ?? 0);
                $subtotal += max($lineTotal, 0);
            }

            $grandTotal = $subtotal - $dto->discountAmount + $dto->taxAmount + $dto->shippingCharge + $dto->otherCharges;

            $data = [
                'po_number' => $this->poRepo->generatePoNumber(),
                'supplier_id' => $dto->supplierId,
                'purchase_request_id' => $dto->purchaseRequestId,
                'order_date' => $dto->orderDate ?? now()->toDateString(),
                'expected_delivery_date' => $dto->expectedDeliveryDate,
                'subtotal' => $subtotal,
                'discount_amount' => $dto->discountAmount,
                'tax_amount' => $dto->taxAmount,
                'shipping_charge' => $dto->shippingCharge,
                'other_charges' => $dto->otherCharges,
                'grand_total' => max($grandTotal, 0),
                'payment_terms' => $dto->paymentTerms,
                'payment_status' => 'pending',
                'order_status' => 'draft',
                'remarks' => $dto->remarks,
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ];

            $po = $this->poRepo->create($data);

            foreach ($dto->items as $itemDto) {
                $lineTotal = ($itemDto->orderedQuantity ?? 0) * ($itemDto->unitPrice ?? 0);
                $taxAmount = $lineTotal * (($itemDto->taxPercentage ?? 0) / 100);
                $lineTotal = $lineTotal + $taxAmount - ($itemDto->discount ?? 0);

                PurchaseOrderItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'purchase_order_id' => $po->id,
                    'inventory_item_id' => $itemDto->inventoryItemId,
                    'ordered_quantity' => $itemDto->orderedQuantity,
                    'received_quantity' => 0,
                    'pending_quantity' => $itemDto->orderedQuantity,
                    'unit_price' => $itemDto->unitPrice,
                    'tax_percentage' => $itemDto->taxPercentage ?? 0,
                    'discount' => $itemDto->discount ?? 0,
                    'line_total' => max($lineTotal, 0),
                    'unit_id' => $itemDto->unitId,
                    'remarks' => $itemDto->remarks,
                ]);
            }

            CacheManager::flush('purchase');
            $this->logInfo('Purchase order created', ['po_id' => $po->id]);
            $this->logActivity('purchase_order_created', $po);

            return $po->fresh(['supplier', 'items.inventoryItem', 'items.unit']);
        });
    }

    public function updateOrder(int $id, PurchaseOrderDTO $dto): ?PurchaseOrder
    {
        return $this->transaction(function () use ($id, $dto) {
            $po = $this->poRepo->getById($id);

            if (! $po) {
                throw new \RuntimeException('Purchase order not found.');
            }

            if ($po->order_status !== 'draft') {
                throw new \RuntimeException('Cannot edit a purchase order that is not in draft status.');
            }

            $adminId = auth()->guard('admin')->id();

            $data = array_filter([
                'supplier_id' => $dto->supplierId,
                'purchase_request_id' => $dto->purchaseRequestId,
                'order_date' => $dto->orderDate,
                'expected_delivery_date' => $dto->expectedDeliveryDate,
                'discount_amount' => $dto->discountAmount,
                'tax_amount' => $dto->taxAmount,
                'shipping_charge' => $dto->shippingCharge,
                'other_charges' => $dto->otherCharges,
                'payment_terms' => $dto->paymentTerms,
                'remarks' => $dto->remarks,
                'updated_by' => $adminId,
            ], fn ($v) => $v !== null);

            if (! empty($dto->items)) {
                $subtotal = 0;
                foreach ($dto->items as $itemDto) {
                    $lineTotal = ($itemDto->orderedQuantity ?? 0) * ($itemDto->unitPrice ?? 0);
                    $taxAmount = $lineTotal * (($itemDto->taxPercentage ?? 0) / 100);
                    $lineTotal += $taxAmount - ($itemDto->discount ?? 0);
                    $subtotal += max($lineTotal, 0);
                }

                $data['subtotal'] = $subtotal;
                $discountAmount = $data['discount_amount'] ?? $po->discount_amount;
                $taxAmount = $data['tax_amount'] ?? $po->tax_amount;
                $shippingCharge = $data['shipping_charge'] ?? $po->shipping_charge;
                $otherCharges = $data['other_charges'] ?? $po->other_charges;
                $data['grand_total'] = max($subtotal - $discountAmount + $taxAmount + $shippingCharge + $otherCharges, 0);
            }

            $this->poRepo->update($id, $data);

            if (! empty($dto->items)) {
                PurchaseOrderItem::where('purchase_order_id', $id)->delete();

                foreach ($dto->items as $itemDto) {
                    $lineTotal = ($itemDto->orderedQuantity ?? 0) * ($itemDto->unitPrice ?? 0);
                    $taxAmount = $lineTotal * (($itemDto->taxPercentage ?? 0) / 100);
                    $lineTotal = $lineTotal + $taxAmount - ($itemDto->discount ?? 0);

                    PurchaseOrderItem::create([
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'purchase_order_id' => $id,
                        'inventory_item_id' => $itemDto->inventoryItemId,
                        'ordered_quantity' => $itemDto->orderedQuantity,
                        'received_quantity' => 0,
                        'pending_quantity' => $itemDto->orderedQuantity,
                        'unit_price' => $itemDto->unitPrice,
                        'tax_percentage' => $itemDto->taxPercentage ?? 0,
                        'discount' => $itemDto->discount ?? 0,
                        'line_total' => max($lineTotal, 0),
                        'unit_id' => $itemDto->unitId,
                        'remarks' => $itemDto->remarks,
                    ]);
                }
            }

            CacheManager::flush('purchase');
            $this->logInfo('Purchase order updated', ['po_id' => $id]);
            $this->logActivity('purchase_order_updated', $po);

            return $this->poRepo->getById($id);
        });
    }

    public function approveOrder(int $id, int $adminId): ?PurchaseOrder
    {
        return $this->transaction(function () use ($id, $adminId) {
            $po = $this->poRepo->getById($id);

            if (! $po) {
                throw new \RuntimeException('Purchase order not found.');
            }

            if ($po->order_status !== 'draft') {
                throw new \RuntimeException('Only draft purchase orders can be approved.');
            }

            $this->poRepo->update($id, [
                'order_status' => 'approved',
                'approved_by' => $adminId,
                'approved_at' => now(),
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('purchase');
            $this->logInfo('Purchase order approved', ['po_id' => $id]);
            $this->logActivity('purchase_order_approved', $po);

            return $this->poRepo->getById($id);
        });
    }

    public function closeOrder(int $id): ?PurchaseOrder
    {
        return $this->transaction(function () use ($id) {
            $po = $this->poRepo->getById($id);

            if (! $po) {
                throw new \RuntimeException('Purchase order not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $this->poRepo->update($id, [
                'order_status' => 'closed',
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('purchase');
            $this->logInfo('Purchase order closed', ['po_id' => $id]);
            $this->logActivity('purchase_order_closed', $po);

            return $this->poRepo->getById($id);
        });
    }

    public function cancelOrder(int $id): ?PurchaseOrder
    {
        return $this->transaction(function () use ($id) {
            $po = $this->poRepo->getById($id);

            if (! $po) {
                throw new \RuntimeException('Purchase order not found.');
            }

            if (in_array($po->order_status, ['closed', 'cancelled', 'received'])) {
                throw new \RuntimeException('Cannot cancel a purchase order in current status.');
            }

            $adminId = auth()->guard('admin')->id();
            $this->poRepo->update($id, [
                'order_status' => 'cancelled',
                'payment_status' => 'cancelled',
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('purchase');
            $this->logInfo('Purchase order cancelled', ['po_id' => $id]);
            $this->logActivity('purchase_order_cancelled', $po);

            return $this->poRepo->getById($id);
        });
    }

    public function convertRequestToOrder(int $requestId, int $supplierId, int $adminId): PurchaseOrder
    {
        return $this->transaction(function () use ($requestId, $supplierId, $adminId) {
            $pr = PurchaseRequest::with('items.inventoryItem', 'items.unit')->find($requestId);

            if (! $pr) {
                throw new \RuntimeException('Purchase request not found.');
            }

            if ($pr->status !== 'approved') {
                throw new \RuntimeException('Only approved purchase requests can be converted to orders.');
            }

            if ($pr->items->isEmpty()) {
                throw new \RuntimeException('Purchase request has no items.');
            }

            $poNumber = $this->poRepo->generatePoNumber();

            $subtotal = 0;
            foreach ($pr->items as $item) {
                $qty = $item->approved_quantity ?? $item->requested_quantity;
                $unitPrice = $item->inventoryItem->cost_price ?? 0;
                $lineTotal = $qty * $unitPrice;
                $subtotal += $lineTotal;
            }

            $po = $this->poRepo->create([
                'po_number' => $poNumber,
                'supplier_id' => $supplierId,
                'purchase_request_id' => $pr->id,
                'order_date' => now()->toDateString(),
                'expected_delivery_date' => $pr->expected_date,
                'subtotal' => $subtotal,
                'grand_total' => $subtotal,
                'payment_terms' => 'Net 30',
                'payment_status' => 'pending',
                'order_status' => 'draft',
                'remarks' => "Converted from PR: {$pr->request_number}",
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            foreach ($pr->items as $item) {
                $qty = $item->approved_quantity ?? $item->requested_quantity;
                $unitPrice = $item->inventoryItem->cost_price ?? 0;
                $lineTotal = $qty * $unitPrice;

                PurchaseOrderItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'purchase_order_id' => $po->id,
                    'inventory_item_id' => $item->inventory_item_id,
                    'ordered_quantity' => $qty,
                    'received_quantity' => 0,
                    'pending_quantity' => $qty,
                    'unit_price' => $unitPrice,
                    'tax_percentage' => 0,
                    'discount' => 0,
                    'line_total' => $lineTotal,
                    'unit_id' => $item->unit_id,
                    'remarks' => $item->remarks,
                ]);
            }

            $pr->update(['status' => 'converted_to_po', 'updated_by' => $adminId]);

            CacheManager::flush('purchase');
            $this->logInfo('Purchase request converted to order', ['pr_id' => $pr->id, 'po_id' => $po->id]);
            $this->logActivity('purchase_order_created', $po);

            return $po->fresh(['supplier', 'items.inventoryItem', 'items.unit']);
        });
    }

    public function getStats(): array
    {
        return $this->poRepo->countByStatus();
    }
}
