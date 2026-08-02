import { Injectable, inject, signal, computed } from '@angular/core';
import { CustomerBrowseApiService, PincodeCheckResponse } from './customer-browse-api.service';
import { LocationService } from './location.service';

@Injectable({ providedIn: 'root' })
export class PincodeStateService {
  private browseApi = inject(CustomerBrowseApiService);
  private locationService = inject(LocationService);

  readonly selectedPincode = signal<string>(localStorage.getItem('selected_pincode') || '');
  readonly pincodeResult = signal<PincodeCheckResponse | null>(null);
  readonly checking = signal(false);
  readonly requesting = signal(false);
  readonly requestMessage = signal<string | null>(null);
  readonly requestSuccess = signal(false);
  readonly areaNotServedDismissed = signal(false);
  readonly locationDetecting = signal(false);
  readonly locationPrompt = signal<string | null>(null);
  readonly autoNotice = signal<string | null>(null);
  readonly autoCheckResolved = signal(false);

  readonly isDeliverable = computed(() => this.pincodeResult()?.deliverable ?? false);
  readonly hasChecked = computed(() => this.pincodeResult() !== null);
  readonly showAreaNotServed = computed(() => this.hasChecked() && !this.isDeliverable() && !this.areaNotServedDismissed());

  private isAutoCheck = false;

  checkPincode(pincode: string): void {
    if (!pincode || pincode.length !== 6) return;

    this.checking.set(true);
    this.pincodeResult.set(null);
    this.requestMessage.set(null);
    this.areaNotServedDismissed.set(false);
    if (!this.isAutoCheck) {
      this.autoNotice.set(null);
    }

    this.browseApi.checkPincode(pincode).subscribe({
      next: (res) => {
        this.checking.set(false);
        this.autoCheckResolved.set(true);
        if (res.success && res.data) {
          this.pincodeResult.set(res.data);
          this.selectedPincode.set(pincode);
          if (res.data.deliverable) {
            localStorage.setItem('selected_pincode', pincode);
            if (this.isAutoCheck) {
              this.autoNotice.set('We deliver to your area (' + pincode + ')!');
            }
          } else {
            localStorage.removeItem('selected_pincode');
            this.autoNotice.set(null);
          }
          this.isAutoCheck = false;
        }
      },
      error: () => {
        this.checking.set(false);
        this.isAutoCheck = false;
        this.autoCheckResolved.set(true);
      },
    });
  }

  autoDetectPincode(): void {
    const saved = this.selectedPincode();
    if (saved && saved.length === 6) {
      this.checkPincode(saved);
      return;
    }

    this.locationDetecting.set(true);
    this.locationPrompt.set(null);
    this.autoNotice.set('Detecting your location to check delivery…');
    this.locationService.detectPincode().subscribe({
      next: (pc) => {
        this.locationDetecting.set(false);
        this.isAutoCheck = true;
        this.checkPincode(pc);
      },
      error: (e) => {
        this.locationDetecting.set(false);
        this.autoNotice.set(null);
        this.locationPrompt.set(this.locationService.friendlyError(e.message));
        this.autoCheckResolved.set(true);
      },
    });
  }

  dismissLocationPrompt(): void {
    this.locationPrompt.set(null);
  }

  dismissAutoNotice(): void {
    this.autoNotice.set(null);
  }

  requestService(data: { pincode: string; name?: string; email?: string; phone?: string; message?: string }): void {
    this.requesting.set(true);
    this.requestMessage.set(null);
    this.requestSuccess.set(false);

    this.browseApi.requestService(data).subscribe({
      next: (res) => {
        this.requesting.set(false);
        this.requestSuccess.set(true);
        this.requestMessage.set(res.message || 'Thank you for your interest!');
      },
      error: (err) => {
        this.requesting.set(false);
        this.requestSuccess.set(false);
        this.requestMessage.set(err.error?.message || 'Something went wrong. Please try again.');
      },
    });
  }

  clearPincode(): void {
    this.selectedPincode.set('');
    this.pincodeResult.set(null);
    this.requestMessage.set(null);
    this.requestSuccess.set(false);
    this.areaNotServedDismissed.set(false);
    localStorage.removeItem('selected_pincode');
  }

  dismissAreaNotServed(): void {
    this.areaNotServedDismissed.set(true);
  }

  restoreFromStorage(): void {
    const saved = localStorage.getItem('selected_pincode');
    if (saved && saved.length === 6) {
      this.checkPincode(saved);
    }
  }
}
