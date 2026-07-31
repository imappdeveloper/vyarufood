import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerBrowseApiService, PincodeCheckResponse } from '../../../../../core/services/customer-browse-api.service';

@Component({
  selector: 'app-delivery-areas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section style="background: #f1f5f9; padding: 1.5rem 0;" aria-label="Delivery areas">
      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem;">
        <div style="background: linear-gradient(135deg, #f97316, #ef4444, #ec4899); border-radius: 1rem; overflow: hidden; box-shadow: 0 16px 48px rgba(249,115,22,0.18);">
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; padding: 1.5rem 2rem; color: #fff;">

            <!-- Left: text + form -->
            <div style="flex: 1; min-width: 20rem;" class="del-left">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem;">
                <div style="width: 2rem; height: 2rem; background: rgba(255,255,255,0.15); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; animation: delPulse 2s ease-in-out infinite;">
                  <span class="material-icons" style="font-size: 18px;">location_on</span>
                </div>
                <span style="font-size: 1.125rem; font-weight: 800; animation: delSlideIn 0.5s ease-out;">We Deliver Near You</span>
              </div>
              <p style="color: rgba(255,255,255,0.85); font-size: 0.78rem; margin-bottom: 1rem; animation: delSlideIn 0.5s ease-out 0.1s both;">Check if we deliver to your area</p>

              <form (ngSubmit)="checkDelivery()" style="display: flex; gap: 0.5rem; max-width: 30rem; animation: delSlideIn 0.5s ease-out 0.2s both;">
                <div style="position: relative; flex: 1;">
                  <span class="material-icons" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 18px;">pin_drop</span>
                  <input
                    type="text"
                    [(ngModel)]="pincode"
                    name="pincode"
                    placeholder="Enter 6-digit pincode"
                    maxlength="6"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    aria-label="Enter pincode"
                    style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border-radius: 0.625rem; background: #fff; color: #1e293b; font-size: 0.8125rem; outline: none; font-weight: 500; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: box-shadow 0.3s;"
                    onfocus="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)';"
                    onblur="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';" />
                </div>
                <button type="submit"
                        [disabled]="checking()"
                        style="padding: 0.75rem 1.25rem; background: #fff; color: #0f172a; font-weight: 600; font-size: 0.8125rem; border-radius: 0.625rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: none; cursor: pointer; white-space: nowrap; transition: all 0.3s; display: flex; align-items: center; justify-content: center;"
                        onmouseover="this.style.boxShadow='0 6px 18px rgba(0,0,0,0.15)'; this.style.transform='translateY(-1px)';"
                        onmouseout="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='none';"
                        [style.opacity]="checking() ? 0.5 : 1">
                  @if (checking()) {
                    <span class="material-icons" style="font-size: 18px; animation: spin 0.8s linear infinite;">refresh</span>
                  } @else {
                    Check
                  }
                </button>
              </form>

              @if (result()) {
                <div style="margin-top: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.625rem; backdrop-filter: blur(8px); transition: all 0.4s ease; animation: delResultPop 0.3s ease-out;"
                     [style.background]="result()!.deliverable ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'"
                     [style.border]="result()!.deliverable ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)'">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 1.25rem;"
                          [style.color]="result()!.deliverable ? '#86efac' : '#fca5a5'">
                      {{ result()!.deliverable ? 'check_circle' : 'cancel' }}
                    </span>
                    <div style="flex: 1;">
                      <p style="font-weight: 700; font-size: 0.8rem;">{{ result()!.message }}</p>
                      @if (result()!.deliverable) {
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.25rem; color: rgba(255,255,255,0.8); font-size: 0.68rem;">
                          @if (result()!.zone_name) {
                            <span style="display: flex; align-items: center; gap: 0.2rem;">
                              <span class="material-icons" style="font-size: 10px;">my_location</span>{{ result()!.zone_name }}
                            </span>
                          }
                          <span style="display: flex; align-items: center; gap: 0.2rem;">
                            <span class="material-icons" style="font-size: 10px;">schedule</span>{{ result()!.estimated_delivery_time || 30 }} min
                          </span>
                          @if (result()!.delivery_charge === 0) {
                            <span style="color: #86efac; font-weight: 700; display: flex; align-items: center; gap: 0.2rem;">
                              <span class="material-icons" style="font-size: 10px;">local_offer</span>Free delivery!
                            </span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Right: visual -->
            <div style="flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; animation: delSlideRight 0.6s ease-out 0.2s both;" class="del-right">
              <div style="position: relative;">
                <div style="width: 4.5rem; height: 4.5rem; background: rgba(255,255,255,0.12); border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.15); animation: delIconBounce 2s ease-in-out infinite;">
                  <span class="material-icons" style="font-size: 2rem; color: #fff;">delivery_dining</span>
                </div>
              </div>
              <div style="max-width: 10rem;">
                <p style="font-weight: 700; font-size: 0.8rem; color: #fff; margin-bottom: 0.125rem;">Fast Delivery</p>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.68rem; line-height: 1.4; margin-bottom: 0.5rem;">30-45 min to your doorstep</p>
                <a routerLink="/delivery-areas"
                   style="display: inline-flex; align-items: center; gap: 0.25rem; color: #fff; font-weight: 600; font-size: 0.7rem; text-decoration: none; transition: all 0.3s;"
                   onmouseover="this.style.gap='0.5rem';"
                   onmouseout="this.style.gap='0.25rem';">
                  View Areas <span class="material-icons" style="font-size: 14px;">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes delSlideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes delSlideRight {
      from { opacity: 0; transform: translateX(16px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes delPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes delIconBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-3px) rotate(-3deg); }
      75% { transform: translateY(-2px) rotate(3deg); }
    }
    @keyframes delResultPop {
      from { opacity: 0; transform: scale(0.95) translateY(-4px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 640px) {
      .del-right { display: none !important; }
    }
  `],
})
export class DeliveryAreasComponent {
  private browseApi = inject(CustomerBrowseApiService);
  pincode = '';
  checking = signal(false);
  result = signal<PincodeCheckResponse | null>(null);

  checkDelivery(): void {
    const pc = this.pincode.trim();
    if (pc.length !== 6 || !/^\d{6}$/.test(pc)) {
      this.result.set({ deliverable: false, pincode: pc, message: 'Please enter a valid 6-digit pincode.' });
      return;
    }
    this.checking.set(true);
    this.result.set(null);
    this.browseApi.checkPincode(pc).subscribe({
      next: (res) => {
        this.checking.set(false);
        if (res.success && res.data) this.result.set(res.data);
      },
      error: () => {
        this.checking.set(false);
        this.result.set({ deliverable: false, pincode: pc, message: 'Unable to check availability. Please try again.' });
      },
    });
  }
}
