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
    <section class="bg-slate-100 py-10 sm:py-14" aria-label="Delivery areas">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 overflow-hidden shadow-2xl shadow-orange-500/20">
          <div class="flex flex-wrap items-center gap-8 px-7 sm:px-10 lg:px-14 py-10 sm:py-12 text-white">

            <!-- Left: text + form -->
            <div class="flex-1 min-w-[20rem]">
              <div class="flex items-center gap-3 mb-1.5">
                <div class="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center animate-[delPulse_2s_ease-in-out_infinite]">
                  <span class="material-icons text-xl">location_on</span>
                </div>
                <span class="text-xl sm:text-2xl font-extrabold animate-[delSlideIn_0.5s_ease-out_both]">We Deliver Near You</span>
              </div>
              <p class="text-white/85 text-sm sm:text-base mb-5 animate-[delSlideIn_0.5s_ease-out_0.1s_both]">Check if we deliver to your area</p>

              <form (ngSubmit)="checkDelivery()" class="flex gap-2.5 max-w-lg animate-[delSlideIn_0.5s_ease-out_0.2s_both]">
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
                    aria-label="Enter pincode"
                    class="w-full py-3 pl-9 pr-3 rounded-xl bg-white text-slate-900 text-sm font-medium outline-none shadow-md focus:shadow-lg transition-shadow duration-300"
                  />
                </div>
                <button type="submit"
                        [disabled]="checking()"
                        class="px-5 py-3 bg-white text-slate-900 font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300 cursor-pointer inline-flex items-center justify-center whitespace-nowrap">
                  @if (checking()) {
                    <span class="material-icons text-lg animate-spin">refresh</span>
                  } @else {
                    Check
                  }
                </button>
              </form>

              @if (result()) {
                <div class="mt-4 p-3.5 rounded-xl backdrop-blur-sm animate-[delResultPop_0.3s_ease-out_both]"
                     [class.bg-white/15]="result()!.deliverable"
                     [class.border]="result()!.deliverable"
                     [class.border-white/20]="result()!.deliverable"
                     [class.bg-white/10]="!result()!.deliverable">
                  <div class="flex items-center gap-2.5">
                    <span class="material-icons text-xl"
                          [class.text-green-300]="result()!.deliverable"
                          [class.text-red-300]="!result()!.deliverable">
                      {{ result()!.deliverable ? 'check_circle' : 'cancel' }}
                    </span>
                    <div class="flex-1">
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
                              <span class="material-icons text-sm">local_offer</span>Free delivery!
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
            <div class="flex-shrink-0 hidden sm:flex items-center gap-4 animate-[delSlideRight_0.6s_ease-out_0.2s_both]">
              <div class="relative">
                <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/15 animate-[delIconBounce_2s_ease-in-out_infinite]">
                  <span class="material-icons text-3xl text-white">delivery_dining</span>
                </div>
              </div>
              <div class="max-w-[10rem]">
                <p class="font-bold text-sm text-white mb-0.5">Fast Delivery</p>
                <p class="text-white/80 text-xs leading-relaxed mb-1.5">30-45 min to your doorstep</p>
                <a routerLink="/delivery-areas"
                   class="inline-flex items-center gap-1.5 text-white font-semibold text-xs hover:gap-2.5 transition-all duration-300">
                  View Areas <span class="material-icons text-sm">arrow_forward</span>
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
