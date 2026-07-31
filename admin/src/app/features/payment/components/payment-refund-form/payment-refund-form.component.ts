import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PaymentTransaction } from '../../../../core/models/payment/payment.model';

@Component({
  selector: 'app-payment-refund-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/payment/refunds" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Refunds
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">Create Refund</h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Process a new refund for a payment transaction</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <div *ngIf="loadingPayments" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; padding: 60px;">
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af;">Loading payment transactions...</p>
        </div>
      </div>

      <form *ngIf="!loadingPayments" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">replay</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Refund Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Select the transaction and enter refund details</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Select Payment Transaction <span style="color: #dc2626;">*</span></label>
              <select formControlName="payment_transaction_id" (change)="onPaymentSelected()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('payment_transaction_id')?.invalid && form.get('payment_transaction_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="">Choose a payment...</option>
                <option *ngFor="let p of availablePayments" [ngValue]="p.id">{{ p.transaction_number }} - ₹{{ p.amount }} ({{ p.status }})</option>
              </select>
              <p *ngIf="form.get('payment_transaction_id')?.hasError('required') && form.get('payment_transaction_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Payment transaction is required</p>
            </div>

            <div *ngIf="selectedPayment" style="grid-column: 1 / -1; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px;">
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Transaction #</p>
                  <p style="font-size: 13px; font-weight: 700; color: #064e3b; margin: 0;">{{ selectedPayment.transaction_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Amount Paid</p>
                  <p style="font-size: 13px; font-weight: 700; color: #064e3b; margin: 0;">₹{{ selectedPayment.amount }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Gateway</p>
                  <p style="font-size: 13px; font-weight: 700; color: #064e3b; margin: 0; text-transform: capitalize;">{{ selectedPayment.gateway_name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Status</p>
                  <p style="font-size: 13px; font-weight: 700; color: #064e3b; margin: 0; text-transform: capitalize;">{{ selectedPayment.status }}</p>
                </div>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Refund Amount (₹) <span style="color: #dc2626;">*</span></label>
              <input formControlName="refund_amount" type="number" placeholder="0.00" min="0.01" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('refund_amount')?.invalid && form.get('refund_amount')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('refund_amount')?.hasError('required') && form.get('refund_amount')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Refund amount is required</p>
              <p *ngIf="form.get('refund_amount')?.hasError('min') && form.get('refund_amount')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Amount must be greater than 0</p>
            </div>

            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Refund Reason <span style="color: #dc2626;">*</span></label>
              <textarea formControlName="refund_reason" rows="3" placeholder="Enter the reason for refund..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                [style.borderColor]="form.get('refund_reason')?.invalid && form.get('refund_reason')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p *ngIf="form.get('refund_reason')?.hasError('required') && form.get('refund_reason')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Refund reason is required</p>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Fields marked with * are required</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/payment/refunds"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="form.invalid || saving ? '0.5' : '1'"
              [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              Process Refund
            </button>
          </div>
        </div>
      </form>
    </section>

    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class PaymentRefundFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private paymentApi = inject(PaymentApiService);
  private notification = inject(NotificationService);

  form!: FormGroup;
  saving = false;
  loadingPayments = false;
  availablePayments: PaymentTransaction[] = [];
  selectedPayment: PaymentTransaction | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      payment_transaction_id: ['', Validators.required],
      refund_amount: [0, [Validators.required, Validators.min(0.01)]],
      refund_reason: ['', Validators.required],
    });
    this.loadCompletedPayments();
  }

  loadCompletedPayments(): void {
    this.loadingPayments = true;
    this.paymentApi.getPayments({ status: 'completed', per_page: '1000' }).subscribe({
      next: (res) => {
        this.availablePayments = res.data ?? [];
        this.loadingPayments = false;
      },
      error: () => { this.loadingPayments = false; },
    });
  }

  onPaymentSelected(): void {
    const paymentId = this.form.get('payment_transaction_id')?.value;
    this.selectedPayment = this.availablePayments.find(p => p.id === paymentId) || null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    this.paymentApi.processRefund(this.form.value).subscribe({
      next: () => {
        this.notification.success('Refund processed successfully');
        this.router.navigate(['/admin/payment/refunds']);
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to process refund');
      },
    });
  }
}
