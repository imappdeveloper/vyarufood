import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap, catchError, of } from 'rxjs';
import { CustomerBrowseApiService } from '../../../../core/services/customer-browse-api.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import { SeoService } from '../../../../core/services/seo.service';
import { SubscriptionPlan } from '../../../../core/models/subscription-plan/subscription-plan.model';

@Component({
  selector: 'app-subscription-plan-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    @if (loading()) {
      <!-- Loading skeleton -->
      <div style="max-width: 80rem; margin: 0 auto; padding: 2rem 1rem;">
        <div style="display: flex; flex-direction: column; gap: 1.5rem; animation: skeletonPulse 1.5s ease-in-out infinite;">
          <div style="height: 1rem; width: 12rem; background: #e2e8f0; border-radius: 0.25rem;"></div>
          <div style="height: 2rem; width: 50%; background: #e2e8f0; border-radius: 0.25rem;"></div>
          <div style="height: 1rem; width: 75%; background: #e2e8f0; border-radius: 0.25rem;"></div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 1rem;">
            <div style="height: 20rem; background: #e2e8f0; border-radius: 0.75rem;"></div>
            <div style="height: 16rem; background: #e2e8f0; border-radius: 0.75rem;"></div>
          </div>
        </div>
      </div>
    } @else if (plan()) {
      <div style="max-width: 80rem; margin: 0 auto; padding: 1.5rem 1rem 3rem;">
        <!-- Breadcrumb -->
        <nav style="margin-bottom: 1.5rem; animation: subSlideIn 0.5s ease-out;" aria-label="Breadcrumb">
          <ol style="display: flex; align-items: center; gap: 0.25rem; list-style: none; padding: 0; margin: 0;">
            <li><a routerLink="/" style="color: #64748b; text-decoration: none; font-size: 0.8rem; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#64748b'">Home</a></li>
            <li><span class="material-icons" style="font-size: 14px; color: #cbd5e1;">chevron_right</span></li>
            <li><a routerLink="/subscriptions" style="color: #64748b; text-decoration: none; font-size: 0.8rem; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#64748b'">Plans</a></li>
            <li><span class="material-icons" style="font-size: 14px; color: #cbd5e1;">chevron_right</span></li>
            <li style="color: #0f172a; font-weight: 600; font-size: 0.8rem;">{{ plan()!.plan_name }}</li>
          </ol>
        </nav>

        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;" class="sub-detail-grid">
          <!-- Plan Info -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;" class="sub-detail-main">
            <!-- Badges -->
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; animation: subSlideIn 0.5s ease-out 0.1s both;">
              @if (plan()!.is_popular) {
                <span style="padding: 0.25rem 0.75rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-size: 0.7rem; font-weight: 700; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.25rem; box-shadow: 0 2px 8px rgba(5,150,105,0.3);">
                  <span class="material-icons" style="font-size: 12px;">workspace_premium</span> Most Popular
                </span>
              }
              @if (plan()!.is_recommended && !plan()!.is_popular) {
                <span style="padding: 0.25rem 0.75rem; background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; font-size: 0.7rem; font-weight: 700; border-radius: 9999px;">Recommended</span>
              }
              <span style="padding: 0.25rem 0.75rem; background: #f1f5f9; color: #475569; font-size: 0.7rem; font-weight: 500; border-radius: 9999px; text-transform: capitalize;">{{ plan()!.plan_type }}</span>
              <span style="padding: 0.25rem 0.75rem; background: #f1f5f9; color: #475569; font-size: 0.7rem; font-weight: 500; border-radius: 9999px; text-transform: capitalize;">{{ plan()!.billing_cycle?.replace('_', ' ') }}</span>
            </div>

            <h1 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; animation: subSlideIn 0.5s ease-out 0.15s both;">{{ plan()!.plan_name }}</h1>

            @if (plan()!.description) {
              <p style="color: #64748b; line-height: 1.7; font-size: 0.875rem; animation: subSlideIn 0.5s ease-out 0.2s both;">{{ plan()!.description }}</p>
            }

            <!-- Features -->
            <div style="background: #fff; border-radius: 0.75rem; border: 1px solid #f1f5f9; padding: 1.5rem; animation: subSlideIn 0.5s ease-out 0.25s both;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.375rem;">
                <span class="material-icons" style="font-size: 20px; color: #059669;">verified</span>
                What's Included
              </h3>
              <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;" class="sub-features-grid">
                @if (plan()!.duration_days) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">{{ plan()!.duration_days }} days of meals</span>
                  </div>
                }
                @if (plan()!.meal_category_name) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">{{ plan()!.meal_category_name }}</span>
                  </div>
                }
                @if (plan()!.meal_selection_enabled) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Meal selection included</span>
                  </div>
                }
                @if (plan()!.allow_skip && plan()!.maximum_skip_days) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Skip up to {{ plan()!.maximum_skip_days }} days</span>
                  </div>
                }
                @if (plan()!.allow_pause) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Pause subscription</span>
                  </div>
                }
                @if (plan()!.weekend_delivery) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Weekend delivery</span>
                  </div>
                }
                @if (plan()!.holiday_delivery) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Holiday delivery</span>
                  </div>
                }
                @if (plan()!.delivery_charge === 0 || plan()!.delivery_charge === null) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Free delivery</span>
                  </div>
                } @else {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #94a3b8;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Delivery: &#8377;{{ plan()!.delivery_charge }}</span>
                  </div>
                }
                @if (plan()!.allow_cancel) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Cancel anytime</span>
                  </div>
                }
                @if (plan()!.auto_renew) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Auto-renew{{ plan()!.renewal_discount ? ' (' + plan()!.renewal_discount + '% off)' : '' }}</span>
                  </div>
                }
                @if (plan()!.trial_days) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">{{ plan()!.trial_days }}-day free trial</span>
                  </div>
                }
                @if (plan()!.allow_upgrade) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
                    <span style="font-size: 0.8rem; color: #475569;">Upgrade available</span>
                  </div>
                }
              </div>
            </div>

            <!-- Plan Meals -->
            @if (plan()!.plan_meals && plan()!.plan_meals!.length > 0) {
              <div style="background: #fff; border-radius: 0.75rem; border: 1px solid #f1f5f9; padding: 1.5rem;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.375rem;">
                  <span class="material-icons" style="font-size: 20px; color: #059669;">restaurant_menu</span>
                  Included Meals
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0;">
                  @for (meal of plan()!.plan_meals!; track meal.id) {
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0; border-bottom: 1px solid #f8fafc;">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="material-icons" style="font-size: 16px; color: #059669;">restaurant</span>
                        <span style="font-size: 0.8rem; color: #475569;">{{ meal.meal_name || 'Meal #' + meal.meal_id }}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.375rem;">
                        @if (meal.day_of_week) {
                          <span style="padding: 0.125rem 0.375rem; background: #f1f5f9; color: #64748b; font-size: 0.65rem; border-radius: 9999px; text-transform: capitalize;">{{ meal.day_of_week }}</span>
                        }
                        @if (meal.is_optional) {
                          <span style="padding: 0.125rem 0.375rem; background: #eff6ff; color: #2563eb; font-size: 0.65rem; border-radius: 9999px;">Optional</span>
                        }
                        <span style="font-size: 0.7rem; color: #94a3b8;">x{{ meal.quantity }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Terms -->
            <div style="background: #f0fdf4; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #dcfce7;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.375rem;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">gavel</span>
                Terms & Conditions
              </h3>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                @if (plan()!.allow_skip && plan()!.maximum_skip_days) {
                  <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
                    <span class="material-icons" style="font-size: 14px; color: #94a3b8; margin-top: 0.125rem;">info</span>
                    <span>Skip up to {{ plan()!.maximum_skip_days }} days per subscription period</span>
                  </li>
                }
                @if (plan()!.allow_pause && plan()!.maximum_pause_days) {
                  <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
                    <span class="material-icons" style="font-size: 14px; color: #94a3b8; margin-top: 0.125rem;">info</span>
                    <span>Pause for up to {{ plan()!.maximum_pause_days }} days total</span>
                  </li>
                }
                @if (plan()!.security_deposit > 0) {
                  <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
                    <span class="material-icons" style="font-size: 14px; color: #94a3b8; margin-top: 0.125rem;">info</span>
                    <span>Refundable security deposit: &#8377;{{ plan()!.security_deposit }}</span>
                  </li>
                }
                @if (plan()!.joining_fee > 0) {
                  <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
                    <span class="material-icons" style="font-size: 14px; color: #94a3b8; margin-top: 0.125rem;">info</span>
                    <span>One-time joining fee: &#8377;{{ plan()!.joining_fee }}</span>
                  </li>
                }
                <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
                  <span class="material-icons" style="font-size: 14px; color: #94a3b8; margin-top: 0.125rem;">info</span>
                  <span>All prices are inclusive of applicable taxes unless stated otherwise</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Sidebar: Price + Subscribe -->
          <div class="sub-detail-sidebar">
            <div style="position: sticky; top: 6rem; background: #fff; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1.5rem; animation: subSlideIn 0.5s ease-out 0.3s both;">
              <!-- Price -->
              <div style="margin-bottom: 1rem;">
                @if (plan()!.effective_price && plan()!.effective_price !== plan()!.price) {
                  <span style="font-size: 1rem; color: #94a3b8; text-decoration: line-through;">&#8377;{{ plan()!.price }}</span>
                }
                <div style="display: flex; align-items: baseline; gap: 0.25rem;">
                  <span style="font-size: 2rem; font-weight: 800; color: #0f172a;">&#8377;{{ plan()!.effective_price || plan()!.price }}</span>
                  <span style="font-size: 0.85rem; color: #94a3b8;">/{{ plan()!.billing_cycle === 'monthly' ? 'mo' : plan()!.billing_cycle === 'weekly' ? 'wk' : plan()!.duration_days + ' days' }}</span>
                </div>
                @if (plan()!.effective_price && plan()!.effective_price !== plan()!.price) {
                  <span style="display: inline-block; margin-top: 0.375rem; padding: 0.125rem 0.5rem; background: #ecfdf5; color: #047857; font-size: 0.7rem; font-weight: 600; border-radius: 9999px;">
                    Save {{ getDiscountPercent() }}%
                  </span>
                }
              </div>

              <!-- Fees -->
              @if (plan()!.security_deposit > 0 || plan()!.joining_fee > 0 || plan()!.delivery_charge > 0) {
                <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem 0; border-top: 1px solid #f1f5f9; margin-bottom: 1rem; font-size: 0.8rem;">
                  @if (plan()!.security_deposit > 0) {
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #64748b;">Security Deposit</span>
                      <span style="color: #0f172a;">&#8377;{{ plan()!.security_deposit }}</span>
                    </div>
                  }
                  @if (plan()!.joining_fee > 0) {
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #64748b;">Joining Fee</span>
                      <span style="color: #0f172a;">&#8377;{{ plan()!.joining_fee }}</span>
                    </div>
                  }
                  @if (plan()!.delivery_charge > 0) {
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #64748b;">Delivery Charge</span>
                      <span style="color: #0f172a;">&#8377;{{ plan()!.delivery_charge }}</span>
                    </div>
                  }
                </div>
              }

              @if (plan()!.tax_percentage > 0) {
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 0.5rem 0; border-top: 1px solid #f1f5f9; margin-bottom: 1rem;">
                  <span style="color: #64748b;">Tax ({{ plan()!.tax_percentage }}%)</span>
                  <span style="color: #0f172a;">Included</span>
                </div>
              }

              <!-- Subscribe Button -->
              <button (click)="onSubscribe()"
                      style="width: 100%; padding: 0.875rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-weight: 700; font-size: 0.9rem; border-radius: 0.75rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(5,150,105,0.35); transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem;"
                      onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)'"
                      onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none'">
                <span class="material-icons">card_membership</span>
                Subscribe Now
              </button>

              <p style="font-size: 0.7rem; color: #94a3b8; text-align: center;">
                Start your subscription today. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <!-- Not Found -->
      <div style="max-width: 80rem; margin: 0 auto; padding: 5rem 1rem; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;">&#127835;</div>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Plan Not Found</h2>
        <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.875rem;">The subscription plan you're looking for is unavailable.</p>
        <a routerLink="/subscriptions"
           style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-weight: 600; font-size: 0.875rem; border-radius: 0.75rem; text-decoration: none; box-shadow: 0 4px 14px rgba(5,150,105,0.35); transition: all 0.3s;"
           onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)'"
           onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none'">
          <span class="material-icons">arrow_back</span> View All Plans
        </a>
      </div>
    }
  `,
  styles: [`
    @keyframes subSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes skeletonPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .sub-detail-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .sub-detail-sidebar {
      width: 100%;
    }
    .sub-features-grid {
      grid-template-columns: 1fr;
    }
    @media (min-width: 640px) {
      .sub-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (min-width: 1024px) {
      .sub-detail-grid { grid-template-columns: 3fr 2fr !important; gap: 2.5rem !important; }
    }
  `],
})
export class SubscriptionPlanDetailComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  private appState = inject(AppStateService);
  private destroy$ = new Subject<void>();

  plan = signal<SubscriptionPlan | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) {
          this.loading.set(false);
          return of(null);
        }
        this.loading.set(true);
        return this.browseApi.getSubscriptionPlanBySlug(slug).pipe(
          catchError(() => { this.loading.set(false); return of(null); })
        );
      })
    ).subscribe(res => {
      this.loading.set(false);
      if (res && res.success && res.data) {
        this.plan.set(res.data);
        this.seo.setPageTitle(
          res.data.plan_name,
          `${res.data.plan_name} - ${res.data.description || 'Fresh meals delivered daily'}`
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDiscountPercent(): number {
    const p = this.plan();
    if (!p || !p.effective_price || !p.price || p.price === 0) return 0;
    return Math.round(((p.price - p.effective_price) / p.price) * 100);
  }

  onSubscribe(): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/subscriptions/${this.plan()?.slug}` },
      });
      return;
    }
    this.router.navigate(['/subscriptions', this.plan()?.slug, 'configure']);
  }
}
