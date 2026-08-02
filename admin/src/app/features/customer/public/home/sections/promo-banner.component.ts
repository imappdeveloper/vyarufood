import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label="Promotional offer">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl shadow-teal-600/20">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute -top-12 -right-12 w-56 h-56 bg-white rounded-full blur-3xl"></div>
          <div class="absolute -bottom-16 left-1/4 w-48 h-48 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 flex flex-wrap items-center gap-8 px-7 sm:px-10 lg:px-14 py-10 sm:py-12 text-white">
          <div class="flex-1 min-w-[18rem]">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-xs font-bold mb-4 animate-[promoSlideIn_0.6s_ease-out_both]">
              <span class="material-icons text-sm text-yellow-300">local_offer</span> Limited Time Offer
            </span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-2 animate-[promoSlideIn_0.6s_ease-out_0.1s_both]">
              Get <span class="text-yellow-300">20% OFF</span> on First Subscription
            </h2>
            <p class="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-lg animate-[promoSlideIn_0.6s_ease-out_0.2s_both]">
              Fresh homestyle meals delivered to your doorstep with zero delivery charges.
            </p>
            <div class="flex flex-wrap gap-3 animate-[promoSlideIn_0.6s_ease-out_0.3s_both]">
              <a routerLink="/subscriptions"
                 class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <span class="material-icons text-lg">card_membership</span> View Plans
              </a>
              <a routerLink="/meals"
                 class="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white/40 text-white font-semibold text-sm rounded-xl hover:bg-white/10 hover:border-white/60 transition-all duration-300">
                <span class="material-icons text-lg">restaurant_menu</span> Browse Meals
              </a>
            </div>
          </div>

          <div class="flex-shrink-0 hidden sm:flex items-center animate-[promoSlideRight_0.7s_ease-out_0.2s_both]">
            <div class="relative">
              <div class="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center border border-white/15 animate-[float_3s_ease-in-out_infinite]">
                <span class="text-5xl">&#127859;</span>
              </div>
              <div class="absolute -top-1.5 -right-2 bg-yellow-400 text-slate-900 rounded-lg px-2 py-1 shadow-lg animate-[promoPop_0.5s_ease-out_0.5s_both]">
                <p class="text-[0.55rem] font-bold leading-none">CODE</p>
                <p class="text-xs font-extrabold tracking-wide leading-tight">FIRST20</p>
              </div>
              <div class="absolute -bottom-1 -left-3 bg-white rounded-lg px-2 py-1 shadow-lg flex items-center gap-1 animate-[promoPop_0.5s_ease-out_0.6s_both]">
                <span class="material-icons text-green-500 text-sm">check_circle</span>
                <span class="text-xs font-bold text-slate-700">Free Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes promoSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes promoSlideRight {
      from { opacity: 0; transform: translateX(20px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes promoPop {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `],
})
export class PromoBannerComponent {}
