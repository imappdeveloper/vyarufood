<?php

declare(strict_types=1);

namespace App\Services\Purchase;

use App\DTOs\Purchase\GoodsReceiptDTO;
use App\Models\{GoodsReceipt, GoodsReceiptItem, PurchaseOrder, PurchaseOrderItem, InventoryItem};
use App\Repositories\Purchase\GoodsReceiptRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GoodsReceiptService extends BaseService implements GoodsReceiptServiceInterface
{
    protected string $moduleName = 'goods_receipt';

    public function __construct(
        protected GoodsReceiptRepositoryInterface $grnRepo,
    ) {}

    public function getPaginatedReceipts(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->grnRepo->getPaginated($filters, $perPage);
    }

    public function getReceiptById(int $id): ?GoodsReceipt
    {
        return $this->grnRepo->getById($id);
    }

    public function getReceiptByUuid(string $uuid): ?GoodsReceipt
    {
        return $this->grnRepo->getByUuid($uuid);
    }

    public function createReceipt(GoodsReceiptDTO $dto): GoodsReceipt
    {
        return $this->transaction(function () use ($dto) {
            $po = PurchaseOrder::with('items')->find($dto->purchaseOrderId);

            if (! $po) {
                throw new \RuntimeException('Purchase order not found.');
            }

            $grn = $this->grnRepo->create([
                'grn_number' => $this->grnRepo->generateGrnNumber(),
                'purchase_order_id' => $dto->purchaseOrderId,
                'supplier_id' => $dto->supplierId ?? $po->supplier_id,
                'received_date' => $dto->receivedDate ?? now()->toDateString(),
                'status' => $dto->status ?? 'pending',
                'remarks' => $dto->remarks,
                'received_by' => $dto->receivedBy,
            ]);

            $allFullyReceived = true;
            $anyAccepted = false;

            foreach ($dto->items as $itemDto) {
                $acceptedQuantity = $itemDto->receivedQuantity ?? 0;

                GoodsReceiptItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'goods_receipt_id' => $grn->id,
                    'inventory_item_id' => $itemDto->inventoryItemId,
                    'received_quantity' => $itemDto->receivedQuantity ?? 0,
                    'accepted_quantity' => $acceptedQuantity,
                    'rejected_quantity' => 0,
                    'unit_cost' => $itemDto->unitCost ?? 0,
                    'remarks' => $itemDto->remarks,
                ]);

                $poItem = PurchaseOrderItem::where('purchase_order_id', $po->id)
                    ->where('inventory_item_id', $itemDto->inventoryItemId)
                    ->first();

                if ($poItem) {
                    $poItem->increment('received_quantity', $acceptedQuantity);
                    $poItem->pending_quantity = $poItem->ordered_quantity - $poItem->received_quantity;
                    $poItem->save();

                    if ($acceptedQuantity > 0) {
                        $inventoryItem = InventoryItem::find($itemDto->inventoryItemId);
                        if ($inventoryItem) {
                            $inventoryItem->increment('current_stock', $acceptedQuantity);
                        }
                        $anyAccepted = true;
                    }

                    if ($poItem->received_quantity < $poItem->ordered_quantity) {
                        $allFullyReceived = false;
                    }
                }
            }

            $newOrderStatus = $allFullyReceived ? 'received' : 'partially_received';

            $po->update([
                'order_status' => $newOrderStatus,
                'updated_by' => auth()->guard('admin')->id(),
            ]);

            if ($anyAccepted) {
                $po->update(['payment_status' => 'pending']);
            }

            CacheManager::flush('purchase');
            $this->logInfo('Goods receipt created', ['grn_id' => $grn->id, 'po_id' => $po->id]);
            $this->logActivity('goods_receipt_created', $grn);

            return $grn->fresh(['items.inventoryItem', 'purchaseOrder', 'supplier']);
        });
    }

    public function getStats(): array
    {
        return $this->grnRepo->countByStatus();
    }
}
