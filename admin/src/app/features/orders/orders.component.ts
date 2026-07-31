import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderApiService } from '../../core/services/order-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Order, ORDER_STATUSES, ORDER_TYPES, PAYMENT_STATUSES } from '../../core/models/order/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && orders.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading orders...</p>
      </div>
    </div>

    <div *ngIf="!loading || orders.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Home</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Orders</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Orders</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage customer orders</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="generateDailyOrders()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">autorenew</span> Generate Daily
          </button>
          <a routerLink="/admin/orders/new"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> New Order
          </a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">receipt_long</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">pending</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Pending</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.pending || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #2563eb;">local_shipping</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">In Progress</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.in_progress || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Delivered</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.delivered || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef2f2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #dc2626;">cancel</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Cancelled</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.cancelled || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="applyFilters()" placeholder="Search orders..."
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
            <option [ngValue]="''">All Statuses</option>
            <option *ngFor="let s of orderStatuses; trackBy: trackByValue" [value]="s.value">{{ s.label }}</option>
          </select>
          <select [(ngModel)]="typeFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="''">All Types</option>
            <option *ngFor="let t of orderTypes; trackBy: trackByValue" [value]="t.value">{{ t.label }}</option>
          </select>
          <select [(ngModel)]="paymentFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="''">All Payments</option>
            <option *ngFor="let p of paymentStatuses; trackBy: trackByValue" [value]="p.value">{{ p.label }}</option>
          </select>
          <button *ngIf="searchQuery || statusFilter || typeFilter || paymentFilter" (click)="clearFilters()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 16px;">filter_alt_off</span> Clear
          </button>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && orders.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && orders.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No orders found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="searchQuery || statusFilter || typeFilter || paymentFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!searchQuery && !statusFilter && !typeFilter && !paymentFilter">No orders have been placed yet</span>
          </p>
        </div>

        <div *ngIf="!loading && orders.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px;">Order #</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 160px;">Customer</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Payment</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">Delivery</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 100px;">Total</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of visibleOrders; let i = index" (click)="viewOrder(row.uuid)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 12px;">
                  <span style="font-size: 13px; font-weight: 700; font-family: monospace; color: #059669;">{{ row.order_number_display || row.order_number }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <div>
                    <p style="font-weight: 700; color: #1f2937; margin: 0 0 2px 0;">{{ row.customer_name || '-' }}</p>
                    <p *ngIf="row.customer_email" style="font-size: 11px; color: #9ca3af; margin: 0;">{{ row.customer_email }}</p>
                  </div>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">
                    {{ row.order_type | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [className]="getStatusClass(row.order_status)">
                    {{ formatStatus(row.order_status) }}
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [className]="getPaymentStatusClass(row.payment_status)">
                    {{ row.payment_status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 13px; color: #6b7280;">{{ row.delivery_date | date:'mediumDate' }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: right;">
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.total_amount | currency:'INR':'symbol':'1.2-2' }}</span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewOrder(row.uuid); $event.stopPropagation()"
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
                      <div *ngIf="activeActionRow?.uuid === row.uuid" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 200px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                        <button (click)="viewOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button (click)="duplicateOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #3b82f6;">content_copy</span> Duplicate
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="row.order_status === 'pending'" (click)="confirmOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span> Confirm
                        </button>
                        <button *ngIf="row.order_status === 'confirmed'" (click)="prepareOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #3b82f6;">restaurant</span> Start Preparing
                        </button>
                        <button *ngIf="row.order_status === 'preparing'" (click)="readyOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #8b5cf6;">check_circle_outline</span> Mark Ready
                        </button>
                        <button *ngIf="row.order_status === 'ready'" (click)="dispatchOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #f97316;">local_shipping</span> Dispatch
                        </button>
                        <button *ngIf="row.order_status === 'out_for_delivery'" (click)="deliverOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">task_alt</span> Mark Delivered
                        </button>
                        <button *ngIf="row.order_status !== 'cancelled' && row.order_status !== 'delivered' && row.order_status !== 'completed' && row.order_status !== 'refunded'" (click)="cancelOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
                        </button>
                        <button *ngIf="row.order_status === 'cancelled' || row.order_status === 'delivered' || row.order_status === 'completed'" (click)="refundOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #ea580c; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#fff7ed'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">refund</span> Refund
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="row.deleted_at" (click)="restoreOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #059669; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">restore</span> Restore
                        </button>
                        <button (click)="deleteOrder(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
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
            <span style="font-size: 12px; color: #9ca3af;">Showing {{ getRangeLabel() }}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button (click)="goToPage(1)" [disabled]="currentPage <= 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">first_page</span>
              </button>
              <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_left</span>
              </button>
              <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">last_page</span>
              </button>
              <select (change)="onPerPageChange($event)" [style]="'padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;'"
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

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class OrdersComponent implements OnInit {
  private orderApi = inject(OrderApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  Math = Math;

  orders: Order[] = [];
  activeActionRow: Order | null = null;

  loading = false;
  currentPage = 0;
  pageSize = 15;
  totalCount = 0;
  totalPages = 1;
  searchQuery = '';
  statusFilter = '';
  typeFilter = '';
  paymentFilter = '';

  stats: any = null;

  orderStatuses = ORDER_STATUSES;
  orderTypes = ORDER_TYPES;
  paymentStatuses = PAYMENT_STATUSES;

  ngOnInit(): void {
    this.loadOrders();
    this.loadStats();
  }

  get visibleOrders(): Order[] {
    const start = this.currentPage * this.pageSize;
    return this.orders.slice(start, start + this.pageSize);
  }

  loadOrders(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: (this.currentPage + 1).toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.statusFilter) params['order_status'] = this.statusFilter;
    if (this.typeFilter) params['order_type'] = this.typeFilter;
    if (this.paymentFilter) params['payment_status'] = this.paymentFilter;

    this.orderApi.getOrders(params).subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.totalCount = res.meta?.total || this.orders.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.pageSize));
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load orders'); },
    });
  }

  loadStats(): void {
    this.orderApi.getStats().subscribe({
      next: (res) => { this.stats = res.data ?? null; },
      error: () => {},
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadOrders();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.paymentFilter = '';
    this.currentPage = 0;
    this.loadOrders();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page - 1;
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 0;
    this.loadOrders();
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  toggleActionMenu(row: Order | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  trackByValue(_: number, item: any): any { return item.value; }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-purple-100 text-purple-700';
      case 'ready': return 'bg-indigo-100 text-indigo-700';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      case 'partial_refund': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  viewOrder(uuid: string | null): void {
    if (uuid) {
      this.router.navigate(['/admin/orders', uuid]);
    }
  }

  confirmOrder(uuid: string): void {
    if (window.confirm('Confirm this order?')) {
      this.orderApi.confirmOrder(uuid).subscribe({
        next: () => { this.notification.success('Order confirmed'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  prepareOrder(uuid: string): void {
    if (window.confirm('Start preparing this order?')) {
      this.orderApi.prepareOrder(uuid).subscribe({
        next: () => { this.notification.success('Order preparing'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  readyOrder(uuid: string): void {
    if (window.confirm('Mark this order as ready?')) {
      this.orderApi.readyOrder(uuid).subscribe({
        next: () => { this.notification.success('Order marked ready'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  dispatchOrder(uuid: string): void {
    if (window.confirm('Dispatch this order?')) {
      this.orderApi.dispatchOrder(uuid).subscribe({
        next: () => { this.notification.success('Order dispatched'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deliverOrder(uuid: string): void {
    if (window.confirm('Mark this order as delivered?')) {
      this.orderApi.deliverOrder(uuid).subscribe({
        next: () => { this.notification.success('Order delivered'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelOrder(uuid: string): void {
    const reason = prompt('Cancellation reason:');
    if (reason === null) return;
    this.orderApi.cancelOrder(uuid, { cancellation_reason: reason || 'Cancelled by admin' }).subscribe({
      next: () => { this.notification.success('Order cancelled'); this.loadOrders(); this.loadStats(); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  refundOrder(uuid: string): void {
    const amount = prompt('Refund amount:');
    if (amount === null) return;
    this.orderApi.refundOrder(uuid, {
      refund_amount: amount,
      refund_method: 'wallet',
      refund_reason: 'Admin initiated refund',
    }).subscribe({
      next: () => { this.notification.success('Order refunded'); this.loadOrders(); this.loadStats(); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  duplicateOrder(uuid: string): void {
    if (window.confirm('Duplicate this order?')) {
      this.orderApi.duplicateOrder(uuid).subscribe({
        next: () => { this.notification.success('Order duplicated'); this.loadOrders(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteOrder(uuid: string): void {
    if (window.confirm('Delete this order? This action cannot be undone.')) {
      this.orderApi.deleteOrder(uuid).subscribe({
        next: () => { this.notification.success('Order deleted'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreOrder(uuid: string): void {
    if (window.confirm('Restore this order?')) {
      this.orderApi.restoreOrder(uuid).subscribe({
        next: () => { this.notification.success('Order restored'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  generateDailyOrders(): void {
    if (window.confirm('Generate daily orders for active subscriptions?')) {
      this.orderApi.generateOrders().subscribe({
        next: (res) => { this.notification.success(res.message || 'Daily orders generated'); this.loadOrders(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Generation failed'),
      });
    }
  }
}
