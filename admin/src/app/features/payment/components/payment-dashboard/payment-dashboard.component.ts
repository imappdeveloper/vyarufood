import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { PaymentDashboardStats, PaymentTransaction, RevenueSummary, PAYMENT_STATUSES } from '../../../../core/models/payment/payment.model';

@Component({
  selector: 'app-payment-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">

      <div *ngIf="loading && stats === null" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af;">Loading payment dashboard...</p>
        </div>
      </div>

      <div *ngIf="!loading || stats !== null">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <span style="font-size: 12px; color: #374151; font-weight: 600;">Payment Dashboard</span>
        </div>

        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Payment & Wallet Dashboard</h1>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">Overview of payments, refunds, and wallet activity</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">payments</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Payments</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total_payments || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Successful</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.successful || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">pending</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Pending</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.pending || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #dc2626;">error</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Failed</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.failed || 0 }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">account_balance_wallet</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Amount</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ formatCurrency(stats?.total_amount || 0) }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #0284c7;">today</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Today's Payments</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.today_count || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #ede9fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #7c3aed;">trending_up</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Refunded</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.refunded || 0 }}</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 16px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 16px 0;">Quick Actions</h2>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
            <button (click)="navigateTo('/payment/transactions')"
              style="padding: 16px 12px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4';this.style.color='#047857'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#f9fafb';this.style.color='#374151'">
              <span class="material-icons" style="font-size: 24px; color: #059669;">receipt_long</span>
              <span>Transactions</span>
            </button>
            <button (click)="navigateTo('/payment/refunds')"
              style="padding: 16px 12px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4';this.style.color='#047857'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#f9fafb';this.style.color='#374151'">
              <span class="material-icons" style="font-size: 24px; color: #059669;">replay</span>
              <span>Refunds</span>
            </button>
            <button (click)="navigateTo('/payment/wallets')"
              style="padding: 16px 12px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4';this.style.color='#047857'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#f9fafb';this.style.color='#374151'">
              <span class="material-icons" style="font-size: 24px; color: #059669;">account_balance_wallet</span>
              <span>Wallets</span>
            </button>
            <button (click)="navigateTo('/payment/webhook-logs')"
              style="padding: 16px 12px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4';this.style.color='#047857'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#f9fafb';this.style.color='#374151'">
              <span class="material-icons" style="font-size: 24px; color: #059669;">web</span>
              <span>Webhook Logs</span>
            </button>
            <button (click)="navigateTo('/payment/refunds/create')"
              style="padding: 16px 12px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4';this.style.color='#047857'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#f9fafb';this.style.color='#374151'">
              <span class="material-icons" style="font-size: 24px; color: #059669;">add_circle</span>
              <span>Create Refund</span>
            </button>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <span class="material-icons" style="font-size: 18px; color: #047857;">receipt_long</span>
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Recent Transactions</h2>
          </div>
          <div *ngIf="recentTransactions.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No recent transactions</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">Transactions will appear here as they are processed</p>
          </div>
          <div *ngIf="recentTransactions.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Txn #</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Gateway</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of recentTransactions; let i = index" [attr.data-idx]="i"
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
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.currency === 'INR' ? '₹' : row.currency }}{{ row.amount }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getStatusBadgeStyles(row.status)">{{ getStatusLabel(row.status) }}</span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px;">
                    <span style="font-size: 13px; color: #9ca3af;">{{ row.created_at | date:'dd MMM yyyy, hh:mm a' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 16px 0;">Revenue Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <div style="background: #d1fae5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px;">
              <p style="font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Total Revenue</p>
              <p style="font-size: 20px; font-weight: 800; color: #064e3b; margin: 0;">{{ formatCurrency(revenue?.total_revenue || 0) }}</p>
            </div>
            <div *ngFor="let gw of revenue?.by_gateway || []" style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 16px;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0; text-transform: capitalize;">{{ gw.gateway }}</p>
              <p style="font-size: 20px; font-weight: 800; color: #1f2937; margin: 0;">{{ formatCurrency(gw.total || 0) }}</p>
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
export class PaymentDashboardComponent implements OnInit {
  private paymentApi = inject(PaymentApiService);
  private router = inject(Router);

  stats: PaymentDashboardStats | null = null;
  revenue: RevenueSummary | null = null;
  recentTransactions: PaymentTransaction[] = [];
  loading = false;

  recentColumns = ['transaction_number', 'gateway_name', 'payment_type', 'amount', 'status', 'created_at'];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.paymentApi.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res.data!;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
    this.paymentApi.getRevenueSummary().subscribe({
      next: (res) => { this.revenue = res.data!; },
    });
    this.paymentApi.getPayments({ per_page: '5', sort: 'created_at', order: 'desc' }).subscribe({
      next: (res) => { this.recentTransactions = res.data ?? []; },
    });
  }

  navigateTo(path: string): void {
    this.router.navigate(['/admin' + path]);
  }

  formatCurrency(value: number): string {
    return '₹' + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
