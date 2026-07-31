import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { NotificationLog, DELIVERY_STATUSES } from '../../../../core/models/notification/notification.model';

@Component({
  selector: 'app-notification-log-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && logs.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading delivery logs...</p>
      </div>
    </div>

    <div *ngIf="!loading || logs.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Home</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/notifications" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Notifications</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Delivery Logs</span>
      </div>

      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Delivery Logs</h1>
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">View detailed delivery logs for all notifications</p>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <input type="number" [(ngModel)]="filterNotificationId" (keyup.enter)="loadLogs()" placeholder="Filter by notification ID"
            style="padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; min-width: 180px; transition: all 0.2s ease; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="filterProvider" (keyup.enter)="loadLogs()" placeholder="e.g. firebase, twilio"
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <select [(ngModel)]="filterStatus" (change)="loadLogs()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option value="">All Statuses</option>
            <option *ngFor="let s of deliveryStatuses" [ngValue]="s.value">{{ s.label }}</option>
          </select>
          <button (click)="resetFilters()"
            style="padding: 9px 16px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4';this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white';this.style.color='#374151'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">refresh</span> Reset
          </button>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && logs.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && logs.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No delivery logs found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">Try adjusting your search or filter criteria</p>
        </div>

        <div *ngIf="!loading && logs.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 60px;">ID</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Notification ID</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Provider</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Provider Msg ID</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Sent At</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of logs; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 12px;"><span style="font-size: 13px; color: #374151;">{{ row.id }}</span></td>
                <td style="padding: 12px 12px;"><span style="font-size: 13px; font-weight: 600; color: #059669;">#{{ row.notification_id }}</span></td>
                <td style="padding: 12px 12px;"><span style="font-size: 13px; color: #374151;">{{ row.provider }}</span></td>
                <td style="padding: 12px 12px;"><span style="font-size: 12px; color: #6b7280; font-family: monospace;">{{ row.provider_message_id || '—' }}</span></td>
                <td style="padding: 12px 12px;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBadgeStyle(row.status).background" [style.color]="getStatusBadgeStyle(row.status).color">
                    {{ getStatusLabel(row.status) }}
                  </span>
                </td>
                <td style="padding: 12px 12px;"><span style="font-size: 12px; color: #9ca3af;">{{ row.sent_at ? (row.sent_at | date:'dd MMM yyyy, hh:mm a') : '—' }}</span></td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewPayload(row.request_payload, 'Request Payload')"
                      style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #059669; transition: all 0.15s ease; line-height: 0;"
                      onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px;">upload</span>
                    </button>
                    <button (click)="viewPayload(row.response_payload, 'Response Payload')"
                      style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #6b7280; transition: all 0.15s ease; line-height: 0;"
                      onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px;">download</span>
                    </button>
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
    </style>
  `,
})
export class NotificationLogListComponent implements OnInit {
  private notificationApi = inject(NotificationApiService);

  logs: NotificationLog[] = [];
  loading = false;
  filterNotificationId: number | null = null;
  filterProvider = '';
  filterStatus = '';
  currentPage = 1;
  pageSize = 15;
  totalItems = 0;

  deliveryStatuses = DELIVERY_STATUSES;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: String(this.currentPage),
      per_page: String(this.pageSize),
    };
    if (this.filterNotificationId) params['notification_id'] = String(this.filterNotificationId);
    if (this.filterProvider) params['provider'] = this.filterProvider;
    if (this.filterStatus) params['status'] = this.filterStatus;

    this.notificationApi.getNotificationLogs(params).subscribe({
      next: (res) => {
        this.logs = res.data ?? [];
        this.totalItems = (res as any).meta?.total ?? this.logs.length;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  getRangeLabel(): string {
    if (this.totalItems === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}\u2013${end} of ${this.totalItems}`;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadLogs();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadLogs();
  }

  resetFilters(): void {
    this.filterNotificationId = null;
    this.filterProvider = '';
    this.filterStatus = '';
    this.currentPage = 1;
    this.loadLogs();
  }

  viewPayload(payload: any, title: string): void {
    alert(`${title}:\n\n${JSON.stringify(payload, null, 2)}`);
  }

  getStatusLabel(status: string): string {
    const found = DELIVERY_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getStatusBadgeStyle(status: string): any {
    const styles: Record<string, any> = {
      pending: { background: '#f3f4f6', color: '#6b7280' },
      queued: { background: '#dbeafe', color: '#1d4ed8' },
      sent: { background: '#e0e7ff', color: '#4338ca' },
      delivered: { background: '#d1fae5', color: '#047857' },
      read: { background: '#ede9fe', color: '#6d28d9' },
      failed: { background: '#fee2e2', color: '#b91c1c' },
      cancelled: { background: '#f3f4f6', color: '#6b7280' },
    };
    return styles[status] || { background: '#f3f4f6', color: '#6b7280' };
  }
}
