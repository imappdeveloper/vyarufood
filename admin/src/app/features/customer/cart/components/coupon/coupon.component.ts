import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStateService } from '../../../../../core/services/cart-state.service';

@Component({
  selector: 'app-coupon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="background: white; border-radius: 0.75rem; border: 1px solid #f1f5f9; padding: 1rem; margin-top: 0.75rem;">
      @if (cartState.hasCoupon()) {
        <!-- Applied Coupon -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-icons" style="color: #16a34a; font-size: 1.15rem;">local_offer</span>
            <div>
              <span style="font-size: 0.8rem; font-weight: 500; color: #15803d; background: #f0fdf4; padding: 0.15rem 0.5rem; border-radius: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em;">{{ cartState.couponCode() }}</span>
              <span style="font-size: 0.7rem; color: #16a34a; margin-left: 0.5rem;">applied</span>
            </div>
          </div>
          <button (click)="cartState.removeCoupon()"
            [disabled]="cartState.updating()"
            style="font-size: 0.8rem; color: #ef4444; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.15rem; font-weight: 500; padding: 0.25rem 0.5rem; border-radius: 0.375rem; transition: all 0.2s;"
            onmouseover="this.style.background='#fef2f2'; this.style.color='#dc2626'"
            onmouseout="this.style.background='transparent'; this.style.color='#ef4444'">
            <span class="material-icons" style="font-size: 0.95rem;">close</span> Remove
          </button>
        </div>
      } @else {
        <!-- Coupon Input -->
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="flex: 1; position: relative;">
            <span class="material-icons" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 1.1rem;">local_offer</span>
            <input type="text" [(ngModel)]="couponCode" placeholder="Enter coupon code"
              [disabled]="cartState.updating()"
              (keyup.enter)="applyCoupon()"
              style="width: 100%; padding: 0.6rem 0.75rem 0.6rem 2.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; text-transform: uppercase; letter-spacing: 0.05em;"
              onfocus="this.style.borderColor='#ea580c'; this.style.boxShadow='0 0 0 3px rgba(234,88,12,0.1)'"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'" />
          </div>
          <button (click)="applyCoupon()"
            [disabled]="!couponCode.trim() || cartState.updating()"
            style="padding: 0.6rem 1rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-size: 0.8rem; font-weight: 600; border-radius: 0.5rem; border: none; cursor: pointer; flex-shrink: 0; transition: all 0.2s; display: flex; align-items: center; justify-content: center; min-width: 3.5rem;"
            onmouseover="this.style.background='linear-gradient(135deg, #047857, #059669)'"
            onmouseout="this.style.background='linear-gradient(135deg, #059669, #10b981)'">
            @if (cartState.updating()) {
              <span class="material-icons" style="font-size: 1rem; animation: spin 1s linear infinite;">refresh</span>
            } @else {
              Apply
            }
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class CouponComponent {
  cartState = inject(CartStateService);
  couponCode = '';

  applyCoupon(): void {
    const code = this.couponCode.trim();
    if (code) {
      this.cartState.applyCoupon(code);
      this.couponCode = '';
    }
  }
}
