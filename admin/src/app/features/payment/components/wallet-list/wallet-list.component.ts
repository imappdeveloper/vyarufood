import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { Wallet, WALLET_STATUSES } from '../../../../core/models/payment/payment.model';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">

      <div *ngIf="loading && wallets.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af;">Loading wallets...</p>
        </div>
      </div>

      <div *ngIf="!loading || wallets.length > 0">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <a routerLink="/admin/payment" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Payment & Wallet</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <span style="font-size: 12px; color: #374151; font-weight: 600;">Wallets</span>
        </div>

        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Wallets</h1>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage customer wallets and balance operations</p>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="position: relative;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadWallets()" placeholder="Search wallets..."
                style="width: 100%; padding: 9px 36px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              <button *ngIf="searchTerm" (click)="searchTerm = ''; loadWallets()"
                style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
              </button>
            </div>
            <select [(ngModel)]="filterStatus" (change)="loadWallets()"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; min-width: 0; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Statuses</option>
              <option *ngFor="let s of walletStatuses" [value]="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div *ngIf="loading && wallets.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
            <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>

          <div *ngIf="!loading && wallets.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">account_balance_wallet</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No wallets found</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">Try adjusting your search or filter criteria</p>
          </div>

          <div *ngIf="!loading && wallets.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Wallet #</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Customer ID</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Balance</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Blocked</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total Credit</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total Debit</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Created</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of wallets; let i = index" [attr.data-idx]="i"
                  style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 16px;">
                    <a [routerLink]="['/admin/payment/wallets', row.uuid]" style="font-size: 13px; font-weight: 600; color: #047857; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ row.wallet_number }}</a>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #374151;">#{{ row.customer_id }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">₹{{ row.current_balance }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #d97706;">₹{{ row.blocked_balance }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #059669;">₹{{ row.total_credit }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #dc2626;">₹{{ row.total_debit }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getStatusBadgeStyles(row.status)">{{ getStatusLabel(row.status) }}</span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px;">
                    <span style="font-size: 13px; color: #9ca3af;">{{ row.created_at | date:'dd MMM yyyy' }}</span>
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
export class WalletListComponent implements OnInit {
  private paymentApi = inject(PaymentApiService);
  private router = inject(Router);

  wallets: Wallet[] = [];
  loading = false;
  searchTerm = '';
  filterStatus = '';
  currentPage = 1;
  pageSize = 15;
  totalItems = 0;

  displayedColumns = ['wallet_number', 'customer_id', 'current_balance', 'blocked_balance', 'total_credit', 'total_debit', 'status', 'created_at'];
  walletStatuses = WALLET_STATUSES;

  ngOnInit(): void {
    this.loadWallets();
  }

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }

  loadWallets(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: String(this.currentPage),
      per_page: String(this.pageSize),
    };
    if (this.searchTerm) params['search'] = this.searchTerm;
    if (this.filterStatus) params['status'] = this.filterStatus;

    this.paymentApi.getWallets(params).subscribe({
      next: (res) => {
        this.wallets = res.data ?? [];
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadWallets();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadWallets();
  }

  getRangeLabel(): string {
    if (this.totalItems === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}\u2013${end} of ${this.totalItems}`;
  }

  getStatusLabel(status: string): string {
    const found = WALLET_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getStatusBadgeClass(status: string): string {
    const found = WALLET_STATUSES.find(s => s.value === status);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  }

  getStatusBadgeStyles(status: string): { background: string; color: string } {
    const colors: Record<string, { background: string; color: string }> = {
      'bg-amber-100 text-amber-800': { background: '#fef3c7', color: '#92400e' },
      'bg-blue-100 text-blue-800': { background: '#dbeafe', color: '#1e40af' },
      'bg-emerald-100 text-emerald-800': { background: '#d1fae5', color: '#065f46' },
      'bg-red-100 text-red-800': { background: '#fee2e2', color: '#991b1b' },
      'bg-gray-100 text-gray-800': { background: '#f3f4f6', color: '#374151' },
    };
    const found = WALLET_STATUSES.find(s => s.value === status);
    return colors[found?.color ?? ''] ?? { background: '#f3f4f6', color: '#374151' };
  }
}
