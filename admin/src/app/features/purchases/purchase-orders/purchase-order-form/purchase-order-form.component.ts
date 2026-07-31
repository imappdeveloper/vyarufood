import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PurchaseApiService } from '../../../../core/services/purchase-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Supplier } from '../../../../core/models/purchase/purchase.model';
import { InventoryItem, Unit } from '../../../../core/models/recipe/recipe.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1100px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/purchases/orders" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Purchase Orders
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditMode">Edit Purchase Order</span>
          <span *ngIf="!isEditMode">Create Purchase Order</span>
        </h1>
        <p *ngIf="isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Update purchase order details and items</p>
        <p *ngIf="!isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Create a new purchase order with line items</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1100px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">receipt_long</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Order Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Configure the purchase order information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Supplier <span style="color: #dc2626;">*</span></label>
              <select formControlName="supplier_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="orderForm.get('supplier_id')?.invalid && orderForm.get('supplier_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null" disabled>Select supplier</option>
                <option *ngFor="let s of suppliers" [ngValue]="s.id">{{ s.company_name }}</option>
              </select>
              <p *ngIf="orderForm.get('supplier_id')?.invalid && orderForm.get('supplier_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Supplier is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Purchase Request</label>
              <select formControlName="purchase_request_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">None</option>
                <option *ngFor="let r of purchaseRequests" [ngValue]="r.id">{{ r.request_number }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Order Date <span style="color: #dc2626;">*</span></label>
              <input formControlName="order_date" type="date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="orderForm.get('order_date')?.invalid && orderForm.get('order_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="orderForm.get('order_date')?.invalid && orderForm.get('order_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Order date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Expected Delivery Date</label>
              <input formControlName="expected_delivery_date" type="date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Payment Terms</label>
              <select formControlName="payment_terms"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select</option>
                <option value="net_7">Net 7</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_60">Net 60</option>
                <option value="cod">Cash on Delivery</option>
                <option value="advance">Advance Payment</option>
              </select>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="3" maxlength="1000" placeholder="Any additional notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ orderForm.get('remarks')?.value?.length || 0 }}/1000</p>
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
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Line Items</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Add items to this purchase order</p>
              </div>
            </div>
            <button type="button" (click)="addItem()"
              style="padding: 8px 14px; background: white; border: 1.5px solid #a7f3d0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
              onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 16px;">add</span> Add Item
            </button>
          </div>

          <div *ngIf="orderItems.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; border: 2px dashed #e5e7eb; border-radius: 12px;">
            <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 12px;">format_list_numbered</span>
            <p style="font-size: 13px; color: #9ca3af; margin: 0 0 16px 0;">No items added yet</p>
            <button type="button" (click)="addItem()"
              style="padding: 8px 14px; background: white; border: 1.5px solid #a7f3d0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
              onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 16px;">add</span> Add First Item
            </button>
          </div>

          <div *ngIf="orderItems.length > 0" formArrayName="items" style="overflow-x: auto;">
            <div style="display: grid; grid-template-columns: 2fr 100px 80px 100px 80px 90px 100px 36px; gap: 10px; padding: 0 12px 10px 12px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; min-width: 900px;">
              <span>Item</span>
              <span>Unit</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span>Tax %</span>
              <span>Discount</span>
              <span style="text-align: right;">Line Total</span>
              <span></span>
            </div>
            <div *ngFor="let itemGroup of orderItems.controls; let i = index" [formGroupName]="i"
              style="display: grid; grid-template-columns: 2fr 100px 80px 100px 80px 90px 100px 36px; gap: 10px; align-items: start; padding: 12px; border: 1px solid #f3f4f6; border-radius: 10px; margin-bottom: 10px; min-width: 900px;">
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
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Unit <span style="color: #dc2626;">*</span></label>
                <select formControlName="unit_id"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';">
                  <option [ngValue]="null" disabled>Select unit</option>
                  <option *ngFor="let u of units" [ngValue]="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Qty</label>
                <input type="number" formControlName="ordered_quantity" min="0" step="0.01" (change)="calculateItemTotal(i)"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Unit Price</label>
                <input type="number" formControlName="unit_price" min="0" step="0.01" (change)="calculateItemTotal(i)"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Tax %</label>
                <input type="number" formControlName="tax_percentage" min="0" step="0.01" (change)="calculateItemTotal(i)"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Discount</label>
                <input type="number" formControlName="discount" min="0" step="0.01" (change)="calculateItemTotal(i)"
                  style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.background='white';" onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">Total</label>
                <div style="height: 38px; display: flex; align-items: center; justify-content: flex-end; font-size: 13px; font-weight: 700; color: #166534;">{{ getItemLineTotal(i) | number:'1.2-2' }}</div>
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

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">calculate</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Order Summary</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Review the totals</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" formGroupName="totals">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Discount Amount</label>
              <input type="number" formControlName="discount_amount" min="0" step="0.01" (change)="calculateGrandTotal()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Tax Amount</label>
              <input type="number" formControlName="tax_amount" min="0" step="0.01" (change)="calculateGrandTotal()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Shipping Charge</label>
              <input type="number" formControlName="shipping_charge" min="0" step="0.01" (change)="calculateGrandTotal()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Other Charges</label>
              <input type="number" formControlName="other_charges" min="0" step="0.01" (change)="calculateGrandTotal()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
          <div style="height: 1px; background: #f3f4f6; margin: 20px 0;"></div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px;">
              <span style="font-size: 13px; color: #6b7280;">Subtotal</span>
              <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ getSubtotal() | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px;">
              <span style="font-size: 13px; color: #6b7280;">Discount</span>
              <span style="font-size: 13px; font-weight: 700; color: #dc2626;">-{{ orderForm.get('totals.discount_amount')?.value || 0 | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px;">
              <span style="font-size: 13px; color: #6b7280;">Tax</span>
              <span style="font-size: 13px; font-weight: 700; color: #1f2937;">+{{ orderForm.get('totals.tax_amount')?.value || 0 | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px;">
              <span style="font-size: 13px; color: #6b7280;">Shipping</span>
              <span style="font-size: 13px; font-weight: 700; color: #1f2937;">+{{ orderForm.get('totals.shipping_charge')?.value || 0 | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px;">
              <span style="font-size: 13px; color: #6b7280;">Other Charges</span>
              <span style="font-size: 13px; font-weight: 700; color: #1f2937;">+{{ orderForm.get('totals.other_charges')?.value || 0 | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #ecfdf5; border-radius: 12px;">
              <span style="font-size: 15px; font-weight: 700; color: #064e3b;">Grand Total</span>
              <span style="font-size: 20px; font-weight: 800; color: #047857;">{{ getGrandTotal() | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Fields marked with * are required</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/purchases/orders"
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
              <span *ngIf="isEditMode">Update Order</span>
              <span *ngIf="!isEditMode">Create Order</span>
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
export class PurchaseOrderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApiService);
  private notification = inject(NotificationService);
  private http = inject(HttpClient);

  orderForm!: FormGroup;
  isEditMode = false;
  orderUuid = '';
  saving = false;

  suppliers: Supplier[] = [];
  purchaseRequests: any[] = [];
  inventoryItems: InventoryItem[] = [];
  units: Unit[] = [];

  get orderItems(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.buildForm();
    this.orderUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditMode = !!this.orderUuid;
    this.loadDropdowns();
    if (this.isEditMode) { this.loadOrder(); }
  }

  buildForm(): void {
    this.orderForm = this.fb.group({
      supplier_id: [null, Validators.required],
      purchase_request_id: [null],
      order_date: [this.formatDate(new Date()), Validators.required],
      expected_delivery_date: [null],
      payment_terms: [null],
      remarks: [''],
      items: this.fb.array([]),
      totals: this.fb.group({
        discount_amount: [0, [Validators.min(0)]],
        tax_amount: [0, [Validators.min(0)]],
        shipping_charge: [0, [Validators.min(0)]],
        other_charges: [0, [Validators.min(0)]],
      }),
    });
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      inventory_item_id: [null, Validators.required],
      unit_id: [null, Validators.required],
      ordered_quantity: [0, [Validators.required, Validators.min(0.01)]],
      unit_price: [0, [Validators.required, Validators.min(0)]],
      tax_percentage: [0, [Validators.min(0), Validators.max(100)]],
      discount: [0, [Validators.min(0)]],
    });
  }

  addItem(): void {
    this.orderItems.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.orderItems.removeAt(index);
    this.calculateGrandTotal();
  }

  calculateItemTotal(index: number): void {
    const item = this.orderItems.at(index) as FormGroup;
    const qty = item.get('ordered_quantity')?.value || 0;
    const price = item.get('unit_price')?.value || 0;
    const tax = item.get('tax_percentage')?.value || 0;
    const discount = item.get('discount')?.value || 0;
    const lineTotal = qty * price * (1 + tax / 100) - discount;
    item.get('line_total')?.setValue(Math.max(0, lineTotal), { emitEvent: false });
    this.calculateGrandTotal();
  }

  getItemLineTotal(index: number): number {
    const item = this.orderItems.at(index) as FormGroup;
    const qty = item.get('ordered_quantity')?.value || 0;
    const price = item.get('unit_price')?.value || 0;
    const tax = item.get('tax_percentage')?.value || 0;
    const discount = item.get('discount')?.value || 0;
    return Math.max(0, qty * price * (1 + tax / 100) - discount);
  }

  getSubtotal(): number {
    let subtotal = 0;
    for (let i = 0; i < this.orderItems.length; i++) {
      subtotal += this.getItemLineTotal(i);
    }
    return subtotal;
  }

  getGrandTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.orderForm.get('totals.discount_amount')?.value || 0;
    const tax = this.orderForm.get('totals.tax_amount')?.value || 0;
    const shipping = this.orderForm.get('totals.shipping_charge')?.value || 0;
    const other = this.orderForm.get('totals.other_charges')?.value || 0;
    return subtotal - discount + tax + shipping + other;
  }

  calculateGrandTotal(): void {
    this.getGrandTotal();
  }

  loadDropdowns(): void {
    this.purchaseApi.getSuppliers({ per_page: '200' }).subscribe({
      next: (res) => { this.suppliers = res.data || []; },
      error: () => {},
    });
    const apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin`;
    this.http.get<any>(`${apiUrl}/inventory-items`, { params: { per_page: '200' }, withCredentials: true }).subscribe({
      next: (res) => { this.inventoryItems = res.data || []; },
      error: () => {},
    });
    this.http.get<any>(`${apiUrl}/units`, { params: { per_page: '200' }, withCredentials: true }).subscribe({
      next: (res) => { this.units = res.data || []; },
      error: () => {},
    });
    this.http.get<any>(`${apiUrl}/purchase-requests`, { params: { per_page: '200', status: 'approved' }, withCredentials: true }).subscribe({
      next: (res) => { this.purchaseRequests = res.data || []; },
      error: () => {},
    });
  }

  loadOrder(): void {
    this.purchaseApi.getPurchaseOrder(this.orderUuid).subscribe({
      next: (res) => {
        const order = res.data!;
        this.orderForm.patchValue({
          supplier_id: order.supplier_id,
          purchase_request_id: order.purchase_request_id,
          order_date: this.formatDate(new Date(order.order_date)),
          expected_delivery_date: order.expected_delivery_date ? this.formatDate(new Date(order.expected_delivery_date)) : null,
          payment_terms: order.payment_terms,
          remarks: order.remarks || '',
          totals: {
            discount_amount: order.discount_amount,
            tax_amount: order.tax_amount,
            shipping_charge: order.shipping_charge,
            other_charges: order.other_charges,
          },
        });

        if (order.items && order.items.length > 0) {
          order.items.forEach((item) => {
            this.orderItems.push(this.fb.group({
              inventory_item_id: [item.inventory_item_id, Validators.required],
              unit_id: [item.unit_id, Validators.required],
              ordered_quantity: [item.ordered_quantity, [Validators.required, Validators.min(0.01)]],
              unit_price: [item.unit_price, [Validators.required, Validators.min(0)]],
              tax_percentage: [item.tax_percentage, [Validators.min(0), Validators.max(100)]],
              discount: [item.discount, [Validators.min(0)]],
            }));
          });
        }
      },
      error: () => { this.notification.error('Failed to load purchase order'); this.router.navigate(['/admin/purchases/orders']); },
    });
  }

  onSubmit(): void {
    if (this.orderItems.length === 0) {
      this.notification.error('At least one item is required');
      return;
    }

    if (this.orderForm.invalid) return;
    this.saving = true;

    const formValue = { ...this.orderForm.value };
    const totals = formValue.totals;
    const data: Record<string, any> = {
      supplier_id: formValue.supplier_id,
      purchase_request_id: formValue.purchase_request_id || null,
      order_date: this.formatDate(formValue.order_date),
      expected_delivery_date: formValue.expected_delivery_date ? this.formatDate(formValue.expected_delivery_date) : null,
      payment_terms: formValue.payment_terms,
      remarks: formValue.remarks || null,
      discount_amount: totals.discount_amount || 0,
      tax_amount: totals.tax_amount || 0,
      shipping_charge: totals.shipping_charge || 0,
      other_charges: totals.other_charges || 0,
      items: formValue.items.map((item: any) => ({
        inventory_item_id: item.inventory_item_id,
        unit_id: item.unit_id,
        ordered_quantity: item.ordered_quantity,
        unit_price: item.unit_price,
        tax_percentage: item.tax_percentage || 0,
        discount: item.discount || 0,
      })),
    };

    const obs = this.isEditMode
      ? this.purchaseApi.updatePurchaseOrder(this.orderUuid, data)
      : this.purchaseApi.createPurchaseOrder(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditMode ? 'Purchase order updated' : 'Purchase order created');
        const uuid = res.data?.uuid || this.orderUuid;
        this.router.navigate(['/admin/purchases/orders', uuid]);
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
