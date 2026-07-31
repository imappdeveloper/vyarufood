import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryApiService } from '../../core/services/inventory-api.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  InventoryItem,
  INVENTORY_ITEM_STATUSES,
  InventoryTransaction,
  InventoryBatch,
  BATCH_STATUSES,
} from '../../core/models/inventory/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && items.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading inventory...</p>
      </div>
    </div>

    <div *ngIf="!loading || items.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Inventory Management</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Inventory</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage stock levels, batches, transactions and audits</p>
        </div>
        <button (click)="addItem()"
          style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
          onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
          <span class="material-icons" style="font-size: 18px;">add</span> Add Item
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">inventory_2</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Items</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Active</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.active || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">attach_money</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Stock Value</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ (stats?.total_stock_value || 0) | number:'1.0-0' }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #dc2626;">warning</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Low Stock</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.items_below_reorder || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 16px;">
        <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
          <button (click)="onTabChange(0)" style="padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer; background: none; border: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s ease;"
            [style.color]="activeTab === 0 ? '#059669' : '#6b7280'"
            [style.borderBottom]="activeTab === 0 ? '2px solid #059669' : '2px solid transparent'"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-color')||'#6b7280'">
            <span class="material-icons" style="font-size: 18px;">inventory_2</span> Items
          </button>
          <button (click)="onTabChange(1)" style="padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer; background: none; border: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s ease;"
            [style.color]="activeTab === 1 ? '#059669' : '#6b7280'"
            [style.borderBottom]="activeTab === 1 ? '2px solid #059669' : '2px solid transparent'"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-color')||'#6b7280'">
            <span class="material-icons" style="font-size: 18px;">batch_prediction</span> Batches
          </button>
          <button (click)="onTabChange(2)" style="padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer; background: none; border: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s ease;"
            [style.color]="activeTab === 2 ? '#059669' : '#6b7280'"
            [style.borderBottom]="activeTab === 2 ? '2px solid #059669' : '2px solid transparent'"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-color')||'#6b7280'">
            <span class="material-icons" style="font-size: 18px;">receipt_long</span> Transactions
          </button>
        </div>
      </div>

      <div *ngIf="activeTab === 0">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="position: relative; flex: 1; min-width: 200px;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onItemSearchDebounce()" placeholder="Search inventory items..."
                style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              <button *ngIf="searchQuery" (click)="searchQuery = ''; applyFilters()"
                style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
              </button>
            </div>
            <select [(ngModel)]="statusFilter" (change)="applyFilters()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Statuses</option>
              <option *ngFor="let s of itemStatuses; trackBy: trackByValue" [value]="s.value">{{ s.label }}</option>
            </select>
            <select [(ngModel)]="categoryFilter" (change)="applyFilters()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 150px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Categories</option>
              <option value="Raw Material">Raw Material</option>
              <option value="Packaging">Packaging</option>
              <option value="Spices">Spices</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Grains">Grains</option>
              <option value="Lentils">Lentils</option>
            </select>
            <button (click)="clearFilters()"
              style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#9ca3af';this.style.background='#f3f4f6'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
              <span class="material-icons" style="font-size: 16px; color: #6b7280;">filter_alt_off</span> Clear
            </button>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 40px;">
            <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>

          <div *ngIf="!loading && items.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">inventory_2</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No inventory items found</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
              <span *ngIf="searchQuery || statusFilter || categoryFilter">Try adjusting your search or filter criteria</span>
              <span *ngIf="!searchQuery && !statusFilter && !categoryFilter">Get started by adding your first inventory item</span>
            </p>
            <button *ngIf="!searchQuery && !statusFilter && !categoryFilter" (click)="addItem()"
              style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
              onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
              <span class="material-icons" style="font-size: 18px;">add</span> Add Item
            </button>
            <button *ngIf="searchQuery || statusFilter || categoryFilter" (click)="clearFilters()"
              style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
          </div>

          <div *ngIf="!loading && items.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 100px;">Code</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 180px;">Item Name</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Category</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Stock</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Available</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Reorder</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Avg Cost</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of items; let i = index" (click)="viewItem(row)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=i % 2 === 0 ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669;">{{ row.item_code }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.item_name }}</span>
                    <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;" *ngIf="row.sku">SKU: {{ row.sku }}</p>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #374151;">{{ row.category_name || '-' }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.current_stock | number:'1.2-2' }}</span>
                    <span style="font-size: 11px; color: #9ca3af; margin-left: 2px;" *ngIf="row.unit_name">{{ row.unit_name }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700;" [style.color]="getAvailableStockColor(row)">{{ row.available_stock | number:'1.2-2' }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; color: #374151;">{{ row.reorder_level | number:'1.0-0' }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; color: #1f2937;">{{ row.average_cost | number:'1.2-2' }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getStatusBg(row.status)"
                      [style.color]="getStatusTextColor(row.status)">
                      {{ row.status | titlecase }}
                    </span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                      <button (click)="viewItem(row); $event.stopPropagation()"
                        style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #059669; transition: all 0.15s ease; line-height: 0;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">visibility</span>
                      </button>
                      <div style="position: relative;">
                        <button (click)="toggleActionMenu(row); $event.stopPropagation()"
                          style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.15s ease; line-height: 0;"
                          onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">more_vert</span>
                        </button>
                        <div *ngIf="activeActionRow?.uuid === row.uuid" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 180px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                          <button (click)="viewItem(row); toggleActionMenu(null); $event.stopPropagation()"
                            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                            <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                          </button>
                          <button (click)="editItem(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                            <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                          </button>
                          <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                          <button (click)="deleteItem(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                            onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                            <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 12px; color: #9ca3af;">Showing {{ itemRangeLabel() }}</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button (click)="goToItemPage(1)" [disabled]="currentPage <= 0"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="currentPage <= 0 ? '0.4' : '1'"
                  [style.cursor]="currentPage <= 0 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">first_page</span>
                </button>
                <button (click)="goToItemPage(currentPage)" [disabled]="currentPage <= 0"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="currentPage <= 0 ? '0.4' : '1'"
                  [style.cursor]="currentPage <= 0 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_left</span>
                </button>
                <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage + 1 }} of {{ itemTotalPages }}</span>
                <button (click)="goToItemPage(currentPage + 2)" [disabled]="currentPage >= itemTotalPages - 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="currentPage >= itemTotalPages - 1 ? '0.4' : '1'"
                  [style.cursor]="currentPage >= itemTotalPages - 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_right</span>
                </button>
                <button (click)="goToItemPage(itemTotalPages)" [disabled]="currentPage >= itemTotalPages - 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="currentPage >= itemTotalPages - 1 ? '0.4' : '1'"
                  [style.cursor]="currentPage >= itemTotalPages - 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">last_page</span>
                </button>
                <select (change)="onItemPerPageChange($event)" style="padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;"
                  onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                  <option value="10">10 / page</option>
                  <option value="15">15 / page</option>
                  <option value="25">25 / page</option>
                  <option value="50">50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab === 1">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="position: relative; flex: 1; min-width: 200px;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [(ngModel)]="batchSearchQuery" (ngModelChange)="onBatchSearchDebounce()" placeholder="Search batches..."
                style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            </div>
            <select [(ngModel)]="batchStatusFilter" (change)="loadBatches()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Statuses</option>
              <option *ngFor="let s of batchStatuses; trackBy: trackByValue" [value]="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div *ngIf="batchesLoading" style="display: flex; align-items: center; justify-content: center; padding: 40px;">
            <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>

          <div *ngIf="!batchesLoading && batches.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">batch_prediction</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No batches found</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; margin: 0;">Batches will appear when you add stock receipts</p>
          </div>

          <div *ngIf="!batchesLoading && batches.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Batch No</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Remaining</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Cost</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Expiry</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of batches; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=i % 2 === 0 ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 12px;"><span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669;">{{ row.batch_number }}</span></td>
                  <td style="padding: 12px 12px;"><span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.inventory_item_name }}</span></td>
                  <td style="padding: 12px 12px; text-align: right;"><span style="font-size: 13px; color: #1f2937;">{{ row.quantity | number:'1.2-2' }}</span></td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700;" [style.color]="row.remaining_quantity <= 0 ? '#dc2626' : '#059669'">{{ row.remaining_quantity | number:'1.2-2' }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;"><span style="font-size: 13px; color: #1f2937;">{{ row.unit_cost | number:'1.2-2' }}</span></td>
                  <td style="padding: 12px 12px;">
                    <span *ngIf="row.expiry_date" style="font-size: 13px;" [style.color]="isExpired(row.expiry_date) ? '#dc2626' : '#374151'" [style.fontWeight]="isExpired(row.expiry_date) ? '700' : '400'">{{ row.expiry_date | date:'mediumDate' }}</span>
                    <span *ngIf="!row.expiry_date" style="font-size: 13px; color: #9ca3af;">-</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getBatchStatusBg(row.status)"
                      [style.color]="getBatchStatusTextColor(row.status)">
                      {{ row.status | titlecase }}
                    </span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px; text-align: center;">
                    <button (click)="deleteBatch(row.uuid); $event.stopPropagation()"
                      style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #dc2626; transition: all 0.15s ease; line-height: 0;"
                      onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px;">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 12px; color: #9ca3af;">Showing {{ batchRangeLabel() }}</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button (click)="goToBatchPage(1)" [disabled]="batchPage <= 0"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="batchPage <= 0 ? '0.4' : '1'"
                  [style.cursor]="batchPage <= 0 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">first_page</span>
                </button>
                <button (click)="goToBatchPage(batchPage)" [disabled]="batchPage <= 0"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="batchPage <= 0 ? '0.4' : '1'"
                  [style.cursor]="batchPage <= 0 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_left</span>
                </button>
                <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ batchPage + 1 }} of {{ batchTotalPages }}</span>
                <button (click)="goToBatchPage(batchPage + 2)" [disabled]="batchPage >= batchTotalPages - 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="batchPage >= batchTotalPages - 1 ? '0.4' : '1'"
                  [style.cursor]="batchPage >= batchTotalPages - 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_right</span>
                </button>
                <button (click)="goToBatchPage(batchTotalPages)" [disabled]="batchPage >= batchTotalPages - 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="batchPage >= batchTotalPages - 1 ? '0.4' : '1'"
                  [style.cursor]="batchPage >= batchTotalPages - 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">last_page</span>
                </button>
                <select (change)="onBatchPerPageChange($event)" style="padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;"
                  onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                  <option value="10">10 / page</option>
                  <option value="15">15 / page</option>
                  <option value="25">25 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab === 2">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="position: relative; flex: 1; min-width: 200px;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [(ngModel)]="txnSearchQuery" (ngModelChange)="onTxnSearchDebounce()" placeholder="Search transactions..."
                style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            </div>
            <select [(ngModel)]="txnTypeFilter" (change)="loadTransactions()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 160px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Types</option>
              <option *ngFor="let t of transactionTypes; trackBy: trackByValue" [value]="t.value">{{ t.label }}</option>
            </select>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div *ngIf="transactionsLoading" style="display: flex; align-items: center; justify-content: center; padding: 40px;">
            <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>

          <div *ngIf="!transactionsLoading && transactions.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No transactions found</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; margin: 0;">Transactions are recorded automatically for stock movements</p>
          </div>

          <div *ngIf="!transactionsLoading && transactions.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Txn No</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Cost</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of transactions; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=i % 2 === 0 ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 12px;"><span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669;">{{ row.transaction_number }}</span></td>
                  <td style="padding: 12px 12px;"><span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.inventory_item_name }}</span></td>
                  <td style="padding: 12px 12px;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getTxnTypeBg(row.transaction_type)"
                      [style.color]="getTxnTypeTextColor(row.transaction_type)">
                      {{ formatTxnType(row.transaction_type) }}
                    </span>
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

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 12px; color: #9ca3af;">Showing {{ txnRangeLabel() }}</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button (click)="goToTxnPage(1)" [disabled]="txnPage <= 0"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnPage <= 0 ? '0.4' : '1'"
                  [style.cursor]="txnPage <= 0 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">first_page</span>
                </button>
                <button (click)="goToTxnPage(txnPage)" [disabled]="txnPage <= 0"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnPage <= 0 ? '0.4' : '1'"
                  [style.cursor]="txnPage <= 0 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_left</span>
                </button>
                <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ txnPage + 1 }} of {{ txnTotalPages }}</span>
                <button (click)="goToTxnPage(txnPage + 2)" [disabled]="txnPage >= txnTotalPages - 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnPage >= txnTotalPages - 1 ? '0.4' : '1'"
                  [style.cursor]="txnPage >= txnTotalPages - 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_right</span>
                </button>
                <button (click)="goToTxnPage(txnTotalPages)" [disabled]="txnPage >= txnTotalPages - 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnPage >= txnTotalPages - 1 ? '0.4' : '1'"
                  [style.cursor]="txnPage >= txnTotalPages - 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">last_page</span>
                </button>
                <select (change)="onTxnPerPageChange($event)" style="padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;"
                  onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                  <option value="10">10 / page</option>
                  <option value="15">15 / page</option>
                  <option value="25">25 / page</option>
                  <option value="50">50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class InventoryComponent implements OnInit {
  private inventoryApi = inject(InventoryApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  Math = Math;

  // Tabs
  activeTab = 0;

  // Items
  items: InventoryItem[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 15;
  totalCount = 0;
  searchQuery = '';
  statusFilter = '';
  categoryFilter = '';

  // Batches
  batches: InventoryBatch[] = [];
  batchesLoading = false;
  batchPage = 0;
  batchPageSize = 15;
  batchTotalCount = 0;
  batchSearchQuery = '';
  batchStatusFilter = '';

  // Transactions
  transactions: InventoryTransaction[] = [];
  transactionsLoading = false;
  txnPage = 0;
  txnPageSize = 15;
  txnTotalCount = 0;
  txnSearchQuery = '';
  txnTypeFilter = '';

  // Stats
  stats: any = null;
  itemStatuses = INVENTORY_ITEM_STATUSES;
  batchStatuses = BATCH_STATUSES;
  transactionTypes = [
    { value: 'purchase_receipt', label: 'Purchase Receipt' },
    { value: 'consumption', label: 'Consumption' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'return', label: 'Return' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'opening_balance', label: 'Opening Balance' },
  ];

  activeActionRow: InventoryItem | null = null;

  private searchTimeout: any;

  ngOnInit(): void {
    this.loadItems();
    this.loadStats();
  }

  loadItems(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: (this.currentPage + 1).toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.categoryFilter) params['category_name'] = this.categoryFilter;

    this.inventoryApi.getItems(params).subscribe({
      next: (res: any) => {
        this.items = res.data || [];
        this.totalCount = res.meta?.total || this.items.length;
        this.loading = false;
      },
      error: (_err: any) => { this.loading = false; this.notification.error('Failed to load inventory items'); },
    });
  }

  loadStats(): void {
    this.inventoryApi.getDashboardStats().subscribe({
      next: (res: any) => { this.stats = res.data ?? null; },
      error: (_err: any) => {},
    });
  }

  loadBatches(): void {
    this.batchesLoading = true;
    const params: Record<string, string> = {
      page: (this.batchPage + 1).toString(),
      per_page: this.batchPageSize.toString(),
    };
    if (this.batchSearchQuery) params['search'] = this.batchSearchQuery;
    if (this.batchStatusFilter) params['status'] = this.batchStatusFilter;

    this.inventoryApi.getBatches(params).subscribe({
      next: (res: any) => {
        this.batches = res.data || [];
        this.batchTotalCount = res.meta?.total || this.batches.length;
        this.batchesLoading = false;
      },
      error: (_err: any) => { this.batchesLoading = false; this.notification.error('Failed to load batches'); },
    });
  }

  loadTransactions(): void {
    this.transactionsLoading = true;
    const params: Record<string, string> = {
      page: (this.txnPage + 1).toString(),
      per_page: this.txnPageSize.toString(),
    };
    if (this.txnSearchQuery) params['search'] = this.txnSearchQuery;
    if (this.txnTypeFilter) params['transaction_type'] = this.txnTypeFilter;

    this.inventoryApi.getTransactions(params).subscribe({
      next: (res: any) => {
        this.transactions = res.data || [];
        this.txnTotalCount = res.meta?.total || this.transactions.length;
        this.transactionsLoading = false;
      },
      error: (_err: any) => { this.transactionsLoading = false; this.notification.error('Failed to load transactions'); },
    });
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    if (index === 1 && this.batches.length === 0) this.loadBatches();
    if (index === 2 && this.transactions.length === 0) this.loadTransactions();
  }

  applyFilters(): void { this.currentPage = 0; this.loadItems(); }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.currentPage = 0;
    this.loadItems();
  }

  onItemSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 0; this.loadItems(); }, 400);
  }

  onBatchSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.batchPage = 0; this.loadBatches(); }, 400);
  }

  onTxnSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.txnPage = 0; this.loadTransactions(); }, 400);
  }

  get itemTotalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }
  get batchTotalPages(): number { return Math.max(1, Math.ceil(this.batchTotalCount / this.batchPageSize)); }
  get txnTotalPages(): number { return Math.max(1, Math.ceil(this.txnTotalCount / this.txnPageSize)); }

  goToItemPage(page: number): void {
    const target = page - 1;
    if (target < 0 || target >= this.itemTotalPages) return;
    this.currentPage = target;
    this.loadItems();
  }

  goToBatchPage(page: number): void {
    const target = page - 1;
    if (target < 0 || target >= this.batchTotalPages) return;
    this.batchPage = target;
    this.loadBatches();
  }

  goToTxnPage(page: number): void {
    const target = page - 1;
    if (target < 0 || target >= this.txnTotalPages) return;
    this.txnPage = target;
    this.loadTransactions();
  }

  onItemPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 0;
    this.loadItems();
  }

  onBatchPerPageChange(event: any): void {
    this.batchPageSize = parseInt(event.target.value, 10);
    this.batchPage = 0;
    this.loadBatches();
  }

  onTxnPerPageChange(event: any): void {
    this.txnPageSize = parseInt(event.target.value, 10);
    this.txnPage = 0;
    this.loadTransactions();
  }

  itemRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  batchRangeLabel(): string {
    if (this.batchTotalCount === 0) return '0 of 0';
    const start = this.batchPage * this.batchPageSize + 1;
    const end = Math.min((this.batchPage + 1) * this.batchPageSize, this.batchTotalCount);
    return `${start}\u2013${end} of ${this.batchTotalCount}`;
  }

  txnRangeLabel(): string {
    if (this.txnTotalCount === 0) return '0 of 0';
    const start = this.txnPage * this.txnPageSize + 1;
    const end = Math.min((this.txnPage + 1) * this.txnPageSize, this.txnTotalCount);
    return `${start}\u2013${end} of ${this.txnTotalCount}`;
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

  getAvailableStockClass(row: InventoryItem): string {
    if (row.available_stock <= 0) return 'text-sm font-semibold text-red-600';
    if (row.available_stock <= row.reorder_level) return 'text-sm font-semibold text-amber-600';
    return 'text-sm font-semibold text-emerald-600';
  }

  getAvailableStockColor(row: InventoryItem): string {
    if (row.available_stock <= 0) return '#dc2626';
    if (row.available_stock <= row.reorder_level) return '#d97706';
    return '#059669';
  }

  formatTxnType(type: string): string {
    return this.transactionTypes.find(t => t.value === type)?.label || type;
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

  toggleActionMenu(row: InventoryItem | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  viewItem(row: any): void { this.activeActionRow = null; this.router.navigate(['/admin/inventory', row.uuid]); }
  addItem(): void { this.router.navigate(['/admin/inventory', 'create']); }
  editItem(uuid: string): void { this.router.navigate(['/admin/inventory', uuid, 'edit']); }

  deleteItem(uuid: string): void {
    if (window.confirm('Delete this inventory item? This cannot be undone.')) {
      this.inventoryApi.deleteItem(uuid).subscribe({
        next: () => { this.notification.success('Inventory item deleted'); this.loadItems(); this.loadStats(); },
        error: (err: any) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteBatch(uuid: string): void {
    if (window.confirm('Delete this batch? This cannot be undone.')) {
      this.inventoryApi.deleteBatch(uuid).subscribe({
        next: () => { this.notification.success('Batch deleted'); this.loadBatches(); },
        error: (err: any) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  trackByValue(index: number, item: any): any { return item.value; }
}
