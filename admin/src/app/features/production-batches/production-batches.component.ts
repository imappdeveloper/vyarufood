import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductionBatchApiService } from '../../core/services/production-batch-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductionBatch, PRODUCTION_STATUSES, BATCH_TYPES } from '../../core/models/production-batch/production-batch.model';

@Component({
  selector: 'app-production-batches',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && batches.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading batches...</p>
      </div>
    </div>

    <div *ngIf="!loading || batches.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Production Batches</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Production Batches</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage kitchen production and cooking batches</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="generateFromOrders()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">autorenew</span> Generate
          </button>
          <a routerLink="/admin/production-batches/create"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> New Batch
          </a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">inventory</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">cooking</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Cooking</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.cooking || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">packing</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Packing</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.packing || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Completed</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.completed || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">restaurant</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Today Meals</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.today_meals || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange()" placeholder="Search batches..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="searchQuery" (click)="clearSearch()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="statusFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option value="">All Statuses</option>
            <option *ngFor="let s of statuses" [value]="s.value">{{ s.label }}</option>
          </select>
          <div style="position: relative;">
            <select [(ngModel)]="typeFilter" (change)="applyFilters()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Types</option>
              <option *ngFor="let t of batchTypes" [value]="t.value">{{ t.label }}</option>
            </select>
          </div>
          <button *ngIf="searchQuery || statusFilter || typeFilter" (click)="clearFilters()"
            style="padding: 9px 16px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">
            <span class="material-icons" style="font-size: 16px;">filter_alt_off</span> Clear
          </button>
        </div>
      </div>

      <div *ngIf="selectedBatches.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedBatches.size }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="clearSelection()"
          style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; color: #9ca3af;"
          onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && batches.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && batches.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">kitchen</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No production batches found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="searchQuery || statusFilter || typeFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!searchQuery && !statusFilter && !typeFilter">No batches have been created yet. Generate from confirmed orders.</span>
          </p>
          <a *ngIf="!searchQuery && !statusFilter && !typeFilter" routerLink="/admin/production-batches/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> New Batch
          </a>
          <button *ngIf="searchQuery || statusFilter || typeFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && batches.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 8px 10px 16px; text-align: left; width: 44px;">
                  <input type="checkbox" (change)="toggleAllRows($event)" [checked]="isAllSelected()"
                    style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px;">Batch #</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px;">Batch Name</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 90px;">Date</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">Kitchen</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meals</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of batches; let i = index" (click)="viewBatch(row.uuid)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 8px 12px 16px;">
                  <input type="checkbox" (click)="$event.stopPropagation()" (change)="toggleRow(row)" [checked]="selectedBatches.has(row)"
                    style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 13px; font-weight: 700; font-family: monospace; color: #059669;">{{ row.batch_number }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">{{ row.batch_name }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 12px; color: #6b7280;">{{ row.production_date | date:'mediumDate' }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 12px; color: #6b7280;">{{ row.kitchen_name || '-' }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: #f3f4f6; font-size: 12px; font-weight: 700; color: #6b7280;">{{ row.total_meals }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(row.production_status)"
                    [style.color]="getStatusText(row.production_status)">
                    {{ row.production_status_label || row.production_status }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewBatch(row.uuid); $event.stopPropagation()"
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
                        <button (click)="viewBatch(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button *ngIf="row.production_status === 'draft' || row.production_status === 'planned'" (click)="startBatch(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #3b82f6;">play_arrow</span> Start Production
                        </button>
                        <button *ngIf="row.production_status === 'cooking'" (click)="pauseBatch(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #d97706;">pause</span> Pause
                        </button>
                        <button *ngIf="row.production_status !== 'completed' && row.production_status !== 'cancelled'" (click)="completeBatch(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Complete
                        </button>
                        <button *ngIf="row.production_status !== 'completed' && row.production_status !== 'cancelled'" (click)="cancelBatch(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="row.deleted_at" (click)="restoreBatch(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #047857; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">restore</span> Restore
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteBatch(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
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
              <button (click)="goToPage(1)" [disabled]="currentPage <= 0"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 0 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 0 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">first_page</span>
              </button>
              <button (click)="goToPage(currentPage)" [disabled]="currentPage <= 0"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 0 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 0 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_left</span>
              </button>
              <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button (click)="goToPage(currentPage + 2)" [disabled]="currentPage >= totalPages - 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages - 1 ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <button (click)="goToPage(totalPages)" [disabled]="currentPage >= totalPages - 1"
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
export class ProductionBatchesComponent implements OnInit {
  private batchApi = inject(ProductionBatchApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  Math = Math;

  batches: ProductionBatch[] = [];
  displayedColumns = ['batch_number', 'batch_name', 'production_date', 'kitchen_name', 'total_meals', 'production_status', 'actions'];
  selectedBatches = new Set<ProductionBatch>();
  activeActionRow: ProductionBatch | null = null;

  loading = false;
  currentPage = 0;
  pageSize = 15;
  totalCount = 0;
  searchQuery = '';
  statusFilter = '';
  typeFilter = '';

  stats: any = null;
  statuses = PRODUCTION_STATUSES;
  batchTypes = BATCH_TYPES;

  private searchSubject = new Subject<string>();

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 0;
      this.loadBatches();
    });
    this.loadBatches();
    this.loadStats();
  }

  loadBatches(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: (this.currentPage + 1).toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.statusFilter) params['production_status'] = this.statusFilter;
    if (this.typeFilter) params['batch_type'] = this.typeFilter;

    this.batchApi.getBatches(params).subscribe({
      next: (res) => {
        this.batches = res.data || [];
        this.totalCount = res.meta?.total || this.batches.length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load production batches'); },
    });
  }

  loadStats(): void {
    this.batchApi.getStats().subscribe({
      next: (res) => { this.stats = res.data ?? null; },
      error: () => {},
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void { this.searchQuery = ''; this.currentPage = 0; this.loadBatches(); }

  applyFilters(): void { this.currentPage = 0; this.loadBatches(); }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.currentPage = 0;
    this.loadBatches();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page - 1;
    this.loadBatches();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 0;
    this.loadBatches();
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'draft': return '#f3f4f6';
      case 'planned': return '#dbeafe';
      case 'cooking': return '#ffedd5';
      case 'prepared': return '#ede9fe';
      case 'packing': return '#e0e7ff';
      case 'packed': return '#cffafe';
      case 'completed': return '#d1fae5';
      case 'cancelled': return '#fef2f2';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'draft': return '#374151';
      case 'planned': return '#1d4ed8';
      case 'cooking': return '#c2410c';
      case 'prepared': return '#7c3aed';
      case 'packing': return '#4338ca';
      case 'packed': return '#0e7490';
      case 'completed': return '#047857';
      case 'cancelled': return '#dc2626';
      default: return '#374151';
    }
  }

  isAllSelected(): boolean { return this.batches.length > 0 && this.selectedBatches.size === this.batches.length; }

  toggleAllRows(event: any): void {
    if (event.target.checked) { this.batches.forEach(c => this.selectedBatches.add(c)); } else { this.selectedBatches.clear(); }
    this.activeActionRow = null;
  }

  toggleRow(row: ProductionBatch): void {
    if (this.selectedBatches.has(row)) { this.selectedBatches.delete(row); } else { this.selectedBatches.add(row); }
    this.activeActionRow = null;
  }

  clearSelection(): void { this.selectedBatches.clear(); }

  toggleActionMenu(row: ProductionBatch | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  viewBatch(uuid: string): void { this.activeActionRow = null; this.router.navigate(['/admin/production-batches', uuid]); }
  addBatch(): void { this.router.navigate(['/admin/production-batches', 'create']); }

  startBatch(uuid: string): void {
    if (window.confirm('Start production for this batch?')) {
      this.batchApi.startBatch(uuid).subscribe({
        next: () => { this.notification.success('Production started'); this.loadBatches(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  pauseBatch(uuid: string): void {
    if (window.confirm('Pause production?')) {
      this.batchApi.pauseBatch(uuid).subscribe({
        next: () => { this.notification.success('Production paused'); this.loadBatches(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  completeBatch(uuid: string): void {
    if (window.confirm('Mark this batch as completed?')) {
      this.batchApi.completeBatch(uuid).subscribe({
        next: () => { this.notification.success('Production completed'); this.loadBatches(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelBatch(uuid: string): void {
    const reason = prompt('Cancellation reason:');
    if (reason === null) return;
    this.batchApi.cancelBatch(uuid, reason || 'Cancelled by admin').subscribe({
      next: () => { this.notification.success('Batch cancelled'); this.loadBatches(); this.loadStats(); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  deleteBatch(uuid: string): void {
    if (window.confirm('Delete this batch? This cannot be undone.')) {
      this.batchApi.deleteBatch(uuid).subscribe({
        next: () => { this.notification.success('Batch deleted'); this.loadBatches(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreBatch(uuid: string): void {
    if (window.confirm('Restore this batch?')) {
      this.batchApi.restoreBatch(uuid).subscribe({
        next: () => { this.notification.success('Batch restored'); this.loadBatches(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  generateFromOrders(): void {
    const date = prompt('Production date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10));
    if (date === null) return;
    this.batchApi.generateFromOrders({ production_date: date }).subscribe({
      next: (res) => { this.notification.success(res.message || 'Batch generated'); this.loadBatches(); this.loadStats(); },
      error: (err) => this.notification.error(err.error?.message || 'Generation failed'),
    });
  }
}
