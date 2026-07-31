import { Injectable, inject, signal, computed } from '@angular/core';
import { CustomerBrowseApiService, PincodeCheckResponse } from './customer-browse-api.service';

@Injectable({ providedIn: 'root' })
export class PincodeStateService {
  private browseApi = inject(CustomerBrowseApiService);

  readonly selectedPincode = signal<string>(localStorage.getItem('selected_pincode') || '');
  readonly pincodeResult = signal<PincodeCheckResponse | null>(null);
  readonly checking = signal(false);
  readonly requesting = signal(false);
  readonly requestMessage = signal<string | null>(null);

  readonly isDeliverable = computed(() => this.pincodeResult()?.deliverable ?? false);
  readonly hasChecked = computed(() => this.pincodeResult() !== null);

  checkPincode(pincode: string): void {
    if (!pincode || pincode.length !== 6) return;

    this.checking.set(true);
    this.pincodeResult.set(null);
    this.requestMessage.set(null);

    this.browseApi.checkPincode(pincode).subscribe({
      next: (res) => {
        this.checking.set(false);
        if (res.success && res.data) {
          this.pincodeResult.set(res.data);
          this.selectedPincode.set(pincode);
          localStorage.setItem('selected_pincode', pincode);
        }
      },
      error: () => {
        this.checking.set(false);
      },
    });
  }

  requestService(data: { pincode: string; name?: string; email?: string; phone?: string; message?: string }): void {
    this.requesting.set(true);
    this.requestMessage.set(null);

    this.browseApi.requestService(data).subscribe({
      next: (res) => {
        this.requesting.set(false);
        this.requestMessage.set(res.message || 'Thank you for your interest!');
      },
      error: (err) => {
        this.requesting.set(false);
        this.requestMessage.set(err.error?.message || 'Something went wrong. Please try again.');
      },
    });
  }

  clearPincode(): void {
    this.selectedPincode.set('');
    this.pincodeResult.set(null);
    this.requestMessage.set(null);
    localStorage.removeItem('selected_pincode');
  }

  restoreFromStorage(): void {
    const saved = localStorage.getItem('selected_pincode');
    if (saved && saved.length === 6) {
      this.checkPincode(saved);
    }
  }
}
