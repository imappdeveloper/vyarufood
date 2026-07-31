import { Component, inject, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartStateService } from '../../../../../core/services/cart-state.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="background: white; border-radius: 0.75rem; border: 1px solid #f1f5f9; padding: 1.25rem;">
      <h3 style="font-weight: 600; color: #111827; margin: 0 0 1rem; font-size: 1rem;">Order Summary</h3>

      @if (cartState.cart() && cartState.hasItems()) {
        <!-- Subtotal -->
        <div style="display: flex; justify-content: space-between; color: #4b5563; font-size: 0.85rem; margin-bottom: 0.75rem;">
          <span>Subtotal ({{ cartState.itemCount() }} items)</span>
          <span>&#8377;{{ cartState.subtotal() | number:'1.2-2' }}</span>
        </div>

        <!-- Meal Discount -->
        @if (cartState.discountAmount() > 0) {
          <div style="display: flex; justify-content: space-between; color: #16a34a; font-size: 0.85rem; margin-bottom: 0.75rem;">
            <span>Meal Discount</span>
            <span>-&#8377;{{ cartState.discountAmount() | number:'1.2-2' }}</span>
          </div>
        }

        <!-- Coupon Discount -->
        @if (cartState.couponAmount() > 0) {
          <div style="display: flex; justify-content: space-between; color: #16a34a; font-size: 0.85rem; margin-bottom: 0.75rem;">
            <span style="display: flex; align-items: center; gap: 0.25rem;">
              <span class="material-icons" style="font-size: 0.85rem;">local_offer</span>
              Coupon ({{ cartState.couponCode() }})
            </span>
            <span>-&#8377;{{ cartState.couponAmount() | number:'1.2-2' }}</span>
          </div>
        }

        <!-- Wallet -->
        @if (cartState.walletAmount() > 0) {
          <div style="display: flex; justify-content: space-between; color: #2563eb; font-size: 0.85rem; margin-bottom: 0.75rem;">
            <span style="display: flex; align-items: center; gap: 0.25rem;">
              <span class="material-icons" style="font-size: 0.85rem;">account_balance_wallet</span>
              Wallet
            </span>
            <span>-&#8377;{{ cartState.walletAmount() | number:'1.2-2' }}</span>
          </div>
        }

        <!-- Tax -->
        @if (cartState.taxAmount() > 0) {
          <div style="display: flex; justify-content: space-between; color: #4b5563; font-size: 0.85rem; margin-bottom: 0.75rem;">
            <span>Tax ({{ cartState.taxPercentage() }}%)</span>
            <span>&#8377;{{ cartState.taxAmount() | number:'1.2-2' }}</span>
          </div>
        }

        <!-- Delivery Charge -->
        @if (cartState.deliveryCharge() > 0) {
          <div style="display: flex; justify-content: space-between; color: #4b5563; font-size: 0.85rem; margin-bottom: 0.75rem;">
            <span>Delivery Charge</span>
            <span>&#8377;{{ cartState.deliveryCharge() | number:'1.2-2' }}</span>
          </div>
        } @else {
          <div style="display: flex; justify-content: space-between; color: #16a34a; font-size: 0.85rem; margin-bottom: 0.75rem;">
            <span>Delivery</span>
            <span style="font-weight: 500;">Free</span>
          </div>
        }

        <!-- Divider + Total -->
        <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; margin-top: 0.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 1rem; font-weight: 700; color: #111827;">
            <span>Total</span>
            <span>&#8377;{{ cartState.totalAmount() | number:'1.2-2' }}</span>
          </div>
        </div>

        <!-- Savings -->
        @if (cartState.discountAmount() + cartState.couponAmount() + cartState.walletAmount() > 0) {
          <div style="background: linear-gradient(135deg, #d1fae5, #ecfdf5); border: 1px solid #a7f3d0; border-radius: 0.5rem; padding: 0.6rem; text-align: center; margin-top: 0.75rem;">
            <span style="font-size: 0.8rem; color: #065f46;">
              You're saving <strong>&#8377;{{ (cartState.discountAmount() + cartState.couponAmount() + cartState.walletAmount()) | number:'1.2-2' }}</strong> on this order!
            </span>
          </div>
        }

        <!-- Checkout Button -->
        <button (click)="onCheckout.emit()"
          [disabled]="cartState.hasUnavailableItems() || cartState.updating()"
          style="width: 100%; margin-top: 1.25rem; padding: 0.75rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 600; font-size: 0.9rem; border-radius: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);"
          onmouseover="this.style.background='linear-gradient(135deg, #047857, #059669)'; this.style.boxShadow='0 6px 16px rgba(5, 150, 105, 0.4)'"
          onmouseout="this.style.background='linear-gradient(135deg, #059669, #10b981)'; this.style.boxShadow='0 4px 12px rgba(5, 150, 105, 0.3)'">
          <span class="material-icons" style="font-size: 1.15rem;">shopping_bag</span>
          Proceed to Checkout
        </button>

        @if (cartState.hasUnavailableItems()) {
          <p style="margin-top: 0.5rem; font-size: 0.7rem; color: #ef4444; text-align: center;">
            Some items are unavailable. Please remove them before checkout.
          </p>
        }

        <!-- Security Notice -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.35rem; margin-top: 0.75rem; font-size: 0.7rem; color: #9ca3af;">
          <span class="material-icons" style="font-size: 0.85rem;">lock</span>
          Secure checkout powered by SSL encryption
        </div>
      } @else {
        <p style="font-size: 0.85rem; color: #9ca3af; text-align: center; padding: 1rem 0;">Add items to see order summary</p>
      }
    </div>
  `,
})
export class OrderSummaryComponent {
  cartState = inject(CartStateService);
  @Output() onCheckout = new EventEmitter<void>();
}
