import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PincodeApiService } from '../../core/services/pincode-api.service';
import { DeliveryZoneApiService } from '../../core/services/delivery-zone-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Pincode, PincodeImportResult } from '../../core/models/master/pincode.model';
import { DeliveryZone } from '../../core/models/master/delivery-zone.model';

interface StatCard { label: string; value: number; icon: string; bg: string; color: string; }

@Component({
  selector: 'app-pincodes',
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
          <span style="color: white; font-weight: 500;">Pincodes</span>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
              <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">markunread_mailbox</span>
              Pincodes
            </h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Manage all delivery pincodes and service areas</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <button (click)="openImportDialog()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">upload_file</span>
              Import
            </button>
            <button (click)="exportPincodes()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">download</span>
              Export
            </button>
            <a routerLink="/admin/pincodes/create"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">add</span>
              Add Pincode
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
          <input [(ngModel)]="search" (keyup.enter)="loadPincodes()" (ngModelChange)="onSearchDebounce()" placeholder="Search pincodes..."
            style="width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          <button *ngIf="search" (click)="clearSearch()"
            style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; color: #9ca3af; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
            <span class="material-icons" style="font-size: 18px;">close</span>
          </button>
        </div>
        <select [(ngModel)]="deliveryZoneFilter" (change)="onFilterChange()"
          style="padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; min-width: 160px;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
          onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''">
          <option [ngValue]="null">All Zones</option>
          <option *ngFor="let z of deliveryZones" [ngValue]="z.id">{{ z.zone_name }}</option>
        </select>
        <select [(ngModel)]="serviceableFilter" (change)="onFilterChange()"
          style="padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; min-width: 150px;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
          onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''">
          <option [ngValue]="null">All Serviceable</option>
          <option value="true">Serviceable</option>
          <option value="false">Non-Serviceable</option>
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

      <div *ngIf="selectedPincodes.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: fadeSlideUp 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedPincodes.size }} selected</span>
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
            <p style="font-size: 13px; color: #9ca3af;">Loading pincodes...</p>
          </div>
        </div>

        <div *ngIf="!loading && pincodes.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px;">
          <div style="width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 36px; color: #059669;">markunread_mailbox</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No pincodes found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 320px; margin: 0 0 24px 0;">
            <span *ngIf="search || statusFilter || deliveryZoneFilter || serviceableFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!search && !statusFilter && !deliveryZoneFilter && !serviceableFilter">Get started by adding your first pincode</span>
          </p>
          <a *ngIf="!search && !statusFilter && !deliveryZoneFilter && !serviceableFilter" routerLink="/admin/pincodes/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'"
            onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Pincode
          </a>
          <button *ngIf="search || statusFilter || deliveryZoneFilter || serviceableFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
            Clear Filters
          </button>
        </div>

        <div *ngIf="!loading && pincodes.length > 0">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f0fdf4; border-bottom: 2px solid #d1fae5;">
                  <th style="padding: 12px 16px; text-align: left; width: 48px;">
                    <input type="checkbox" (change)="toggleAllRows($event)" [checked]="isAllSelected()"
                      style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                  </th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">Pincode</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Zone</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">City</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; display: none;" class="lg-cell">District</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Serviceable</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; width: 48px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of pincodes" (click)="viewPincode(row)"
                  style="border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.15s ease;"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                  <td style="padding: 14px 16px;" (click)="$event.stopPropagation()">
                    <input type="checkbox" (change)="toggleRow(row)" [checked]="selectedPincodes.has(row)"
                      style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                  </td>
                  <td style="padding: 14px 16px;">
                    <div>
                      <p style="font-weight: 600; color: #166534; margin: 0; font-family: monospace; line-height: 1.3;">{{ row.pincode }}</p>
                      <p *ngIf="row.office_name" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ row.office_name }}</p>
                    </div>
                  </td>
                  <td style="padding: 14px 16px; color: #6b7280;">{{ row.deliveryZone?.zone_name || '-' }}</td>
                  <td style="padding: 14px 16px; color: #6b7280;">{{ row.city?.name || '-' }}</td>
                  <td style="padding: 14px 16px; color: #6b7280; display: none;" class="lg-cell">{{ row.district || '-' }}</td>
                  <td style="padding: 14px 16px; text-align: center;">
                    <span *ngIf="row.is_serviceable" class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span *ngIf="!row.is_serviceable" class="material-icons" style="font-size: 18px; color: #dc2626;">block</span>
                  </td>
                  <td style="padding: 14px 16px; text-align: center;">
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getStatusBg(row.status)" [style.color]="getStatusColor(row.status)">
                      <span *ngIf="row.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      {{ row.status | titlecase }}
                    </span>
                  </td>
                  <td style="padding: 14px 16px; text-align: center; position: relative;" (click)="$event.stopPropagation()">
                    <button (click)="toggleMenu(row)"
                      style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; display: inline-flex; color: #9ca3af; transition: all 0.15s ease;"
                      onmouseover="this.style.background='#f0fdf4'; this.style.color='#059669'" onmouseout="this.style.background=''; this.style.color='#9ca3af'">
                      <span class="material-icons" style="font-size: 20px;">more_vert</span>
                    </button>
                    <div *ngIf="openMenuId === row.id"
                      style="position: absolute; right: 8px; top: 100%; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 180px; z-index: 20; padding: 6px; animation: fadeSlideUp 0.15s ease-out;">
                      <button (click)="viewPincode(row)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                      </button>
                      <button (click)="editPincode(row)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
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
                      <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                      <button (click)="deletePincode(row)"
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
          <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">Importing pincodes...</p>
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
              <span style="color: #374151;">{{ importResult.success_count }} pincodes imported successfully</span>
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
    </style>
  `,
})
export class PincodesComponent implements OnInit {
  private pincodeApi = inject(PincodeApiService);
  private deliveryZoneApi = inject(DeliveryZoneApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  pincodes: Pincode[] = [];
  deliveryZones: DeliveryZone[] = [];
  selectedPincodes = new Set<Pincode>();
  openMenuId: number | null = null;

  loading = false;
  importing = false;
  importResult: PincodeImportResult | null = null;

  currentPage = 1;
  perPage = 10;
  totalCount = 0;
  totalPages = 1;
  sort = 'created_at';
  order: 'asc' | 'desc' = 'desc';
  search = '';
  statusFilter: string | null = null;
  deliveryZoneFilter: number | null = null;
  serviceableFilter: string | null = null;

  activeCount = 0;
  serviceableCount = 0;
  private searchTimeout: any;

  statCards: StatCard[] = [];

  ngOnInit(): void {
    this.loadDeliveryZones();
    this.loadPincodes();
  }

  loadDeliveryZones(): void {
    this.deliveryZoneApi.getAll().subscribe({
      next: (res) => { this.deliveryZones = res.data || []; },
      error: () => {},
    });
  }

  loadPincodes(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
      sort: this.sort,
      order: this.order,
    };
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.deliveryZoneFilter) params['delivery_zone_id'] = this.deliveryZoneFilter.toString();
    if (this.serviceableFilter) params['is_serviceable'] = this.serviceableFilter;

    this.pincodeApi.getAll(params).subscribe({
      next: (res) => {
        this.pincodes = res.data || [];
        this.totalCount = this.pincodes.length;
        this.totalPages = Math.ceil(this.totalCount / this.perPage) || 1;
        this.activeCount = this.pincodes.filter(p => p.status === 'active').length;
        this.serviceableCount = this.pincodes.filter(p => p.is_serviceable).length;
        this.updateStatCards();
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load pincodes'); },
    });
  }

  updateStatCards(): void {
    this.statCards = [
      { label: 'Total Pincodes', value: this.totalCount, icon: 'markunread_mailbox', bg: '#d1fae5', color: '#047857' },
      { label: 'Active', value: this.activeCount, icon: 'check_circle', bg: '#a7f3d0', color: '#059669' },
      { label: 'Serviceable', value: this.serviceableCount, icon: 'local_shipping', bg: '#ccfbf1', color: '#0d9488' },
      { label: 'Non-Serviceable', value: this.totalCount - this.serviceableCount, icon: 'block', bg: '#fef3c7', color: '#d97706' },
    ];
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadPincodes(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadPincodes(); }
  onFilterChange(): void { this.currentPage = 1; this.loadPincodes(); }
  clearFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.deliveryZoneFilter = null;
    this.serviceableFilter = null;
    this.currentPage = 1;
    this.loadPincodes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPincodes();
  }

  onPerPageChange(event: any): void {
    this.perPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadPincodes();
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  isAllSelected(): boolean {
    return this.pincodes.length > 0 && this.selectedPincodes.size === this.pincodes.length;
  }

  toggleAllRows(event: any): void {
    if (event.target.checked) {
      this.pincodes.forEach(p => this.selectedPincodes.add(p));
    } else {
      this.selectedPincodes.clear();
    }
    this.openMenuId = null;
  }

  toggleRow(row: Pincode): void {
    if (this.selectedPincodes.has(row)) {
      this.selectedPincodes.delete(row);
    } else {
      this.selectedPincodes.add(row);
    }
    this.openMenuId = null;
  }

  clearSelection(): void { this.selectedPincodes.clear(); }

  toggleMenu(row: Pincode): void {
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

  viewPincode(row: Pincode): void { this.router.navigate(['/admin/pincodes', row.uuid]); }
  editPincode(row: Pincode): void { this.router.navigate(['/admin/pincodes', row.uuid, 'edit']); }

  setStatus(row: Pincode, status: string): void {
    this.openMenuId = null;
    const label = status === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} pincode "${row.pincode}"?`)) {
      this.pincodeApi.setStatus(row.uuid, status).subscribe({
        next: () => { this.notification.success(`Pincode ${status === 'active' ? 'activated' : 'deactivated'}`); this.loadPincodes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deletePincode(row: Pincode): void {
    this.openMenuId = null;
    if (window.confirm(`Delete pincode "${row.pincode}"? This action cannot be undone.`)) {
      this.pincodeApi.delete(row.uuid).subscribe({
        next: () => { this.notification.success('Pincode deleted'); this.loadPincodes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetActive(): void {
    const ids = [...this.selectedPincodes].map(p => p.id);
    if (window.confirm(`Activate ${ids.length} selected pincodes?`)) {
      this.pincodeApi.bulkSetStatus(ids, 'active').subscribe({
        next: () => { this.notification.success('Pincodes activated'); this.clearSelection(); this.loadPincodes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetInactive(): void {
    const ids = [...this.selectedPincodes].map(p => p.id);
    if (window.confirm(`Deactivate ${ids.length} selected pincodes?`)) {
      this.pincodeApi.bulkSetStatus(ids, 'inactive').subscribe({
        next: () => { this.notification.success('Pincodes deactivated'); this.clearSelection(); this.loadPincodes(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkDelete(): void {
    const ids = [...this.selectedPincodes].map(p => p.id);
    if (window.confirm(`Delete ${ids.length} selected pincodes? This cannot be undone.`)) {
      this.pincodeApi.bulkDelete(ids).subscribe({
        next: () => { this.notification.success('Pincodes deleted'); this.clearSelection(); this.loadPincodes(); },
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
    this.pincodeApi.import(file).subscribe({
      next: (res) => { this.importing = false; this.importResult = res.data || null; this.loadPincodes(); input.value = ''; },
      error: (err) => { this.importing = false; this.notification.error(err.error?.message || 'Import failed'); input.value = ''; },
    });
  }

  exportPincodes(): void {
    const filters: Record<string, string> = {};
    if (this.search) filters['search'] = this.search;
    if (this.statusFilter) filters['status'] = this.statusFilter;
    if (this.deliveryZoneFilter) filters['delivery_zone_id'] = this.deliveryZoneFilter.toString();
    if (this.serviceableFilter) filters['is_serviceable'] = this.serviceableFilter;
    this.pincodeApi.export(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'pincodes-export.csv'; a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notification.error(err.error?.message || 'Export failed'),
    });
  }
}
