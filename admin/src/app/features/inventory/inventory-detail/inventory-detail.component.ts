import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InventoryApiService } from '../../../core/services/inventory-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  InventoryItem,
  InventoryBatch,
  InventoryTransaction,
  STOCK_VALUATION_METHODS,
} from '../../../core/models/inventory/inventory.model';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading inventory details...</p>
      </div>
    </div>

    <div *ngIf="!loading && item" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/inventory" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Inventory
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ item.item_name }}</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBg(item.status)"
                [style.color]="getStatusTextColor(item.status)">
                <span *ngIf="item.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                {{ item.status | titlecase }}
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 13px; font-family: monospace; font-weight: 700; color: rgba(255,255,255,0.9);">{{ item.item_code }}</span>
              <span *ngIf="item.sku" style="font-size: 13px; color: rgba(255,255,255,0.7);">&bull; SKU: {{ item.sku }}</span>
              <span *ngIf="item.category_name" style="font-size: 13px; color: rgba(255,255,255,0.7);">&bull; {{ item.category_name }}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <a [routerLink]="['/admin/inventory', item.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteItem()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">delete</span> Delete
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">inventory</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Current Stock</p>
              <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ item.current_stock | number:'1.2-2' }} {{ item.unit_name || '' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">check_circle</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Available</p>
              <p style="font-size: 18px; font-weight: 800;" [style.color]="getAvailableStockColor()">{{ item.available_stock | number:'1.2-2' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">attach_money</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Avg Cost</p>
              <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ item.average_cost | number:'1.2-2' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">warning</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Reorder Level</p>
              <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ item.reorder_level | number:'1.0-0' }}</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 24px;">
          <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
            <button (click)="activeTab = 0" style="padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer; background: none; border: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s ease;"
              [style.color]="activeTab === 0 ? '#059669' : '#6b7280'"
              [style.borderBottom]="activeTab === 0 ? '2px solid #059669' : '2px solid transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-color')||'#6b7280'">
              <span class="material-icons" style="font-size: 18px;">info</span> Overview
            </button>
            <button (click)="activeTab = 1" style="padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer; background: none; border: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s ease;"
              [style.color]="activeTab === 1 ? '#059669' : '#6b7280'"
              [style.borderBottom]="activeTab === 1 ? '2px solid #059669' : '2px solid transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-color')||'#6b7280'">
              <span class="material-icons" style="font-size: 18px;">batch_prediction</span> Batches
            </button>
            <button (click)="activeTab = 2" style="padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer; background: none; border: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s ease;"
              [style.color]="activeTab === 2 ? '#059669' : '#6b7280'"
              [style.borderBottom]="activeTab === 2 ? '2px solid #059669' : '2px solid transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-color')||'#6b7280'">
              <span class="material-icons" style="font-size: 18px;">receipt_long</span> Transactions
            </button>
          </div>

          <div *ngIf="activeTab === 0" style="padding: 24px;">
            <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">inventory_2</span>
                <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Item Information</h3>
              </div>
              <div style="border-top: 1px solid #f3f4f6; padding-top: 16px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Item Code</p><p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ item.item_code }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Item Name</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.item_name }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">SKU</p><p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ item.sku || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Barcode</p><p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ item.barcode || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">HSN Code</p><p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ item.hsn_code || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Category</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.category_name || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Unit</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.unit_name || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Valuation Method</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ formatValuationMethod(item.stock_valuation_method) }}</p></div>
                </div>
                <div *ngIf="item.description" style="border-top: 1px solid #f3f4f6; margin-top: 16px; padding-top: 16px;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Description</p>
                  <p style="font-size: 13px; color: #374151; margin: 0;">{{ item.description }}</p>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">inventory</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Stock Levels</h3>
                </div>
                <div style="border-top: 1px solid #f3f4f6; padding-top: 16px;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Current Stock</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.current_stock | number:'1.2-2' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Reserved Stock</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.reserved_stock | number:'1.2-2' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Available Stock</p><p style="font-size: 13px; font-weight: 600;" [style.color]="getAvailableStockColor()">{{ item.available_stock | number:'1.2-2' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Reorder Level</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.reorder_level | number:'1.0-0' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Minimum Stock</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.minimum_stock | number:'1.0-0' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Maximum Stock</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.maximum_stock | number:'1.0-0' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Reorder Quantity</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.reorder_quantity | number:'1.0-0' }}</p></div>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #d97706;">attach_money</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Cost Information</h3>
                </div>
                <div style="border-top: 1px solid #f3f4f6; padding-top: 16px;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Cost Price</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.cost_price | number:'1.2-2' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Average Cost</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.average_cost | number:'1.2-2' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Last Purchase Cost</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ (item.last_purchase_cost || 0) | number:'1.2-2' }}</p></div>
                    <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Total Value</p><p style="font-size: 13px; font-weight: 700; color: #059669; margin: 0;">{{ (item.current_stock * item.average_cost) | number:'1.2-2' }}</p></div>
                  </div>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-top: 20px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">settings</span>
                <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Settings & Tracking</h3>
              </div>
              <div style="border-top: 1px solid #f3f4f6; padding-top: 16px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-icons" style="font-size: 18px;" [style.color]="item.expiry_tracking ? '#047857' : '#d1d5db'">{{ item.expiry_tracking ? 'check_circle' : 'cancel' }}</span>
                    <span style="font-size: 13px; font-weight: 600;" [style.color]="item.expiry_tracking ? '#1f2937' : '#9ca3af'">Expiry Tracking</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-icons" style="font-size: 18px;" [style.color]="item.batch_tracking ? '#047857' : '#d1d5db'">{{ item.batch_tracking ? 'check_circle' : 'cancel' }}</span>
                    <span style="font-size: 13px; font-weight: 600;" [style.color]="item.batch_tracking ? '#1f2937' : '#9ca3af'">Batch Tracking</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-icons" style="font-size: 18px;" [style.color]="item.serial_tracking ? '#047857' : '#d1d5db'">{{ item.serial_tracking ? 'check_circle' : 'cancel' }}</span>
                    <span style="font-size: 13px; font-weight: 600;" [style.color]="item.serial_tracking ? '#1f2937' : '#9ca3af'">Serial Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="item.storage_location || item.shelf_number || item.rack_number || item.bin_number" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-top: 20px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #2563eb;">place</span>
                <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Storage Location</h3>
              </div>
              <div style="border-top: 1px solid #f3f4f6; padding-top: 16px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Storage Location</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.storage_location || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Shelf Number</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.shelf_number || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Rack Number</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.rack_number || '-' }}</p></div>
                  <div><p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Bin Number</p><p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ item.bin_number || '-' }}</p></div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="activeTab === 1" style="padding: 24px;">
            <div *ngIf="batchesLoading" style="display: flex; align-items: center; justify-content: center; padding: 40px;">
              <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            </div>
            <div *ngIf="!batchesLoading && batches.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px;">
              <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 8px;">batch_prediction</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No batches recorded for this item</p>
            </div>
            <div *ngIf="!batchesLoading && batches.length > 0" style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Batch No</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Remaining</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Cost</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Expiry</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of batches; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                    [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                    <td style="padding: 12px 12px;"><span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669;">{{ row.batch_number }}</span></td>
                    <td style="padding: 12px 12px; text-align: right;"><span style="font-size: 13px; color: #1f2937;">{{ row.quantity | number:'1.2-2' }}</span></td>
                    <td style="padding: 12px 12px; text-align: right;"><span style="font-size: 13px; font-weight: 700;" [style.color]="row.remaining_quantity <= 0 ? '#dc2626' : '#059669'">{{ row.remaining_quantity | number:'1.2-2' }}</span></td>
                    <td style="padding: 12px 12px; text-align: right;"><span style="font-size: 13px; color: #1f2937;">{{ row.unit_cost | number:'1.2-2' }}</span></td>
                    <td style="padding: 12px 12px;">
                      <span *ngIf="row.expiry_date" style="font-size: 13px;" [style.color]="isExpired(row.expiry_date) ? '#dc2626' : '#374151'" [style.fontWeight]="isExpired(row.expiry_date) ? '700' : '400'">{{ row.expiry_date | date:'mediumDate' }}</span>
                      <span *ngIf="!row.expiry_date" style="font-size: 13px; color: #9ca3af;">-</span>
                    </td>
                    <td style="padding: 12px 12px; text-align: center;">
                      <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                        [style.background]="getBatchStatusBg(row.status)"
                        [style.color]="getBatchStatusTextColor(row.status)">{{ row.status | titlecase }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div *ngIf="activeTab === 2" style="padding: 24px;">
            <div *ngIf="transactionsLoading" style="display: flex; align-items: center; justify-content: center; padding: 40px;">
              <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            </div>
            <div *ngIf="!transactionsLoading && transactions.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px;">
              <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 8px;">receipt_long</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No transactions recorded for this item</p>
            </div>
            <div *ngIf="!transactionsLoading && transactions.length > 0" style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Txn No</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Cost</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of transactions; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                    [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                    <td style="padding: 12px 12px;"><span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669;">{{ row.transaction_number }}</span></td>
                    <td style="padding: 12px 12px;">
                      <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                        [style.background]="getTxnTypeBg(row.transaction_type)"
                        [style.color]="getTxnTypeTextColor(row.transaction_type)">{{ formatTxnType(row.transaction_type) }}</span>
                    </td>
                    <td style="padding: 12px 12px; text-align: right;">
                      <span style="font-size: 13px; font-weight: 700;" [style.color]="row.transaction_type === 'consumption' ? '#dc2626' : '#059669'">
                        {{ row.transaction_type === 'consumption' ? '-' : '+' }}{{ row.quantity | number:'1.2-2' }}
                      </span>
                    </td>
                    <td style="padding: 12px 12px; text-align: right;"><span style="font-size: 13px; color: #1f2937;">{{ row.unit_cost | number:'1.2-2' }}</span></td>
                    <td style="padding: 12px 12px; text-align: right;"><span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.total_cost | number:'1.2-2' }}</span></td>
                    <td style="padding: 12px 12px;"><span style="font-size: 13px; color: #374151;">{{ row.created_at | date:'medium' }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class InventoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventoryApi = inject(InventoryApiService);
  private notification = inject(NotificationService);

  item: InventoryItem | null = null;
  loading = true;

  batches: InventoryBatch[] = [];
  batchesLoading = false;

  transactions: InventoryTransaction[] = [];
  transactionsLoading = false;

  valuationMethods = STOCK_VALUATION_METHODS;
  transactionTypes: Record<string, string> = {
    purchase_receipt: 'Purchase Receipt', consumption: 'Consumption', adjustment: 'Adjustment',
    return: 'Return', transfer: 'Transfer', opening_balance: 'Opening Balance',
  };

  activeTab = 0;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadItem(uuid);
      this.loadBatches(uuid);
      this.loadTransactions(uuid);
    }
  }

  loadItem(uuid: string): void {
    this.inventoryApi.getItem(uuid).subscribe({
      next: (res: any) => { this.item = res.data ?? null; this.loading = false; },
      error: (_err: any) => { this.notification.error('Failed to load inventory item'); this.router.navigate(['/admin/inventory']); },
    });
  }

  loadBatches(uuid: string): void {
    this.batchesLoading = true;
    this.inventoryApi.getBatches({ inventory_item_id: this.item?.id?.toString() || '', per_page: '100' }).subscribe({
      next: (res: any) => { this.batches = res.data || []; this.batchesLoading = false; },
      error: (_err: any) => { this.batchesLoading = false; },
    });
  }

  loadTransactions(uuid: string): void {
    this.transactionsLoading = true;
    this.inventoryApi.getTransactions({ inventory_item_id: this.item?.id?.toString() || '', per_page: '50' }).subscribe({
      next: (res: any) => { this.transactions = res.data || []; this.transactionsLoading = false; },
      error: (_err: any) => { this.transactionsLoading = false; },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      case 'discontinued': return 'bg-amber-100 text-amber-700';
      case 'out_of_stock': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#f3f4f6';
      case 'discontinued': return '#fef3c7';
      case 'out_of_stock': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'inactive': return '#6b7280';
      case 'discontinued': return '#b45309';
      case 'out_of_stock': return '#dc2626';
      default: return '#6b7280';
    }
  }

  getBatchStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'depleted': return 'bg-gray-100 text-gray-600';
      case 'quarantined': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getBatchStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'expired': return '#fee2e2';
      case 'depleted': return '#f3f4f6';
      case 'quarantined': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }

  getBatchStatusTextColor(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'expired': return '#dc2626';
      case 'depleted': return '#6b7280';
      case 'quarantined': return '#b45309';
      default: return '#6b7280';
    }
  }

  getAvailableStockClass(): string {
    if (!this.item) return 'text-sm font-semibold text-gray-900';
    if (this.item.available_stock <= 0) return 'text-sm font-semibold text-red-600';
    if (this.item.available_stock <= this.item.reorder_level) return 'text-sm font-semibold text-amber-600';
    return 'text-sm font-semibold text-emerald-600';
  }

  getAvailableStockColor(): string {
    if (!this.item) return '#1f2937';
    if (this.item.available_stock <= 0) return '#dc2626';
    if (this.item.available_stock <= this.item.reorder_level) return '#d97706';
    return '#059669';
  }

  formatValuationMethod(method: string): string {
    return this.valuationMethods.find(m => m.value === method)?.label || method;
  }

  formatTxnType(type: string): string {
    return this.transactionTypes[type] || type;
  }

  getTxnTypeClass(type: string): string {
    switch (type) {
      case 'purchase_receipt': return 'bg-emerald-100 text-emerald-700';
      case 'consumption': return 'bg-red-100 text-red-700';
      case 'adjustment': return 'bg-amber-100 text-amber-700';
      case 'return': return 'bg-blue-100 text-blue-700';
      case 'transfer': return 'bg-purple-100 text-purple-700';
      case 'opening_balance': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getTxnTypeBg(type: string): string {
    switch (type) {
      case 'purchase_receipt': return '#d1fae5';
      case 'consumption': return '#fee2e2';
      case 'adjustment': return '#fef3c7';
      case 'return': return '#dbeafe';
      case 'transfer': return '#f3e8ff';
      case 'opening_balance': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }

  getTxnTypeTextColor(type: string): string {
    switch (type) {
      case 'purchase_receipt': return '#047857';
      case 'consumption': return '#dc2626';
      case 'adjustment': return '#b45309';
      case 'return': return '#1d4ed8';
      case 'transfer': return '#7c3aed';
      case 'opening_balance': return '#6b7280';
      default: return '#6b7280';
    }
  }

  isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }

  editItem(): void {
    if (this.item) { this.router.navigate(['/admin/inventory', this.item.uuid, 'edit']); }
  }

  deleteItem(): void {
    if (!this.item) return;
    if (window.confirm('Delete this inventory item? This cannot be undone.')) {
      this.inventoryApi.deleteItem(this.item.uuid).subscribe({
        next: () => { this.notification.success('Inventory item deleted'); this.router.navigate(['/admin/inventory']); },
        error: (err: any) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
