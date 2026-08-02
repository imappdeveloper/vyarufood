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
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" aria-label="Promo and Delivery">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <!-- Left: Promo -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-green-500 shadow-xl shadow-emerald-500/15 flex flex-col justify-between min-h-[12rem] p-7 sm:p-9 text-white">
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute -top-8 -right-8 w-36 h-36 bg-white rounded-full blur-3xl"></div>
          </div>

          <div class="relative z-10">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-xs font-bold mb-3 animate-[cPromoIn_0.5s_ease-out_both]">
              <span class="material-icons text-sm text-yellow-300">local_offer</span> Limited Time
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-1.5 animate-[cPromoIn_0.5s_ease-out_0.1s_both]">
              Get <span class="text-yellow-300">20% OFF</span> First Subscription
            </h2>
            <p class="text-white/85 text-sm sm:text-base mb-5 animate-[cPromoIn_0.5s_ease-out_0.15s_both]">
              Fresh homestyle meals, zero delivery charges.
            </p>
            <div class="flex gap-2.5 animate-[cPromoIn_0.5s_ease-out_0.2s_both]">
              <a routerLink="/subscriptions"
                 class="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <span class="material-icons text-lg">card_membership</span> View Plans
              </a>
              <a routerLink="/meals"
                 class="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-white/40 text-white font-semibold text-sm rounded-xl hover:bg-white/10 hover:border-white/60 transition-all duration-300">
                Browse
              </a>
            </div>
          </div>

          <!-- Floating visual -->
          <div class="absolute top-4 right-5 z-10 hidden sm:block animate-[cSlideRight_0.6s_ease-out_0.3s_both]">
            <div class="relative">
              <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/15 animate-[float_3s_ease-in-out_infinite]">
                <span class="text-3xl">&#127859;</span>
              </div>
              <div class="absolute -bottom-0.5 -right-1 bg-yellow-400 text-slate-900 rounded-md px-1.5 py-0.5 shadow-lg animate-[cPop_0.4s_ease-out_0.6s_both]">
                <p class="text-[0.45rem] font-bold leading-none">CODE</p>
                <p class="text-[0.65rem] font-extrabold tracking-wide leading-tight">FIRST20</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Delivery -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 shadow-xl shadow-emerald-900/20 flex flex-col justify-center min-h-[12rem] p-7 sm:p-9 text-white">
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-1.5">
              <div class="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center animate-[cPulse_2s_ease-in-out_infinite]">
                <span class="material-icons text-xl">location_on</span>
              </div>
              <span class="text-xl sm:text-2xl font-extrabold animate-[cPromoIn_0.5s_ease-out_both]">We Deliver Near You</span>
            </div>
            <p class="text-white/80 text-sm mb-4 animate-[cPromoIn_0.5s_ease-out_0.1s_both]">Check if we deliver to your area</p>

            <form (ngSubmit)="checkDelivery()" class="flex gap-2.5 animate-[cPromoIn_0.5s_ease-out_0.15s_both]">
              <div class="relative flex-1">
                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">pin_drop</span>
                <input
                  type="text"
                  [(ngModel)]="pincode"
                  name="pincode"
                  placeholder="Enter 6-digit pincode"
                  maxlength="6"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  aria-label="Pincode"
                  class="w-full py-2.5 pl-9 pr-3 rounded-xl bg-white text-slate-900 text-sm font-medium outline-none shadow-md focus:shadow-lg transition-shadow duration-300"
                />
              </div>
              <button type="submit"
                      [disabled]="checking()"
                      class="px-4 py-2.5 bg-white text-slate-900 font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300 cursor-pointer inline-flex items-center justify-center whitespace-nowrap">
                @if (checking()) {
                  <span class="material-icons text-lg animate-spin">refresh</span>
                } @else {
                  Check
                }
              </button>
            </form>

            @if (result()) {
              <div class="mt-3 p-3.5 rounded-xl backdrop-blur-sm animate-[cResultPop_0.3s_ease-out_both]"
                   [class.bg-white/15]="result()!.deliverable"
                   [class.border]="result()!.deliverable"
                   [class.border-white/20]="result()!.deliverable"
                   [class.bg-white/10]="!result()!.deliverable">
                <div class="flex items-center gap-2.5">
                  <span class="material-icons text-lg"
                        [class.text-green-300]="result()!.deliverable"
                        [class.text-red-300]="!result()!.deliverable">
                    {{ result()!.deliverable ? 'check_circle' : 'cancel' }}
                  </span>
                  <div>
                    <p class="font-bold text-sm">{{ result()!.message }}</p>
                    @if (result()!.deliverable) {
                      <div class="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-white/80 text-xs">
                        @if (result()!.zone_name) {
                          <span class="inline-flex items-center gap-1">
                            <span class="material-icons text-sm">my_location</span>{{ result()!.zone_name }}
                          </span>
                        }
                        <span class="inline-flex items-center gap-1">
                          <span class="material-icons text-sm">schedule</span>{{ result()!.estimated_delivery_time || 30 }} min
                        </span>
                        @if (result()!.delivery_charge === 0) {
                          <span class="text-green-300 font-bold inline-flex items-center gap-1">
                            <span class="material-icons text-sm">local_offer</span>Free!
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
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
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
