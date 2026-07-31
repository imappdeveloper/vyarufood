import { Injectable, inject, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';
import { CartApiService } from './cart-api.service';
import { AppStateService } from './app-state.service';
import { Cart, CartItem } from '../models/customer/cart.model';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private cartApi = inject(CartApiService);
  private appState = inject(AppStateService);

  readonly cart = signal<Cart | null>(null);
  readonly items = signal<CartItem[]>([]);
  readonly loading = signal(false);
  readonly updating = signal(false);
  readonly error = signal<string | null>(null);

  readonly itemCount = computed(() => this.cart()?.item_count ?? 0);
  readonly subtotal = computed(() => this.cart()?.subtotal ?? 0);
  readonly taxAmount = computed(() => this.cart()?.tax_amount ?? 0);
  readonly taxPercentage = computed(() => this.cart()?.tax_percentage ?? 0);
  readonly deliveryCharge = computed(() => this.cart()?.delivery_charge ?? 0);
  readonly discountAmount = computed(() => this.cart()?.discount_amount ?? 0);
  readonly couponAmount = computed(() => this.cart()?.coupon_amount ?? 0);
  readonly couponCode = computed(() => this.cart()?.coupon_code ?? null);
  readonly walletAmount = computed(() => this.cart()?.wallet_amount ?? 0);
  readonly totalAmount = computed(() => this.cart()?.total_amount ?? 0);
  readonly hasItems = computed(() => this.items().length > 0);
  readonly isEmpty = computed(() => this.items().length === 0 && !this.loading());
  readonly hasUnavailableItems = computed(() => this.items().some(i => !i.is_available));
  readonly hasCoupon = computed(() => !!this.couponCode());

  private addToast$ = new Subject<{ message: string; type: 'success' | 'error' | 'info' }>();
  readonly toasts$ = this.addToast$.asObservable();

  loadCart(): void {
    if (!this.appState.isLoggedIn()) {
      this.cart.set(null);
      this.items.set([]);
      this.appState.updateCart(0, 0);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.cartApi.getCart().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.appState.updateCart(res.data.item_count, res.data.total_amount);
        } else {
          this.cart.set(null);
          this.items.set([]);
          this.appState.updateCart(0, 0);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Unable to load your cart. Please try again.');
        this.appState.updateCart(0, 0);
      },
    });
  }

  addItem(mealId: number, quantity: number, mealName?: string): void {
    this.updating.set(true);
    this.cartApi.addItem(mealId, quantity).subscribe({
      next: (res) => {
        this.updating.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.appState.updateCart(res.data.item_count, res.data.total_amount);
          this.addToast$.next({ message: `${mealName || 'Item'} added to cart`, type: 'success' });
        }
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to add item to cart';
        this.addToast$.next({ message: msg, type: 'error' });
      },
    });
  }

  updateItem(itemId: number, quantity: number): void {
    this.updating.set(true);
    this.cartApi.updateItem(itemId, quantity).subscribe({
      next: (res) => {
        this.updating.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.appState.updateCart(res.data.item_count, res.data.total_amount);
        }
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to update cart';
        this.addToast$.next({ message: msg, type: 'error' });
        this.loadCart();
      },
    });
  }

  removeItem(itemId: number): void {
    this.updating.set(true);
    this.cartApi.removeItem(itemId).subscribe({
      next: (res) => {
        this.updating.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.appState.updateCart(res.data.item_count, res.data.total_amount);
          this.addToast$.next({ message: 'Item removed from cart', type: 'success' });
        } else {
          this.cart.set(null);
          this.items.set([]);
          this.appState.updateCart(0, 0);
          this.addToast$.next({ message: 'Item removed from cart', type: 'success' });
        }
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to remove item';
        this.addToast$.next({ message: msg, type: 'error' });
      },
    });
  }

  clearCart(): void {
    this.updating.set(true);
    this.cartApi.clearCart().subscribe({
      next: () => {
        this.updating.set(false);
        this.cart.set(null);
        this.items.set([]);
        this.appState.updateCart(0, 0);
        this.addToast$.next({ message: 'Cart cleared', type: 'success' });
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to clear cart';
        this.addToast$.next({ message: msg, type: 'error' });
      },
    });
  }

  applyCoupon(code: string): void {
    this.updating.set(true);
    this.cartApi.applyCoupon(code).subscribe({
      next: (res) => {
        this.updating.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.addToast$.next({ message: 'Coupon applied successfully', type: 'success' });
        }
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to apply coupon';
        this.addToast$.next({ message: msg, type: 'error' });
      },
    });
  }

  removeCoupon(): void {
    this.updating.set(true);
    this.cartApi.removeCoupon().subscribe({
      next: (res) => {
        this.updating.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.addToast$.next({ message: 'Coupon removed', type: 'success' });
        }
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to remove coupon';
        this.addToast$.next({ message: msg, type: 'error' });
      },
    });
  }

  applyWallet(amount?: number): void {
    this.updating.set(true);
    this.cartApi.applyWallet(amount).subscribe({
      next: (res) => {
        this.updating.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.addToast$.next({ message: 'Wallet balance applied', type: 'success' });
        }
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to apply wallet balance';
        this.addToast$.next({ message: msg, type: 'error' });
      },
    });
  }

  removeWallet(): void {
    this.updating.set(true);
    this.cartApi.removeWallet().subscribe({
      next: (res) => {
        this.updating.set(false);
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.items.set(res.data.items ?? []);
          this.addToast$.next({ message: 'Wallet balance removed', type: 'success' });
        }
      },
      error: (err) => {
        this.updating.set(false);
        const msg = err.error?.message || 'Failed to remove wallet balance';
        this.addToast$.next({ message: msg, type: 'error' });
      },
    });
  }
}
