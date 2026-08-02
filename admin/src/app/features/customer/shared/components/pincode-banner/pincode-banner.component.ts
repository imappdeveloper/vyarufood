import { Component, inject, signal, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PincodeStateService } from '../../../../../core/services/pincode-state.service';
import { LocationService } from '../../../../../core/services/location.service';

@Component({
  selector: 'app-pincode-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Compact pincode bar -->
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
        <span class="material-icons" style="color: #059669; font-size: 1.25rem;">local_shipping</span>
        <span style="font-size: 0.8rem; font-weight: 600; color: #1e293b;">Check delivery:</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 200px;">
        <div style="position: relative; flex: 1;">
          <input type="text" [(ngModel)]="pincode" (keyup.enter)="check()" maxlength="6" placeholder="Enter 6-digit pincode"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.85rem; outline: none; box-sizing: border-box; letter-spacing: 0.1em;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
        </div>
        <button (click)="check()" [disabled]="pincodeState.checking() || pincode.length !== 6"
          style="padding: 0.5rem 1rem; background: #059669; color: white; font-weight: 600; font-size: 0.8rem; border-radius: 0.5rem; border: none; cursor: pointer; white-space: nowrap; transition: background 0.2s;"
          onmouseover="if(!this.disabled)this.style.background='#047857'" onmouseout="this.style.background='#059669'"
          [style.opacity]="(pincode.length !== 6) ? '0.5' : '1'"
          [style.cursor]="(pincode.length !== 6) ? 'not-allowed' : 'pointer'">
          @if (pincodeState.checking()) {
            <span class="material-icons" style="font-size: 0.9rem; animation: spin 1s linear infinite; display: inline-block;">refresh</span>
          } @else {
            Check
          }
        </button>
        <button (click)="detectLocation()" [disabled]="locationLoading()" title="Use my location"
          style="width: 2rem; height: 2rem; border-radius: 0.5rem; border: 1px solid #d1d5db; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;"
          onmouseover="if(!this.disabled){this.style.borderColor='#059669'; this.style.background='#f0fdf4'}" onmouseout="this.style.borderColor='#d1d5db'; this.style.background='white'">
          @if (locationLoading()) {
            <span class="material-icons" style="font-size: 1rem; color: #059669; animation: spin 1s linear infinite; display: inline-block;">refresh</span>
          } @else {
            <span class="material-icons" style="font-size: 1rem; color: #059669;">my_location</span>
          }
        </button>
      </div>
    </div>

    @if (locationError()) {
      <div style="margin-top: 0.5rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 0.5rem; padding: 0.625rem 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
        <span class="material-icons" style="color: #d97706; font-size: 1rem;">location_off</span>
        <span style="font-size: 0.8rem; color: #92400e; flex: 1;">{{ locationError() }}</span>
      </div>
    }

    <!-- Result: Deliverable -->
    @if (pincodeState.pincodeResult()?.deliverable) {
      <div style="margin-top: 0.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 0.625rem 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
        <span class="material-icons" style="color: #059669; font-size: 1rem;">check_circle</span>
        <span style="font-size: 0.8rem; color: #065f46; font-weight: 500; flex: 1;">{{ pincodeState.pincodeResult()?.message }}</span>
        @if (pincodeState.pincodeResult()?.estimated_delivery_time) {
          <span style="font-size: 0.72rem; color: #059669;">Delivery in ~{{ pincodeState.pincodeResult()?.estimated_delivery_time }} min</span>
        }
        <button (click)="dismiss()" title="Close"
          style="width: 1.25rem; height: 1.25rem; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; flex-shrink: 0;"
          onmouseover="this.style.background='#dcfce7'" onmouseout="this.style.background='transparent'">
          <span class="material-icons" style="font-size: 0.85rem; color: #059669;">close</span>
        </button>
      </div>
    }

    <!-- Result: Not deliverable -->
    @if (pincodeState.pincodeResult() && !pincodeState.pincodeResult()?.deliverable) {
      <div style="margin-top: 0.5rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 0.75rem 0.875rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="material-icons" style="color: #dc2626; font-size: 1rem;">cancel</span>
          <span style="font-size: 0.8rem; color: #991b1b; font-weight: 500; flex: 1;">Sorry, we are not available in your area yet.</span>
          <button (click)="dismiss()" title="Close"
            style="width: 1.25rem; height: 1.25rem; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; flex-shrink: 0;"
            onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='transparent'">
            <span class="material-icons" style="font-size: 0.85rem; color: #dc2626;">close</span>
          </button>
        </div>
        @if (!showRequestForm) {
          <button (click)="showRequestForm = true"
            style="margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.875rem; background: white; border: 1px solid #fecaca; color: #dc2626; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;"
            onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
            <span class="material-icons" style="font-size: 0.85rem;">notifications_active</span> Request Service in Your Area
          </button>
        }
        @if (showRequestForm) {
          <div style="background: white; border-radius: 0.5rem; padding: 0.75rem; margin-top: 0.5rem; border: 1px solid #fde68a;">
            <p style="font-size: 0.75rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">We'll notify you when we start serving {{ pincodeState.selectedPincode() }}</p>
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              <input type="text" [(ngModel)]="requestName" placeholder="Your name (optional)"
                style="padding: 0.4rem 0.625rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.78rem; outline: none;"
                onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#d1d5db'" />
              <input type="tel" [(ngModel)]="requestPhone" placeholder="Phone number (optional)" maxlength="10"
                style="padding: 0.4rem 0.625rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.78rem; outline: none;"
                onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#d1d5db'" />
            </div>
            <div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">
              <button (click)="submitRequest()" [disabled]="pincodeState.requesting()"
                style="flex: 1; padding: 0.4rem; background: #059669; color: white; font-weight: 600; font-size: 0.75rem; border-radius: 0.375rem; border: none; cursor: pointer; transition: background 0.2s;"
                onmouseover="if(!this.disabled)this.style.background='#047857'" onmouseout="this.style.background='#059669'">
                {{ pincodeState.requesting() ? 'Submitting...' : 'Submit Request' }}
              </button>
              <button (click)="showRequestForm = false"
                style="padding: 0.4rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; color: #6b7280; font-size: 0.75rem; cursor: pointer;">
                Cancel
              </button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Request submitted message -->
    @if (pincodeState.requestMessage()) {
      <div style="margin-top: 0.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 0.625rem 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
        <span class="material-icons" style="color: #059669; font-size: 1rem;">info</span>
        <span style="font-size: 0.8rem; color: #065f46; flex: 1;">{{ pincodeState.requestMessage() }}</span>
        <button (click)="dismissRequestMessage()" title="Close"
          style="width: 1.25rem; height: 1.25rem; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; flex-shrink: 0;"
          onmouseover="this.style.background='#dcfce7'" onmouseout="this.style.background='transparent'">
          <span class="material-icons" style="font-size: 0.85rem; color: #059669;">close</span>
        </button>
      </div>
    }
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class PincodeBannerComponent implements OnInit, OnDestroy {
  pincodeState = inject(PincodeStateService);
  private locationService = inject(LocationService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  pincode = '';
  showRequestForm = false;
  requestName = '';
  requestPhone = '';
  locationLoading = signal(false);
  locationError = signal<string | null>(null);

  private timers: any[] = [];

  ngOnInit(): void {
    this.pincode = this.pincodeState.selectedPincode();
    if (this.pincode) {
      this.pincodeState.restoreFromStorage();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private autoHide(ms: number): void {
    const t = setTimeout(() => {
      this.ngZone.run(() => {
        this.pincodeState.pincodeResult.set(null);
        this.pincodeState.requestMessage.set(null);
        this.showRequestForm = false;
        this.cdr.markForCheck();
      });
    }, ms);
    this.timers.push(t);
  }

  private waitForResultAndAutoHide(): void {
    let elapsed = 0;
    const poll = setInterval(() => {
      elapsed += 100;
      const result = this.pincodeState.pincodeResult();
      if (result) {
        clearInterval(poll);
        if (result.deliverable) {
          this.autoHide(5000);
        }
      } else if (elapsed > 10000) {
        clearInterval(poll);
      }
    }, 100);
    this.timers.push(poll);
  }

  private clearTimers(): void {
    this.timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    this.timers = [];
  }

  check(): void {
    if (this.pincode.length === 6) {
      this.clearTimers();
      this.showRequestForm = false;
      this.pincodeState.checkPincode(this.pincode);
      this.waitForResultAndAutoHide();
    }
  }

  detectLocation(): void {
    this.locationLoading.set(true);
    this.locationError.set(null);
    this.locationService.detectPincode().subscribe({
      next: (pc) => {
        this.locationLoading.set(false);
        this.pincode = pc;
        this.check();
      },
      error: (e) => {
        this.locationLoading.set(false);
        this.locationError.set(this.locationService.friendlyError(e.message));
      },
    });
  }

  submitRequest(): void {
    this.pincodeState.requestService({
      pincode: this.pincodeState.selectedPincode(),
      name: this.requestName || undefined,
      phone: this.requestPhone || undefined,
    });
    this.showRequestForm = false;
    const t = setTimeout(() => {
      this.ngZone.run(() => {
        this.pincodeState.requestMessage.set(null);
        this.cdr.markForCheck();
      });
    }, 4000);
    this.timers.push(t);
  }

  dismiss(): void {
    this.clearTimers();
    this.pincodeState.clearPincode();
    this.showRequestForm = false;
  }

  dismissRequestMessage(): void {
    this.clearTimers();
    this.pincodeState.requestMessage.set(null);
  }
}
