import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PurchaseApiService } from '../../../../core/services/purchase-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RECEIPT_STATUSES, PurchaseOrder } from '../../../../core/models/purchase/purchase.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-goods-receipt-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1100px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/purchases/goods-receipts" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Goods Receipts
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">Create Goods Receipt</h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Record goods received against a purchase order</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1100px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="receiptForm" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">local_shipping</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Receipt Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Configure the goods receipt information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Purchase Order <span style="color: #dc2626;">*</span></label>
              <select formControlName="purchase_order_id" (change)="onPoSelected()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="receiptForm.get('purchase_order_id')?.invalid && receiptForm.get('purchase_order_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select PO</option>
                <option *ngFor="let po of pendingPOs" [ngValue]="po.id">{{ po.po_number }} - {{ po.supplier_name }}</option>
              </select>
              <p *ngIf="receiptForm.get('purchase_order_id')?.invalid && receiptForm.get('purchase_order_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Purchase order is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Received Date <span style="color: #dc2626;">*</span></label>
              <input formControlName="received_date" type="date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="receiptForm.get('received_date')?.invalid && receiptForm.get('received_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="receiptForm.get('received_date')?.invalid && receiptForm.get('received_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Received date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status <span style="color: #dc2626;">*</span></label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let s of receiptStatuses" [ngValue]="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Received By <span style="color: #dc2626;">*</span></label>
              <input formControlName="received_by" placeholder="e.g. John Doe" maxlength="200"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="receiptForm.get('received_by')?.invalid && receiptForm.get('received_by')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="receiptForm.get('received_by')?.invalid && receiptForm.get('received_by')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Received by is required</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="3" maxlength="1000" placeholder="Any additional notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div *ngIf="selectedPO && selectedPO.items && selectedPO.items.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">format_list_numbered</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">PO Items - Received Quantities</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Enter received quantities for each item</p>
            </div>
          </div>

          <div formArrayName="items" style="overflow-x: auto;">
            <div style="display: grid; grid-template-columns: 2fr 90px 100px 100px 150px; gap: 10px; padding: 0 12px 10px 12px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; min-width: 760px;">
              <span>Item</span>
              <span style="text-align: center;">Ordered</span>
              <span style="text-align: center;">Received</span>
              <span style="text-align: right;">Unit Cost</span>
              <span>Remarks</span>
            </div>
            <div *ngFor="let itemGroup of receiptItems.controls; let i = index" [formGroupName]="i"
              style="display: grid; grid-template-columns: 2fr 90px 100px 100px 150px; gap: 10px; align-items: center; padding: 12px; border: 1px solid #f3f4f6; border-radius: 10px; margin-bottom: 10px; min-width: 760px;">
              <div>
                <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ getItemName(i) }}</span>
              </div>
              <div style="text-align: center;">
                <span style="font-size: 13px; color: #374151;">{{ getOrderedQuantity(i) }}</span>
              </div>
              <div>
                <input type="number" formControlName="received_quantity" min="0" step="0.01"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div>
                <input type="number" formControlName="unit_cost" min="0" step="0.01"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div>
                <input formControlName="remarks" maxlength="200"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!selectedPO && receiptForm.get('purchase_order_id')?.value" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 40px 24px; margin-bottom: 16px; text-align: center;">
          <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 12px;">info</span>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Selected PO has no items configured</p>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Fields marked with * are required</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/purchases/goods-receipts"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="saving ? '0.5' : '1'"
              [style.cursor]="saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              Create Receipt
            </button>
          </div>
        </div>
      </form>
    </section>

    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class GoodsReceiptFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApiService);
  private notification = inject(NotificationService);
  private http = inject(HttpClient);

  receiptForm!: FormGroup;
  saving = false;

  pendingPOs: PurchaseOrder[] = [];
  selectedPO: PurchaseOrder | null = null;
  receiptStatuses = RECEIPT_STATUSES;

  get receiptItems(): FormArray {
    return this.receiptForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadPendingPOs();
  }

  buildForm(): void {
    this.receiptForm = this.fb.group({
      purchase_order_id: [null, Validators.required],
      received_date: [this.formatDate(new Date()), Validators.required],
      status: ['pending', Validators.required],
      received_by: ['', Validators.required],
      remarks: [''],
      items: this.fb.array([]),
    });
  }

  createItemGroup(item: any): FormGroup {
    return this.fb.group({
      inventory_item_id: [item.inventory_item_id, Validators.required],
      received_quantity: [item.ordered_quantity || 0, [Validators.required, Validators.min(0)]],
      unit_cost: [item.unit_price || 0, [Validators.required, Validators.min(0)]],
      remarks: [''],
    });
  }

  loadPendingPOs(): void {
    this.purchaseApi.getPurchaseOrders({ order_status: 'approved', per_page: '200' }).subscribe({
      next: (res) => { this.pendingPOs = res.data || []; },
      error: () => {},
    });
  }

  onPoSelected(): void {
    const poId = this.receiptForm.get('purchase_order_id')?.value;
    if (!poId) {
      this.selectedPO = null;
      this.receiptItems.clear();
      return;
    }

    const po = this.pendingPOs.find(p => p.id === poId);
    if (po) {
      this.selectedPO = po;
      this.receiptItems.clear();
      this.http.get<any>(`${environment.apiUrl}/${environment.apiVersion}/admin/purchase-orders/${po.uuid}`, { withCredentials: true }).subscribe({
        next: (res) => {
          const orderData = res.data;
          if (orderData.items && orderData.items.length > 0) {
            orderData.items.forEach((item: any) => {
              this.receiptItems.push(this.createItemGroup(item));
            });
          }
          this.selectedPO = orderData;
        },
        error: () => { this.notification.error('Failed to load PO items'); },
      });
    }
  }

  getItemName(index: number): string {
    if (this.selectedPO?.items) {
      return this.selectedPO.items[index]?.inventory_item_name || '-';
    }
    return '-';
  }

  getOrderedQuantity(index: number): number {
    if (this.selectedPO?.items) {
      return this.selectedPO.items[index]?.ordered_quantity || 0;
    }
    return 0;
  }

  onSubmit(): void {
    if (this.receiptForm.invalid) return;
    this.saving = true;

    const formValue = { ...this.receiptForm.value };
    const data: Record<string, any> = {
      purchase_order_id: formValue.purchase_order_id,
      received_date: this.formatDate(formValue.received_date),
      status: formValue.status,
      received_by: formValue.received_by,
      remarks: formValue.remarks || null,
      items: formValue.items.map((item: any) => ({
        inventory_item_id: item.inventory_item_id,
        received_quantity: item.received_quantity,
        unit_cost: item.unit_cost,
        remarks: item.remarks || null,
      })),
    };

    this.purchaseApi.createGoodsReceipt(data).subscribe({
      next: (res) => {
        this.notification.success('Goods receipt created');
        const uuid = res.data?.uuid;
        if (uuid) {
          this.router.navigate(['/admin/purchases/goods-receipts', uuid]);
        } else {
          this.router.navigate(['/admin/purchases/goods-receipts']);
        }
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
