import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerBrowseApiService } from '../../../../core/services/customer-browse-api.service';
import { SubscriptionPlan } from '../../../../core/models/subscription-plan/subscription-plan.model';
import { SubscriptionCardComponent } from '../../../../shared/components/subscription-card/subscription-card.component';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, SubscriptionCardComponent],
  template: `
    <!-- Hero Banner -->
    <section style="background: linear-gradient(135deg, #059669, #047857, #166534); padding: 3.5rem 1rem 4rem; position: relative; overflow: hidden;">
      <!-- Decorative blurs -->
      <div style="position: absolute; inset: 0; opacity: 0.06; pointer-events: none;">
        <div style="position: absolute; top: -3rem; right: -3rem; width: 14rem; height: 14rem; background: #fff; border-radius: 50%; filter: blur(50px);"></div>
        <div style="position: absolute; bottom: -4rem; left: -3rem; width: 12rem; height: 12rem; background: #fff; border-radius: 50%; filter: blur(50px);"></div>
        <div style="position: absolute; top: 20%; left: 40%; width: 8rem; height: 8rem; background: #a7f3d0; border-radius: 50%; filter: blur(40px);"></div>
      </div>
      <!-- Floating food emojis -->
      <div style="position: absolute; top: 10%; left: 8%; font-size: 1.5rem; animation: subHeroFloat 5s ease-in-out infinite; opacity: 0.25;">&#127835;</div>
      <div style="position: absolute; top: 25%; right: 12%; font-size: 1.25rem; animation: subHeroFloat 6s ease-in-out infinite 1s; opacity: 0.2;">&#129367;</div>
      <div style="position: absolute; bottom: 25%; left: 15%; font-size: 1.75rem; animation: subHeroFloat 4.5s ease-in-out infinite 0.5s; opacity: 0.2;">&#127798;</div>
      <div style="position: absolute; bottom: 18%; right: 8%; font-size: 1.5rem; animation: subHeroFloat 5.5s ease-in-out infinite 2s; opacity: 0.25;">&#129361;</div>
      <div style="position: absolute; top: 50%; left: 5%; font-size: 1rem; animation: subHeroFloat 7s ease-in-out infinite 3s; opacity: 0.15;">&#127807;</div>
      <div style="position: absolute; top: 15%; left: 55%; font-size: 1.1rem; animation: subHeroFloat 6.5s ease-in-out infinite 1.5s; opacity: 0.18;">&#127805;</div>
      <!-- Steam wisps -->
      <div style="position: absolute; top: 5%; left: 50%; transform: translateX(-50%); display: flex; gap: 1rem; opacity: 0.12;">
        <div style="width: 2px; height: 2.5rem; background: linear-gradient(to top, #fff, transparent); border-radius: 9999px; animation: subSteam 2.5s ease-in-out infinite;"></div>
        <div style="width: 2px; height: 3rem; background: linear-gradient(to top, #fff, transparent); border-radius: 9999px; animation: subSteam 3s ease-in-out infinite 0.4s;"></div>
        <div style="width: 2px; height: 2rem; background: linear-gradient(to top, #fff, transparent); border-radius: 9999px; animation: subSteam 2s ease-in-out infinite 0.8s;"></div>
      </div>

      <div style="max-width: 80rem; margin: 0 auto; position: relative; z-index: 10;">
        <!-- Breadcrumb -->
        <nav style="margin-bottom: 1rem; animation: subSlideIn 0.5s ease-out;" aria-label="Breadcrumb">
          <ol style="display: flex; align-items: center; gap: 0.25rem; list-style: none; padding: 0; margin: 0;">
            <li><a routerLink="/" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.8rem; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Home</a></li>
            <li><span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span></li>
            <li style="color: #fff; font-weight: 600; font-size: 0.8rem;">Subscription Plans</li>
          </ol>
        </nav>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.375rem;">
          <span class="material-icons" style="font-size: 2rem; color: rgba(255,255,255,0.9); animation: subSlideIn 0.5s ease-out 0.05s both;">card_membership</span>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff; animation: subSlideIn 0.5s ease-out 0.1s both;">
            Subscription Plans
          </h1>
        </div>
        <p style="color: rgba(255,255,255,0.8); font-size: 0.875rem; max-width: 36rem; animation: subSlideIn 0.5s ease-out 0.2s both;">
          Choose a plan that fits your lifestyle. Enjoy fresh, home-style meals delivered daily with the flexibility to pause, skip, or cancel anytime.
        </p>
        <!-- Stat pills -->
        <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem; animation: subSlideIn 0.5s ease-out 0.3s both;">
          <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 9999px;">
            <span class="material-icons" style="font-size: 14px; color: #86efac;">verified</span>
            <span style="font-size: 0.75rem; font-weight: 600; color: #fff;">Flexible Plans</span>
          </div>
          <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 9999px;">
            <span class="material-icons" style="font-size: 14px; color: #86efac;">local_shipping</span>
            <span style="font-size: 0.75rem; font-weight: 600; color: #fff;">Free Delivery</span>
          </div>
          <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 9999px;">
            <span class="material-icons" style="font-size: 14px; color: #86efac;">cancel</span>
            <span style="font-size: 0.75rem; font-weight: 600; color: #fff;">Cancel Anytime</span>
          </div>
        </div>
      </div>
      <!-- Bottom wave -->
      <div style="position: absolute; bottom: 0; left: 0; right: 0;">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; display: block;">
          <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div style="max-width: 80rem; margin: 0 auto; padding: 2rem 1rem 3rem; background: #f8fafc;">

      <!-- Loading State -->
      @if (loading()) {
        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;" class="sub-plans-grid">
          @for (i of [1, 2, 3]; track i) {
            <div style="background: #fff; border-radius: 1rem; overflow: hidden; border: 1px solid #f1f5f9; animation: skeletonPulse 1.5s ease-in-out infinite;" [style.animation-delay]="(i * 0.1) + 's'">
              <div style="height: 10rem; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
              <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="height: 1rem; width: 60%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                <div style="height: 0.75rem; width: 80%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                <div style="height: 2rem; width: 40%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                  <div style="height: 0.75rem; width: 90%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                  <div style="height: 0.75rem; width: 70%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                  <div style="height: 0.75rem; width: 80%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                </div>
                <div style="height: 2.5rem; width: 100%; background: #f1f5f9; border-radius: 0.75rem; margin-top: 0.5rem;"></div>
              </div>
            </div>
          }
        </div>
      } @else if (plans().length === 0) {
        <!-- Empty State -->
        <div style="text-align: center; padding: 4rem 1rem; background: #fff; border-radius: 1rem; border: 1px solid #e5e7eb;">
          <div style="font-size: 3.5rem; margin-bottom: 0.75rem; animation: float 3s ease-in-out infinite;">&#127835;</div>
          <h2 style="font-size: 1.125rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">No Plans Available</h2>
          <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.875rem;">We're working on new subscription plans. Check back soon!</p>
          <a routerLink="/meals"
             style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-weight: 600; font-size: 0.875rem; border-radius: 0.75rem; text-decoration: none; box-shadow: 0 4px 14px rgba(5,150,105,0.35); transition: all 0.3s;"
             onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)'"
             onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none'">
            <span class="material-icons" style="font-size: 20px;">restaurant_menu</span> Browse Meals
          </a>
        </div>
      } @else {
        <!-- Plan Type Tabs -->
        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; animation: subSlideIn 0.5s ease-out 0.3s both;">
          <button (click)="filterByType('all')"
                  style="padding: 0.5rem 1.25rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.25s;"
                  [style.background]="activeFilter() === 'all' ? 'linear-gradient(135deg, #059669, #16a34a)' : '#fff'"
                  [style.color]="activeFilter() === 'all' ? '#fff' : '#475569'"
                  [style.boxShadow]="activeFilter() === 'all' ? '0 2px 8px rgba(5,150,105,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'"
                  [style.border]="activeFilter() === 'all' ? 'none' : '1px solid #e2e8f0'">
            All Plans
          </button>
          @for (type of availableTypes(); track type) {
            <button (click)="filterByType(type)"
                    style="padding: 0.5rem 1.25rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 0.375rem;"
                    [style.background]="activeFilter() === type ? 'linear-gradient(135deg, #059669, #16a34a)' : '#fff'"
                    [style.color]="activeFilter() === type ? '#fff' : '#475569'"
                    [style.boxShadow]="activeFilter() === type ? '0 2px 8px rgba(5,150,105,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'"
                    [style.border]="activeFilter() === type ? 'none' : '1px solid #e2e8f0'"
                    onmouseover="if(!this.style.background.includes('059669')) { this.style.borderColor='#a7f3d0'; }"
                    onmouseout="if(!this.style.background.includes('059669')) { this.style.borderColor='#e2e8f0'; }">
              {{ type | titlecase }}
            </button>
          }
        </div>

        <!-- Plans Grid -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem;" class="sub-plans-grid">
          @for (plan of filteredPlans(); track plan.id; let i = $index) {
            <div class="sub-card-anim" [style.animation-delay]="(i * 0.1) + 's'">
              <app-subscription-card [plan]="plan" />
            </div>
          }
        </div>

        <!-- Benefits Section -->
        <div style="background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border: 1px solid #d1fae5; border-radius: 1rem; padding: 2.5rem 2rem; margin-bottom: 2.5rem; animation: subSlideIn 0.5s ease-out 0.5s both;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 2rem;">Why Subscribe?</h2>
          <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;" class="sub-benefits-grid">
            <!-- Benefit 1 -->
            <div style="text-align: center;">
              <div style="width: 3.5rem; height: 3.5rem; margin: 0 auto 1rem; background: #fff; border-radius: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 1.5rem; color: #059669;">savings</span>
              </div>
              <h3 style="font-weight: 700; color: #0f172a; margin-bottom: 0.375rem; font-size: 0.95rem;">Save More</h3>
              <p style="color: #64748b; font-size: 0.8rem; line-height: 1.5;">Get up to 30% off compared to ordering individual meals</p>
            </div>
            <!-- Benefit 2 -->
            <div style="text-align: center;">
              <div style="width: 3.5rem; height: 3.5rem; margin: 0 auto 1rem; background: #fff; border-radius: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 1.5rem; color: #059669;">event_repeat</span>
              </div>
              <h3 style="font-weight: 700; color: #0f172a; margin-bottom: 0.375rem; font-size: 0.95rem;">Flexible Schedule</h3>
              <p style="color: #64748b; font-size: 0.8rem; line-height: 1.5;">Pause, skip, or cancel your subscription anytime</p>
            </div>
            <!-- Benefit 3 -->
            <div style="text-align: center;">
              <div style="width: 3.5rem; height: 3.5rem; margin: 0 auto 1rem; background: #fff; border-radius: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 1.5rem; color: #059669;">restaurant</span>
              </div>
              <h3 style="font-weight: 700; color: #0f172a; margin-bottom: 0.375rem; font-size: 0.95rem;">Fresh Daily Meals</h3>
              <p style="color: #64748b; font-size: 0.8rem; line-height: 1.5;">Cooked fresh and delivered to your door every day</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div style="text-align: center; animation: subSlideIn 0.5s ease-out 0.6s both;">
          <p style="color: #64748b; margin-bottom: 1rem; font-size: 0.875rem;">Have questions? Need a custom plan?</p>
          <a routerLink="/contact"
             style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border: 2px solid #059669; color: #059669; font-weight: 600; font-size: 0.875rem; border-radius: 0.75rem; text-decoration: none; transition: all 0.3s; background: transparent;"
             onmouseover="this.style.background='#ecfdf5'; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.15)'"
             onmouseout="this.style.background='transparent'; this.style.boxShadow='none'">
            <span class="material-icons" style="font-size: 20px;">support_agent</span> Contact Us
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes subHeroFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-10px) rotate(5deg); }
      50% { transform: translateY(-5px) rotate(-3deg); }
      75% { transform: translateY(-12px) rotate(2deg); }
    }
    @keyframes subSteam {
      0% { opacity: 0; transform: translateY(0) scaleX(1); }
      50% { opacity: 0.6; transform: translateY(-1rem) scaleX(1.5); }
      100% { opacity: 0; transform: translateY(-2rem) scaleX(2); }
    }
    @keyframes subSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes skeletonPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .sub-card-anim {
      animation: cardFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .sub-plans-grid {
      grid-template-columns: 1fr;
    }
    @media (min-width: 640px) {
      .sub-plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .sub-benefits-grid { grid-template-columns: repeat(3, 1fr) !important; }
    }
    @media (min-width: 1024px) {
      .sub-plans-grid { grid-template-columns: repeat(3, 1fr) !important; }
    }
  `],
})
export class SubscriptionPlansComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  private seo = inject(SeoService);

  plans = signal<SubscriptionPlan[]>([]);
  loading = signal(true);
  activeFilter = signal('all');
  availableTypes = signal<string[]>([]);
  filteredPlans = signal<SubscriptionPlan[]>([]);

  ngOnInit(): void {
    this.seo.setPageTitle('Subscription Plans', 'Choose from our flexible tiffin subscription plans. Fresh meals delivered daily.');

    this.browseApi.getSubscriptionPlans({ per_page: 50 }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.plans.set(res.data);
          this.filteredPlans.set(res.data);
          const types = [...new Set(res.data.map((p: SubscriptionPlan) => p.plan_type).filter(Boolean))];
          this.availableTypes.set(types);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  filterByType(type: string): void {
    this.activeFilter.set(type);
    if (type === 'all') {
      this.filteredPlans.set(this.plans());
    } else {
      this.filteredPlans.set(this.plans().filter(p => p.plan_type === type));
    }
  }
}
