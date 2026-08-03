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

      <div class="max-w-7xl mx-auto lg:px-8 py-0 sm:py-20 lg:py-28 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="hidden lg:block max-w-xl">
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
              <div class="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
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

          <div class="relative w-full h-56 sm:h-72 lg:h-96 overflow-hidden lg:rounded-3xl lg:shadow-2xl lg:shadow-black/25 lg:ring-1 lg:ring-white/20">
            <div class="flex h-full transition-transform duration-700 ease-out will-change-transform"
                 [style.transform]="'translateX(' + (0 - currentSlide() * 100) + '%)'">
              @for (img of heroBanners; track img; let i = $index) {
                <div class="relative h-full min-w-full">
                  <img [src]="img" [alt]="'Tiffin banner ' + (i + 1)" class="h-full w-full object-cover" loading="eager" />
                </div>
              }
            </div>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/45 via-transparent to-transparent lg:from-transparent"></div>

            <div class="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
              @for (img of heroBanners; track img; let i = $index) {
                <button type="button" (click)="goToSlide(i)" [attr.aria-label]="'Go to slide ' + (i + 1)"
                        class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                        [style.width]="i === currentSlide() ? '1.25rem' : '0.375rem'"
                        [style.background]="i === currentSlide() ? '#ffffff' : 'rgba(255,255,255,0.6)'"></button>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="hidden sm:block absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white"/>
        </svg>
      </div>
    </section>
  `,
  styles: [``],
})
export class HeroSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  private seo = inject(SeoService);
  private browseApi = inject(CustomerBrowseApiService);
  heroBanners: string[] = [
    'assets/banners/banner-1.png',
    'assets/banners/banner-2.png',
    'assets/banners/banner-3.png',
  ];
  currentSlide = signal(0);
  private sliderInterval?: ReturnType<typeof setInterval>;
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

    this.startSlider();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.sliderInterval) clearInterval(this.sliderInterval);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.restartSlider();
  }

  private nextSlide(): void {
    this.currentSlide.set((this.currentSlide() + 1) % this.heroBanners.length);
  }

  private startSlider(): void {
    this.sliderInterval = setInterval(() => this.nextSlide(), 4000);
  }

  private restartSlider(): void {
    if (this.sliderInterval) clearInterval(this.sliderInterval);
    this.startSlider();
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
