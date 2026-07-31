import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerBrowseApiService, PincodeCheckResponse } from '../../../../../core/services/customer-browse-api.service';

@Component({
  selector: 'app-promo-delivery-combined',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section style="max-width: 80rem; margin: 0 auto; padding: 1.5rem 1rem;" aria-label="Promo and Delivery">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">

        <!-- Left: Promo -->
        <div style="position: relative; overflow: hidden; border-radius: 1rem; background: linear-gradient(135deg, #059669, #059669, #16a34a); box-shadow: 0 12px 40px rgba(5,150,105,0.15); display: flex; flex-direction: column; justify-content: space-between; min-height: 11rem;">
          <div style="position: absolute; inset: 0; opacity: 0.06; pointer-events: none;">
            <div style="position: absolute; top: -2rem; right: -2rem; width: 8rem; height: 8rem; background: #fff; border-radius: 50%; filter: blur(40px);"></div>
          </div>
          <div style="position: relative; z-index: 10; padding: 1.25rem 1.5rem; color: #fff;">
            <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.125rem 0.5rem; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border-radius: 9999px; font-size: 0.6rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 0.5rem; animation: cPromoIn 0.5s ease-out;">
              <span class="material-icons" style="font-size: 11px; color: #facc15;">local_offer</span> Limited Time
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.25rem; animation: cPromoIn 0.5s ease-out 0.1s both;">
              Get <span style="color: #facc15;">20% OFF</span><br>First Subscription
            </h2>
            <p style="color: rgba(255,255,255,0.8); font-size: 0.72rem; line-height: 1.4; margin-bottom: 0.75rem; animation: cPromoIn 0.5s ease-out 0.15s both;">
              Fresh homestyle meals, zero delivery charges.
            </p>
            <div style="display: flex; gap: 0.5rem; animation: cPromoIn 0.5s ease-out 0.2s both;">
              <a routerLink="/subscriptions"
                 style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.5rem 1rem; background: #fff; color: #0f172a; font-weight: 600; font-size: 0.72rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s;"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)';"
                 onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';">
                <span class="material-icons" style="font-size: 16px;">card_membership</span> View Plans
              </a>
              <a routerLink="/meals"
                 style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.5rem 1rem; border: 1.5px solid rgba(255,255,255,0.3); color: #fff; font-weight: 600; font-size: 0.72rem; border-radius: 0.5rem; text-decoration: none; transition: all 0.3s;"
                 onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='rgba(255,255,255,0.5)';"
                 onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(255,255,255,0.3)';">
                Browse
              </a>
            </div>
          </div>
          <!-- Floating visual -->
          <div style="position: absolute; top: 0.75rem; right: 1rem; z-index: 10; animation: cSlideRight 0.6s ease-out 0.3s both;">
            <div style="position: relative;">
              <div style="width: 4rem; height: 4rem; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.12); animation: float 3s ease-in-out infinite;">
                <span style="font-size: 1.75rem;">&#127859;</span>
              </div>
              <div style="position: absolute; bottom: -0.125rem; right: -0.25rem; background: #facc15; color: #1e293b; border-radius: 0.375rem; padding: 0.15rem 0.35rem; box-shadow: 0 2px 8px rgba(0,0,0,0.2); animation: cPop 0.4s ease-out 0.6s both;">
                <p style="font-size: 0.45rem; font-weight: 700; margin: 0; line-height: 1;">CODE</p>
                <p style="font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; margin: 0; line-height: 1.1;">FIRST20</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Delivery -->
        <div style="position: relative; overflow: hidden; border-radius: 1rem; background: linear-gradient(135deg, #047857, #065f46, #064e3b); box-shadow: 0 12px 40px rgba(4,120,87,0.15); display: flex; flex-direction: column; justify-content: center; min-height: 11rem;">
          <div style="position: relative; z-index: 10; padding: 1.25rem 1.5rem; color: #fff;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <div style="width: 2rem; height: 2rem; background: rgba(255,255,255,0.15); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; animation: cPulse 2s ease-in-out infinite;">
                <span class="material-icons" style="font-size: 18px;">location_on</span>
              </div>
              <span style="font-size: 1.1rem; font-weight: 800; animation: cPromoIn 0.5s ease-out;">We Deliver Near You</span>
            </div>
            <p style="color: rgba(255,255,255,0.8); font-size: 0.72rem; margin-bottom: 0.75rem; animation: cPromoIn 0.5s ease-out 0.1s both;">Check if we deliver to your area</p>

            <form (ngSubmit)="checkDelivery()" style="display: flex; gap: 0.5rem; animation: cPromoIn 0.5s ease-out 0.15s both;">
              <div style="position: relative; flex: 1;">
                <span class="material-icons" style="position: absolute; left: 0.625rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px;">pin_drop</span>
                <input
                  type="text"
                  [(ngModel)]="pincode"
                  name="pincode"
                  placeholder="Enter 6-digit pincode"
                  maxlength="6"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  aria-label="Pincode"
                  style="width: 100%; padding: 0.625rem 0.625rem 0.625rem 2.25rem; border-radius: 0.5rem; background: #fff; color: #1e293b; font-size: 0.75rem; outline: none; font-weight: 500; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: box-shadow 0.3s;"
                  onfocus="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)';"
                  onblur="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';" />
              </div>
              <button type="submit"
                      [disabled]="checking()"
                      style="padding: 0.625rem 1rem; background: #fff; color: #0f172a; font-weight: 600; font-size: 0.75rem; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: none; cursor: pointer; white-space: nowrap; transition: all 0.3s; display: flex; align-items: center; justify-content: center;"
                      onmouseover="this.style.boxShadow='0 6px 18px rgba(0,0,0,0.15)'; this.style.transform='translateY(-1px)';"
                      onmouseout="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='none';"
                      [style.opacity]="checking() ? 0.5 : 1">
                @if (checking()) {
                  <span class="material-icons" style="font-size: 16px; animation: spin 0.8s linear infinite;">refresh</span>
                } @else {
                  Check
                }
              </button>
            </form>

            @if (result()) {
              <div style="margin-top: 0.5rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; backdrop-filter: blur(8px); animation: cResultPop 0.3s ease-out;"
                   [style.background]="result()!.deliverable ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'"
                   [style.border]="result()!.deliverable ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)'">
                <div style="display: flex; align-items: center; gap: 0.375rem;">
                  <span class="material-icons" style="font-size: 1rem;"
                        [style.color]="result()!.deliverable ? '#86efac' : '#fca5a5'">
                    {{ result()!.deliverable ? 'check_circle' : 'cancel' }}
                  </span>
                  <div>
                    <p style="font-weight: 700; font-size: 0.7rem;">{{ result()!.message }}</p>
                    @if (result()!.deliverable) {
                      <div style="display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.125rem; color: rgba(255,255,255,0.8); font-size: 0.6rem;">
                        @if (result()!.zone_name) {
                          <span style="display: flex; align-items: center; gap: 0.125rem;">
                            <span class="material-icons" style="font-size: 9px;">my_location</span>{{ result()!.zone_name }}
                          </span>
                        }
                        <span style="display: flex; align-items: center; gap: 0.125rem;">
                          <span class="material-icons" style="font-size: 9px;">schedule</span>{{ result()!.estimated_delivery_time || 30 }} min
                        </span>
                        @if (result()!.delivery_charge === 0) {
                          <span style="color: #86efac; font-weight: 700; display: flex; align-items: center; gap: 0.125rem;">
                            <span class="material-icons" style="font-size: 9px;">local_offer</span>Free!
                          </span>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes cPromoIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cSlideRight {
      from { opacity: 0; transform: translateX(16px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes cPop {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes cPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes cResultPop {
      from { opacity: 0; transform: scale(0.95) translateY(-4px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 640px) {
      :host > section > div { grid-template-columns: 1fr !important; }
    }
  `],
})
export class PromoDeliveryCombinedComponent {
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
