import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerSubscriptionApiService } from '../../core/services/customer-subscription-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { CustomerSubscription, SUBSCRIPTION_STATUSES, BILLING_CYCLES } from '../../core/models/customer-subscription/customer-subscription.model';

@Component({
  selector: 'app-customer-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && subscriptions.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading subscriptions...</p>
      </div>
    </div>

    <div *ngIf="!loading || subscriptions.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Customer Subscriptions</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Customer Subscriptions</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage customer subscription assignments</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #e0e7ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #4f46e5;">inventory_2</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Total</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #d97706;">pending</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Pending</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.pending || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Active</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.active || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #ffedd5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #ea580c;">pause_circle</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Paused</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.paused || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #fce4ec; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #e53935;">event_busy</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Expired</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.expired || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #fce4ec; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #e91e63;">cancel</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Cancelled</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.cancelled || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #2563eb;">task_alt</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Completed</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.completed || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 18px; color: #7c3aed;">block</span>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px 0;">Suspended</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.suspended || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="applyFilters()" placeholder="Search by customer name or subscription #..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="searchQuery" (click)="searchQuery='';applyFilters()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="statusFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option value="">All Statuses</option>
            <option *ngFor="let s of subscriptionStatuses" [value]="s.value">{{ s.label }}</option>
          </select>
          <select [(ngModel)]="paymentStatusFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 150px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option value="">All Payments</option>
            <option *ngFor="let p of paymentStatuses" [value]="p.value">{{ p.label }}</option>
          </select>
          <select [(ngModel)]="billingCycleFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option value="">All Cycles</option>
            <option *ngFor="let bc of billingCycles" [value]="bc.value">{{ bc.label }}</option>
          </select>
          <button *ngIf="searchQuery || statusFilter || paymentStatusFilter || billingCycleFilter" (click)="clearFilters()"
            style="padding: 9px 16px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">
            <span class="material-icons" style="font-size: 16px;">filter_alt_off</span> Clear
          </button>
        </div>
      </div>

      <div *ngIf="selectedSubscriptions.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedSubscriptions.size }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="clearSelection()"
          style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; color: #9ca3af;"
          onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && subscriptions.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && subscriptions.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">card_membership</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No customer subscriptions found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">
            <span *ngIf="searchQuery || statusFilter || paymentStatusFilter || billingCycleFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!searchQuery && !statusFilter && !paymentStatusFilter && !billingCycleFilter">No subscriptions have been created yet</span>
          </p>
        </div>

        <div *ngIf="!loading && subscriptions.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 8px 10px 16px; text-align: left; width: 44px;">
                  <input type="checkbox" (change)="toggleAllRows($event)" [checked]="isAllSelected()"
                    style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px;">Subscription #</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 160px;">Customer</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 150px;">Plan</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Payment</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">Start Date</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">End Date</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Remaining</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of subscriptions; let i = index" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" (click)="$event.stopPropagation()" style="padding: 12px 8px 12px 16px;">
                  <input type="checkbox" (click)="$event.stopPropagation()" (change)="toggleRow(row)"
                    [checked]="selectedSubscriptions.has(row)" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669; cursor: pointer;" (click)="viewSubscription(row.uuid)">{{ row.subscription_number_display || row.subscription_number }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <div>
                    <p style="font-weight: 700; color: #1f2937; margin: 0; font-size: 13px;">{{ row.customer_name || '-' }}</p>
                    <p *ngIf="row.customer_email" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ row.customer_email }}</p>
                  </div>
                </td>
                <td style="padding: 12px 12px;">
                  <div>
                    <p style="font-weight: 700; color: #1f2937; margin: 0; font-size: 13px;">{{ row.plan_name || '-' }}</p>
                    <p *ngIf="row.plan_code" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0; font-family: monospace;">{{ row.plan_code }}</p>
                  </div>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(row.subscription_status)"
                    [style.color]="getStatusText(row.subscription_status)">
                    {{ row.subscription_status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getPaymentStatusBg(row.payment_status)"
                    [style.color]="getPaymentStatusText(row.payment_status)">
                    {{ row.payment_status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 12px; font-size: 12px; color: #6b7280;">{{ row.start_date | date:'mediumDate' }}</td>
                <td style="padding: 12px 12px; font-size: 12px; color: #6b7280;">{{ row.end_date | date:'mediumDate' }}</td>
                <td style="padding: 12px 12px; text-align: center; font-weight: 700; color: #374151;">{{ row.remaining_meals }}/{{ row.total_meals }}</td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewSubscription(row.uuid); $event.stopPropagation()"
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
                        <button (click)="viewSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button *ngIf="row.subscription_status === 'pending'" (click)="activateSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">play_circle</span> Activate
                        </button>
                        <button *ngIf="row.subscription_status === 'active'" (click)="pauseSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #d97706;">pause_circle</span> Pause
                        </button>
                        <button *ngIf="row.subscription_status === 'paused'" (click)="resumeSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">play_circle</span> Resume
                        </button>
                        <button *ngIf="row.subscription_status === 'active'" (click)="skipMeal(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #3b82f6;">skip_next</span> Skip
                        </button>
                        <button *ngIf="row.subscription_status === 'active' || row.subscription_status === 'paused'" (click)="cancelSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="renewSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #3b82f6;">autorenew</span> Renew
                        </button>
                        <button *ngIf="row.deleted_at" (click)="restoreSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #059669; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">restore</span> Restore
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteSubscription(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
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
            <span style="font-size: 12px; color: #9ca3af;">Showing {{ currentPage * pageSize + 1 }}-{{ Math.min((currentPage + 1) * pageSize, totalCount) }} of {{ totalCount }}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button (click)="onPageChange(0)" [disabled]="currentPage <= 0"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 0 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 0 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">first_page</span>
              </button>
              <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage <= 0"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 0 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 0 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_left</span>
              </button>
              <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages - 1 ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <button (click)="onPageChange(totalPages - 1)" [disabled]="currentPage >= totalPages - 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages - 1 ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">last_page</span>
              </button>
              <select (change)="onPerPageChange($event)" style="padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;"
                onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                <option value="10">10 / page</option>
                <option value="15" selected>15 / page</option>
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
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    </style>
  `,
})
export class CustomerSubscriptionsComponent implements OnInit {
  private subscriptionApi = inject(CustomerSubscriptionApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  Math = Math;

  subscriptions: CustomerSubscription[] = [];
  selectedSubscriptions = new Set<CustomerSubscription>();
  activeActionRow: CustomerSubscription | null = null;

  loading = false;
  currentPage = 0;
  pageSize = 15;
  totalCount = 0;
  searchQuery = '';
  statusFilter = '';
  paymentStatusFilter = '';
  billingCycleFilter = '';

  stats: any = null;

  subscriptionStatuses = SUBSCRIPTION_STATUSES;
  paymentStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'partial_refund', label: 'Partial Refund' },
  ];
  billingCycles = BILLING_CYCLES;

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadStats();
  }

  loadSubscriptions(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: (this.currentPage + 1).toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.statusFilter) params['subscription_status'] = this.statusFilter;
    if (this.paymentStatusFilter) params['payment_status'] = this.paymentStatusFilter;
    if (this.billingCycleFilter) params['billing_cycle'] = this.billingCycleFilter;

    this.subscriptionApi.getSubscriptions(params).subscribe({
      next: (res) => {
        this.subscriptions = res.data || [];
        this.totalCount = res.meta?.total || this.subscriptions.length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load customer subscriptions'); },
    });
  }

  loadStats(): void {
    this.subscriptionApi.getStats().subscribe({
      next: (res) => { this.stats = res.data ?? null; },
      error: () => {},
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadSubscriptions();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.paymentStatusFilter = '';
    this.billingCycleFilter = '';
    this.currentPage = 0;
    this.loadSubscriptions();
  }

  onPageChange(gotoPage: number): void {
    if (gotoPage < 0 || gotoPage >= this.totalPages) return;
    this.currentPage = gotoPage;
    this.loadSubscriptions();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 0;
    this.loadSubscriptions();
  }

  isAllSelected(): boolean { return this.subscriptions.length > 0 && this.selectedSubscriptions.size === this.subscriptions.length; }

  toggleAllRows(event: any): void {
    if (event.target.checked) { this.subscriptions.forEach(s => this.selectedSubscriptions.add(s)); } else { this.selectedSubscriptions.clear(); }
    this.activeActionRow = null;
  }

  toggleRow(row: CustomerSubscription): void {
    if (this.selectedSubscriptions.has(row)) { this.selectedSubscriptions.delete(row); } else { this.selectedSubscriptions.add(row); }
    this.activeActionRow = null;
  }

  clearSelection(): void { this.selectedSubscriptions.clear(); }

  toggleActionMenu(row: CustomerSubscription | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'paused': return 'bg-orange-100 text-orange-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'suspended': return 'bg-purple-100 text-purple-700';
      case 'skipped': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'pending': return '#fef3c7';
      case 'active': return '#d1fae5';
      case 'paused': return '#ffedd5';
      case 'expired': return '#fce4ec';
      case 'cancelled': return '#ffe4e6';
      case 'completed': return '#dbeafe';
      case 'suspended': return '#f3e8ff';
      case 'skipped': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return '#d97706';
      case 'active': return '#047857';
      case 'paused': return '#ea580c';
      case 'expired': return '#e53935';
      case 'cancelled': return '#e11d48';
      case 'completed': return '#2563eb';
      case 'suspended': return '#7c3aed';
      case 'skipped': return '#6b7280';
      default: return '#6b7280';
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

  getPaymentStatusBg(status: string): string {
    switch (status) {
      case 'paid': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'failed': return '#fce4ec';
      case 'refunded': return '#dbeafe';
      case 'partial_refund': return '#ffedd5';
      default: return '#f3f4f6';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'paid': return '#047857';
      case 'pending': return '#d97706';
      case 'failed': return '#e53935';
      case 'refunded': return '#2563eb';
      case 'partial_refund': return '#ea580c';
      default: return '#6b7280';
    }
  }

  viewSubscription(uuid: string): void { this.router.navigate(['/admin/customer-subscriptions', uuid]); }

  activateSubscription(uuid: string): void {
    if (window.confirm('Activate this subscription?')) {
      this.subscriptionApi.activateSubscription(uuid).subscribe({
        next: () => { this.notification.success('Subscription activated'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  pauseSubscription(uuid: string): void {
    if (window.confirm('Pause this subscription?')) {
      this.subscriptionApi.pauseSubscription(uuid, {}).subscribe({
        next: () => { this.notification.success('Subscription paused'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  resumeSubscription(uuid: string): void {
    if (window.confirm('Resume this subscription?')) {
      this.subscriptionApi.resumeSubscription(uuid).subscribe({
        next: () => { this.notification.success('Subscription resumed'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  skipMeal(uuid: string): void {
    if (window.confirm('Skip meal for this subscription?')) {
      this.subscriptionApi.skipMeal(uuid, {}).subscribe({
        next: () => { this.notification.success('Meal skipped'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  renewSubscription(uuid: string): void {
    if (window.confirm('Renew this subscription?')) {
      this.subscriptionApi.renewSubscription(uuid).subscribe({
        next: () => { this.notification.success('Subscription renewed'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelSubscription(uuid: string): void {
    if (window.confirm('Cancel this subscription? This action cannot be undone.')) {
      this.subscriptionApi.cancelSubscription(uuid, {}).subscribe({
        next: () => { this.notification.success('Subscription cancelled'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteSubscription(uuid: string): void {
    if (window.confirm('Delete this subscription? This action cannot be undone.')) {
      this.subscriptionApi.deleteSubscription(uuid).subscribe({
        next: () => { this.notification.success('Subscription deleted'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreSubscription(uuid: string): void {
    if (window.confirm('Restore this subscription?')) {
      this.subscriptionApi.restoreSubscription(uuid).subscribe({
        next: () => { this.notification.success('Subscription restored'); this.loadSubscriptions(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
