import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WeeklyMenuApiService } from '../../core/services/weekly-menu-api.service';
import { KitchenApiService } from '../../core/services/kitchen-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { WeeklyMenu, WeeklyMenuStats } from '../../core/models/weekly-menu/weekly-menu.model';

@Component({
  selector: 'app-weekly-menus',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && menus.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading menus...</p>
      </div>
    </div>

    <div *ngIf="!loading || menus.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Weekly Menus</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Weekly Menu Planner</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Plan and manage weekly menus for your kitchens</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="copyPreviousWeek()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">content_copy</span> Copy Previous
          </button>
          <a routerLink="/admin/weekly-menus/create"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Create Menu
          </a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">calendar_today</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Menus</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Published</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.published || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">edit_note</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Draft</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.draft || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #6b7280;">archive</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Archived</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.archived || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchDebounce()" placeholder="Search menus..."
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
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select [(ngModel)]="kitchenFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 160px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All Kitchens</option>
            <option *ngFor="let k of kitchens" [ngValue]="k.id">{{ k.name }}</option>
          </select>
        </div>
      </div>

      <div *ngIf="selectedRows.length > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedRows.length }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="bulkPublish()"
          style="padding: 6px 14px; background: white; border: 1px solid #059669; border-radius: 8px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">publish</span> Publish
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
        <div *ngIf="loading && menus.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && menus.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">calendar_today</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No weekly menus found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="search || statusFilter || kitchenFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!search && !statusFilter && !kitchenFilter">Get started by creating your first weekly menu</span>
          </p>
          <a *ngIf="!search && !statusFilter && !kitchenFilter" routerLink="/admin/weekly-menus/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Create Menu
          </a>
          <button *ngIf="search || statusFilter || kitchenFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && menus.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 8px 10px 16px; text-align: left; width: 44px;">
                  <input type="checkbox" (change)="toggleAllRows($event)"
                    [checked]="isAllSelected()"
                    style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 200px;">Title</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Week Range</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="lg-cell">Kitchen</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="xl-cell">Items</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="xl-cell">Published</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of visibleMenus; let i = index" (click)="viewMenu(row)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 8px 12px 16px;">
                  <input type="checkbox" (click)="$event.stopPropagation()" (change)="toggleRow(row)"
                    [checked]="selectedMenus.has(row)" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </td>
                <td style="padding: 12px 12px;">
                  <div>
                    <p style="font-weight: 700; color: #1f2937; margin: 0; line-height: 1.3;">{{ row.title }}</p>
                    <p *ngIf="row.description" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.description }}</p>
                  </div>
                </td>
                <td style="padding: 12px 12px;">
                  <p style="font-size: 13px; color: #374151; margin: 0;">{{ row.week_start_date | date:'MMM d' }} - {{ row.week_end_date | date:'MMM d, yyyy' }}</p>
                  <p style="font-size: 11px; color: #9ca3af; margin: 1px 0 0 0;">{{ row.duration_days }} days</p>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="row.status === 'published' ? '#d1fae5' : row.status === 'draft' ? '#fef3c7' : '#f3f4f6'"
                    [style.color]="row.status === 'published' ? '#047857' : row.status === 'draft' ? '#b45309' : '#6b7280'">
                    {{ row.status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 12px; display: none;" [style.display]="'table-cell'" class="lg-cell">
                  <span style="font-size: 13px; color: #6b7280;">{{ row.kitchen_name || '-' }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center; display: none;" [style.display]="'table-cell'" class="xl-cell">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: #d1fae5; font-size: 11px; font-weight: 800; color: #047857;">{{ row.items?.length || 0 }}</span>
                </td>
                <td style="padding: 12px 12px; display: none;" [style.display]="'table-cell'" class="xl-cell">
                  <span style="font-size: 12px; color: #9ca3af;">{{ row.published_at ? (row.published_at | date:'MMM d, h:mm a') : '-' }}</span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewMenu(row); $event.stopPropagation()"
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
                        <button (click)="viewMenu(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button (click)="editMenu(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="row.status !== 'published'" (click)="publishMenu(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">publish</span> Publish
                        </button>
                        <button *ngIf="row.status === 'published'" (click)="unpublishMenu(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #d97706;">unpublished</span> Unpublish
                        </button>
                        <button (click)="copyPreviousWeek(); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #6366f1;">content_copy</span> Copy Previous Week
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteMenu(row); toggleActionMenu(null); $event.stopPropagation()"
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
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      @media (min-width: 1024px) { .lg-cell { display: table-cell !important; } }
      @media (min-width: 1280px) { .xl-cell { display: table-cell !important; } }
    </style>
  `,
})
export class WeeklyMenusComponent implements OnInit {
  private weeklyMenuApi = inject(WeeklyMenuApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  menus: WeeklyMenu[] = [];
  selectedMenus = new Set<WeeklyMenu>();
  activeActionRow: WeeklyMenu | null = null;

  loading = false;
  currentPage = 1;
  perPage = 10;
  sort = 'created_at';
  order: 'asc' | 'desc' = 'desc';
  search = '';
  statusFilter: string | null = null;
  kitchenFilter: number | null = null;

  totalCount = 0;
  totalPages = 1;
  stats: WeeklyMenuStats | null = null;
  kitchens: any[] = [];

  Math = Math;
  private searchTimeout: any;

  get visibleMenus(): WeeklyMenu[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.menus.slice(start, start + this.perPage);
  }

  get selectedRows(): WeeklyMenu[] {
    return [...this.selectedMenus];
  }

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadMenus();
    this.loadStats();
  }

  loadDropdowns(): void {
    this.kitchenApi.getAll().subscribe({ next: (res) => { this.kitchens = res.data || []; } });
  }

  loadStats(): void {
    this.weeklyMenuApi.getWeeklyMenuStats().subscribe({
      next: (res) => { this.stats = res.data ?? null; },
      error: () => {},
    });
  }

  loadMenus(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: '1',
      per_page: '999',
      sort: this.sort,
      order: this.order,
    };
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.kitchenFilter) params['kitchen_id'] = this.kitchenFilter.toString();

    this.weeklyMenuApi.getWeeklyMenus(params).subscribe({
      next: (res) => {
        this.menus = res.data || [];
        this.totalCount = this.menus.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.perPage));
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load weekly menus'); },
    });
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadMenus(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadMenus(); }
  onFilterChange(): void { this.currentPage = 1; this.loadMenus(); }
  clearFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.kitchenFilter = null;
    this.currentPage = 1;
    this.loadMenus();
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

  isAllSelected(): boolean { return this.menus.length > 0 && this.selectedMenus.size === this.menus.length; }

  toggleAllRows(event: any): void {
    if (event.target.checked) { this.menus.forEach(m => this.selectedMenus.add(m)); } else { this.selectedMenus.clear(); }
    this.activeActionRow = null;
  }

  toggleRow(row: WeeklyMenu): void {
    if (this.selectedMenus.has(row)) { this.selectedMenus.delete(row); } else { this.selectedMenus.add(row); }
    this.activeActionRow = null;
  }

  clearSelection(): void { this.selectedMenus.clear(); }

  toggleActionMenu(row: WeeklyMenu | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  viewMenu(row: WeeklyMenu): void { this.activeActionRow = null; this.router.navigate(['/admin/weekly-menus', row.uuid]); }
  editMenu(row: WeeklyMenu): void { this.activeActionRow = null; this.router.navigate(['/admin/weekly-menus', row.uuid, 'edit']); }

  publishMenu(row: WeeklyMenu): void {
    if (window.confirm(`Publish "${row.title}"?`)) {
      this.weeklyMenuApi.publishWeeklyMenu(row.uuid).subscribe({
        next: () => { this.notification.success('Menu published'); this.loadMenus(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  unpublishMenu(row: WeeklyMenu): void {
    if (window.confirm(`Unpublish "${row.title}"?`)) {
      this.weeklyMenuApi.unpublishWeeklyMenu(row.uuid).subscribe({
        next: () => { this.notification.success('Menu unpublished'); this.loadMenus(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  copyPreviousWeek(): void {
    const weekStart = window.prompt('Enter target week start date (YYYY-MM-DD) to copy into:');
    if (!weekStart) return;
    const fromStart = window.prompt('Enter source week start date (YYYY-MM-DD) to copy from:');
    if (!fromStart) return;
    this.weeklyMenuApi.copyPreviousWeek({
      from_week_start: fromStart,
      to_week_start: weekStart,
    }).subscribe({
      next: (res) => {
        this.notification.success('Previous week copied');
        if (res.data) { this.router.navigate(['/admin/weekly-menus', res.data.uuid, 'edit']); }
        this.loadMenus();
        this.loadStats();
      },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  deleteMenu(row: WeeklyMenu): void {
    if (window.confirm(`Delete "${row.title}"? This action cannot be undone.`)) {
      this.weeklyMenuApi.deleteWeeklyMenu(row.uuid).subscribe({
        next: () => { this.notification.success('Menu deleted'); this.loadMenus(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkPublish(): void {
    const ids = [...this.selectedMenus].filter(r => r.status !== 'published');
    if (ids.length === 0) { this.notification.error('No publishable menus selected'); return; }
    if (window.confirm(`Publish ${ids.length} selected menus?`)) {
      let completed = 0;
      ids.forEach((menu) => {
        this.weeklyMenuApi.publishWeeklyMenu(menu.uuid).subscribe({
          next: () => { completed++; if (completed === ids.length) { this.notification.success('Menus published'); this.clearSelection(); this.loadMenus(); this.loadStats(); } },
          error: () => { completed++; if (completed === ids.length) { this.notification.success('Menus published'); this.clearSelection(); this.loadMenus(); this.loadStats(); } },
        });
      });
    }
  }

  bulkDelete(): void {
    const ids = [...this.selectedMenus];
    if (window.confirm(`Delete ${ids.length} selected menus? This cannot be undone.`)) {
      let completed = 0;
      ids.forEach((menu) => {
        this.weeklyMenuApi.deleteWeeklyMenu(menu.uuid).subscribe({
          next: () => { completed++; if (completed === ids.length) { this.notification.success('Menus deleted'); this.clearSelection(); this.loadMenus(); this.loadStats(); } },
          error: () => { completed++; if (completed === ids.length) { this.notification.success('Menus deleted'); this.clearSelection(); this.loadMenus(); this.loadStats(); } },
        });
      });
    }
  }
}
