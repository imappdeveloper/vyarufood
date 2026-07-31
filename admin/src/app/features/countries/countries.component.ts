import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CountryApiService } from '../../core/services/country-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Country, CountryImportResult } from '../../core/models/master/country.model';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 48px 32px 80px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px;">
          <a routerLink="/admin/dashboard" style="color: rgba(255,255,255,0.75); text-decoration: none;">Home</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white; font-weight: 500;">Countries</span>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
              <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">public</span>
              Countries
            </h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Manage all countries and regions</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <button (click)="openImportDialog()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">upload_file</span>
              Import
            </button>
            <button (click)="exportCountries()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">download</span>
              Export
            </button>
            <a routerLink="/admin/countries/create"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">add</span>
              Add Country
            </a>
          </div>
        </div>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: -40px auto 0; padding: 0 24px; position: relative; z-index: 3; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
      <div *ngFor="let stat of statCards; let i = index"
           style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.04);"
           [style.animation]="'fadeSlideUp 0.5s ease-out ' + (0.1 + i * 0.08) + 's both'"
           (mouseenter)="hoverStat(i)" (mouseleave)="unhoverStat(i)">
        <div style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
             [style.background]="stat.bg">
          <span class="material-icons" style="font-size: 22px;" [style.color]="stat.color">{{ stat.icon }}</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ stat.value }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <section style="max-width: 1200px; margin: 24px auto 60px; padding: 0 24px;">
      <!-- Search & Filters -->
      <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 16px 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 200px; position: relative;">
          <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
          <input [(ngModel)]="search" (keyup.enter)="loadCountries()" (ngModelChange)="onSearchDebounce()" placeholder="Search countries..."
            style="width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          <button *ngIf="search" (click)="clearSearch()"
            style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; color: #9ca3af; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
            <span class="material-icons" style="font-size: 18px;">close</span>
          </button>
        </div>
        <select [(ngModel)]="statusFilter" (change)="onFilterChange()"
          style="padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; min-width: 140px;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
          onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''">
          <option [ngValue]="null">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <!-- Bulk Action Bar -->
      <div *ngIf="selectedRows.length > 0"
        style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedRows.length }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="bulkSetActive()"
          style="padding: 6px 14px; background: transparent; border: 1.5px solid #059669; border-radius: 8px; color: #059669; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;"
          onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='transparent'">
          <span class="material-icons" style="font-size: 16px;">check_circle</span>
          Activate
        </button>
        <button (click)="bulkSetInactive()"
          style="padding: 6px 14px; background: transparent; border: 1.5px solid #ef4444; border-radius: 8px; color: #ef4444; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;"
          onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='transparent'">
          <span class="material-icons" style="font-size: 16px;">block</span>
          Deactivate
        </button>
        <button (click)="bulkDelete()"
          style="padding: 6px 14px; background: transparent; border: 1.5px solid #dc2626; border-radius: 8px; color: #dc2626; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;"
          onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='transparent'">
          <span class="material-icons" style="font-size: 16px;">delete</span>
          Delete
        </button>
        <button (click)="clearSelection()"
          style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; display: flex; color: #9ca3af; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <!-- Table Card -->
      <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
        <!-- Loading spinner -->
        <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 80px 0;">
          <div style="width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading && countries.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 36px; color: #059669;">public_off</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No countries found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 300px; margin: 0 0 24px 0;">
            <ng-container *ngIf="search || statusFilter; else noFilter">Try adjusting your search or filter criteria</ng-container>
            <ng-template #noFilter>Get started by adding your first country</ng-template>
          </p>
          <a *ngIf="!search && !statusFilter" routerLink="/admin/countries/create"
            style="padding: 10px 24px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; font-size: 13px; text-decoration: none; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
            <span class="material-icons" style="font-size: 18px; vertical-align: middle; margin-right: 6px;">add</span>
            Add Country
          </a>
          <button *ngIf="search || statusFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: transparent; border: 1.5px solid #e5e7eb; border-radius: 10px; color: #374151; font-size: 13px; font-weight: 600; cursor: pointer;">
            Clear Filters
          </button>
        </div>

        <!-- Table -->
        <div *ngIf="!loading && countries.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 44px;">
                  <input type="checkbox" (change)="toggleAllRows($event)" [checked]="isAllSelected()"
                    style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                </th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 60px;">Flag</th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; min-width: 180px;">Name</th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">ISO Codes</th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Phone</th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; display: none;" class="lg-cell">Capital</th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; display: none;" class="xl-cell">Currency</th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; display: none;" class="xl-cell">Region</th>
                <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
                <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 60px;">Default</th>
                <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of countries; let idx = index"
                style="border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.15s ease;"
                onmouseover="this.style.background='#f0fdfa'" onmouseout="this.style.background=''"
                (click)="viewCountry(row)">
                <td style="padding: 14px 16px;" (click)="$event.stopPropagation()">
              <input type="checkbox" (change)="toggleRow(row)" [checked]="selection.has(row)"
                style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                </td>
                <td style="padding: 14px 16px;">
                  <span *ngIf="row.emoji" style="font-size: 24px;">{{ row.emoji }}</span>
                  <div *ngIf="!row.emoji"
                    style="width: 34px; height: 34px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 12px; font-weight: 800; color: #059669;">{{ row.iso2 }}</span>
                  </div>
                </td>
                <td style="padding: 14px 16px;">
                  <div style="font-weight: 600; color: #166534;">{{ row.name }}</div>
                  <div *ngIf="row.native_name" style="font-size: 12px; color: #9ca3af; margin-top: 2px;">{{ row.native_name }}</div>
                </td>
                <td style="padding: 14px 16px;">
                  <div style="display: flex; gap: 4px;">
                    <span style="padding: 2px 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; font-weight: 700; color: #374151;">{{ row.iso2 }}</span>
                    <span style="padding: 2px 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; font-weight: 700; color: #374151;">{{ row.iso3 }}</span>
                  </div>
                </td>
                <td style="padding: 14px 16px; font-weight: 500; color: #374151;">{{ row.phone_code ? '+' + row.phone_code : '-' }}</td>
                <td style="padding: 14px 16px; color: #6b7280; display: none;" class="lg-cell">{{ row.capital || '-' }}</td>
                <td style="padding: 14px 16px; color: #6b7280; display: none;" class="xl-cell">{{ row.currency_code || '-' }}</td>
                <td style="padding: 14px 16px; color: #6b7280; display: none;" class="xl-cell">{{ row.region || '-' }}</td>
                <td style="padding: 14px 16px; text-align: center;">
                  <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(row.status)" [style.color]="getStatusColor(row.status)">
                    <span *ngIf="row.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ row.status | titlecase }}
                  </span>
                </td>
                <td style="padding: 14px 16px; text-align: center;">
                  <span class="material-icons" *ngIf="row.is_default" style="color: #f59e0b; font-size: 18px;">star</span>
                  <span class="material-icons" *ngIf="!row.is_default" style="color: #d1d5db; font-size: 18px;">star_outline</span>
                </td>
                <td style="padding: 14px 16px; text-align: center; position: relative;" (click)="$event.stopPropagation()">
                  <button (click)="toggleMenu(idx)"
                    style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #9ca3af; transition: all 0.2s ease; display: inline-flex;"
                    onmouseover="this.style.background='#f3f4f6'; this.style.color='#374151'"
                    onmouseout="this.style.background=''; this.style.color='#9ca3af'">
                    <span class="material-icons" style="font-size: 20px;">more_vert</span>
                  </button>
                  <div *ngIf="openMenuIdx === idx"
                    style="position: absolute; right: 16px; top: 100%; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.08); z-index: 50; min-width: 180px; padding: 6px; animation: fadeSlideUp 0.15s ease-out;">
                    <button (click)="viewCountry(row); openMenuIdx = -1"
                      style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.15s;"
                      onmouseover="this.style.background='#f0fdfa'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span>
                      View Details
                    </button>
                    <button (click)="editCountry(row); openMenuIdx = -1"
                      style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.15s;"
                      onmouseover="this.style.background='#f0fdfa'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span>
                      Edit
                    </button>
                    <button *ngIf="!row.is_default" (click)="setDefault(row); openMenuIdx = -1"
                      style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.15s;"
                      onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px; color: #f59e0b;">star</span>
                      Set as Default
                    </button>
                    <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                    <button *ngIf="row.status !== 'active'" (click)="setStatus(row, 'active'); openMenuIdx = -1"
                      style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.15s;"
                      onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                      Activate
                    </button>
                    <button *ngIf="row.status === 'active'" (click)="setStatus(row, 'inactive'); openMenuIdx = -1"
                      style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.15s;"
                      onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px; color: #ef4444;">block</span>
                      Deactivate
                    </button>
                    <div *ngIf="!row.is_default" style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                    <button *ngIf="!row.is_default" (click)="deleteCountry(row); openMenuIdx = -1"
                      style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #ef4444; border-radius: 8px; text-align: left; transition: background 0.15s;"
                      onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px;">delete</span>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && countries.length > 0" style="border-top: 1px solid #f3f4f6; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 13px; color: #9ca3af;">Showing {{ getRangeLabel() }}</span>
          <div style="display: flex; align-items: center; gap: 4px;">
            <button (click)="goToPage(1)" [disabled]="currentPage <= 1"
              style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; color: #374151; font-size: 13px; transition: all 0.2s; display: inline-flex; align-items: center;"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 16px;">first_page</span>
            </button>
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1"
              style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; color: #374151; font-size: 13px; transition: all 0.2s; display: inline-flex; align-items: center;"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 16px;">chevron_left</span>
            </button>
            <span style="padding: 0 8px; font-size: 13px; color: #6b7280;">Page {{ currentPage }}</span>
            <button (click)="goToPage(currentPage + 1)"
              style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; color: #374151; font-size: 13px; transition: all 0.2s; display: inline-flex; align-items: center;"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 16px;">chevron_right</span>
            </button>
            <select [(ngModel)]="perPage" (change)="onPerPageChange()"
              style="margin-left: 8px; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; cursor: pointer; outline: none;">
              <option [value]="10">10 / page</option>
              <option [value]="25">25 / page</option>
              <option [value]="50">50 / page</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Hidden file input -->
      <input #fileInput type="file" hidden accept=".csv,.xlsx,.xls" (change)="onFileSelected($event)" />

      <!-- Import overlay -->
      <div *ngIf="importing" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; animation: fadeIn 0.2s;">
        <div style="background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 24px 48px rgba(0,0,0,0.2); max-width: 360px; width: calc(100% - 32px);">
          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <div style="width: 28px; height: 28px; border: 3px solid rgba(5,150,105,0.2); border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>
          <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">Importing countries...</p>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Please wait while we process your file</p>
        </div>
      </div>

      <!-- Import result modal -->
      <div *ngIf="importResult" (click)="importResult = null" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; animation: fadeIn 0.2s;">
        <div (click)="$event.stopPropagation()" style="background: white; border-radius: 20px; padding: 24px; max-width: 480px; width: calc(100% - 32px); box-shadow: 0 24px 48px rgba(0,0,0,0.2);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"
              [style.background]="importResult.error_count > 0 ? '#fef3c7' : '#d1fae5'">
              <span class="material-icons" [style.color]="importResult.error_count > 0 ? '#f59e0b' : '#059669'">{{ importResult.error_count > 0 ? 'warning' : 'check_circle' }}</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Import Results</h3>
          </div>
          <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151; margin-bottom: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              {{ importResult.success_count }} countries imported successfully
            </div>
            <div *ngIf="importResult.error_count > 0">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #ef4444; margin-bottom: 8px;">
                <span class="material-icons" style="font-size: 18px;">error</span>
                {{ importResult.error_count }} errors occurred
              </div>
              <div style="background: #fef2f2; border-radius: 8px; padding: 12px; max-height: 160px; overflow-y: auto;">
                <p *ngFor="let err of importResult.errors; let i = index" style="font-size: 12px; color: #ef4444; margin: 0 0 4px 0;">{{ err }}</p>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button (click)="importResult = null"
              style="padding: 10px 24px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
              Close
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @media (min-width: 1024px) { .lg-cell { display: table-cell !important; } }
    @media (min-width: 1280px) { .xl-cell { display: table-cell !important; } }
  `],
})
export class CountriesComponent implements OnInit {
  private countryApi = inject(CountryApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  countries: Country[] = [];
  selection = new Set<Country>();
  selectedRows: Country[] = [];

  loading = false;
  importing = false;
  importResult: CountryImportResult | null = null;
  openMenuIdx = -1;

  currentPage = 1;
  perPage = 10;
  search = '';
  statusFilter: string | null = null;

  totalCount = 0;
  activeCount = 0;
  inactiveCount = 0;
  defaultCount = 0;

  get statCards() {
    return [
      { icon: 'public', value: String(this.totalCount), label: 'Total Countries', bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', color: '#059669' },
      { icon: 'check_circle', value: String(this.activeCount), label: 'Active', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#3b82f6' },
      { icon: 'cancel', value: String(this.inactiveCount), label: 'Inactive', bg: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#ef4444' },
      { icon: 'star', value: String(this.defaultCount), label: 'Default', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#f59e0b' },
    ];
  }

  private searchTimeout: any;

  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutside);
    this.loadCountries();
  }

  handleClickOutside = () => {
    this.openMenuIdx = -1;
  };

  loadCountries(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
      sort: 'sort_order',
      order: 'asc',
    };
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.countryApi.getAll(params).subscribe({
      next: (res) => {
        this.countries = res.data || [];
        this.totalCount = this.countries.length;
        this.activeCount = this.countries.filter(c => c.status === 'active').length;
        this.inactiveCount = this.countries.filter(c => c.status === 'inactive').length;
        this.defaultCount = this.countries.filter(c => c.is_default).length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load countries');
      },
    });
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadCountries();
    }, 400);
  }

  clearSearch(): void {
    this.search = '';
    this.currentPage = 1;
    this.loadCountries();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCountries();
  }

  clearFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.currentPage = 1;
    this.loadCountries();
  }

  goToPage(page: number): void {
    if (page < 1) return;
    this.currentPage = page;
    this.loadCountries();
  }

  onPerPageChange(): void {
    this.currentPage = 1;
    this.loadCountries();
  }

  isAllSelected(): boolean {
    return this.selection.size === this.countries.length && this.countries.length > 0;
  }

  toggleAllRows(event: any): void {
    if (event.target.checked) {
      this.countries.forEach(c => this.selection.add(c));
    } else {
      this.selection.clear();
    }
    this.selectedRows = Array.from(this.selection);
  }

  toggleRow(row: Country): void {
    if (this.selection.has(row)) {
      this.selection.delete(row);
    } else {
      this.selection.add(row);
    }
    this.selectedRows = Array.from(this.selection);
  }

  clearSelection(): void {
    this.selection.clear();
    this.selectedRows = [];
  }

  toggleMenu(idx: number): void {
    this.openMenuIdx = this.openMenuIdx === idx ? -1 : idx;
  }

  getRangeLabel(): string {
    if (this.countries.length === 0) return '0 of 0';
    return `1\u2013${this.countries.length} of ${this.countries.length}`;
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#fee2e2';
      case 'pending': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'inactive': return '#dc2626';
      case 'pending': return '#d97706';
      default: return '#6b7280';
    }
  }

  hoverStat(i: number): void {
    const els = document.querySelectorAll('[style*="fadeSlideUp"]');
    if (els[i]) {
      (els[i] as HTMLElement).style.transform = 'translateY(-2px)';
      (els[i] as HTMLElement).style.boxShadow = '0 8px 24px rgba(5,150,105,0.1)';
      (els[i] as HTMLElement).style.borderColor = '#a7f3d0';
    }
  }

  unhoverStat(i: number): void {
    const els = document.querySelectorAll('[style*="fadeSlideUp"]');
    if (els[i]) {
      (els[i] as HTMLElement).style.transform = '';
      (els[i] as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
      (els[i] as HTMLElement).style.borderColor = '#e5e7eb';
    }
  }

  viewCountry(row: Country): void {
    this.router.navigate(['/admin/countries', row.uuid]);
  }

  editCountry(row: Country): void {
    this.router.navigate(['/admin/countries', row.uuid, 'edit']);
  }

  setDefault(row: Country): void {
    if (window.confirm(`Set "${row.name}" as the default country?`)) {
      this.countryApi.setDefault(row.uuid).subscribe({
        next: () => { this.notification.success('Default country updated'); this.loadCountries(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  setStatus(row: Country, status: string): void {
    const label = status === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${row.name}"?`)) {
      this.countryApi.setStatus(row.uuid, status).subscribe({
        next: () => {
          this.notification.success(`Country ${status === 'active' ? 'activated' : 'deactivated'}`);
          this.loadCountries();
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteCountry(row: Country): void {
    if (window.confirm(`Delete "${row.name}"? This action cannot be undone.`)) {
      this.countryApi.delete(row.uuid).subscribe({
        next: () => { this.notification.success('Country deleted'); this.loadCountries(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetActive(): void {
    const ids = this.selectedRows.map(r => r.id);
    if (window.confirm(`Activate ${ids.length} selected countries?`)) {
      this.countryApi.bulkStatus(ids, 'active').subscribe({
        next: () => { this.notification.success('Countries activated'); this.clearSelection(); this.loadCountries(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetInactive(): void {
    const ids = this.selectedRows.map(r => r.id);
    if (window.confirm(`Deactivate ${ids.length} selected countries?`)) {
      this.countryApi.bulkStatus(ids, 'inactive').subscribe({
        next: () => { this.notification.success('Countries deactivated'); this.clearSelection(); this.loadCountries(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkDelete(): void {
    const ids = this.selectedRows.map(r => r.id);
    if (window.confirm(`Delete ${ids.length} selected countries? This cannot be undone.`)) {
      this.countryApi.bulkDelete(ids).subscribe({
        next: () => { this.notification.success('Countries deleted'); this.clearSelection(); this.loadCountries(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  openImportDialog(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.importing = true;
    this.countryApi.import(file).subscribe({
      next: (res) => {
        this.importing = false;
        this.importResult = res.data || null;
        this.loadCountries();
        input.value = '';
      },
      error: (err) => {
        this.importing = false;
        this.notification.error(err.error?.message || 'Import failed');
        input.value = '';
      },
    });
  }

  exportCountries(): void {
    const filters: Record<string, string> = {};
    if (this.search) filters['search'] = this.search;
    if (this.statusFilter) filters['status'] = this.statusFilter;

    this.countryApi.export(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'countries-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notification.error(err.error?.message || 'Export failed'),
    });
  }
}
