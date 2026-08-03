import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerBrowseApiService } from '../../../../../core/services/customer-browse-api.service';
import { SubscriptionPlan } from '../../../../../core/models/subscription-plan/subscription-plan.model';
import { SubscriptionCardComponent } from '../../../../../shared/components/subscription-card/subscription-card.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-plans-section',
  standalone: true,
  imports: [CommonModule, SubscriptionCardComponent, EmptyStateComponent],
  template: `
    <section class="bg-slate-100 py-8 sm:py-20 relative overflow-hidden" aria-label="Subscription plans">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-100/30 rounded-full blur-[120px]"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-6 sm:mb-14">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/15 text-green-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
            <span class="material-icons text-sm">card_membership</span> Subscriptions
          </span>
          <h2 class="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-1">Subscription Plans</h2>
          <p class="text-slate-600 max-w-lg mx-auto text-xs sm:text-base">Choose a plan that fits your lifestyle. Save more with longer subscriptions.</p>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 animate-pulse shadow-sm">
                <div class="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div class="h-4 bg-slate-100 rounded w-2/3 mb-6"></div>
                <div class="h-8 bg-slate-200 rounded w-1/2 mb-6"></div>
                <div class="space-y-3 mb-8">
                  @for (j of [1,2,3,4]; track j) {
                    <div class="h-4 bg-slate-100 rounded w-full"></div>
                  }
                </div>
                <div class="h-12 bg-slate-200 rounded-xl w-full"></div>
              </div>
            }
          </div>
        } @else if (plans().length === 0) {
          <div class="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span class="material-icons text-5xl text-slate-300 mb-3">card_membership</span>
            <p class="text-slate-500 text-sm">Subscription plans will appear here soon.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            @for (plan of plans(); track plan.id; let i = $index) {
              <app-subscription-card [plan]="plan"></app-subscription-card>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class PlansSectionComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  plans = signal<SubscriptionPlan[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.browseApi.getSubscriptionPlans({ per_page: 6 }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) this.plans.set(res.data);
      },
      error: () => this.loading.set(false),
    });
  }
}
