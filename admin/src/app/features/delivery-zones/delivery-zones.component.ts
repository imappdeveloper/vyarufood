import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeliveryZoneApiService } from '../../core/services/delivery-zone-api.service';
import { CountryApiService } from '../../core/services/country-api.service';
import { StateApiService } from '../../core/services/state-api.service';
import { CityApiService } from '../../core/services/city-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { DeliveryZone, DeliveryZoneImportResult } from '../../core/models/master/delivery-zone.model';
import { Country } from '../../core/models/master/country.model';
import { State } from '../../core/models/master/state.model';
import { City } from '../../core/models/master/city.model';

interface StatCard { label: string; value: number; icon: string; bg: string; color: string; }

@Component({
  selector: 'app-delivery-zones',
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
          <span style="color: white; font-weight: 500;">Delivery Zones</span>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
              <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">local_shipping</span>
              Delivery Zones
            </h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Manage delivery zones, pricing, and service areas</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <button (click)="openImportDialog()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">upload_file</span>
              Import
            </button>
            <button (click)="exportZones()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">download</span>
              Export
            </button>
            <a routerLink="/admin/delivery-zones/create"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">add</span>
              Add Zone
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
      <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 16px 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 180px; position: relative;">
          <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
          <input [(ngModel)]="search" (keyup.enter)="loadZones()" (ngModelChange)="onSearchDebounce()" placeholder="Search delivery zones..."
            style="width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          <button *ngIf="search" (click)="clearSearch()"
            style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; color: #9ca3af; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
            <span class="material-icons" style="font-size: 18px;">close</span>
          </button>
        </div>
        <select [(ngModel)]="countryFilter" (change)="onCountryChange()"
          style="padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; min-width: 150px;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
          onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''">
          <option [ngValue]="null">All Countries</option>
          <option *ngFor="let c of countries" [ngValue]="c.id">{{ c.name }}</option>
        </select>
        <select [(ngModel)]="stateFilter" (change)="onStateChange()"
          style="padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; min-width: 150px;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
          onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''">
          <option [ngValue]="null">All States</option>
          <option *ngFor="let s of states" [ngValue]="s.id">{{ s.name }}</option>
        </select>
        <select [(ngModel)]="cityFilter" (change)="onFilterChange()"
          style="padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; min-width: 150px;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
          onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''">
          <option [ngValue]="null">All Cities</option>
          <option *ngFor="let c of cities" [ngValue]="c.id">{{ c.name }}</option>
        </select>
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

      <div *ngIf="selectedZones.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: fadeSlideUp 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedZones.size }} selected</span>
        <div style="width: 1px; height: 18px; background: #a7f3d0;"></div>
        <button (click)="bulkSetActive()"
          style="padding: 6px 12px; background: #d1fae5; color: #047857; font-weight: 600; border-radius: 8px; border: none; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#a7f3d0'" onmouseout="this.style.background='#d1fae5'">
          <span class="material-icons" style="font-size: 14px;">check_circle</span> Activate
        </button>
        <button (click)="bulkSetInactive()"
          style="padding: 6px 12px; background: #fee2e2; color: #dc2626; font-weight: 600; border-radius: 8px; border: none; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'">
          <span class="material-icons" style="font-size: 14px;">block</span> Deactivate
        </button>
        <button (click)="bulkDelete()"
          style="padding: 6px 12px; background: #fef2f2; color: #dc2626; font-weight: 600; border-radius: 8px; border: 1px solid #fecaca; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fef2f2'">
          <span class="material-icons" style="font-size: 14px;">delete</span> Delete
        </button>
        <button (click)="clearSelection()"
          style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; display: flex; color: #9ca3af; transition: color 0.2s ease;"
          onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#9ca3af'">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 80px 20px;">
          <div style="text-align: center;">
            <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>
            <p style="font-size: 13px; color: #9ca3af;">Loading delivery zones...</p>
          </div>
        </div>

        <div *ngIf="!loading && zones.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px;">
          <div style="width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 36px; color: #059669;">local_shipping</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No delivery zones found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 320px; margin: 0 0 24px 0;">
            <span *ngIf="search || statusFilter || countryFilter || stateFilter || cityFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!search && !statusFilter && !countryFilter && !stateFilter && !cityFilter">Get started by adding your first delivery zone</span>
          </p>
          <a *ngIf="!search && !statusFilter && !countryFilter && !stateFilter && !cityFilter" routerLink="/admin/delivery-zones/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'"
            onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Zone
          </a>
          <button *ngIf="search || statusFilter || countryFilter || stateFilter || cityFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
            Clear Filters
          </button>
        </div>

        <div *ngIf="!loading && zones.length > 0">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f0fdf4; border-bottom: 2px solid #d1fae5;">
                  <th style="padding: 12px 16px; text-align: left; width: 48px;">
                    <input type="checkbox" (change)="toggleAllRows($event)" [checked]="isAllSelected()"
                      style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                  </th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">Zone</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">City</th>
                  <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; display: none;" class="lg-cell">Radius</th>
                  <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; display: none;" class="xl-cell">Min Order</th>
                  <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; display: none;" class="xl-cell">Charge</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; width: 64px;">Default</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; width: 48px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of zones" (click)="viewZone(row)"
                  style="border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.15s ease;"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                  <td style="padding: 14px 16px;" (click)="$event.stopPropagation()">
                    <input type="checkbox" (change)="toggleRow(row)" [checked]="selectedZones.has(row)"
                      style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                  </td>
                  <td style="padding: 14px 16px;">
                    <div>
                      <p style="font-weight: 600; color: #166534; margin: 0; line-height: 1.3;">{{ row.zone_name }}</p>
                      <p *ngIf="row.zone_code" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0; font-family: monospace;">{{ row.zone_code }}</p>
                    </div>
                  </td>
                  <td style="padding: 14px 16px; color: #6b7280;">{{ row.city?.name || '-' }}</td>
                  <td style="padding: 14px 16px; text-align: right; color: #6b7280; font-family: monospace; display: none;" class="lg-cell">{{ row.delivery_radius ? (row.delivery_radius + ' km') : '-' }}</td>
                  <td style="padding: 14px 16px; text-align: right; color: #6b7280; font-family: monospace; display: none;" class="xl-cell">{{ row.minimum_order_amount ? ('\u20B9' + row.minimum_order_amount) : '-' }}</td>
                  <td style="padding: 14px 16px; text-align: right; color: #6b7280; font-family: monospace; display: none;" class="xl-cell">{{ row.delivery_charge ? ('\u20B9' + row.delivery_charge) : 'Free' }}</td>
                  <td style="padding: 14px 16px; text-align: center;">
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getStatusBg(row.status)" [style.color]="getStatusColor(row.status)">
                      <span *ngIf="row.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      {{ row.status | titlecase }}
                    </span>
                  </td>
                  <td style="padding: 14px 16px; text-align: center;">
                    <span class="material-icons" *ngIf="row.is_default" style="font-size: 18px; color: #f59e0b;">star</span>
                    <span class="material-icons" *ngIf="!row.is_default" style="font-size: 18px; color: #d1d5db;">star_outline</span>
                  </td>
                  <td style="padding: 14px 16px; text-align: center; position: relative;" (click)="$event.stopPropagation()">
                    <button (click)="toggleMenu(row)"
                      style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; display: inline-flex; color: #9ca3af; transition: all 0.15s ease;"
                      onmouseover="this.style.background='#f0fdf4'; this.style.color='#059669'" onmouseout="this.style.background=''; this.style.color='#9ca3af'">
                      <span class="material-icons" style="font-size: 20px;">more_vert</span>
                    </button>
                    <div *ngIf="openMenuId === row.id"
                      style="position: absolute; right: 8px; top: 100%; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 190px; z-index: 20; padding: 6px; animation: fadeSlideUp 0.15s ease-out;">
                      <button (click)="viewZone(row)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                      </button>
                      <button (click)="editZone(row)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                      </button>
                      <button (click)="manageSlots(row)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #0d9488;">schedule</span> Manage Slots
                      </button>
                      <button *ngIf="!row.is_default" (click)="setDefault(row)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #f59e0b;">star</span> Set as Default
                      </button>
                      <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                      <button *ngIf="row.status !== 'active'" (click)="setStatus(row, 'active')"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span> Activate
                      </button>
                      <button *ngIf="row.status === 'active'" (click)="setStatus(row, 'inactive')"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #dc2626;">block</span> Deactivate
                      </button>
                      <div *ngIf="!row.is_default" style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                      <button *ngIf="!row.is_default" (click)="deleteZone(row)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="border-top: 1px solid #f3f4f6; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 12px; color: #9ca3af;">Showing {{ getRangeLabel() }}</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <button (click)="goToPage(1)" [style.opacity]="currentPage === 1 ? '0.4' : '1'" [style.cursor]="currentPage === 1 ? 'default' : 'pointer'"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center;"
                onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
                <span class="material-icons" style="font-size: 16px;">first_page</span>
              </button>
              <button (click)="goToPage(currentPage - 1)" [style.opacity]="currentPage <= 1 ? '0.4' : '1'" [style.cursor]="currentPage <= 1 ? 'default' : 'pointer'"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center;"
                onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
                <span class="material-icons" style="font-size: 16px;">chevron_left</span>
              </button>
              <span style="padding: 6px 12px; font-size: 12px; color: #6b7280;">Page {{ currentPage }} of {{ totalPages }}</span>
              <button (click)="goToPage(currentPage + 1)" [style.opacity]="currentPage >= totalPages ? '0.4' : '1'" [style.cursor]="currentPage >= totalPages ? 'default' : 'pointer'"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center;"
                onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
                <span class="material-icons" style="font-size: 16px;">chevron_right</span>
              </button>
              <button (click)="goToPage(totalPages)" [style.opacity]="currentPage >= totalPages ? '0.4' : '1'" [style.cursor]="currentPage >= totalPages ? 'default' : 'pointer'"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center;"
                onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
                <span class="material-icons" style="font-size: 16px;">last_page</span>
              </button>
              <select (change)="onPerPageChange($event)" style="margin-left: 8px; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; cursor: pointer; outline: none;">
                <option [selected]="perPage === 10" value="10">10 / page</option>
                <option [selected]="perPage === 25" value="25">25 / page</option>
                <option [selected]="perPage === 50" value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <input #fileInput type="file" hidden accept=".csv,.xlsx,.xls" (change)="onFileSelected($event)" />

      <div *ngIf="importing" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; animation: fadeIn 0.2s;">
        <div style="background: white; border-radius: 20px; padding: 32px; text-align: center; box-shadow: 0 24px 48px rgba(0,0,0,0.2); max-width: 320px; width: calc(100% - 32px);">
          <div style="width: 64px; height: 64px; border: 3px solid #d1fae5; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">Importing zones...</p>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Please wait while we process your file</p>
        </div>
      </div>

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
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              <span style="color: #374151;">{{ importResult.success_count }} zones imported successfully</span>
            </div>
            <div *ngIf="importResult.error_count > 0">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 8px;">
                <span class="material-icons" style="font-size: 18px; color: #dc2626;">error</span>
                <span style="color: #dc2626;">{{ importResult.error_count }} errors occurred</span>
              </div>
              <div style="background: #fef2f2; border-radius: 8px; padding: 12px; max-height: 160px; overflow-y: auto;">
                <p *ngFor="let error of importResult.errors" style="font-size: 12px; color: #dc2626; margin: 0 0 4px 0; line-height: 1.4;">{{ error }}</p>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button (click)="importResult = null"
              style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease;"
              onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">Close</button>
          </div>
        </div>
      </div>
    </section>

    <style>
      @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @media (min-width: 1024px) { .lg-cell { display: table-cell !important; } }
      @media (min-width: 1280px) { .xl-cell { display: table-cell !important; } }
    </style>
  `,
})
export class DeliveryZonesComponent implements OnInit {
  private zoneApi = inject(DeliveryZoneApiService);
  private countryApi = inject(CountryApiService);
  private stateApi = inject(StateApiService);
  private cityApi = inject(CityApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  zones: DeliveryZone[] = [];
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  selectedZones = new Set<DeliveryZone>();
  openMenuId: number | null = null;

  loading = false;
  importing = false;
  importResult: DeliveryZoneImportResult | null = null;

  currentPage = 1;
  perPage = 10;
  totalCount = 0;
  totalPages = 1;
  sort = 'priority';
  order: 'asc' | 'desc' = 'asc';
  search = '';
  statusFilter: string | null = null;
  countryFilter: number | null = null;
  stateFilter: number | null = null;
  cityFilter: number | null = null;

  activeCount = 0;
  defaultCount = 0;
  totalSlots = 0;
  private searchTimeout: any;

  statCards: StatCard[] = [];

  ngOnInit(): void {
    this.loadCountries();
    this.loadZones();
  }

  loadCountries(): void {
    this.countryApi.getAll().subscribe({
      next: (res) => { this.countries = res.data || []; },
      error: () => {},
    });
  }

  loadStatesByCountry(): void {
    if (!this.countryFilter) { this.states = []; return; }
    const country = this.countries.find(c => c.id === this.countryFilter);
    if (country) {
      this.stateApi.getByCountry(country.uuid).subscribe({
        next: (res) => { this.states = res.data || []; },
        error: () => { this.states = []; },
      });
    }
  }

  loadCitiesByState(): void {
    if (!this.stateFilter) { this.cities = []; return; }
    const state = this.states.find(s => s.id === this.stateFilter);
    if (state) {
      this.cityApi.getByState(state.uuid).subscribe({
        next: (res) => { this.cities = res.data || []; },
        error: () => { this.cities = []; },
      });
    }
  }

  onCountryChange(): void {
    this.stateFilter = null;
    this.cityFilter = null;
    this.cities = [];
    this.loadStatesByCountry();
    this.currentPage = 1;
    this.loadZones();
  }

  onStateChange(): void {
    this.cityFilter = null;
    this.loadCitiesByState();
    this.currentPage = 1;
    this.loadZones();
  }

  loadZones(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
      sort: this.sort,
      order: this.order,
    };
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.cityFilter) params['city_id'] = this.cityFilter.toString();

    this.zoneApi.getAll(params).subscribe({
      next: (res) => {
        this.zones = res.data || [];
        this.totalCount = this.zones.length;
        this.totalPages = Math.ceil(this.totalCount / this.perPage) || 1;
        this.activeCount = this.zones.filter(z => z.status === 'active').length;
        this.defaultCount = this.zones.filter(z => z.is_default).length;
        this.totalSlots = this.zones.reduce((sum, z) => sum + (z.deliverySlotsCount || 0), 0);
        this.updateStatCards();
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load delivery zones'); },
    });
  }

  updateStatCards(): void {
    this.statCards = [
      { label: 'Total Zones', value: this.totalCount, icon: 'local_shipping', bg: '#d1fae5', color: '#047857' },
      { label: 'Active', value: this.activeCount, icon: 'check_circle', bg: '#a7f3d0', color: '#059669' },
      { label: 'Default', value: this.defaultCount, icon: 'star', bg: '#fef3c7', color: '#d97706' },
      { label: 'Total Slots', value: this.totalSlots, icon: 'schedule', bg: '#ccfbf1', color: '#0d9488' },
    ];
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadZones(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadZones(); }
  onFilterChange(): void { this.currentPage = 1; this.loadZones(); }
  clearFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.countryFilter = null;
    this.stateFilter = null;
    this.cityFilter = null;
    this.states = [];
    this.cities = [];
    this.currentPage = 1;
    this.loadZones();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadZones();
  }

  onPerPageChange(event: any): void {
    this.perPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadZones();
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  isAllSelected(): boolean {
    return this.zones.length > 0 && this.selectedZones.size === this.zones.length;
  }

  toggleAllRows(event: any): void {
    if (event.target.checked) {
      this.zones.forEach(z => this.selectedZones.add(z));
    } else {
      this.selectedZones.clear();
    }
    this.openMenuId = null;
  }

  toggleRow(row: DeliveryZone): void {
    if (this.selectedZones.has(row)) {
      this.selectedZones.delete(row);
    } else {
      this.selectedZones.add(row);
    }
    this.openMenuId = null;
  }

  clearSelection(): void { this.selectedZones.clear(); }

  toggleMenu(row: DeliveryZone): void {
    this.openMenuId = this.openMenuId === row.id ? null : row.id;
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

  viewZone(row: DeliveryZone): void { this.router.navigate(['/admin/delivery-zones', row.uuid]); }
  editZone(row: DeliveryZone): void { this.router.navigate(['/admin/delivery-zones', row.uuid, 'edit']); }
  manageSlots(row: DeliveryZone): void { this.router.navigate(['/admin/delivery-zones', row.uuid, 'slots']); }

  setDefault(row: DeliveryZone): void {
    this.openMenuId = null;
    if (window.confirm(`Set "${row.zone_name}" as the default delivery zone?`)) {
      this.zoneApi.setDefault(row.uuid).subscribe({
        next: () => { this.notification.success('Default delivery zone updated'); this.loadZones(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  setStatus(row: DeliveryZone, status: string): void {
    this.openMenuId = null;
    const label = status === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${row.zone_name}"?`)) {
      this.zoneApi.setStatus(row.uuid, status).subscribe({
        next: () => { this.notification.success(`Zone ${status === 'active' ? 'activated' : 'deactivated'}`); this.loadZones(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteZone(row: DeliveryZone): void {
    this.openMenuId = null;
    if (window.confirm(`Delete "${row.zone_name}"? This action cannot be undone.`)) {
      this.zoneApi.delete(row.uuid).subscribe({
        next: () => { this.notification.success('Delivery zone deleted'); this.loadZones(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetActive(): void {
    const ids = [...this.selectedZones].map(r => r.id);
    if (window.confirm(`Activate ${ids.length} selected zones?`)) {
      this.zoneApi.bulkSetStatus(ids, 'active').subscribe({
        next: () => { this.notification.success('Zones activated'); this.clearSelection(); this.loadZones(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetInactive(): void {
    const ids = [...this.selectedZones].map(r => r.id);
    if (window.confirm(`Deactivate ${ids.length} selected zones?`)) {
      this.zoneApi.bulkSetStatus(ids, 'inactive').subscribe({
        next: () => { this.notification.success('Zones deactivated'); this.clearSelection(); this.loadZones(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkDelete(): void {
    const ids = [...this.selectedZones].map(r => r.id);
    if (window.confirm(`Delete ${ids.length} selected zones? This cannot be undone.`)) {
      this.zoneApi.bulkDelete(ids).subscribe({
        next: () => { this.notification.success('Zones deleted'); this.clearSelection(); this.loadZones(); },
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
    this.zoneApi.import(file).subscribe({
      next: (res) => { this.importing = false; this.importResult = res.data || null; this.loadZones(); input.value = ''; },
      error: (err) => { this.importing = false; this.notification.error(err.error?.message || 'Import failed'); input.value = ''; },
    });
  }

  exportZones(): void {
    const filters: Record<string, string> = {};
    if (this.search) filters['search'] = this.search;
    if (this.statusFilter) filters['status'] = this.statusFilter;
    if (this.cityFilter) filters['city_id'] = this.cityFilter.toString();
    this.zoneApi.export(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'delivery-zones-export.csv'; a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notification.error(err.error?.message || 'Export failed'),
    });
  }
}
