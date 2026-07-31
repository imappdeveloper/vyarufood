import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-method-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.625rem;">
      @for (method of methods; track method.value) {
        <div (click)="selectMethod(method.value)"
          style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.875rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.875rem; transition: all 0.2s;"
          [style.border-color]="selectedMethod === method.value ? '#059669' : '#e5e7eb'"
          [style.background]="selectedMethod === method.value ? '#f0fdf4' : 'white'"
          [style.boxShadow]="selectedMethod === method.value ? '0 0 0 3px rgba(5,150,105,0.08)' : 'none'"
          [style.opacity]="method.value === 'wallet' && walletBalance <= 0 ? '0.5' : '1'"
          [style.pointer-events]="method.value === 'wallet' && walletBalance <= 0 ? 'none' : 'auto'"
          onmouseover="if(this.style.borderColor!=='#059669'){this.style.borderColor='#d1d5db'}"
          onmouseout="if(this.style.borderColor==='#d1d5db'){this.style.borderColor='#e5e7eb'}">
          <!-- Radio -->
          <div style="flex-shrink: 0;">
            <div style="width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"
              [style.border]="selectedMethod === method.value ? '2px solid #059669' : '2px solid #d1d5db'">
              @if (selectedMethod === method.value) {
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #059669;"></div>
              }
            </div>
          </div>

          <!-- Icon -->
          <div style="width: 40px; height: 40px; border-radius: 0.625rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
            [style.background]="selectedMethod === method.value ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : '#f3f4f6'">
            <span class="material-icons" [style.color]="selectedMethod === method.value ? '#059669' : '#6b7280'" style="font-size: 1.25rem;">{{ method.icon }}</span>
          </div>

          <!-- Text -->
          <div style="flex: 1;">
            <p style="font-size: 0.85rem; font-weight: 600; color: #1e293b; margin: 0;">{{ method.label }}</p>
            <p style="font-size: 0.72rem; color: #6b7280; margin: 0.15rem 0 0;">{{ method.description }}</p>
          </div>

          <!-- Wallet balance -->
          @if (method.value === 'wallet') {
            <div style="text-align: right; flex-shrink: 0;">
              <p style="font-size: 0.85rem; font-weight: 700; color: #059669; margin: 0;">&#8377;{{ walletBalance.toFixed(2) }}</p>
              @if (walletBalance < orderTotal && walletBalance > 0) {
                <p style="font-size: 0.68rem; color: #d97706; margin: 0.15rem 0 0;">Partial ({{ ((walletBalance / orderTotal) * 100).toFixed(0) }}%)</p>
              } @else if (walletBalance <= 0) {
                <p style="font-size: 0.68rem; color: #ef4444; margin: 0.15rem 0 0;">No balance</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PaymentMethodSelectorComponent {
  @Input() selectedMethod = 'upi';
  @Input() walletBalance = 0;
  @Input() orderTotal = 0;
  @Output() methodSelected = new EventEmitter<string>();

  methods = [
    { value: 'upi', label: 'UPI', icon: 'qr_code', description: 'Pay via Google Pay, PhonePe, Paytm, etc.' },
    { value: 'wallet', label: 'Wallet Balance', icon: 'account_balance_wallet', description: 'Use your VyaruFood wallet balance' },
    { value: 'cod', label: 'Cash on Delivery', icon: 'payments', description: 'Pay when your order arrives' },
  ];

  selectMethod(value: string): void {
    if (value === 'wallet' && this.walletBalance <= 0) return;
    this.methodSelected.emit(value);
  }
}
