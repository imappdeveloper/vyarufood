import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  PaymentTransaction, PaymentRefund, PAYMENT_STATUSES, REFUND_STATUSES
} from '../../../../core/models/payment/payment.model';

@Component({
  selector: 'app-payment-transaction-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading transaction details...</p>
      </div>
    </div>

    <div *ngIf="!loading && transaction" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/payment/transactions" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Transactions
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">Transaction Detail</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getStatusBadgeStyles(transaction.status)">{{ getStatusLabel(transaction.status) }}</span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ transaction.transaction_number }} &bull; {{ transaction.gateway_name }}</p>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">payments</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Amount</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ transaction.currency === 'INR' ? '₹' : '' }}{{ transaction.amount }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #0284c7;">percent</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Gateway Fee</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ transaction.gateway_fee }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #ede9fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #7c3aed;">receipt</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Tax Amount</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ transaction.tax_amount }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px;" [style.color]="transaction.webhook_verified ? '#059669' : '#9ca3af'">{{ transaction.webhook_verified ? 'verified' : 'help_outline' }}</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Webhook Verified</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ transaction.webhook_verified ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; margin-bottom: 24px;">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 18px; color: #047857;">receipt_long</span>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Payment Information</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Transaction Number</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.transaction_number }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Status</p>
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getStatusBadgeStyles(transaction.status)">{{ getStatusLabel(transaction.status) }}</span>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Gateway</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ transaction.gateway_name }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Gateway Transaction ID</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.gateway_transaction_id || '—' }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Gateway Order ID</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.gateway_order_id || '—' }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Payment Type</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ transaction.payment_type }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Payment Method</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ transaction.payment_method }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Currency</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.currency }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Amount</p>
                <p style="font-size: 18px; font-weight: 800; color: #1f2937; margin: 0;">{{ transaction.currency === 'INR' ? '₹' : '' }}{{ transaction.amount }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Gateway Fee</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.gateway_fee }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Tax Amount</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.tax_amount }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Webhook Verified</p>
                <p style="font-size: 14px; font-weight: 600;" [style.color]="transaction.webhook_verified ? '#059669' : '#9ca3af'">{{ transaction.webhook_verified ? 'Yes' : 'No' }}</p>
              </div>
            </div>
            <div *ngIf="transaction.failure_reason" style="grid-column: 1 / -1; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; margin-top: 20px;">
              <p style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Failure Reason</p>
              <p style="font-size: 13px; color: #b91c1c; margin: 0;">{{ transaction.failure_reason }}</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">link</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Related Info</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Customer ID</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.customer_id }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Order ID</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.order_id || '—' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Subscription ID</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.subscription_id || '—' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Payment Date</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.payment_date ? (transaction.payment_date | date:'dd MMM yyyy, hh:mm a') : '—' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.created_at | date:'dd MMM yyyy, hh:mm a' }}</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ transaction.updated_at | date:'dd MMM yyyy, hh:mm a' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="display: flex; align-items: center; gap: 8px; padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <span class="material-icons" style="font-size: 18px; color: #047857;">replay</span>
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Refunds</h2>
          </div>
          <div *ngIf="!transaction.refunds || transaction.refunds.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">replay</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No refunds</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">No refunds have been processed for this transaction</p>
          </div>
          <div *ngIf="transaction.refunds && transaction.refunds.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Refund #</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Reason</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of transaction.refunds; let i = index" [attr.data-idx]="i"
                  style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 16px;">
                    <span style="font-size: 13px; font-weight: 600; color: #047857;">{{ row.refund_number }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">₹{{ row.refund_amount }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #374151;">{{ row.refund_reason }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getRefundStatusBadgeStyles(row.status)">{{ getRefundStatusLabel(row.status) }}</span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px;">
                    <span style="font-size: 13px; color: #9ca3af;">{{ row.created_at | date:'dd MMM yyyy, hh:mm a' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class PaymentTransactionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentApi = inject(PaymentApiService);
  private notification = inject(NotificationService);

  transaction: PaymentTransaction | null = null;
  loading = false;
  refundColumns = ['refund_number', 'refund_amount', 'refund_reason', 'status', 'created_at'];

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadTransaction(uuid);
    }
  }

  loadTransaction(uuid: string): void {
    this.loading = true;
    this.paymentApi.getPayment(uuid).subscribe({
      next: (res) => {
        this.transaction = res.data!;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load transaction');
      },
    });
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

  getRefundStatusLabel(status: string): string {
    const found = REFUND_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getRefundStatusBadgeClass(status: string): string {
    const found = REFUND_STATUSES.find(s => s.value === status);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  }

  getRefundStatusBadgeStyles(status: string): { background: string; color: string } {
    const colors: Record<string, { background: string; color: string }> = {
      'bg-amber-100 text-amber-800': { background: '#fef3c7', color: '#92400e' },
      'bg-blue-100 text-blue-800': { background: '#dbeafe', color: '#1e40af' },
      'bg-emerald-100 text-emerald-800': { background: '#d1fae5', color: '#065f46' },
      'bg-red-100 text-red-800': { background: '#fee2e2', color: '#991b1b' },
      'bg-gray-100 text-gray-800': { background: '#f3f4f6', color: '#374151' },
    };
    const found = REFUND_STATUSES.find(s => s.value === status);
    return colors[found?.color ?? ''] ?? { background: '#f3f4f6', color: '#374151' };
  }
}
