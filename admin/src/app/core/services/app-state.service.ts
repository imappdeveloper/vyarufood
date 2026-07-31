import { Injectable, signal, computed } from '@angular/core';
import { CustomerProfile } from '../models/customer/customer-profile.model';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  readonly currentUser = signal<CustomerProfile | null>(this.restoreUser());
  readonly cartCount = signal<number>(0);
  readonly cartTotal = signal<number>(0);
  readonly notificationCount = signal<number>(0);
  readonly walletBalance = signal<number>(0);
  readonly pageLoading = signal<boolean>(false);
  readonly isLoggedIn = computed(() => !!this.currentUser());

  setCurrentUser(user: CustomerProfile | null): void {
    this.currentUser.set(user);
    if (user) {
      this.walletBalance.set(user.wallet_balance ?? 0);
    }
  }

  updateCart(count: number, total: number): void {
    this.cartCount.set(count);
    this.cartTotal.set(total);
  }

  updateNotificationCount(count: number): void {
    this.notificationCount.set(count);
  }

  updateWalletBalance(balance: number): void {
    this.walletBalance.set(balance);
  }

  setPageLoading(loading: boolean): void {
    this.pageLoading.set(loading);
  }

  clearState(): void {
    this.currentUser.set(null);
    this.cartCount.set(0);
    this.cartTotal.set(0);
    this.notificationCount.set(0);
    this.walletBalance.set(0);
  }

  private restoreUser(): CustomerProfile | null {
    try {
      const data = localStorage.getItem('tiffin_customer_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
