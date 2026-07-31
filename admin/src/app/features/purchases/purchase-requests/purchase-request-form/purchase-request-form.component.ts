import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PurchaseApiService } from '../../../../core/services/purchase-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PRIORITY_LEVELS } from '../../../../core/models/purchase/purchase.model';
import { InventoryItem, Unit } from '../../../../core/models/recipe/recipe.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-purchase-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1100px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/purchases/requests" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Purchase Requests
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditMode">Edit Purchase Request</span>
          <span *ngIf="!isEditMode">Create Purchase Request</span>
        </h1>
        <p *ngIf="isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Update purchase request details and items</p>
        <p *ngIf="!isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Create a new purchase request with items</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1100px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="requestForm" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">receipt</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Request Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Configure the purchase request information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Request Date <span style="color: #dc2626;">*</span></label>
              <input formControlName="request_date" type="date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="requestForm.get('request_date')?.invalid && requestForm.get('request_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="requestForm.get('request_date')?.invalid && requestForm.get('request_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Request date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Request Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="request_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="general">General</option>
                <option value="urgent">Urgent</option>
                <option value="stock_replenishment">Stock Replenishment</option>
                <option value="new_item">New Item</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Requested By <span style="color: #dc2626;">*</span></label>
              <input formControlName="requested_by" placeholder="e.g. John Doe" maxlength="200"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="requestForm.get('requested_by')?.invalid && requestForm.get('requested_by')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="requestForm.get('requested_by')?.invalid && requestForm.get('requested_by')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Requested by is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Department <span style="color: #dc2626;">*</span></label>
              <input formControlName="department" placeholder="e.g. Kitchen" maxlength="200"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="requestForm.get('department')?.invalid && requestForm.get('department')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="requestForm.get('department')?.invalid && requestForm.get('department')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Department is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Priority <span style="color: #dc2626;">*</span></label>
              <select formControlName="priority"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let p of priorities" [ngValue]="p.value">{{ p.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Expected Date</label>
              <input formControlName="expected_date" type="date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="3" maxlength="1000" placeholder="Any additional notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ requestForm.get('remarks')?.value?.length || 0 }}/1000</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 20px; color: #7c3aed;">format_list_numbered</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Items</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Add items to this purchase request</p>
              </div>
            </div>
            <button type="button" (click)="addItem()"
              style="padding: 8px 14px; background: white; border: 1.5px solid #a7f3d0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
              onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 16px;">add</span> Add Item
            </button>
          </div>

          <div *ngIf="requestItems.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; border: 2px dashed #e5e7eb; border-radius: 12px;">
            <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 12px;">format_list_numbered</span>
            <p style="font-size: 13px; color: #9ca3af; margin: 0 0 16px 0;">No items added yet</p>
            <button type="button" (click)="addItem()"
              style="padding: 8px 14px; background: white; border: 1.5px solid #a7f3d0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
              onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 16px;">add</span> Add First Item
            </button>
          </div>

          <div *ngIf="requestItems.length > 0" formArrayName="items" style="overflow-x: auto;">
            <div style="display: grid; grid-template-columns: 2fr 100px 110px 150px 36px; gap: 10px; padding: 0 12px 10px 12px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; min-width: 760px;">
              <span>Inventory Item</span>
              <span>Quantity</span>
              <span>Unit</span>
              <span>Remarks</span>
              <span></span>
            </div>
            <div *ngFor="let itemGroup of requestItems.controls; let i = index" [formGroupName]="i"
              style="display: grid; grid-template-columns: 2fr 100px 110px 150px 36px; gap: 10px; align-items: start; padding: 12px; border: 1px solid #f3f4f6; border-radius: 10px; margin-bottom: 10px; min-width: 760px;">
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Item <span style="color: #dc2626;">*</span></label>
                <select formControlName="inventory_item_id"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';">
                  <option [ngValue]="null" disabled>Select item</option>
                  <option *ngFor="let item of inventoryItems" [ngValue]="item.id">{{ item.name }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Qty</label>
                <input type="number" formControlName="requested_quantity" min="0" step="0.01"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Unit <span style="color: #dc2626;">*</span></label>
                <select formControlName="unit_id"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';">
                  <option [ngValue]="null" disabled>Select unit</option>
                  <option *ngFor="let u of units" [ngValue]="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Remarks</label>
                <input formControlName="remarks" maxlength="200"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div style="display: flex; align-items: flex-end;">
                <button type="button" (click)="removeItem(i)"
                  style="width: 34px; height: 34px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #dc2626; transition: all 0.15s ease; line-height: 0;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Fields marked with * are required</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/purchases/requests"
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
              <span *ngIf="isEditMode">Update Request</span>
              <span *ngIf="!isEditMode">Create Request</span>
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
export class PurchaseRequestFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApiService);
  private notification = inject(NotificationService);
  private http = inject(HttpClient);

  requestForm!: FormGroup;
  isEditMode = false;
  requestUuid = '';
  saving = false;

  inventoryItems: InventoryItem[] = [];
  units: Unit[] = [];
  priorities = PRIORITY_LEVELS;

  get requestItems(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.buildForm();
    this.requestUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditMode = !!this.requestUuid;
    this.loadDropdowns();
    if (this.isEditMode) { this.loadRequest(); }
  }

  buildForm(): void {
    this.requestForm = this.fb.group({
      request_date: [this.formatDate(new Date()), Validators.required],
      request_type: ['general', Validators.required],
      requested_by: ['', Validators.required],
      department: ['', Validators.required],
      priority: ['medium', Validators.required],
      expected_date: [null],
      remarks: [''],
      items: this.fb.array([]),
    });
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      inventory_item_id: [null, Validators.required],
      unit_id: [null, Validators.required],
      requested_quantity: [0, [Validators.required, Validators.min(0.01)]],
      remarks: [''],
    });
  }

  addItem(): void {
    this.requestItems.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.requestItems.removeAt(index);
  }

  loadDropdowns(): void {
    const apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin`;
    this.http.get<any>(`${apiUrl}/inventory-items`, { params: { per_page: '200' }, withCredentials: true }).subscribe({
      next: (res) => { this.inventoryItems = res.data || []; },
      error: () => {},
    });
    this.http.get<any>(`${apiUrl}/units`, { params: { per_page: '200' }, withCredentials: true }).subscribe({
      next: (res) => { this.units = res.data || []; },
      error: () => {},
    });
  }

  loadRequest(): void {
    this.purchaseApi.getPurchaseRequest(this.requestUuid).subscribe({
      next: (res) => {
        const request = res.data!;
        this.requestForm.patchValue({
          request_date: this.formatDate(new Date(request.request_date)),
          request_type: request.request_type,
          requested_by: request.requested_by,
          department: request.department,
          priority: request.priority,
          expected_date: request.expected_date ? this.formatDate(new Date(request.expected_date)) : null,
          remarks: request.remarks || '',
        });

        if (request.items && request.items.length > 0) {
          request.items.forEach((item) => {
            this.requestItems.push(this.fb.group({
              inventory_item_id: [item.inventory_item_id, Validators.required],
              unit_id: [item.unit_id, Validators.required],
              requested_quantity: [item.requested_quantity, [Validators.required, Validators.min(0.01)]],
              remarks: [item.remarks || ''],
            }));
          });
        }
      },
      error: () => { this.notification.error('Failed to load purchase request'); this.router.navigate(['/admin/purchases/requests']); },
    });
  }

  onSubmit(): void {
    if (this.requestItems.length === 0) {
      this.notification.error('At least one item is required');
      return;
    }

    if (this.requestForm.invalid) return;
    this.saving = true;

    const formValue = { ...this.requestForm.value };
    const data: Record<string, any> = {
      request_date: this.formatDate(formValue.request_date),
      request_type: formValue.request_type,
      requested_by: formValue.requested_by,
      department: formValue.department,
      priority: formValue.priority,
      expected_date: formValue.expected_date ? this.formatDate(formValue.expected_date) : null,
      remarks: formValue.remarks || null,
      items: formValue.items.map((item: any) => ({
        inventory_item_id: item.inventory_item_id,
        unit_id: item.unit_id,
        requested_quantity: item.requested_quantity,
        remarks: item.remarks || null,
      })),
    };

    const obs = this.isEditMode
      ? this.purchaseApi.updatePurchaseRequest(this.requestUuid, data)
      : this.purchaseApi.createPurchaseRequest(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditMode ? 'Purchase request updated' : 'Purchase request created');
        const uuid = res.data?.uuid || this.requestUuid;
        this.router.navigate(['/admin/purchases/requests', uuid]);
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
