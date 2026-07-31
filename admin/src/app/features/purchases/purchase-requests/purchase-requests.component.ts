import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PurchaseApiService } from '../../../core/services/purchase-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PurchaseRequest, PURCHASE_REQUEST_STATUSES, PRIORITY_LEVELS } from '../../../core/models/purchase/purchase.model';

@Component({
  selector: 'app-purchase-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && requests.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading purchase requests...</p>
      </div>
    </div>

    <div *ngIf="!loading || requests.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Purchase Requests</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Purchase Requests</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage purchase requests and procurement approvals</p>
        </div>
        <a routerLink="/admin/purchases/requests/create"
          style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
          onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
          <span class="material-icons" style="font-size: 18px;">add</span> New Request
        </a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">receipt</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Requests</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">pending</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Pending Approval</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.pending_approval || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Approved</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.approved || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #b91c1c;">cancel</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Rejected</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.rejected || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #7c3aed;">swap_horiz</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Converted</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.converted_to_po || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchDebounce()" placeholder="Search by request number or requester..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="searchQuery" (click)="clearSearch()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 170px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All Statuses</option>
            <option *ngFor="let s of statuses" [ngValue]="s.value">{{ s.label }}</option>
          </select>
          <select [(ngModel)]="priorityFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All Priorities</option>
            <option *ngFor="let p of priorities" [ngValue]="p.value">{{ p.label }}</option>
          </select>
          <button *ngIf="searchQuery || statusFilter || priorityFilter" (click)="clearFilters()"
            style="padding: 9px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">
            <span class="material-icons" style="font-size: 16px; color: #6b7280;">filter_alt_off</span> Clear
          </button>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && requests.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && requests.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">receipt</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No purchase requests found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="searchQuery || statusFilter || priorityFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!searchQuery && !statusFilter && !priorityFilter">No purchase requests have been created yet.</span>
          </p>
          <a *ngIf="!searchQuery && !statusFilter && !priorityFilter" routerLink="/admin/purchases/requests/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Create First Request
          </a>
          <button *ngIf="searchQuery || statusFilter || priorityFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && requests.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 130px;">Request #</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">Date</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 130px;">Requested By</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px;">Department</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Priority</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Items</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of requests; let i = index" (click)="viewRequest(row.uuid)" [attr.data-idx]="i"
                style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td style="padding: 12px 16px;">
                  <span style="font-family: monospace; font-weight: 700; color: #047857;">{{ row.request_number }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="color: #374151;">{{ row.request_date | date:'mediumDate' }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="color: #374151;">{{ row.requested_by || '-' }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="color: #374151;">{{ row.department || '-' }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getPriorityClass(row.priority).bg"
                    [style.color]="getPriorityClass(row.priority).fg">
                    {{ row.priority | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; min-width: 28px; height: 28px; padding: 0 6px; border-radius: 8px; background: #f3f4f6; font-size: 12px; font-weight: 700; color: #6b7280;">{{ row.items_count || 0 }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; align-items: center; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusClass(row.status).bg"
                    [style.color]="getStatusClass(row.status).fg">
                    <span *ngIf="row.status === 'approved'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 4px;"></span>
                    {{ row.status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewRequest(row.uuid); $event.stopPropagation()"
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
                      <div *ngIf="activeActionRow?.uuid === row.uuid" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 190px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                        <button (click)="viewRequest(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button *ngIf="row.status === 'draft'" (click)="editRequest(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <button *ngIf="row.status === 'pending_approval'" (click)="approveRequest(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Approve
                        </button>
                        <button *ngIf="row.status === 'pending_approval'" (click)="rejectRequest(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #dc2626;">cancel</span> Reject
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="row.status !== 'cancelled'" (click)="cancelRequest(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #d97706;">block</span> Cancel
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteRequest(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
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
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    </style>
  `,
})
export class PurchaseRequestsComponent implements OnInit, OnDestroy {
  private purchaseApi = inject(PurchaseApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  requests: PurchaseRequest[] = [];
  activeActionRow: PurchaseRequest | null = null;

  loading = false;
  currentPage = 1;
  perPage = 15;
  totalCount = 0;

  searchQuery = '';
  statusFilter: string | null = null;
  priorityFilter: string | null = null;

  stats: any = null;
  statuses = PURCHASE_REQUEST_STATUSES;
  priorities = PRIORITY_LEVELS;

  private searchSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.perPage));
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => {
      this.currentPage = 1;
      this.loadRequests();
    });
    this.loadRequests();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRequests(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.priorityFilter) params['priority'] = this.priorityFilter;

    this.purchaseApi.getPurchaseRequests(params).subscribe({
      next: (res) => {
        this.requests = res.data || [];
        this.totalCount = res.meta?.total || this.requests.length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load purchase requests'); },
    });
  }

  loadStats(): void {
    this.purchaseApi.getPurchaseRequestStats().subscribe({
      next: (res) => { this.stats = res.data ?? null; },
      error: () => {},
    });
  }

  onSearchDebounce(): void { this.searchSubject.next(); }

  clearSearch(): void { this.searchQuery = ''; this.currentPage = 1; this.loadRequests(); }

  onFilterChange(): void { this.currentPage = 1; this.loadRequests(); }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = null;
    this.priorityFilter = null;
    this.currentPage = 1;
    this.loadRequests();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRequests();
  }

  onPerPageChange(event: any): void {
    this.perPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadRequests();
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  getStatusClass(status: string): { bg: string; fg: string } {
    switch (status) {
      case 'draft': return { bg: '#f3f4f6', fg: '#374151' };
      case 'pending_approval': return { bg: '#fef3c7', fg: '#b45309' };
      case 'approved': return { bg: '#d1fae5', fg: '#047857' };
      case 'rejected': return { bg: '#fee2e2', fg: '#b91c1c' };
      case 'converted_to_po': return { bg: '#f3e8ff', fg: '#7e22ce' };
      case 'cancelled': return { bg: '#f3f4f6', fg: '#6b7280' };
      default: return { bg: '#f3f4f6', fg: '#374151' };
    }
  }

  getPriorityClass(priority: string): { bg: string; fg: string } {
    switch (priority) {
      case 'low': return { bg: '#f3f4f6', fg: '#4b5563' };
      case 'medium': return { bg: '#dbeafe', fg: '#1d4ed8' };
      case 'high': return { bg: '#fef3c7', fg: '#b45309' };
      case 'urgent': return { bg: '#fee2e2', fg: '#b91c1c' };
      default: return { bg: '#f3f4f6', fg: '#4b5563' };
    }
  }

  toggleActionMenu(row: PurchaseRequest | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  viewRequest(uuid: string): void { this.activeActionRow = null; this.router.navigate(['/admin/purchases/requests', uuid]); }
  addRequest(): void { this.router.navigate(['/admin/purchases/requests', 'create']); }
  editRequest(uuid: string): void { this.activeActionRow = null; this.router.navigate(['/admin/purchases/requests', uuid, 'edit']); }

  approveRequest(uuid: string): void {
    if (window.confirm('Approve this purchase request?')) {
      this.purchaseApi.approvePurchaseRequest(uuid).subscribe({
        next: () => { this.notification.success('Purchase request approved'); this.loadRequests(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  rejectRequest(uuid: string): void {
    const reason = window.prompt('Reason for rejection:');
    if (reason !== null) {
      this.purchaseApi.rejectPurchaseRequest(uuid, { reason }).subscribe({
        next: () => { this.notification.success('Purchase request rejected'); this.loadRequests(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelRequest(uuid: string): void {
    if (window.confirm('Cancel this purchase request?')) {
      this.purchaseApi.cancelPurchaseRequest(uuid).subscribe({
        next: () => { this.notification.success('Purchase request cancelled'); this.loadRequests(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteRequest(uuid: string): void {
    if (window.confirm('Delete this purchase request? This cannot be undone.')) {
      this.purchaseApi.deletePurchaseRequest(uuid).subscribe({
        next: () => { this.notification.success('Purchase request deleted'); this.loadRequests(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
