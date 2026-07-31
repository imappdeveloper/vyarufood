import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartStateService } from '../../../core/services/cart-state.service';
import { AppStateService } from '../../../core/services/app-state.service';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CouponComponent } from './components/coupon/coupon.component';
import { WalletSectionComponent } from './components/wallet-section/wallet-section.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CartSkeletonComponent } from './components/cart-skeleton/cart-skeleton.component';
import { CartToastComponent } from './components/cart-toast/cart-toast.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
    CartItemComponent, CouponComponent, WalletSectionComponent,
    OrderSummaryComponent, CartSkeletonComponent, CartToastComponent,
  ],
  template: `
    <app-cart-toast />

    <!-- Hero Banner -->
    <div style="background: linear-gradient(135deg, #059669, #10b981, #34d399); padding: 2rem 1rem; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -20px; left: 10%; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 1;">
        <nav style="margin-bottom: 0.75rem;">
          <ol style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; color: rgba(255,255,255,0.7);">
            <li><a routerLink="/" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">Home</a></li>
            <li><span class="material-icons" style="font-size: 0.85rem;">chevron_right</span></li>
            <li style="color: white; font-weight: 600;">Your Cart</li>
          </ol>
        </nav>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h1 style="font-size: 1.75rem; font-weight: 800; color: white; margin: 0;">Your Cart</h1>
            @if (cartState.hasItems()) {
              <p style="color: rgba(255,255,255,0.85); margin: 0.25rem 0 0; font-size: 0.875rem;">
                {{ cartState.itemCount() }} item{{ cartState.itemCount() === 1 ? '' : 's' }} waiting for you
              </p>
            }
          </div>
          @if (cartState.hasItems()) {
            <button (click)="confirmClearCart()"
              style="display: flex; align-items: center; gap: 0.35rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: white; border-radius: 0.75rem; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: background 0.2s;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 1rem;">delete_sweep</span> Clear Cart
            </button>
          }
        </div>
      </div>
    </div>

    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem;">
      <!-- Loading -->
      @if (cartState.loading()) {
        <app-cart-skeleton />

      <!-- Error -->
      } @else if (cartState.error()) {
        <div style="background: white; border-radius: 1.25rem; border: 1px solid #f1f5f9; padding: 3rem; text-align: center;">
          <span class="material-icons" style="font-size: 3.5rem; color: #fca5a5; margin-bottom: 1rem; display: block;">error_outline</span>
          <h2 style="font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">Unable to load your cart</h2>
          <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem;">Please check your connection and try again.</p>
          <button (click)="cartState.loadCart()"
            style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.5rem; background: #059669; color: white; font-weight: 600; border-radius: 0.75rem; border: none; cursor: pointer; font-size: 0.875rem; transition: background 0.2s;"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 1rem;">refresh</span> Retry
          </button>
        </div>

      <!-- Empty Cart -->
      } @else if (cartState.isEmpty()) {
        <div style="background: white; border-radius: 1.25rem; border: 1px solid #f1f5f9; padding: 4rem 2rem; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -40px; right: -40px; width: 150px; height: 150px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 50%; opacity: 0.4;"></div>
          <div style="position: relative; z-index: 1;">
            <div style="width: 100px; height: 100px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 3rem; color: #059669;">shopping_cart</span>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem;">Your cart is empty</h2>
            <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem;">Looks like you haven't added any delicious meals yet!</p>
            <a routerLink="/meals"
              style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 2rem; background: #059669; color: white; font-weight: 600; border-radius: 0.75rem; text-decoration: none; font-size: 0.95rem; transition: background 0.2s;"
              onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
              <span class="material-icons">restaurant_menu</span> Browse Meals
            </a>
          </div>
        </div>

      <!-- Cart with items -->
      } @else {
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;" class="cart-grid">
          <!-- Left: Cart Items -->
          <div class="cart-items-col">
            <!-- Suggested items promo -->
            <div style="background: linear-gradient(135deg, #d1fae5, #ecfdf5); border: 1px solid #a7f3d0; border-radius: 1rem; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
              <span class="material-icons" style="color: #059669; font-size: 1.5rem;">local_offer</span>
              <div>
                <p style="font-size: 0.8rem; font-weight: 600; color: #065f46; margin: 0;">Great choices!</p>
                <p style="font-size: 0.75rem; color: #047857; margin: 0;">Add more meals to get free delivery</p>
              </div>
            </div>

            @for (item of cartState.items(); track item.id) {
              <app-cart-item
                [item]="item"
                [updating]="cartState.updating()"
                (onRemove)="removeItem($event)"
                (onQuantityChange)="updateQuantity($event)" />
            }

            <!-- Coupon -->
            <app-coupon />

            <!-- Wallet -->
            <app-wallet-section />
          </div>

          <!-- Right: Order Summary -->
          <div class="cart-summary-col">
            <app-order-summary (onCheckout)="proceedToCheckout()" />
          </div>
        </div>
      }
    </div>

    <!-- Clear Cart Confirmation Modal -->
    @if (showClearConfirm) {
      <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem;" (click)="showClearConfirm = false">
        <div style="background: white; border-radius: 1.25rem; max-width: 24rem; width: 100%; padding: 1.5rem;" (click)="$event.stopPropagation()">
          <div style="text-align: center;">
            <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #ef4444; font-size: 2rem;">delete_sweep</span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">Clear Cart?</h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">All items will be removed. This cannot be undone.</p>
            <div style="display: flex; gap: 0.75rem;">
              <button (click)="showClearConfirm = false"
                style="flex: 1; padding: 0.65rem; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; border-radius: 0.75rem; background: white; cursor: pointer; font-size: 0.85rem; transition: background 0.2s;"
                onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                Keep Items
              </button>
              <button (click)="clearCart()" [disabled]="cartState.updating()"
                style="flex: 1; padding: 0.65rem; background: #ef4444; color: white; font-weight: 600; border-radius: 0.75rem; border: none; cursor: pointer; font-size: 0.85rem; opacity: 1; transition: background 0.2s;"
                onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                @if (cartState.updating()) {
                  <span class="material-icons" style="font-size: 1rem; animation: spin 1s linear infinite;">refresh</span>
                } @else {
                  Clear All
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Mobile Sticky Checkout Bar -->
    @if (cartState.hasItems()) {
      <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e5e7eb; padding: 1rem; z-index: 40; display: none;" class="mobile-checkout-bar">
        <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
          <div>
            <p style="font-size: 0.7rem; color: #64748b; margin: 0;">Total</p>
            <p style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0;">₹{{ cartState.totalAmount() | number:'1.2-2' }}</p>
          </div>
          <button (click)="proceedToCheckout()"
            [disabled]="cartState.hasUnavailableItems() || cartState.updating()"
            style="padding: 0.75rem 1.5rem; background: #059669; color: white; font-weight: 700; border-radius: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; transition: background 0.2s;"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons">shopping_bag</span>
            Checkout
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    @media (min-width: 1024px) {
      .cart-grid { grid-template-columns: 1fr 380px !important; }
      .cart-items-col { min-width: 0; }
      .cart-summary-col { position: sticky; top: 1rem; align-self: start; }
    }
    @media (max-width: 1023px) {
      .mobile-checkout-bar { display: block !important; }
      :host { padding-bottom: 5rem; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class CartComponent implements OnInit {
  cartState = inject(CartStateService);
  private appState = inject(AppStateService);
  private router = inject(Router);

  showClearConfirm = false;

  ngOnInit(): void {
    this.cartState.loadCart();
  }

  updateQuantity(event: { itemId: number; quantity: number }): void {
    if (event.quantity < 1) {
      this.removeItem(event.itemId);
      return;
    }
    this.cartState.updateItem(event.itemId, event.quantity);
  }

  removeItem(itemId: number): void {
    this.cartState.removeItem(itemId);
  }

  confirmClearCart(): void {
    this.showClearConfirm = true;
  }

  clearCart(): void {
    this.cartState.clearCart();
    this.showClearConfirm = false;
  }

  proceedToCheckout(): void {
    if (this.cartState.hasUnavailableItems()) {
      return;
    }
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
