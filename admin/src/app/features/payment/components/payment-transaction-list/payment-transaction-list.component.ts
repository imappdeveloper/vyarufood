import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  PaymentTransaction, PAYMENT_STATUSES, GATEWAY_NAMES, PAYMENT_TYPES, PAYMENT_METHODS
} from '../../../../core/models/payment/payment.model';

@Component({
  selector: 'app-payment-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">

      <div *ngIf="loading && transactions.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af;">Loading transactions...</p>
        </div>
      </div>

      <div *ngIf="!loading || transactions.length > 0">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <a routerLink="/admin/payment" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Payment & Wallet</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <span style="font-size: 12px; color: #374151; font-weight: 600;">Transactions</span>
        </div>

        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Payment Transactions</h1>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">View and manage all payment transactions</p>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="position: relative;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadPayments()" placeholder="Search transactions..."
                style="width: 100%; padding: 9px 36px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              <button *ngIf="searchTerm" (click)="searchTerm = ''; loadPayments()"
                style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
              </button>
            </div>
            <select [(ngModel)]="filterGateway" (change)="loadPayments()"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; min-width: 0; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Gateways</option>
              <option *ngFor="let g of gatewayNames" [value]="g.value">{{ g.label }}</option>
            </select>
            <select [(ngModel)]="filterStatus" (change)="loadPayments()"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; min-width: 0; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Statuses</option>
              <option *ngFor="let s of paymentStatuses" [value]="s.value">{{ s.label }}</option>
            </select>
            <select [(ngModel)]="filterType" (change)="loadPayments()"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; min-width: 0; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Types</option>
              <option *ngFor="let t of paymentTypes" [value]="t.value">{{ t.label }}</option>
            </select>
            <input type="date" [value]="filterFromDate ? (filterFromDate | date:'yyyy-MM-dd') : ''" (change)="onFromDateChange($event)"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; min-width: 0; transition: all 0.2s ease; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''" />
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div *ngIf="loading && transactions.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
            <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>

          <div *ngIf="!loading && transactions.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No transactions found</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">Try adjusting your search or filter criteria</p>
          </div>

          <div *ngIf="!loading && transactions.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Txn #</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Gateway</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Method</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Webhook</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of transactions; let i = index" [attr.data-idx]="i"
                  style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 16px;">
                    <a [routerLink]="['/admin/payment/transactions', row.uuid]" style="font-size: 13px; font-weight: 600; color: #047857; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ row.transaction_number }}</a>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #374151; text-transform: capitalize;">{{ row.gateway_name }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #374151; text-transform: capitalize;">{{ row.payment_type }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #374151; text-transform: capitalize;">{{ row.payment_method }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.currency === 'INR' ? '₹' : row.currency }}{{ row.amount }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getStatusBadgeStyles(row.status)">{{ getStatusLabel(row.status) }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span class="material-icons" style="font-size: 18px; vertical-align: middle;" [style.color]="row.webhook_verified ? '#059669' : '#9ca3af'">{{ row.webhook_verified ? 'verified' : 'help_outline' }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #9ca3af;">{{ row.created_at | date:'dd MMM yyyy, hh:mm a' }}</span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px; text-align: right;">
                    <div style="position: relative;">
                      <button (click)="toggleActionMenu(row); $event.stopPropagation()"
                        style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.15s ease; line-height: 0;"
                        onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">more_vert</span>
                      </button>
                      <div *ngIf="activeActionRow?.uuid === row.uuid" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 180px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                        <button (click)="viewTransaction(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
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

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class PaymentTransactionListComponent implements OnInit {
  private paymentApi = inject(PaymentApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  transactions: PaymentTransaction[] = [];
  activeActionRow: PaymentTransaction | null = null;
  loading = false;
  searchTerm = '';
  filterGateway = '';
  filterStatus = '';
  filterType = '';
  filterFromDate: Date | null = null;
  currentPage = 1;
  pageSize = 15;
  totalItems = 0;

  displayedColumns = ['transaction_number', 'gateway_name', 'payment_type', 'payment_method', 'amount', 'status', 'webhook_verified', 'created_at', 'actions'];
  paymentStatuses = PAYMENT_STATUSES;
  gatewayNames = GATEWAY_NAMES;
  paymentTypes = PAYMENT_TYPES;
  paymentMethods = PAYMENT_METHODS;

  ngOnInit(): void {
    this.loadPayments();
  }

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }

  loadPayments(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: String(this.currentPage),
      per_page: String(this.pageSize),
    };
    if (this.searchTerm) params['search'] = this.searchTerm;
    if (this.filterGateway) params['gateway_name'] = this.filterGateway;
    if (this.filterStatus) params['status'] = this.filterStatus;
    if (this.filterType) params['payment_type'] = this.filterType;
    if (this.filterFromDate) params['from_date'] = this.filterFromDate.toISOString().split('T')[0];

    this.paymentApi.getPayments(params).subscribe({
      next: (res) => {
        this.transactions = res.data ?? [];
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  onFromDateChange(event: any): void {
    const value = event.target?.value as string | undefined;
    this.filterFromDate = value ? new Date(value) : null;
    this.loadPayments();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPayments();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadPayments();
  }

  getRangeLabel(): string {
    if (this.totalItems === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}\u2013${end} of ${this.totalItems}`;
  }

  toggleActionMenu(row: PaymentTransaction | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  viewTransaction(txn: PaymentTransaction): void {
    this.router.navigate(['/admin/payment/transactions', txn.uuid]);
  }

  getStatusLabel(status: string): string {
    const found = PAYMENT_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getStatusBadgeClass(status: string): string {
    const found = PAYMENT_STATUSES.find(s => s.value === status);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  }

  getStatusBadgeStyles(status: string): { background: string; color: string } {
    const colors: Record<string, { background: string; color: string }> = {
      'bg-amber-100 text-amber-800': { background: '#fef3c7', color: '#92400e' },
      'bg-blue-100 text-blue-800': { background: '#dbeafe', color: '#1e40af' },
      'bg-emerald-100 text-emerald-800': { background: '#d1fae5', color: '#065f46' },
      'bg-red-100 text-red-800': { background: '#fee2e2', color: '#991b1b' },
      'bg-gray-100 text-gray-800': { background: '#f3f4f6', color: '#374151' },
      'bg-purple-100 text-purple-800': { background: '#ede9fe', color: '#5b21b6' },
    };
    const found = PAYMENT_STATUSES.find(s => s.value === status);
    return colors[found?.color ?? ''] ?? { background: '#f3f4f6', color: '#374151' };
  }
}
