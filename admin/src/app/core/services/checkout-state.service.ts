import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFrontOrderApiService, PlaceOrderPayload, CheckoutSummary } from './customer-front-order-api.service';
import { CartStateService } from './cart-state.service';
import { AppStateService } from './app-state.service';
import { CustomerBrowseApiService, PincodeCheckResponse } from './customer-browse-api.service';

export interface CheckoutData {
  addressId: number | null;
  deliveryDate: string;
  deliverySlot: string;
  deliveryInstruction: string;
  paymentMethod: string;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  private orderApi = inject(CustomerFrontOrderApiService);
  private cartState = inject(CartStateService);
  private appState = inject(AppStateService);
  private router = inject(Router);
  private browseApi = inject(CustomerBrowseApiService);

  readonly loading = signal(false);
  readonly processing = signal(false);
  readonly error = signal<string | null>(null);
  readonly summary = signal<CheckoutSummary | null>(null);
  readonly orderPlaced = signal<any>(null);

  readonly selectedAddress = signal<any>(null);
  readonly addresses = signal<any[]>([]);
  readonly walletBalance = signal(0);
  readonly pincodeDeliverable = signal<boolean | null>(null);
  readonly pincodeChecking = signal(false);

  readonly checkoutData = signal<CheckoutData>({
    addressId: null,
    deliveryDate: this.getDefaultDeliveryDate(),
    deliverySlot: '',
    deliveryInstruction: '',
    paymentMethod: 'upi',
    notes: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  readonly canPlaceOrder = computed(() => {
    const data = this.checkoutData();
    const s = this.summary();
    return (
      data.addressId !== null &&
      data.deliveryDate !== '' &&
      data.paymentMethod !== '' &&
      !this.processing() &&
      s !== null &&
      !s.has_unavailable_items &&
      s.cart?.items?.length > 0 &&
      this.pincodeDeliverable() === true
    );
  });

  loadSummary(): void {
    this.loading.set(true);
    this.error.set(null);

    this.orderApi.getCheckoutSummary().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.summary.set(res.data);
          this.addresses.set(res.data.addresses);
          this.walletBalance.set(res.data.wallet_balance);

          const defaultAddr = res.data.addresses.find((a: any) => a.is_default) || res.data.addresses[0];
          if (defaultAddr) {
            this.selectAddress(defaultAddr);
          }

          const user = this.appState.currentUser();
          if (user) {
            this.checkoutData.update(current => ({
              ...current,
              firstName: current.firstName || user.first_name || '',
              lastName: current.lastName || user.last_name || '',
              email: current.email || user.email || '',
              phone: current.phone || user.phone || '',
            }));
          }
        } else {
          this.error.set('Unable to load checkout summary.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Unable to load checkout summary.');
      },
    });
  }

  selectAddress(address: any): void {
    this.selectedAddress.set(address);
    this.updateData({ addressId: address.id });
    this.validateAddressPincode(address);
  }

  private validateAddressPincode(address: any): void {
    const pincodeStr = typeof address.pincode === 'object' ? address.pincode?.pincode : address.pincode;
    if (!pincodeStr || pincodeStr.length !== 6) {
      this.pincodeDeliverable.set(null);
      return;
    }
    this.pincodeChecking.set(true);
    this.pincodeDeliverable.set(null);
    this.browseApi.checkPincode(pincodeStr).subscribe({
      next: (res) => {
        this.pincodeChecking.set(false);
        if (res.success && res.data) {
          this.pincodeDeliverable.set(res.data.deliverable);
        } else {
          this.pincodeDeliverable.set(false);
        }
      },
      error: () => {
        this.pincodeChecking.set(false);
        this.pincodeDeliverable.set(false);
      },
    });
  }

  updateData(partial: Partial<CheckoutData>): void {
    this.checkoutData.update(current => ({ ...current, ...partial }));
  }

  placeOrder(): void {
    if (!this.canPlaceOrder()) return;

    this.processing.set(true);
    this.error.set(null);

    const data = this.checkoutData();
    const payload: PlaceOrderPayload = {
      address_id: data.addressId!,
      delivery_date: data.deliveryDate,
      delivery_slot: data.deliverySlot || undefined,
      delivery_instruction: data.deliveryInstruction || undefined,
      payment_method: data.paymentMethod,
      notes: data.notes || undefined,
      first_name: data.firstName || undefined,
      last_name: data.lastName || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
    };

    this.orderApi.placeOrder(payload).subscribe({
      next: (res) => {
        this.processing.set(false);
        if (res.success && res.data) {
          this.orderPlaced.set(res.data);
          this.cartState.loadCart();
          this.router.navigate(['/order-confirmation'], {
            queryParams: { order: res.data.uuid },
          });
        } else {
          this.error.set(res.message || 'Failed to place order.');
        }
      },
      error: (err) => {
        this.processing.set(false);
        this.error.set(err.error?.message || 'Failed to place order. Please try again.');
      },
    });
  }

  reset(): void {
    this.loading.set(false);
    this.processing.set(false);
    this.error.set(null);
    this.summary.set(null);
    this.orderPlaced.set(null);
    this.selectedAddress.set(null);
    this.addresses.set([]);
    this.walletBalance.set(0);
    this.checkoutData.set({
      addressId: null,
      deliveryDate: this.getDefaultDeliveryDate(),
      deliverySlot: '',
      deliveryInstruction: '',
      paymentMethod: 'upi',
      notes: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
  }

  private getDefaultDeliveryDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
}
