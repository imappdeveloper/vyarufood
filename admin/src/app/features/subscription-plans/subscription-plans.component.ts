import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubscriptionPlanApiService } from '../../core/services/subscription-plan-api.service';
import { KitchenApiService } from '../../core/services/kitchen-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { SubscriptionPlan, PLAN_TYPES, BILLING_CYCLES, PLAN_STATUSES } from '../../core/models/subscription-plan/subscription-plan.model';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && plans.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading plans...</p>
      </div>
    </div>

    <div *ngIf="!loading || plans.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Subscription Plans</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Subscription Plans</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage subscription plans and pricing</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="openImportDialog()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">upload_file</span> Import
          </button>
          <button (click)="exportPlans()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">download</span> Export
          </button>
          <a routerLink="/admin/subscription-plans/create"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Create Plan
          </a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">inventory_2</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total</p>
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
            <span class="material-icons" style="font-size: 22px; color: #d97706;">cancel</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Inactive</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.inactive || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #2563eb;">edit_note</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Draft</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.draft || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #2563eb;">star</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Popular</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.popular || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #7c3aed;">thumb_up</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Recommended</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.recommended || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="applyFilters()" placeholder="Search plans..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="searchQuery" (click)="searchQuery = ''; applyFilters()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <div style="position: relative;">
            <select [(ngModel)]="planTypeFilter" (change)="applyFilters()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option [ngValue]="''">All Types</option>
              <option *ngFor="let pt of planTypes; trackBy: trackByValue" [ngValue]="pt.value">{{ pt.label }}</option>
            </select>
          </div>
          <div style="position: relative;">
            <select [(ngModel)]="billingCycleFilter" (change)="applyFilters()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option [ngValue]="''">All Cycles</option>
              <option *ngFor="let bc of billingCycles; trackBy: trackByValue" [ngValue]="bc.value">{{ bc.label }}</option>
            </select>
          </div>
          <div style="position: relative;">
            <select [(ngModel)]="statusFilter" (change)="applyFilters()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option [ngValue]="''">All Statuses</option>
              <option *ngFor="let ps of planStatuses; trackBy: trackByValue" [ngValue]="ps.value">{{ ps.label }}</option>
            </select>
          </div>
          <button *ngIf="searchQuery || planTypeFilter || billingCycleFilter || statusFilter" (click)="clearFilters()"
            style="padding: 9px 16px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">
            <span class="material-icons" style="font-size: 16px; color: #6b7280;">filter_alt_off</span> Clear
          </button>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && plans.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && plans.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">inventory_2</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No subscription plans found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="searchQuery || planTypeFilter || billingCycleFilter || statusFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!searchQuery && !planTypeFilter && !billingCycleFilter && !statusFilter">Get started by creating your first subscription plan</span>
          </p>
          <a *ngIf="!searchQuery && !planTypeFilter && !billingCycleFilter && !statusFilter" routerLink="/admin/subscription-plans/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Create Plan
          </a>
          <button *ngIf="searchQuery || planTypeFilter || billingCycleFilter || statusFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && plans.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">Plan Code</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 180px;">Plan Name</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Billing</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Offer</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Pop.</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Rec.</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 70px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of plans; let i = index" (click)="viewPlan(row.uuid)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(parseInt(this.getAttribute('data-idx')) % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 12px;">
                  <span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669;">{{ row.plan_code }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <div>
                    <p style="font-weight: 700; color: #1f2937; margin: 0; line-height: 1.3;">{{ row.plan_name }}</p>
                    <p *ngIf="row.description" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">{{ row.description }}</p>
                  </div>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="display: inline-flex; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">{{ row.plan_type | titlecase }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 12px; color: #374151;">{{ row.billing_cycle | titlecase }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: right;">
                  <span style="font-weight: 700; color: #1f2937;">{{ row.price | number:'1.2-2' }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: right;">
                  <span *ngIf="row.offer_price && row.offer_price > 0" style="font-weight: 700; color: #059669;">{{ row.offer_price | number:'1.2-2' }}</span>
                  <span *ngIf="!row.offer_price || row.offer_price <= 0" style="color: #d1d5db;">-</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(row.status)"
                    [style.color]="getStatusText(row.status)">
                    {{ row.status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span class="material-icons" *ngIf="row.is_popular" style="font-size: 18px; color: #3b82f6;">star</span>
                  <span class="material-icons" *ngIf="!row.is_popular" style="font-size: 18px; color: #d1d5db;">star_border</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span class="material-icons" *ngIf="row.is_recommended" style="font-size: 18px; color: #7c3aed;">thumb_up</span>
                  <span class="material-icons" *ngIf="!row.is_recommended" style="font-size: 18px; color: #d1d5db;">thumb_up_off_alt</span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewPlan(row.uuid); $event.stopPropagation()"
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
                        <button (click)="viewPlan(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button *ngIf="row.status === 'draft'" (click)="editPlan(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="duplicatePlan(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #3b82f6;">content_copy</span> Duplicate
                        </button>
                        <button (click)="togglePopular(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #3b82f6;">{{ row.is_popular ? 'star_border' : 'star' }}</span>
                          {{ row.is_popular ? 'Unset Popular' : 'Set Popular' }}
                        </button>
                        <button (click)="toggleRecommended(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #7c3aed;">{{ row.is_recommended ? 'thumb_up_off_alt' : 'thumb_up' }}</span>
                          {{ row.is_recommended ? 'Unset Recommended' : 'Set Recommended' }}
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="!row.deleted_at" (click)="deletePlan(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                        </button>
                        <button *ngIf="row.deleted_at" (click)="restorePlan(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #047857; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">restore</span> Restore
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
              <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage }} of {{ totalPages }}</span>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <button (click)="goToPage(totalPages)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">last_page</span>
              </button>
              <select (change)="onPerPageChange($event)" [style]="'padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;'"
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

      <input #fileInput type="file" accept=".csv,.xlsx,.xls" hidden (change)="onFileSelected($event)" />
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class SubscriptionPlansComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private subscriptionPlanApi = inject(SubscriptionPlanApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  Math = Math;

  plans: SubscriptionPlan[] = [];
  displayedColumns = ['plan_code', 'plan_name', 'plan_type', 'billing_cycle', 'price', 'offer_price', 'status', 'is_popular', 'is_recommended', 'actions'];

  loading = false;
  currentPage = 1;
  pageSize = 15;
  totalCount = 0;
  searchQuery = '';
  planTypeFilter = '';
  billingCycleFilter = '';
  statusFilter = '';

  stats: any = null;

  planTypes = PLAN_TYPES;
  billingCycles = BILLING_CYCLES;
  planStatuses = PLAN_STATUSES;

  activeActionRow: SubscriptionPlan | null = null;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  ngOnInit(): void {
    this.loadPlans();
    this.loadStats();
  }

  loadPlans(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.planTypeFilter) params['plan_type'] = this.planTypeFilter;
    if (this.billingCycleFilter) params['billing_cycle'] = this.billingCycleFilter;
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.subscriptionPlanApi.getSubscriptionPlans(params).subscribe({
      next: (res) => {
        this.plans = res.data || [];
        this.totalCount = res.meta?.total || this.plans.length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load subscription plans'); },
    });
  }

  loadStats(): void {
    this.subscriptionPlanApi.getSubscriptionPlanStats().subscribe({
      next: (res) => { this.stats = res.data ?? null; },
      error: () => {},
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadPlans();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.planTypeFilter = '';
    this.billingCycleFilter = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadPlans();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPlans();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadPlans();
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#fef2f2';
      case 'draft': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'inactive': return '#dc2626';
      case 'draft': return '#b45309';
      default: return '#6b7280';
    }
  }

  toggleActionMenu(row: SubscriptionPlan | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  trackByValue(index: number, item: any): any {
    return item.value;
  }

  viewPlan(uuid: string): void { this.activeActionRow = null; this.router.navigate(['/admin/subscription-plans', uuid]); }
  editPlan(uuid: string): void { this.activeActionRow = null; this.router.navigate(['/admin/subscription-plans', uuid, 'edit']); }

  duplicatePlan(uuid: string): void {
    if (window.confirm('Duplicate this subscription plan?')) {
      this.subscriptionPlanApi.duplicateSubscriptionPlan(uuid).subscribe({
        next: (res) => { this.notification.success('Plan duplicated'); this.loadPlans(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  togglePopular(uuid: string): void {
    this.subscriptionPlanApi.togglePopular(uuid).subscribe({
      next: () => { this.notification.success('Plan updated'); this.loadPlans(); this.loadStats(); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  toggleRecommended(uuid: string): void {
    this.subscriptionPlanApi.toggleRecommended(uuid).subscribe({
      next: () => { this.notification.success('Plan updated'); this.loadPlans(); this.loadStats(); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  deletePlan(uuid: string): void {
    if (window.confirm('Delete this subscription plan? This action cannot be undone.')) {
      this.subscriptionPlanApi.deleteSubscriptionPlan(uuid).subscribe({
        next: () => { this.notification.success('Plan deleted'); this.loadPlans(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restorePlan(uuid: string): void {
    if (window.confirm('Restore this subscription plan?')) {
      this.subscriptionPlanApi.restoreSubscriptionPlan(uuid).subscribe({
        next: () => { this.notification.success('Plan restored'); this.loadPlans(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  openImportDialog(): void { this.fileInput.nativeElement.click(); }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.subscriptionPlanApi.importSubscriptionPlans(file).subscribe({
      next: () => { this.notification.success('Plans imported'); this.loadPlans(); this.loadStats(); input.value = ''; },
      error: (err) => { this.notification.error(err.error?.message || 'Import failed'); input.value = ''; },
    });
  }

  exportPlans(): void {
    const filters: Record<string, string> = {};
    if (this.searchQuery) filters['search'] = this.searchQuery;
    if (this.planTypeFilter) filters['plan_type'] = this.planTypeFilter;
    if (this.billingCycleFilter) filters['billing_cycle'] = this.billingCycleFilter;
    if (this.statusFilter) filters['status'] = this.statusFilter;
    this.subscriptionPlanApi.exportSubscriptionPlans(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'subscription-plans-export.csv'; a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notification.error(err.error?.message || 'Export failed'),
    });
  }
}
