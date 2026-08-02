import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-download',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" aria-label="Download our app">
      <div class="max-w-7xl mx-auto">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

          <!-- Decorative background elements -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-24 -left-16 w-64 h-64 rounded-full" style="background: radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%);"></div>
            <div class="absolute -bottom-16 -right-12 w-48 h-48 rounded-full" style="background: radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%);"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;"></div>
          </div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 sm:p-12">

            <!-- Left: Content -->
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/15 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-orange-400 mb-4 animate-[appSlideIn_0.6s_ease-out_both]">
                <span class="material-icons text-sm">new_releases</span> Coming Soon
              </span>

              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 animate-[appSlideIn_0.6s_ease-out_0.1s_both]">
                Get the
                <span class="bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text text-transparent">Vyaru Tiffin</span>
                App
              </h2>

              <p class="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md animate-[appSlideIn_0.6s_ease-out_0.2s_both]">
                Order meals, manage subscriptions, track deliveries, and more — all from your phone.
              </p>

              <!-- Store buttons -->
              <div class="flex flex-wrap gap-3 mb-6 animate-[appSlideIn_0.6s_ease-out_0.3s_both]">
                <button class="inline-flex items-center gap-2.5 px-5 py-3 bg-white text-slate-900 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <span class="material-icons text-2xl text-green-500">android</span>
                  <span class="text-left">
                    <span class="block text-[0.55rem] text-slate-500 leading-none">GET IT ON</span>
                    <span class="block text-sm font-bold leading-tight">Google Play</span>
                  </span>
                </button>
                <button class="inline-flex items-center gap-2.5 px-5 py-3 bg-white text-slate-900 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <span class="material-icons text-2xl text-slate-900">phone_iphone</span>
                  <span class="text-left">
                    <span class="block text-[0.55rem] text-slate-500 leading-none">Download on the</span>
                    <span class="block text-sm font-bold leading-tight">App Store</span>
                  </span>
                </button>
              </div>

              <!-- Stats row -->
              <div class="flex items-center gap-6 animate-[appSlideIn_0.6s_ease-out_0.4s_both]">
                <div>
                  <p class="text-xl font-extrabold text-emerald-500 leading-none">4.8</p>
                  <div class="flex gap-0.5 my-1.5">
                    <span class="material-icons text-xs text-yellow-400">star</span>
                    <span class="material-icons text-xs text-yellow-400">star</span>
                    <span class="material-icons text-xs text-yellow-400">star</span>
                    <span class="material-icons text-xs text-yellow-400">star</span>
                    <span class="material-icons text-xs text-yellow-400">star_half</span>
                  </div>
                  <p class="text-xs text-slate-500">App Rating</p>
                </div>
                <div class="w-px h-10 bg-white/10"></div>
                <div>
                  <p class="text-xl font-extrabold text-emerald-500 leading-none">5K+</p>
                  <p class="text-xs text-slate-500 mt-3">Downloads</p>
                </div>
                <div class="w-px h-10 bg-white/10"></div>
                <div>
                  <p class="text-xl font-extrabold text-emerald-500 leading-none">24/7</p>
                  <p class="text-xs text-slate-500 mt-3">Support</p>
                </div>
              </div>
            </div>

            <!-- Right: Phone mockup -->
            <div class="flex justify-center items-center app-phone-wrap">
              <div class="relative animate-[appSlideRight_0.7s_ease-out_0.2s_both]">
                <!-- Phone body -->
                <div style="width: 13rem; height: 22rem; background: linear-gradient(145deg, #1e293b, #334155); border-radius: 2rem; padding: 0.375rem; box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);">
                  <div style="width: 100%; height: 100%; background: linear-gradient(160deg, #059669, #16a34a, #22c55e); border-radius: 1.625rem; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <!-- Status bar -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: rgba(255,255,255,0.8); font-size: 0.55rem; font-weight: 600; z-index: 10;">
                      <span>9:41</span>
                      <div style="display: flex; gap: 0.25rem; align-items: center;">
                        <span class="material-icons" style="font-size: 10px;">signal_cellular_alt</span>
                        <span class="material-icons" style="font-size: 10px;">wifi</span>
                        <span class="material-icons" style="font-size: 10px;">battery_full</span>
                      </div>
                    </div>
                    <!-- App content preview -->
                    <div style="text-align: center; color: #fff; padding: 1.5rem;">
                      <div style="width: 3.5rem; height: 3.5rem; background: rgba(255,255,255,0.15); border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);">
                        <span class="material-icons" style="font-size: 1.75rem;">restaurant_menu</span>
                      </div>
                      <p style="font-size: 0.85rem; font-weight: 800; margin-bottom: 0.25rem;">Vyaru Tiffin</p>
                      <p style="font-size: 0.55rem; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem;">Homestyle Meals Delivered</p>
                      <!-- Mini food cards -->
                      <div style="display: flex; gap: 0.375rem; justify-content: center;">
                        <div style="width: 2.75rem; height: 2.75rem; background: rgba(255,255,255,0.12); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08);">
                          <span style="font-size: 1rem;">&#127834;</span>
                        </div>
                        <div style="width: 2.75rem; height: 2.75rem; background: rgba(255,255,255,0.12); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08);">
                          <span style="font-size: 1rem;">&#127835;</span>
                        </div>
                        <div style="width: 2.75rem; height: 2.75rem; background: rgba(255,255,255,0.12); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08);">
                          <span style="font-size: 1rem;">&#127857;</span>
                        </div>
                      </div>
                    </div>
                    <!-- Bottom nav -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 0.625rem 1.5rem 0.875rem; display: flex; justify-content: space-around; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px);">
                      <span class="material-icons" style="font-size: 16px; color: #fff;">home</span>
                      <span class="material-icons" style="font-size: 16px; color: rgba(255,255,255,0.5);">search</span>
                      <span class="material-icons" style="font-size: 16px; color: rgba(255,255,255,0.5);">shopping_cart</span>
                      <span class="material-icons" style="font-size: 16px; color: rgba(255,255,255,0.5);">person</span>
                    </div>
                    <!-- Notch -->
                    <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 5rem; height: 1.125rem; background: #1e293b; border-radius: 0 0 1rem 1rem;"></div>
                  </div>
                </div>

                <!-- Floating badges -->
                <div style="position: absolute; top: 2rem; right: -1rem; background: #fff; border-radius: 0.75rem; padding: 0.5rem 0.75rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 0.375rem; animation: appBadgeFloat 3s ease-in-out infinite;">
                  <div style="width: 1.5rem; height: 1.5rem; background: rgba(34,197,94,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons" style="font-size: 14px; color: #22c55e;">notifications_active</span>
                  </div>
                  <span style="font-size: 0.65rem; font-weight: 700; color: #1e293b; white-space: nowrap;">Order Updates</span>
                </div>

                <div style="position: absolute; bottom: 4rem; left: -1rem; background: #fff; border-radius: 0.75rem; padding: 0.5rem 0.75rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 0.375rem; animation: appBadgeFloat 3s ease-in-out 1s infinite;">
                  <div style="width: 1.5rem; height: 1.5rem; background: rgba(249,115,22,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons" style="font-size: 14px; color: #f97316;">local_shipping</span>
                  </div>
                  <span style="font-size: 0.65rem; font-weight: 700; color: #1e293b; white-space: nowrap;">Live Tracking</span>
                </div>

                <div style="position: absolute; bottom: 1rem; right: -0.5rem; background: linear-gradient(135deg, #059669, #16a34a); border-radius: 0.75rem; padding: 0.5rem 0.75rem; box-shadow: 0 8px 24px rgba(5,150,105,0.3); display: flex; align-items: center; gap: 0.375rem; animation: appBadgeFloat 3s ease-in-out 2s infinite;">
                  <span class="material-icons" style="font-size: 14px; color: #fff;">schedule</span>
                  <span style="font-size: 0.65rem; font-weight: 700; color: #fff; white-space: nowrap;">30 min delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes appSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes appSlideRight {
      from { opacity: 0; transform: translateX(30px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes appBadgeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @media (max-width: 1023px) {
      .app-phone-wrap { display: none !important; }
    }
  `],
})
export class AppDownloadComponent {}
