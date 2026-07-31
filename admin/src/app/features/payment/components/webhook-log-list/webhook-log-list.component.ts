import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import {
  PaymentWebhookLog, GATEWAY_NAMES, WEBHOOK_VERIFICATION_STATUSES
} from '../../../../core/models/payment/payment.model';

@Component({
  selector: 'app-webhook-log-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">

      <div *ngIf="loading && webhookLogs.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af;">Loading webhook logs...</p>
        </div>
      </div>

      <div *ngIf="!loading || webhookLogs.length > 0">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <a routerLink="/admin/payment" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Payment & Wallet</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <span style="font-size: 12px; color: #374151; font-weight: 600;">Webhook Logs</span>
        </div>

        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Webhook Logs</h1>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">View all incoming webhook events from payment gateways</p>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="position: relative;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadWebhookLogs()" placeholder="Search webhooks..."
                style="width: 100%; padding: 9px 36px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              <button *ngIf="searchTerm" (click)="searchTerm = ''; loadWebhookLogs()"
                style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
              </button>
            </div>
            <select [(ngModel)]="filterGateway" (change)="loadWebhookLogs()"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; min-width: 0; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Gateways</option>
              <option *ngFor="let g of gatewayNames" [value]="g.value">{{ g.label }}</option>
            </select>
            <div style="position: relative;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">bolt</span>
              <input type="text" [(ngModel)]="filterEvent" (keyup.enter)="loadWebhookLogs()" placeholder="e.g. payment.captured"
                style="width: 100%; padding: 9px 36px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              <button *ngIf="filterEvent" (click)="filterEvent = ''; loadWebhookLogs()"
                style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
              </button>
            </div>
            <select [(ngModel)]="filterVerification" (change)="loadWebhookLogs()"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; min-width: 0; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Statuses</option>
              <option *ngFor="let s of verificationStatuses" [value]="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div *ngIf="loading && webhookLogs.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
            <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>

          <div *ngIf="!loading && webhookLogs.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">webhook</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No webhook logs found</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">Try adjusting your search or filter criteria</p>
          </div>

          <div *ngIf="!loading && webhookLogs.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Gateway</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Event</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Verification</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Signature</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Processed</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Received</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Payload</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of webhookLogs; let i = index" [attr.data-idx]="i"
                  style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 16px;">
                    <span style="font-size: 13px; color: #374151; text-transform: capitalize;">{{ row.gateway_name }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; font-weight: 600; color: #047857;">{{ row.event_name }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getVerificationBadgeStyles(row.verification_status)">{{ getVerificationLabel(row.verification_status) }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 12px; color: #6b7280; font-family: monospace; display: inline-block; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom;"
                      [title]="row.signature || '—'">{{ row.signature ? (row.signature | slice:0:20) + '...' : '—' }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span *ngIf="row.processed_at" style="font-size: 13px; color: #6b7280;">{{ row.processed_at | date:'dd MMM yyyy, hh:mm a' }}</span>
                    <span *ngIf="!row.processed_at" style="font-size: 13px; color: #9ca3af;">Not processed</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #6b7280;">{{ row.created_at | date:'dd MMM yyyy, hh:mm a' }}</span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px; text-align: right;">
                    <button (click)="viewPayload(row)"
                      style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #059669; line-height: 0; display: inline-flex; transition: all 0.15s ease;"
                      onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background=''" [title]="'View payload for ' + row.event_name">
                      <span class="material-icons" style="font-size: 18px;">visibility</span>
                    </button>
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
                <select (change)="onPerPageChange($event)"
                  style="padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;"
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
    </div>

    <div *ngIf="selectedLog" (click)="selectedLog = null"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(17, 24, 39, 0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease-out;">
      <div (click)="$event.stopPropagation()" style="background: white; border-radius: 16px; width: 100%; max-width: 720px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25); animation: fadeIn 0.25s ease-out;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
          <div>
            <h3 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0;">{{ selectedLog.event_name }}</h3>
            <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0; text-transform: capitalize;">{{ selectedLog.gateway_name }} &middot; {{ selectedLog.created_at | date:'dd MMM yyyy, hh:mm a' }}</p>
          </div>
          <button (click)="selectedLog = null" style="background: #f3f4f6; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #6b7280; line-height: 0; display: inline-flex; transition: all 0.15s ease;"
            onmouseover="this.style.background='#fee2e2';this.style.color='#dc2626'" onmouseout="this.style.background='#f3f4f6';this.style.color='#6b7280'">
            <span class="material-icons" style="font-size: 18px;">close</span>
          </button>
        </div>
        <div style="flex: 1; overflow: auto; padding: 20px; background: #f9fafb;">
          <pre style="margin: 0; font-size: 12px; line-height: 1.6; color: #374151; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; white-space: pre-wrap; word-break: break-all;">{{ selectedLog.payload | json }}</pre>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid #f3f4f6;">
          <button (click)="selectedLog = null" style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 10px; background: white; cursor: pointer; font-size: 13px; font-weight: 600; color: #374151; transition: all 0.15s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">Close</button>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class WebhookLogListComponent implements OnInit {
  private paymentApi = inject(PaymentApiService);

  webhookLogs: PaymentWebhookLog[] = [];
  loading = false;
  searchTerm = '';
  filterGateway = '';
  filterEvent = '';
  filterVerification = '';
  currentPage = 1;
  pageSize = 15;
  totalItems = 0;
  selectedLog: PaymentWebhookLog | null = null;

  gatewayNames = GATEWAY_NAMES;
  verificationStatuses = WEBHOOK_VERIFICATION_STATUSES;

  ngOnInit(): void {
    this.loadWebhookLogs();
  }

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }

  loadWebhookLogs(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: String(this.currentPage),
      per_page: String(this.pageSize),
    };
    if (this.searchTerm) params['search'] = this.searchTerm;
    if (this.filterGateway) params['gateway_name'] = this.filterGateway;
    if (this.filterEvent) params['event_name'] = this.filterEvent;
    if (this.filterVerification) params['verification_status'] = this.filterVerification;

    this.paymentApi.getWebhookLogs(params).subscribe({
      next: (res) => {
        this.webhookLogs = res.data ?? [];
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadWebhookLogs();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadWebhookLogs();
  }

  getRangeLabel(): string {
    if (this.totalItems === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}\u2013${end} of ${this.totalItems}`;
  }

  viewPayload(log: PaymentWebhookLog): void {
    this.selectedLog = log;
  }

  getVerificationLabel(status: string): string {
    const found = WEBHOOK_VERIFICATION_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getVerificationBadgeStyles(status: string): { background: string; color: string } {
    const colors: Record<string, { background: string; color: string }> = {
      'bg-amber-100 text-amber-800': { background: '#fef3c7', color: '#92400e' },
      'bg-blue-100 text-blue-800': { background: '#dbeafe', color: '#1e40af' },
      'bg-emerald-100 text-emerald-800': { background: '#d1fae5', color: '#065f46' },
      'bg-red-100 text-red-800': { background: '#fee2e2', color: '#991b1b' },
      'bg-gray-100 text-gray-800': { background: '#f3f4f6', color: '#374151' },
    };
    const found = WEBHOOK_VERIFICATION_STATUSES.find(s => s.value === status);
    return colors[found?.color ?? ''] ?? { background: '#f3f4f6', color: '#374151' };
  }
}
