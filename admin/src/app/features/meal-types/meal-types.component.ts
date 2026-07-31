import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MealTypeApiService } from '../../core/services/meal-type-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { MealType, MealTypeImportResult } from '../../core/models/meal/meal-type.model';

@Component({
  selector: 'app-meal-types',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && mealTypes.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading meal types...</p>
      </div>
    </div>

    <div *ngIf="!loading || mealTypes.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Meal Types</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Meal Types</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage meal types and their settings</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="openImportDialog()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">upload_file</span> Import
          </button>
          <button (click)="exportMealTypes()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">download</span> Export
          </button>
          <a routerLink="/admin/meal-types/create"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Meal Type
          </a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">view_list</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Types</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ totalCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Active</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ activeCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">star</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Default</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ defaultCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #6b7280;">block</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Inactive</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ inactiveCount }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchDebounce()" placeholder="Search by name or code..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="search" (click)="clearSearch()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div style="position: relative;">
            <select [(ngModel)]="defaultFilter" (change)="onFilterChange()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 130px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option [ngValue]="null">All</option>
              <option value="true">Default</option>
              <option value="false">Non-Default</option>
            </select>
          </div>
        </div>
      </div>

      <div *ngIf="selectedTypes.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedTypes.size }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="bulkSetActive()"
          style="padding: 6px 14px; background: white; border: 1px solid #059669; border-radius: 8px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">check_circle</span> Activate
        </button>
        <button (click)="bulkSetInactive()"
          style="padding: 6px 14px; background: white; border: 1px solid #059669; border-radius: 8px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">block</span> Deactivate
        </button>
        <button (click)="bulkDelete()"
          style="padding: 6px 14px; background: white; border: 1px solid #fca5a5; border-radius: 8px; font-size: 12px; font-weight: 600; color: #dc2626; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">delete</span> Delete
        </button>
        <button (click)="clearSelection()"
          style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; color: #9ca3af;"
          onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && mealTypes.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && mealTypes.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">view_list</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No meal types found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="search || statusFilter || defaultFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!search && !statusFilter && !defaultFilter">Get started by creating your first meal type</span>
          </p>
          <a *ngIf="!search && !statusFilter && !defaultFilter" routerLink="/admin/meal-types/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Meal Type
          </a>
          <button *ngIf="search || statusFilter || defaultFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && mealTypes.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 8px 10px 16px; text-align: left; width: 44px;">
                  <input type="checkbox" (change)="toggleAllRows($event)"
                    [checked]="isAllSelected()"
                    style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 200px;">Meal Type</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Order</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="lg-cell">Slug</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of visibleTypes; let i = index" (click)="viewMealType(row)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 8px 12px 16px;">
                  <input type="checkbox" (click)="$event.stopPropagation()" (change)="toggleRow(row)"
                    [checked]="selectedTypes.has(row)" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </td>
                <td style="padding: 12px 12px;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span *ngIf="row.color_code" style="width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.08);" [style.background]="row.color_code"></span>
                      <div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.name }}</span>
                          <span *ngIf="row.is_default" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #fef3c7; color: #b45309; text-transform: uppercase; letter-spacing: 0.03em;">Default</span>
                        </div>
                        <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ row.type_code }}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: #f3f4f6; font-size: 12px; font-weight: 700; color: #6b7280;">{{ row.display_order }}</span>
                </td>
                <td style="padding: 12px 12px; display: none;" [style.display]="'table-cell'" class="lg-cell">
                  <span style="font-size: 12px; font-family: monospace; color: #9ca3af;">{{ row.slug }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="row.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                    [style.color]="row.status === 'active' ? '#047857' : '#6b7280'">
                    <span *ngIf="row.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 4px;"></span>
                    {{ row.status_label }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewMealType(row); $event.stopPropagation()"
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
                        <button (click)="viewMealType(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button (click)="editMealType(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="!row.is_default" (click)="setDefault(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #d97706;">star</span> Set as Default
                        </button>
                        <button *ngIf="row.status !== 'active'" (click)="setStatus(row, 'active'); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Activate
                        </button>
                        <button *ngIf="row.status === 'active'" (click)="setStatus(row, 'inactive'); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #d97706;">pause</span> Deactivate
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteMealType(row); toggleActionMenu(null); $event.stopPropagation()"
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
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <input #fileInput type="file" hidden accept=".csv,.xlsx,.xls" (change)="onFileSelected($event)" />

      <div *ngIf="importing" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease-out;">
        <div style="background: white; border-radius: 16px; padding: 32px; text-align: center; max-width: 360px; width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #d1fae5; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <div style="width: 28px; height: 28px; border: 3px solid #a7f3d0; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>
          <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">Importing meal types...</p>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Please wait while we process your file</p>
        </div>
      </div>

      <div *ngIf="importResult" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease-out;" (click)="importResult = null">
        <div style="background: white; border-radius: 16px; padding: 24px; max-width: 420px; width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2);" (click)="$event.stopPropagation()">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"
              [style.background]="importResult.failures.length > 0 ? '#fef3c7' : '#d1fae5'">
              <span class="material-icons" style="font-size: 20px;"
                [style.color]="importResult.failures.length > 0 ? '#d97706' : '#047857'">
                {{ importResult.failures.length > 0 ? 'warning' : 'check_circle' }}
              </span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Import Results</h3>
          </div>
          <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0;">
              <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span>
              <span style="font-size: 13px; color: #374151;">{{ importResult.successes }} meal types imported successfully</span>
            </div>
            <div *ngIf="importResult.failures.length > 0" style="display: flex; align-items: center; gap: 8px; padding: 8px 0;">
              <span class="material-icons" style="font-size: 18px; color: #dc2626;">error</span>
              <span style="font-size: 13px; color: #dc2626;">{{ importResult.failures.length }} errors occurred</span>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button (click)="importResult = null"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">Close</button>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      @media (min-width: 1024px) { .lg-cell { display: table-cell !important; } }
    </style>
  `,
})
export class MealTypesComponent implements OnInit {
  private mealTypeApi = inject(MealTypeApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  mealTypes: MealType[] = [];
  selectedTypes = new Set<MealType>();
  activeActionRow: MealType | null = null;

  loading = false;
  importing = false;
  importResult: MealTypeImportResult | null = null;

  currentPage = 1;
  perPage = 10;
  totalCount = 0;
  totalPages = 1;

  search = '';
  statusFilter: string | null = null;
  defaultFilter: string | null = null;

  activeCount = 0;
  inactiveCount = 0;
  defaultCount = 0;
  private searchTimeout: any;

  Math = Math;

  get visibleTypes(): MealType[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.mealTypes.slice(start, start + this.perPage);
  }

  ngOnInit(): void { this.loadMealTypes(); }

  loadMealTypes(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: '1',
      per_page: '999',
      sort: 'display_order',
      order: 'asc',
    };
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.defaultFilter) params['is_default'] = this.defaultFilter;

    this.mealTypeApi.getAll(params).subscribe({
      next: (res) => {
        this.mealTypes = res.data || [];
        this.totalCount = this.mealTypes.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.perPage));
        this.activeCount = this.mealTypes.filter(t => t.status === 'active').length;
        this.inactiveCount = this.mealTypes.filter(t => t.status === 'inactive').length;
        this.defaultCount = this.mealTypes.filter(t => t.is_default).length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load meal types'); },
    });
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadMealTypes(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadMealTypes(); }
  onFilterChange(): void { this.currentPage = 1; this.loadMealTypes(); }
  clearFilters(): void {
    this.search = ''; this.statusFilter = null; this.defaultFilter = null;
    this.currentPage = 1; this.loadMealTypes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onPerPageChange(event: any): void {
    this.perPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  isAllSelected(): boolean { return this.mealTypes.length > 0 && this.selectedTypes.size === this.mealTypes.length; }

  toggleAllRows(event: any): void {
    if (event.target.checked) { this.mealTypes.forEach(t => this.selectedTypes.add(t)); } else { this.selectedTypes.clear(); }
    this.activeActionRow = null;
  }

  toggleRow(row: MealType): void {
    if (this.selectedTypes.has(row)) { this.selectedTypes.delete(row); } else { this.selectedTypes.add(row); }
    this.activeActionRow = null;
  }

  clearSelection(): void { this.selectedTypes.clear(); }

  toggleActionMenu(row: MealType | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  viewMealType(row: MealType): void { this.activeActionRow = null; this.router.navigate(['/admin/meal-types', row.uuid]); }
  editMealType(row: MealType): void { this.activeActionRow = null; this.router.navigate(['/admin/meal-types', row.uuid, 'edit']); }

  setDefault(row: MealType): void {
    if (window.confirm(`Set "${row.name}" as default meal type?`)) {
      this.mealTypeApi.setDefault(row.uuid).subscribe({
        next: () => { this.notification.success('Default meal type updated'); this.loadMealTypes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  setStatus(row: MealType, status: string): void {
    const label = status === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${row.name}"?`)) {
      this.mealTypeApi.setStatus(row.uuid, status).subscribe({
        next: () => { this.notification.success(`Meal type ${status === 'active' ? 'activated' : 'deactivated'}`); this.loadMealTypes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteMealType(row: MealType): void {
    if (row.is_default) { this.notification.error('Default meal type cannot be deleted'); return; }
    if (window.confirm(`Delete "${row.name}"? This action cannot be undone.`)) {
      this.mealTypeApi.delete(row.uuid).subscribe({
        next: () => { this.notification.success('Meal type deleted'); this.loadMealTypes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetActive(): void {
    const ids = [...this.selectedTypes].map(t => t.id);
    if (window.confirm(`Activate ${ids.length} selected meal types?`)) {
      this.mealTypeApi.bulkSetStatus(ids, 'active').subscribe({
        next: () => { this.notification.success('Meal types activated'); this.clearSelection(); this.loadMealTypes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetInactive(): void {
    const ids = [...this.selectedTypes].map(t => t.id);
    if (window.confirm(`Deactivate ${ids.length} selected meal types?`)) {
      this.mealTypeApi.bulkSetStatus(ids, 'inactive').subscribe({
        next: () => { this.notification.success('Meal types deactivated'); this.clearSelection(); this.loadMealTypes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkDelete(): void {
    const ids = [...this.selectedTypes].map(t => t.id);
    if (window.confirm(`Delete ${ids.length} selected meal types? This cannot be undone.`)) {
      this.mealTypeApi.bulkDelete(ids).subscribe({
        next: () => { this.notification.success('Meal types deleted'); this.clearSelection(); this.loadMealTypes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  openImportDialog(): void { this.fileInput.nativeElement.click(); }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.importing = true;
    this.mealTypeApi.import(file).subscribe({
      next: (res) => { this.importing = false; this.importResult = res.data || null; this.loadMealTypes(); input.value = ''; },
      error: (err) => { this.importing = false; this.notification.error(err.error?.message || 'Import failed'); input.value = ''; },
    });
  }

  exportMealTypes(): void {
    const filters: Record<string, string> = {};
    if (this.search) filters['search'] = this.search;
    if (this.statusFilter) filters['status'] = this.statusFilter;
    this.mealTypeApi.export(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'meal-types-export.csv'; a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notification.error(err.error?.message || 'Export failed'),
    });
  }
}
