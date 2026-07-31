import { Component, inject, OnInit, signal, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { CustomerBrowseApiService, HomeStats } from '../../../../../core/services/customer-browse-api.service';
import { FogOverlayComponent } from './fog-overlay.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, FogOverlayComponent],
  template: `
    <section class="relative overflow-hidden" style="background: linear-gradient(to bottom right, #059669, #047857, #166534)" aria-label="Hero">
      <app-fog-overlay />
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-full h-full opacity-[0.08]">
          <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-white rounded-full blur-[100px]"></div>
          <div class="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-cyan-200 rounded-full blur-[120px]"></div>
        </div>
        <div class="absolute inset-0 opacity-[0.04]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-6"
                 style="animation: float 3s ease-in-out infinite;">
              <span class="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></span>
              <span class="text-sm font-medium text-white">Fresh &amp; Healthy Meals Daily</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-extrabold leading-[1.1] mb-6 text-white">
              Delicious Tiffin Meals,<br class="hidden sm:block" /> Delivered to Your Door
            </h1>

            <p class="text-base sm:text-lg lg:text-xl text-emerald-100 mb-8 leading-relaxed max-w-lg">
              Experience homestyle cooking with the freshest ingredients. Choose from a variety of meal plans tailored to your taste and nutrition needs.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <a routerLink="/meals"
                 class="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                <span class="material-icons mr-2 group-hover:rotate-12 transition-transform duration-300">restaurant_menu</span>
                Browse Meals
              </a>
              <a routerLink="/subscriptions"
                 class="group inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl text-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                <span class="material-icons mr-2 group-hover:scale-110 transition-transform duration-300">card_membership</span>
                View Plans
              </a>
            </div>

            @if (stats()) {
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-icons text-yellow-300 text-lg">star</span>
                    <span class="font-extrabold text-xl leading-tight text-white">{{ animatedStats().rating }}</span>
                  </div>
                  <p class="text-emerald-200/80 text-xs font-medium">Avg Rating</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-icons text-yellow-300 text-lg">restaurant</span>
                    <span class="font-extrabold text-xl leading-tight text-white">{{ animatedStats().meals }}+</span>
                  </div>
                  <p class="text-emerald-200/80 text-xs font-medium">Meals</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-icons text-yellow-300 text-lg">people</span>
                    <span class="font-extrabold text-xl leading-tight text-white">{{ animatedStats().customers }}+</span>
                  </div>
                  <p class="text-emerald-200/80 text-xs font-medium">Customers</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-icons text-yellow-300 text-lg">local_shipping</span>
                    <span class="font-extrabold text-xl leading-tight text-white">{{ animatedStats().deliveries }}+</span>
                  </div>
                  <p class="text-emerald-200/80 text-xs font-medium">Deliveries</p>
                </div>
              </div>
            }
          </div>

          <div class="hidden lg:flex justify-center items-center">
            <div class="relative" style="animation: float 4s ease-in-out infinite;">
              <div class="w-80 h-80 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] flex items-center justify-center">
                <div class="w-56 h-56 rounded-full bg-white/[0.08] flex items-center justify-center border border-white/[0.08]">
                  <span class="text-[7rem] drop-shadow-lg">🍱</span>
                </div>
              </div>

              <!-- Floating ingredients around the bento -->
              <div style="position: absolute; top: -1rem; left: 1rem; font-size: 2rem; animation: heroIngFloat 5s ease-in-out infinite; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">&#127813;</div>
              <div style="position: absolute; top: 15%; right: -2rem; font-size: 1.75rem; animation: heroIngFloat 4.5s ease-in-out infinite 0.5s; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">&#129367;</div>
              <div style="position: absolute; bottom: 10%; left: -2rem; font-size: 1.75rem; animation: heroIngFloat 5.5s ease-in-out infinite 1s; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">&#127798;</div>
              <div style="position: absolute; bottom: -1rem; right: 1rem; font-size: 2rem; animation: heroIngFloat 4s ease-in-out infinite 1.5s; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">&#129361;</div>
              <div style="position: absolute; top: 50%; left: -2.5rem; font-size: 1.5rem; animation: heroIngFloat 6s ease-in-out infinite 2s; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">&#127807;</div>
              <div style="position: absolute; top: 40%; right: -2.5rem; font-size: 1.5rem; animation: heroIngFloat 5s ease-in-out infinite 0.8s; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">&#127805;</div>

              <div class="absolute top-2 -right-2 bg-white rounded-2xl px-4 py-3 shadow-2xl shadow-black/10 flex items-center gap-2.5"
                   style="animation: float 3s ease-in-out 0.5s infinite;">
                <div class="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                  <span class="material-icons text-green-500 text-lg">check_circle</span>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">Fresh Daily</p>
                  <p class="text-[10px] text-slate-400">100% Hygienic</p>
                </div>
              </div>

              <div class="absolute -bottom-2 -left-2 bg-white rounded-2xl px-4 py-3 shadow-2xl shadow-black/10 flex items-center gap-2.5"
                   style="animation: float 3s ease-in-out 1s infinite;">
                <div class="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span class="material-icons text-emerald-500 text-lg">schedule</span>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">On-Time</p>
                  <p class="text-[10px] text-slate-400">30 min delivery</p>
                </div>
              </div>

              <div class="absolute top-1/2 -left-6 bg-white rounded-2xl px-4 py-3 shadow-2xl shadow-black/10 flex items-center gap-2.5"
                   style="animation: float 3s ease-in-out 1.5s infinite;">
                <div class="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span class="material-icons text-yellow-500 text-lg">thumb_up</span>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">4.8 Rating</p>
                  <p class="text-[10px] text-slate-400">Top rated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    @keyframes heroIngFloat {
      0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
      25% { transform: translateY(-14px) rotate(6deg) scale(1.05); }
      50% { transform: translateY(-6px) rotate(-4deg) scale(0.95); }
      75% { transform: translateY(-16px) rotate(3deg) scale(1.02); }
    }
  `],
})
export class HeroSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  private seo = inject(SeoService);
  private browseApi = inject(CustomerBrowseApiService);
  stats = signal<HomeStats | null>(null);
  animatedStats = signal({ rating: '0', meals: '0', customers: '0', deliveries: '0' });
  private animationFrame?: number;

  ngOnInit(): void {
    this.seo.setPageTitle(
      'Fresh Tiffin Meals Delivered Daily',
      'Order delicious, homestyle tiffin meals delivered to your doorstep. Fresh ingredients, flexible subscription plans, and on-time delivery.'
    );
    this.browseApi.getHomeStats().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats.set(res.data);
          this.animateCounters(res.data);
        }
      },
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }

  private animateCounters(data: HomeStats): void {
    const duration = 1500;
    const start = performance.now();
    const targets = {
      rating: data.average_rating,
      meals: data.total_meals,
      customers: data.happy_customers,
      deliveries: data.total_deliveries,
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      this.animatedStats.set({
        rating: (targets.rating * ease).toFixed(1),
        meals: this.formatNumber(Math.round(targets.meals * ease)),
        customers: this.formatNumber(Math.round(targets.customers * ease)),
        deliveries: this.formatNumber(Math.round(targets.deliveries * ease)),
      });

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(tick);
      }
    };

    this.animationFrame = requestAnimationFrame(tick);
  }

  formatNumber(num: number): string {
    if (num >= 10000) return (num / 1000).toFixed(0) + 'K';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return String(num);
  }
}
