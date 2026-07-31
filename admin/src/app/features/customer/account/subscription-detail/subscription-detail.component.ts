import { Component, inject, OnInit, OnDestroy, signal, ChangeDetectionStrategy, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, switchMap, catchError, of } from 'rxjs';
import { CustomerSubscriptionApiService } from '../../../../core/services/customer-subscription-api.service';
import { CustomerSubscription } from '../../../../core/models/customer-subscription/customer-subscription.model';
import { CustomerBrowseApiService } from '../../../../core/services/customer-browse-api.service';
import { SubscriptionPlan } from '../../../../core/models/subscription-plan/subscription-plan.model';
import { WeeklyMenu, WeeklyMenuItem } from '../../../../core/models/weekly-menu/weekly-menu.model';
import { SeoService } from '../../../../core/services/seo.service';

interface TimelineEvent {
  id?: number | string;
  type: string;
  label?: string;
  description?: string;
  timestamp: string;
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  dayLabel: string;
  dayNum: number;
  status: 'past' | 'scheduled' | 'skipped' | 'paused' | 'future';
  isConsumed: boolean;
}

@Component({
  selector: 'app-subscription-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule],
  styles: [`
    .clickable-day {
      cursor: pointer;
      transition: box-shadow 0.2s ease, background 0.2s ease;
    }
    .clickable-day:hover {
      box-shadow: inset 0 0 0 2px #059669;
    }
  `],
  template: `
    <div [style]="'max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem 1.5rem 1rem;'">
      <!-- Toast Banner -->
      @if (actionMessage()) {
        <div [style.margin]="'0 0 1rem 0'" [style.borderRadius]="'12px'" [style.padding]="'12px 16px'"
             [style.fontSize]="'13px'" [style.fontWeight]="'500'" [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'"
             [style.transition]="'all 0.3s'"
             [style.background]="actionMessage()!.type === 'success' ? '#ecfdf5' : '#fef2f2'"
             [style.color]="actionMessage()!.type === 'success' ? '#065f46' : '#b91c1c'"
             [style.border]="actionMessage()!.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca'">
          <span class="material-icons" [style.fontSize]='actionMessage()!.type === "success" ? "18px" : "18px"'>
            {{ actionMessage()!.type === 'success' ? 'check_circle' : 'error' }}
          </span>
          <span>{{ actionMessage()!.text }}</span>
          <button (click)="actionMessage.set(null)" [style.marginLeft]="'auto'" [style.background]="'transparent'" [style.border]="'none'" [style.cursor]="'pointer'" [style.padding]="'2px'">
            <span class="material-icons" [style.fontSize]="'16px'" [style.opacity]="'0.5'">close</span>
          </button>
        </div>
      }

      @if (loading()) {
        <div [style.animation]="'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'" [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'16px'">
          <div [style.height]="'24px'" [style.background]="'#e5e7eb'" [style.borderRadius]="'8px'" [style.width]="'33%'"></div>
          <div [style.height]="'16px'" [style.background]="'#e5e7eb'" [style.borderRadius]="'8px'" [style.width]="'25%'"></div>
          <div [style.height]="'192px'" [style.background]="'#f3f4f6'" [style.borderRadius]="'12px'"></div>
        </div>
      } @else if (subscription()) {
        <!-- Gradient Green Hero -->
        <div [style.background]="'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)'"
             [style.borderRadius]="'16px'" [style.padding]="isDesktop() ? '32px 40px' : '24px 20px'"
             [style.margin]="'0 0 24px 0'" [style.position]="'relative'" [style.overflow]="'hidden'">
          <div [style.position]="'absolute'" [style.top]="'-30px'" [style.right]="'-30px'" [style.width]="'180px'" [style.height]="'180px'"
               [style.borderRadius]="'50%'" [style.background]="'rgba(255,255,255,0.05)'"></div>
          <div [style.position]="'absolute'" [style.bottom]="'-50px'" [style.left]="'-20px'" [style.width]="'120px'" [style.height]="'120px'"
               [style.borderRadius]="'50%'" [style.background]="'rgba(255,255,255,0.04)'"></div>
          <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.alignItems]="'flex-start'" [style.position]="'relative'" [style.zIndex]="'1'">
            <div [style.flex]="'1'">
              <a routerLink="/customer/subscriptions" [style.display]="'inline-flex'" [style.alignItems]="'center'" [style.gap]="'6px'"
                 [style.color]="'rgba(255,255,255,0.8)'" [style.textDecoration]="'none'" [style.fontSize]="'13px'"
                 [style.marginBottom]="'12px'" [style.transition]="'color 0.2s'">
                <span class="material-icons" [style.fontSize]="'16px'">arrow_back</span> Back to Subscriptions
              </a>
              <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'" [style.marginBottom]="'4px'">
                <h1 [style.color]="'#fff'" [style.fontSize]="isDesktop() ? '26px' : '22px'" [style.fontWeight]="'700'" [style.margin]="'0'">
                  {{ subscription()!.plan_name || 'Subscription' }}
                </h1>
                <span [style.display]="'inline-block'" [style.padding]="'3px 10px'" [style.fontSize]="'11px'" [style.fontWeight]="'600'"
                      [style.borderRadius]="'20px'"
                      [style.background]="getStatusBg(subscription()!.subscription_status)"
                      [style.color]="getStatusText(subscription()!.subscription_status)">
                  {{ subscription()!.subscription_status_label || subscription()!.subscription_status }}
                </span>
              </div>
              <p [style.color]="'rgba(255,255,255,0.7)'" [style.fontSize]="'14px'" [style.margin]="'0'">
                {{ subscription()!.subscription_number_display || subscription()!.subscription_number }}
              </p>
            </div>
          </div>
          <!-- Quick stat chips in hero -->
          <div [style.display]="'flex'" [style.flexWrap]="'wrap'" [style.gap]="'12px'" [style.marginTop]="'20px'" [style.position]="'relative'" [style.zIndex]="'1'">
            <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'"
                 [style.background]="'rgba(255,255,255,0.12)'" [style.borderRadius]="'10px'" [style.padding]="'10px 16px'">
              <span class="material-icons" [style.fontSize]="'18px'" [style.color]="'rgba(255,255,255,0.9)'">calendar_today</span>
              <div>
                <p [style.margin]="'0'" [style.fontSize]="'10px'" [style.color]="'rgba(255,255,255,0.6)'">Duration</p>
                <p [style.margin]="'0'" [style.fontSize]="'13px'" [style.fontWeight]="'600'" [style.color]="'#fff'">
                  {{ subscription()!.start_date | date:'MMM d' }} - {{ subscription()!.end_date | date:'MMM d' }}
                </p>
              </div>
            </div>
            <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'"
                 [style.background]="'rgba(255,255,255,0.12)'" [style.borderRadius]="'10px'" [style.padding]="'10px 16px'">
              <span class="material-icons" [style.fontSize]="'18px'" [style.color]="'rgba(255,255,255,0.9)'">restaurant</span>
              <div>
                <p [style.margin]="'0'" [style.fontSize]="'10px'" [style.color]="'rgba(255,255,255,0.6)'">Remaining</p>
                <p [style.margin]="'0'" [style.fontSize]="'13px'" [style.fontWeight]="'600'" [style.color]="'#fff'">{{ subscription()!.remaining_meals }}</p>
              </div>
            </div>
            <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'"
                 [style.background]="'rgba(255,255,255,0.12)'" [style.borderRadius]="'10px'" [style.padding]="'10px 16px'">
              <span class="material-icons" [style.fontSize]="'18px'" [style.color]="'rgba(255,255,255,0.9)'">hourglass_bottom</span>
              <div>
                <p [style.margin]="'0'" [style.fontSize]="'10px'" [style.color]="'rgba(255,255,255,0.6)'">Days Left</p>
                <p [style.margin]="'0'" [style.fontSize]="'13px'" [style.fontWeight]="'600'" [style.color]="'#fff'">{{ daysRemaining() }}</p>
              </div>
            </div>
            <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'"
                 [style.background]="'rgba(255,255,255,0.12)'" [style.borderRadius]="'10px'" [style.padding]="'10px 16px'">
              <span class="material-icons" [style.fontSize]="'18px'" [style.color]="'rgba(255,255,255,0.9)'">pie_chart</span>
              <div>
                <p [style.margin]="'0'" [style.fontSize]="'10px'" [style.color]="'rgba(255,255,255,0.6)'">Progress</p>
                <p [style.margin]="'0'" [style.fontSize]="'13px'" [style.fontWeight]="'600'" [style.color]="'#fff'">{{ subscription()!.progress_percentage || 0 }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        @if (subscription()!.total_meals > 0) {
          <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'16px'" [style.margin]="'0 0 24px 0'">
            <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'" [style.color]="'#6b7280'" [style.marginBottom]="'8px'">
              <span>{{ subscription()!.consumed_meals }} consumed / {{ subscription()!.total_meals }} total</span>
              <span>{{ subscription()!.skipped_meals }} skipped</span>
            </div>
            <div [style.background]="'#f3f4f6'" [style.borderRadius]="'9999px'" [style.height]="'10px'" [style.width]="'100%'" [style.overflow]="'hidden'">
              <div [style.background]="'linear-gradient(90deg, #059669, #10b981)'"
                   [style.height]="'100%'" [style.borderRadius]="'9999px'" [style.transition]="'width 0.5s ease'"
                   [style.width.%]="progressWidth()"></div>
            </div>
          </div>
        }

        <!-- Tab Bar -->
        <div [style.display]="'flex'" [style.gap]="'8px'" [style.margin]="'0 0 24px 0'">
          <button (click)="activeTab.set('details')"
                  [style.background]="activeTab() === 'details' ? '#059669' : '#f3f4f6'"
                  [style.color]="activeTab() === 'details' ? '#fff' : '#4b5563'"
                  [style.padding]="'10px 20px'" [style.borderRadius]="'12px'" [style.border]="'none'"
                  [style.fontSize]="'13px'" [style.fontWeight]="'500'" [style.cursor]="'pointer'"
                  [style.transition]="'all 0.2s'">
            <span class="material-icons" [style.fontSize]="'16px'" [style.verticalAlign]="'middle'" [style.marginRight]="'4px'">info</span>
            Details
          </button>
          <button (click)="switchToTimeline()"
                  [style.background]="activeTab() === 'timeline' ? '#059669' : '#f3f4f6'"
                  [style.color]="activeTab() === 'timeline' ? '#fff' : '#4b5563'"
                  [style.padding]="'10px 20px'" [style.borderRadius]="'12px'" [style.border]="'none'"
                  [style.fontSize]="'13px'" [style.fontWeight]="'500'" [style.cursor]="'pointer'"
                  [style.transition]="'all 0.2s'">
            <span class="material-icons" [style.fontSize]="'16px'" [style.verticalAlign]="'middle'" [style.marginRight]="'4px'">timeline</span>
            Activity Timeline
          </button>
          <button (click)="switchToDeliverySchedule()"
                  [style.background]="activeTab() === 'schedule' ? '#059669' : '#f3f4f6'"
                  [style.color]="activeTab() === 'schedule' ? '#fff' : '#4b5563'"
                  [style.padding]="'10px 20px'" [style.borderRadius]="'12px'" [style.border]="'none'"
                  [style.fontSize]="'13px'" [style.fontWeight]="'500'" [style.cursor]="'pointer'"
                  [style.transition]="'all 0.2s'">
            <span class="material-icons" [style.fontSize]="'16px'" [style.verticalAlign]="'middle'" [style.marginRight]="'4px'">event_note</span>
            Menu Schedule
          </button>
        </div>

        @if (activeTab() === 'details') {
        <!-- Details Grid -->
        <div [style.display]="'grid'" [style.gridTemplateColumns]="isDesktop() ? '1fr 1fr' : '1fr'"
             [style.gap]="'24px'" [style.margin]="'0 0 24px 0'">
          <!-- Subscription Info -->
          <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'24px'">
            <h3 [style.fontSize]="'15px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 16px 0'">
              <span class="material-icons" [style.fontSize]="'18px'" [style.verticalAlign]="'middle'" [style.color]="'#059669'" [style.marginRight]="'6px'">description</span>
              Subscription Details
            </h3>
            <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'12px'">
              <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                <span [style.color]="'#6b7280'">Plan</span>
                <span [style.color]="'#111827'" [style.fontWeight]="'500'">{{ subscription()!.plan_name }}</span>
              </div>
              <div [style.borderBottom]="'1px solid #f3f4f6'"></div>
              <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                <span [style.color]="'#6b7280'">Start Date</span>
                <span [style.color]="'#111827'">{{ subscription()!.start_date | date:'MMM d, y' }}</span>
              </div>
              <div [style.borderBottom]="'1px solid #f3f4f6'"></div>
              <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                <span [style.color]="'#6b7280'">End Date</span>
                <span [style.color]="'#111827'">{{ subscription()!.end_date | date:'MMM d, y' }}</span>
              </div>
              @if (subscription()!.kitchen_name) {
                <div [style.borderBottom]="'1px solid #f3f4f6'"></div>
                <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                  <span [style.color]="'#6b7280'">Kitchen</span>
                  <span [style.color]="'#111827'">{{ subscription()!.kitchen_name }}</span>
                </div>
              }
              @if (subscription()!.meal_category_name) {
                <div [style.borderBottom]="'1px solid #f3f4f6'"></div>
                <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                  <span [style.color]="'#6b7280'">Category</span>
                  <span [style.color]="'#111827'">{{ subscription()!.meal_category_name }}</span>
                </div>
              }
              <div [style.borderBottom]="'1px solid #f3f4f6'"></div>
              <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                <span [style.color]="'#6b7280'">Payment</span>
                <span [style.color]="getPaymentStatusColor(subscription()!.payment_status)"
                      [style.fontWeight]="'500'">
                  {{ subscription()!.payment_status_label || subscription()!.payment_status }}
                </span>
              </div>
              @if (subscription()!.next_delivery_date) {
                <div [style.borderBottom]="'1px solid #f3f4f6'"></div>
                <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                  <span [style.color]="'#6b7280'">Next Delivery</span>
                  <span [style.color]="'#059669'" [style.fontWeight]="'500'">{{ subscription()!.next_delivery_date | date:'MMM d, y' }}</span>
                </div>
              }
              @if (subscription()!.auto_renew) {
                <div [style.borderBottom]="'1px solid #f3f4f6'"></div>
                <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.fontSize]="'13px'">
                  <span [style.color]="'#6b7280'">Auto Renew</span>
                  <span [style.color]="'#059669'" [style.fontWeight]="'500'">Enabled</span>
                </div>
              }
            </div>
          </div>

          <!-- Plan Features -->
          <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'24px'">
            <h3 [style.fontSize]="'15px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 16px 0'">
              <span class="material-icons" [style.fontSize]="'18px'" [style.verticalAlign]="'middle'" [style.color]="'#059669'" [style.marginRight]="'6px'">checklist</span>
              Plan Features
            </h3>
            <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'12px'">
              @for (feature of planFeatures(); track feature.key) {
                <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.alignItems]="'center'" [style.fontSize]="'13px'">
                  <span [style.display]="'inline-flex'" [style.alignItems]="'center'" [style.gap]="'6px'" [style.color]="'#6b7280'">
                    <span class="material-icons" [style.fontSize]="'15px'" [style.color]="feature.available ? '#059669' : '#9ca3af'">{{ feature.icon }}</span>
                    {{ feature.label }}
                  </span>
                  <span [style.padding]="'2px 8px'" [style.borderRadius]="'12px'" [style.fontSize]="'11px'" [style.fontWeight]="'600'"
                        [style.background]="feature.available ? '#d1fae5' : '#f3f4f6'"
                        [style.color]="feature.available ? '#065f46' : '#9ca3af'">
                    {{ feature.available ? 'Available' : 'Not included' }}
                  </span>
                </div>
              }
            </div>
          </div>

          <!-- Actions -->
          <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'24px'">
            <h3 [style.fontSize]="'15px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 16px 0'">
              <span class="material-icons" [style.fontSize]="'18px'" [style.verticalAlign]="'middle'" [style.color]="'#059669'" [style.marginRight]="'6px'">bolt</span>
              Actions
            </h3>
            <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'10px'">
              @if (subscription()!.subscription_status === 'active') {
                @if (subscription()!.plan_allow_upgrade) {
                <button (click)="showUpgradeModal.set(true); loadAvailablePlans()"
                  [style.width]="'100%'" [style.padding]="'11px 0'" [style.background]="'#8b5cf6'"
                  [style.color]="'#fff'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'"
                  [style.border]="'none'" [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.transition]="'background 0.2s'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.gap]="'6px'">
                  <span class="material-icons" [style.fontSize]="'16px'">upgrade</span> Upgrade Plan
                </button>
                }
                @if (subscription()!.plan_allow_pause) {
                <button (click)="showPauseModal.set(true)"
                  [style.width]="'100%'" [style.padding]="'11px 0'" [style.background]="'#fff'"
                  [style.color]="'#374151'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'"
                  [style.border]="'1px solid #d1d5db'" [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.transition]="'all 0.2s'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.gap]="'6px'">
                  <span class="material-icons" [style.fontSize]="'16px'">pause</span> Pause Subscription
                </button>
                }
                @if (subscription()!.plan_allow_skip) {
                <button (click)="showSkipModal.set(true)"
                  [style.width]="'100%'" [style.padding]="'11px 0'" [style.background]="'#fff'"
                  [style.color]="'#374151'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'"
                  [style.border]="'1px solid #d1d5db'" [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.transition]="'all 0.2s'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.gap]="'6px'">
                  <span class="material-icons" [style.fontSize]="'16px'">event_busy</span> Skip Next Meal
                </button>
                }
                @if (subscription()!.plan_allow_cancel) {
                <button (click)="showCancelModal.set(true)"
                  [style.width]="'100%'" [style.padding]="'11px 0'" [style.background]="'#fff'"
                  [style.color]="'#dc2626'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'"
                  [style.border]="'1px solid #fecaca'" [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.transition]="'all 0.2s'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.gap]="'6px'">
                  <span class="material-icons" [style.fontSize]="'16px'">cancel</span> Cancel Subscription
                </button>
                }
              }
              @if (subscription()!.subscription_status === 'paused' && subscription()!.plan_allow_resume) {
                <button (click)="resumeSubscription()" [disabled]="actionLoading()"
                  [style.width]="'100%'" [style.padding]="'11px 0'" [style.background]="'#059669'"
                  [style.color]="'#fff'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'"
                  [style.border]="'none'" [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.transition]="'background 0.2s'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.gap]="'6px'"
                  [style.opacity]="actionLoading() ? '0.5' : '1'">
                  <span class="material-icons" [style.fontSize]="'16px'">play_arrow</span> {{ actionLoading() ? 'Resuming...' : 'Resume Subscription' }}
                </button>
              }
              @if (subscription()!.subscription_status === 'expired' || subscription()!.subscription_status === 'cancelled') {
                <button (click)="showRenewModal.set(true); loadAvailablePlans()"
                  [style.width]="'100%'" [style.padding]="'11px 0'" [style.background]="'#059669'"
                  [style.color]="'#fff'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'"
                  [style.border]="'none'" [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.transition]="'background 0.2s'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.gap]="'6px'">
                  <span class="material-icons" [style.fontSize]="'16px'">replay</span> Renew Subscription
                </button>
              }
              <a routerLink="/subscriptions"
                 [style.width]="'100%'" [style.padding]="'11px 0'" [style.background]="'#fff'"
                 [style.color]="'#059669'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'"
                 [style.border]="'1px solid #059669'" [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                 [style.transition]="'all 0.2s'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.gap]="'6px'" [style.textDecoration]="'none'">
                <span class="material-icons" [style.fontSize]="'16px'">card_membership</span> Browse Plans
              </a>
            </div>
          </div>
        </div>
        }

        <!-- Timeline Tab -->
        @if (activeTab() === 'timeline') {
          @if (loadingTimeline()) {
            <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'24px'" [style.animation]="'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'">
              @for (i of [1,2,3]; track i) {
                <div [style.display]="'flex'" [style.gap]="'12px'" [style.marginBottom]="'16px'">
                  <div [style.width]="'12px'" [style.height]="'12px'" [style.background]="'#e5e7eb'" [style.borderRadius]="'50%'" [style.marginTop]="'6px'"></div>
                  <div [style.flex]="'1'">
                    <div [style.height]="'16px'" [style.background]="'#e5e7eb'" [style.borderRadius]="'6px'" [style.width]="'25%'" [style.marginBottom]="'8px'"></div>
                    <div [style.height]="'12px'" [style.background]="'#f3f4f6'" [style.borderRadius]="'6px'" [style.width]="'33%'"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (timeline().length === 0) {
            <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'48px 24px'" [style.textAlign]="'center'">
              <span class="material-icons" [style.fontSize]="'48px'" [style.color]="'#d1d5db'">timeline</span>
              <h3 [style.fontSize]="'16px'" [style.fontWeight]="'500'" [style.color]="'#374151'" [style.margin]="'12px 0 4px 0'">No activity yet</h3>
              <p [style.fontSize]="'13px'" [style.color]="'#6b7280'">Activity events will appear here as your subscription progresses.</p>
            </div>
          } @else {
            <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'24px'">
              @for (event of timeline(); track event.id || $index; let last = $last) {
                <div [style.display]="'flex'" [style.gap]="'12px'">
                  <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.alignItems]="'center'">
                    <div [style.width]="'14px'" [style.height]="'14px'" [style.borderRadius]="'50%'" [style.flexShrink]="'0'"
                         [style.background]="getTimelineDotColor(event.type)"></div>
                    @if (!last) {
                      <div [style.width]="'2px'" [style.flex]="'1'" [style.background]="'#e5e7eb'" [style.marginTop]="'4px'" [style.minHeight]="'24px'"></div>
                    }
                  </div>
                  <div [style.paddingBottom]="last ? '0' : '20px'">
                    <p [style.fontWeight]="'500'" [style.color]="'#111827'" [style.margin]="'0'" [style.fontSize]="'14px'">{{ event.label || event.type }}</p>
                    @if (event.description) {
                      <p [style.fontSize]="'13px'" [style.color]="'#6b7280'" [style.margin]="'2px 0 0 0'">{{ event.description }}</p>
                    }
                    <p [style.fontSize]="'11px'" [style.color]="'#9ca3af'" [style.margin]="'4px 0 0 0'">{{ event.timestamp | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                </div>
              }
            </div>
          }
        }

        <!-- Delivery Schedule Tab -->
        @if (activeTab() === 'schedule') {
          @if (loadingWeeklyMenu()) {
            <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'16px'" [style.margin]="'0 0 16px 0'" [style.animation]="'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'">
              <div [style.height]="'16px'" [style.background]="'#e5e7eb'" [style.borderRadius]="'6px'" [style.width]="'30%'" [style.marginBottom]="'8px'"></div>
              <div [style.height]="'12px'" [style.background]="'#f3f4f6'" [style.borderRadius]="'6px'" [style.width]="'50%'"></div>
            </div>
          } @else if (weeklyMenu()) {
            <div [style.background]="'linear-gradient(135deg, #ecfdf5, #d1fae5)'" [style.border]="'1px solid #a7f3d0'" [style.borderRadius]="'12px'" [style.padding]="'16px 20px'" [style.margin]="'0 0 16px 0'" [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'">
              <span class="material-icons" [style.fontSize]="'28px'" [style.color]="'#059669'">event_note</span>
              <div [style.flex]="'1'">
                <p [style.margin]="'0'" [style.fontSize]="'14px'" [style.fontWeight]="'700'" [style.color]="'#065f46'">This Week's Menu</p>
                <p [style.margin]="'2px 0 0 0'" [style.fontSize]="'12px'" [style.color]="'#047857'">
                  {{ getWeeklyMenuRange() }}
                  @if (weeklyMenu()!.kitchen_name) { · {{ weeklyMenu()!.kitchen_name }} }
                </p>
              </div>
              <span [style.padding]="'3px 10px'" [style.background]="'#059669'" [style.color]="'#fff'" [style.fontSize]="'10px'" [style.fontWeight]="'700'" [style.borderRadius]="'9999px'" [style.textTransform]="'uppercase'" [style.whiteSpace]="'nowrap'">Published</span>
            </div>
          }
          @if (weeklyMenu()) {
            <div [style.background]="'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)'" [style.borderRadius]="'12px'" [style.padding]="'20px'" [style.margin]="'0 0 16px 0'" [style.position]="'relative'" [style.overflow]="'hidden'">
              <div [style.position]="'absolute'" [style.top]="'-40px'" [style.right]="'-40px'" [style.width]="'140px'" [style.height]="'140px'" [style.borderRadius]="'50%'" [style.background]="'rgba(255,255,255,0.06)'"></div>
              <div [style.position]="'relative'" [style.zIndex]="'1'">
                <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'10px'" [style.marginBottom]="'6px'">
                  <span [style.padding]="'3px 12px'" [style.background]="'#fbbf24'" [style.color]="'#78350f'" [style.fontSize]="'11px'" [style.fontWeight]="'800'" [style.borderRadius]="'9999px'" [style.textTransform]="'uppercase'" [style.letterSpacing]="'0.04em'">Today</span>
                  <span [style.color]="'rgba(255,255,255,0.85)'" [style.fontSize]="'13px'" [style.fontWeight]="'500'">{{ getTodayLabel() }}</span>
                </div>
                <p [style.margin]="'0 0 12px 0'" [style.color]="'#fff'" [style.fontSize]="'17px'" [style.fontWeight]="'700'">
                  What You'll Receive Today
                </p>
                @if (todayMeals().length === 0) {
                  <div [style.background]="'rgba(255,255,255,0.1)'" [style.borderRadius]="'10px'" [style.padding]="'12px 14px'" [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'">
                    <span class="material-icons" [style.fontSize]="'18px'" [style.color]="'#fde68a'">schedule</span>
                    <span [style.color]="'rgba(255,255,255,0.9)'" [style.fontSize]="'13px'">No meals published for today — the menu for this week will appear here once published.</span>
                  </div>
                } @else {
                  <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'8px'">
                    @for (item of todayMeals(); track item.id) {
                      <a [routerLink]="item.meal?.slug ? ['/meals', item.meal!.slug] : ['/meals']"
                         [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'" [style.background]="'#fff'" [style.borderRadius]="'10px'" [style.padding]="'10px 12px'" [style.textDecoration]="'none'" [style.transition]="'transform 0.2s'" [style.boxShadow]="'0 2px 8px rgba(0,0,0,0.08)'">
                        @if (item.meal?.meal_image) {
                          <img [src]="item.meal!.meal_image" [alt]="item.meal_name" loading="lazy"
                               [style.width]="'52px'" [style.height]="'52px'" [style.borderRadius]="'10px'" [style.objectFit]="'cover'" [style.flexShrink]="'0'" />
                        } @else {
                          <div [style.width]="'52px'" [style.height]="'52px'" [style.borderRadius]="'10px'" [style.background]="'linear-gradient(135deg, #ecfdf5, #d1fae5)'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.flexShrink]="'0'" [style.fontSize]="'24px'">🍛</div>
                        }
                        <div [style.flex]="'1'" [style.minWidth]="'0'">
                          <p [style.margin]="'0'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.fontSize]="'14px'" [style.whiteSpace]="'nowrap'" [style.overflow]="'hidden'" [style.textOverflow]="'ellipsis'">{{ item.meal_name || item.meal?.name || 'Meal' }}</p>
                          <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'4px'" [style.flexWrap]="'wrap'" [style.marginTop]="'3px'">
                            <span [style.padding]="'1px 8px'" [style.background]="'#f1f5f9'" [style.color]="'#475569'" [style.fontSize]="'11px'" [style.fontWeight]="'500'" [style.borderRadius]="'9999px'" [style.whiteSpace]="'nowrap'">{{ item.meal_category_name || 'Meal' }}</span>
                            @if (item.is_default) {
                              <span [style.padding]="'1px 8px'" [style.background]="'#dbeafe'" [style.color]="'#1d4ed8'" [style.fontSize]="'11px'" [style.fontWeight]="'700'" [style.borderRadius]="'9999px'">Default</span>
                            }
                            @if (item.is_recommended) {
                              <span [style.padding]="'1px 8px'" [style.background]="'#d1fae5'" [style.color]="'#047857'" [style.fontSize]="'11px'" [style.fontWeight]="'700'" [style.borderRadius]="'9999px'">Recommended</span>
                            }
                          </div>
                        </div>
                        <div [style.textAlign]="'right'" [style.flexShrink]="'0'">
                          <p [style.margin]="'0'" [style.fontWeight]="'800'" [style.color]="'#059669'" [style.fontSize]="'14px'">₹{{ getMealPrice(item) }}</p>
                          <span class="material-icons" [style.fontSize]="'16px'" [style.color]="'#9ca3af'">chevron_right</span>
                        </div>
                      </a>
                    }
                  </div>
                }
              </div>
            </div>
          }
          @if (calendarWeeks().length === 0) {
            <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'48px 24px'" [style.textAlign]="'center'">
              <span class="material-icons" [style.fontSize]="'48px'" [style.color]="'#d1d5db'">calendar_month</span>
              <h3 [style.fontSize]="'16px'" [style.fontWeight]="'500'" [style.color]="'#374151'" [style.margin]="'12px 0 4px 0'">No schedule data</h3>
              <p [style.fontSize]="'13px'" [style.color]="'#6b7280'">Delivery schedule will appear once your subscription is active.</p>
            </div>
          } @else {
            <!-- Legend -->
            <div [style.display]="'flex'" [style.flexWrap]="'wrap'" [style.gap]="'16px'" [style.marginBottom]="'16px'" [style.fontSize]="'12px'">
              <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'6px'">
                <span [style.width]="'12px'" [style.height]="'12px'" [style.borderRadius]="'50%'" [style.background]="'#34d399'"></span> Scheduled
              </div>
              <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'6px'">
                <span [style.width]="'12px'" [style.height]="'12px'" [style.borderRadius]="'50%'" [style.background]="'#facc15'"></span> Skipped
              </div>
              <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'6px'">
                <span [style.width]="'12px'" [style.height]="'12px'" [style.borderRadius]="'50%'" [style.background]="'#9ca3af'"></span> Paused
              </div>
              <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'6px'">
                <span [style.width]="'12px'" [style.height]="'12px'" [style.borderRadius]="'50%'" [style.background]="'#d1d5db'"></span> Past / Consumed
              </div>
              <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'6px'">
                <span [style.width]="'12px'" [style.height]="'12px'" [style.borderRadius]="'50%'" [style.background]="'#93c5fd'"></span> Future
              </div>
            </div>

            @for (week of calendarWeeks(); track week.label) {
              <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.overflow]="'hidden'" [style.marginBottom]="'12px'">
                <div [style.padding]="'10px 16px'" [style.background]="'#f9fafb'" [style.borderBottom]="'1px solid #e5e7eb'">
                  <p [style.fontSize]="'13px'" [style.fontWeight]="'600'" [style.color]="'#374151'">{{ week.label }}</p>
                </div>
                <div [style.display]="'grid'" [style.gridTemplateColumns]="'repeat(7, 1fr)'">
                  @for (day of week.days; track day.dateStr) {
                    <div [style.padding]="'8px 4px'" [style.minHeight]="'80px'"
                         [style.display]="'flex'" [style.flexDirection]="'column'" [style.alignItems]="'center'" [style.gap]="'4px'"
                         [style.borderRight]="'1px solid #f3f4f6'" [style.borderBottom]="'1px solid #f3f4f6'"
                         [style.background]="getCalendarDayBg(day)"
                         [class.clickable-day]="!!getDayMeal(day)"
                         (click)="openDayMenu(day)">
                      <span [style.fontSize]="'10px'" [style.fontWeight]="'500'" [style.color]="'#6b7280'" [style.textTransform]="'uppercase'">{{ day.dayLabel }}</span>
                      <span [style.fontSize]="'14px'" [style.fontWeight]="'700'" [style.color]="getCalendarDayText(day)">{{ day.dayNum }}</span>
                      @if (day.dateStr === todayStr) {
                        <span [style.padding]="'1px 6px'" [style.background]="'#059669'" [style.color]="'#fff'" [style.fontSize]="'8px'" [style.fontWeight]="'700'" [style.borderRadius]="'9999px'" [style.textTransform]="'uppercase'">Today</span>
                      }
                      @if (day.status === 'skipped') {
                        <span class="material-icons" [style.fontSize]="'14px'" [style.color]="'#ca8a04'">event_busy</span>
                      } @else if (day.status === 'paused') {
                        <span class="material-icons" [style.fontSize]="'14px'" [style.color]="'#9ca3af'">pause_circle</span>
                      } @else if (day.status === 'past' && day.isConsumed) {
                        <span class="material-icons" [style.fontSize]="'14px'" [style.color]="'#10b981'">check_circle</span>
                      } @else if (day.status === 'scheduled') {
                        <span class="material-icons" [style.fontSize]="'14px'" [style.color]="'#10b981'">restaurant</span>
                      } @else if (day.status === 'future') {
                        <span class="material-icons" [style.fontSize]="'14px'" [style.color]="'#60a5fa'">schedule</span>
                      }
                      @if (getDayMeal(day); as meal) {
                        <div [style.marginTop]="'auto'" [style.display]="'flex'" [style.flexDirection]="'column'" [style.alignItems]="'center'" [style.gap]="'3px'" [style.width]="'100%'">
                          @if (meal.meal?.meal_image) {
                            <img [src]="meal.meal!.meal_image" [alt]="meal.meal_name" loading="lazy"
                                 [style.width]="'30px'" [style.height]="'30px'" [style.borderRadius]="'8px'" [style.objectFit]="'cover'" />
                          }
                          <span [style.fontSize]="'9px'" [style.fontWeight]="'600'" [style.color]="'#065f46'" [style.lineHeight]="'1.2'" [style.textAlign]="'center'"
                                [style.overflow]="'hidden'" [style.display]="'-webkit-box'" [style.webkitLineClamp]="'2'" [style.webkitBoxOrient]="'vertical'">
                            {{ meal.meal_name || meal.meal?.name }}
                          </span>
                          <span [style.fontSize]="'8px'" [style.fontWeight]="'700'" [style.color]="'#059669'" [style.textTransform]="'uppercase'">View menu ›</span>
                        </div>
                      } @else {
                        <span [style.fontSize]="'9px'" [style.color]="'#9ca3af'" [style.lineHeight]="'1.2'" [style.textAlign]="'center'">
                          {{ getCalendarDayLabel(day) }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          }
        }

        <!-- Day Menu Modal -->
        @if (selectedDayMenu(); as dayMenu) {
          <div [style.position]="'fixed'" [style.inset]="'0'" [style.background]="'rgba(0,0,0,0.5)'" [style.zIndex]="'50'"
               [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.padding]="'16px'"
               (click)="closeDayMenu()">
            <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.maxWidth]="'512px'" [style.width]="'100%'"
                 [style.maxHeight]="'85vh'" [style.display]="'flex'" [style.flexDirection]="'column'" [style.overflow]="'hidden'"
                 (click)="$event.stopPropagation()">
              <div [style.padding]="'18px 20px'" [style.background]="'linear-gradient(135deg, #064e3b, #047857)'" [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'">
                <span class="material-icons" [style.fontSize]="'26px'" [style.color]="'#fbbf24'">event_note</span>
                <div [style.flex]="'1'">
                  <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'">
                    <p [style.margin]="'0'" [style.color]="'#fff'" [style.fontSize]="'16px'" [style.fontWeight]="'700'">{{ dayMenu.label }}</p>
                    @if (dayMenu.isToday) {
                      <span [style.padding]="'2px 8px'" [style.background]="'#fbbf24'" [style.color]="'#78350f'" [style.fontSize]="'10px'" [style.fontWeight]="'800'" [style.borderRadius]="'9999px'" [style.textTransform]="'uppercase'">Today</span>
                    }
                  </div>
                  <p [style.margin]="'2px 0 0 0'" [style.color]="'rgba(255,255,255,0.8)'" [style.fontSize]="'12px'">{{ dayMenu.items.length }} meal{{ dayMenu.items.length === 1 ? '' : 's' }} scheduled</p>
                </div>
                <button (click)="closeDayMenu()" [style.background]="'rgba(255,255,255,0.15)'" [style.border]="'none'" [style.borderRadius]="'50%'" [style.width]="'32px'" [style.height]="'32px'" [style.color]="'#fff'" [style.cursor]="'pointer'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'">
                  <span class="material-icons" [style.fontSize]="'18px'">close</span>
                </button>
              </div>
              <div [style.flex]="'1'" [style.overflowY]="'auto'" [style.padding]="'16px'" [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'10px'">
                @for (item of dayMenu.items; track item.id) {
                  <a [routerLink]="item.meal?.slug ? ['/meals', item.meal!.slug] : ['/meals']"
                     [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.borderRadius]="'12px'" [style.padding]="'12px'" [style.textDecoration]="'none'" [style.transition]="'border-color 0.2s, box-shadow 0.2s'">
                    @if (item.meal?.meal_image) {
                      <img [src]="item.meal!.meal_image" [alt]="item.meal_name" loading="lazy"
                           [style.width]="'56px'" [style.height]="'56px'" [style.borderRadius]="'10px'" [style.objectFit]="'cover'" [style.flexShrink]="'0'" />
                    } @else {
                      <div [style.width]="'56px'" [style.height]="'56px'" [style.borderRadius]="'10px'" [style.background]="'linear-gradient(135deg, #ecfdf5, #d1fae5)'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.flexShrink]="'0'" [style.fontSize]="'26px'">🍛</div>
                    }
                    <div [style.flex]="'1'" [style.minWidth]="'0'">
                      <p [style.margin]="'0'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.fontSize]="'14px'">{{ item.meal_name || item.meal?.name || 'Meal' }}</p>
                      <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'4px'" [style.flexWrap]="'wrap'" [style.marginTop]="'4px'">
                        <span [style.padding]="'2px 8px'" [style.background]="'#f1f5f9'" [style.color]="'#475569'" [style.fontSize]="'11px'" [style.fontWeight]="'500'" [style.borderRadius]="'9999px'">{{ item.meal_category_name || 'Meal' }}</span>
                        @if (item.is_default) {
                          <span [style.padding]="'2px 8px'" [style.background]="'#dbeafe'" [style.color]="'#1d4ed8'" [style.fontSize]="'11px'" [style.fontWeight]="'700'" [style.borderRadius]="'9999px'">Default</span>
                        }
                        @if (item.is_recommended) {
                          <span [style.padding]="'2px 8px'" [style.background]="'#d1fae5'" [style.color]="'#047857'" [style.fontSize]="'11px'" [style.fontWeight]="'700'" [style.borderRadius]="'9999px'">Recommended</span>
                        }
                      </div>
                      @if (item.meal_limit > 0) {
                        <p [style.margin]="'4px 0 0 0'" [style.fontSize]="'11px'" [style.color]="'#9ca3af'">Limit: {{ item.meal_limit }} · Remaining: {{ item.remaining_quantity }}</p>
                      }
                    </div>
                    <div [style.textAlign]="'right'" [style.flexShrink]="'0'">
                      <p [style.margin]="'0'" [style.fontWeight]="'800'" [style.color]="'#059669'" [style.fontSize]="'14px'">₹{{ getMealPrice(item) }}</p>
                      <span class="material-icons" [style.fontSize]="'18px'" [style.color]="'#9ca3af'">chevron_right</span>
                    </div>
                  </a>
                }
              </div>
              <div [style.padding]="'12px 16px'" [style.borderTop]="'1px solid #e5e7eb'" [style.display]="'flex'" [style.justifyContent]="'center'">
                <button (click)="closeDayMenu()" [style.padding]="'10px 24px'" [style.background]="'#fff'" [style.color]="'#374151'" [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'1px solid #d1d5db'" [style.cursor]="'pointer'" [style.fontSize]="'13px'">Close</button>
              </div>
            </div>
          </div>
        }

        <!-- Skip Days Modal -->
        @if (showSkipModal()) {
          <div [style.position]="'fixed'" [style.inset]="'0'" [style.background]="'rgba(0,0,0,0.5)'" [style.zIndex]="'50'"
               [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.padding]="'16px'"
               (click)="showSkipModal.set(false)">
            <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.maxWidth]="'448px'" [style.width]="'100%'" [style.padding]="'24px'" (click)="$event.stopPropagation()">
              <h3 [style.fontSize]="'17px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 8px 0'">Skip Meal</h3>
              <p [style.fontSize]="'13px'" [style.color]="'#6b7280'" [style.margin]="'0 0 16px 0'">Select the date you want to skip:</p>
              <input type="date" [(ngModel)]="skipDate" [min]="minSkipDate"
                [style.width]="'100%'" [style.border]="'1px solid #d1d5db'" [style.borderRadius]="'10px'" [style.padding]="'10px 12px'"
                [style.fontSize]="'13px'" [style.outline]="'none'" />
              <div [style.display]="'flex'" [style.gap]="'12px'" [style.marginTop]="'16px'">
                <button (click)="showSkipModal.set(false)"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#fff'" [style.color]="'#374151'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'1px solid #d1d5db'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'">Cancel</button>
                <button (click)="skipMeal()" [disabled]="!skipDate || actionLoading()"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#059669'" [style.color]="'#fff'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'none'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.opacity]="(!skipDate || actionLoading()) ? '0.5' : '1'">
                  {{ actionLoading() ? 'Skipping...' : 'Confirm Skip' }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Pause Modal -->
        @if (showPauseModal()) {
          <div [style.position]="'fixed'" [style.inset]="'0'" [style.background]="'rgba(0,0,0,0.5)'" [style.zIndex]="'50'"
               [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.padding]="'16px'"
               (click)="showPauseModal.set(false)">
            <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.maxWidth]="'448px'" [style.width]="'100%'" [style.padding]="'24px'" (click)="$event.stopPropagation()">
              <h3 [style.fontSize]="'17px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 16px 0'">Pause Subscription</h3>
              <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'12px'" [style.marginBottom]="'16px'">
                <div>
                  <label [style.display]="'block'" [style.fontSize]="'13px'" [style.fontWeight]="'500'" [style.color]="'#374151'" [style.marginBottom]="'4px'">Pause From</label>
                  <input type="date" [(ngModel)]="pauseStartDate" [min]="today"
                    [style.width]="'100%'" [style.border]="'1px solid #d1d5db'" [style.borderRadius]="'10px'" [style.padding]="'10px 12px'"
                    [style.fontSize]="'13px'" [style.outline]="'none'" />
                </div>
                <div>
                  <label [style.display]="'block'" [style.fontSize]="'13px'" [style.fontWeight]="'500'" [style.color]="'#374151'" [style.marginBottom]="'4px'">Pause Until (optional)</label>
                  <input type="date" [(ngModel)]="pauseEndDate" [min]="pauseStartDate || today"
                    [style.width]="'100%'" [style.border]="'1px solid #d1d5db'" [style.borderRadius]="'10px'" [style.padding]="'10px 12px'"
                    [style.fontSize]="'13px'" [style.outline]="'none'" />
                </div>
              </div>
              <div [style.display]="'flex'" [style.gap]="'12px'">
                <button (click)="showPauseModal.set(false)"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#fff'" [style.color]="'#374151'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'1px solid #d1d5db'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'">Cancel</button>
                <button (click)="pauseSubscription()" [disabled]="!pauseStartDate || actionLoading()"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#059669'" [style.color]="'#fff'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'none'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.opacity]="(!pauseStartDate || actionLoading()) ? '0.5' : '1'">
                  {{ actionLoading() ? 'Pausing...' : 'Confirm Pause' }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Cancel Modal -->
        @if (showCancelModal()) {
          <div [style.position]="'fixed'" [style.inset]="'0'" [style.background]="'rgba(0,0,0,0.5)'" [style.zIndex]="'50'"
               [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.padding]="'16px'"
               (click)="showCancelModal.set(false)">
            <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.maxWidth]="'448px'" [style.width]="'100%'" [style.padding]="'24px'" (click)="$event.stopPropagation()">
              <h3 [style.fontSize]="'17px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 8px 0'">Cancel Subscription</h3>
              <p [style.fontSize]="'13px'" [style.color]="'#6b7280'" [style.margin]="'0 0 16px 0'">Are you sure you want to cancel this subscription? This action cannot be undone.</p>
              <textarea [(ngModel)]="cancelReason" placeholder="Reason for cancellation (optional)" rows="3"
                [style.width]="'100%'" [style.border]="'1px solid #d1d5db'" [style.borderRadius]="'10px'" [style.padding]="'10px 12px'"
                [style.fontSize]="'13px'" [style.outline]="'none'" [style.resize]="'none'"></textarea>
              <div [style.display]="'flex'" [style.gap]="'12px'" [style.marginTop]="'16px'">
                <button (click)="showCancelModal.set(false)"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#fff'" [style.color]="'#374151'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'1px solid #d1d5db'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'">Keep Subscription</button>
                <button (click)="cancelSubscription()" [disabled]="actionLoading()"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#dc2626'" [style.color]="'#fff'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'none'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.opacity]="actionLoading() ? '0.5' : '1'">
                  {{ actionLoading() ? 'Cancelling...' : 'Confirm Cancel' }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Upgrade Plan Modal -->
        @if (showUpgradeModal()) {
          <div [style.position]="'fixed'" [style.inset]="'0'" [style.background]="'rgba(0,0,0,0.5)'" [style.zIndex]="'50'"
               [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.padding]="'16px'"
               (click)="showUpgradeModal.set(false)">
            <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.maxWidth]="'512px'" [style.width]="'100%'" [style.padding]="'24px'"
                 [style.maxHeight]="'85vh'" [style.display]="'flex'" [style.flexDirection]="'column'" (click)="$event.stopPropagation()">
              <h3 [style.fontSize]="'17px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 4px 0'">Upgrade Plan</h3>
              <p [style.fontSize]="'13px'" [style.color]="'#6b7280'" [style.margin]="'0 0 16px 0'">Choose a higher-tier plan to upgrade to:</p>

              @if (loadingPlans()) {
                <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'12px'">
                  @for (i of [1,2,3]; track i) {
                    <div [style.height]="'80px'" [style.background]="'#f3f4f6'" [style.borderRadius]="'12px'" [style.animation]="'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'"></div>
                  }
                </div>
              } @else if (upgradePlans().length === 0) {
                <div [style.textAlign]="'center'" [style.padding]="'32px 0'" [style.color]="'#6b7280'" [style.fontSize]="'13px'">
                  <span class="material-icons" [style.fontSize]="'36px'" [style.color]="'#d1d5db'" [style.display]="'block'" [style.marginBottom]="'8px'">info</span>
                  No higher-tier plans available at the moment.
                </div>
              } @else {
                <div [style.flex]="'1'" [style.overflowY]="'auto'" [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'12px'" [style.marginBottom]="'16px'" [style.paddingRight]="'4px'">
                  @for (plan of upgradePlans(); track plan.id) {
                    <button (click)="selectedUpgradePlanId.set(plan.id)"
                            [style.width]="'100%'" [style.textAlign]="'left'" [style.borderRadius]="'12px'"
                            [style.border]="selectedUpgradePlanId() === plan.id ? '2px solid #059669' : '2px solid #d1d5db'"
                            [style.padding]="'16px'" [style.background]="selectedUpgradePlanId() === plan.id ? '#ecfdf5' : '#fff'"
                            [style.cursor]="'pointer'" [style.transition]="'all 0.2s'">
                      <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.alignItems]="'flex-start'">
                        <div [style.flex]="'1'">
                          <p [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0'">{{ plan.plan_name }}</p>
                          @if (plan.description) {
                            <p [style.fontSize]="'12px'" [style.color]="'#6b7280'" [style.margin]="'2px 0 0 0'">{{ plan.description }}</p>
                          }
                          <div [style.display]="'flex'" [style.gap]="'8px'" [style.marginTop]="'8px'" [style.fontSize]="'12px'" [style.color]="'#6b7280'">
                            @if (plan.duration_days) {
                              <span [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'4px'">
                                <span class="material-icons" [style.fontSize]="'12px'">schedule</span> {{ plan.duration_days }} days
                              </span>
                            }
                            @if (plan.meal_category_name) {
                              <span [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'4px'">
                                <span class="material-icons" [style.fontSize]="'12px'">restaurant</span> {{ plan.meal_category_name }}
                              </span>
                            }
                          </div>
                        </div>
                        <div [style.textAlign]="'right'" [style.marginLeft]="'12px'">
                          <p [style.fontWeight]="'700'" [style.color]="'#111827'" [style.margin]="'0'">₹{{ plan.effective_price || plan.price | number:'1.0-0' }}</p>
                          @if (plan.offer_price && plan.offer_price < plan.price) {
                            <p [style.fontSize]="'12px'" [style.color]="'#9ca3af'" [style.textDecoration]="'line-through'" [style.margin]="'0'">₹{{ plan.price | number:'1.0-0' }}</p>
                          }
                        </div>
                      </div>
                    </button>
                  }
                </div>
              }

              @if (selectedUpgradePlanId()) {
                <div [style.background]="'#eff6ff'" [style.border]="'1px solid #bfdbfe'" [style.borderRadius]="'10px'" [style.padding]="'12px'" [style.marginBottom]="'16px'" [style.fontSize]="'13px'">
                  <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.color]="'#374151'">
                    <span>Price difference to pay:</span>
                    <span [style.fontWeight]="'700'" [style.color]="'#1d4ed8'">₹{{ getUpgradePriceDifference() | number:'1.2-2' }}</span>
                  </div>
                </div>
              }

              <div [style.display]="'flex'" [style.gap]="'12px'">
                <button (click)="showUpgradeModal.set(false); selectedUpgradePlanId.set(null)"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#fff'" [style.color]="'#374151'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'1px solid #d1d5db'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'">Cancel</button>
                <button (click)="confirmUpgrade()" [disabled]="!selectedUpgradePlanId() || actionLoading()"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#8b5cf6'" [style.color]="'#fff'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'none'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.opacity]="(!selectedUpgradePlanId() || actionLoading()) ? '0.5' : '1'">
                  {{ actionLoading() ? 'Upgrading...' : 'Confirm Upgrade' }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Renew Modal -->
        @if (showRenewModal()) {
          <div [style.position]="'fixed'" [style.inset]="'0'" [style.background]="'rgba(0,0,0,0.5)'" [style.zIndex]="'50'"
               [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'" [style.padding]="'16px'"
               (click)="showRenewModal.set(false)">
            <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.maxWidth]="'512px'" [style.width]="'100%'" [style.padding]="'24px'"
                 [style.maxHeight]="'85vh'" [style.display]="'flex'" [style.flexDirection]="'column'" (click)="$event.stopPropagation()">
              <h3 [style.fontSize]="'17px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0 0 4px 0'">Renew Subscription</h3>
              <p [style.fontSize]="'13px'" [style.color]="'#6b7280'" [style.margin]="'0 0 16px 0'">Select a plan to renew with:</p>

              @if (loadingPlans()) {
                <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'12px'">
                  @for (i of [1,2,3]; track i) {
                    <div [style.height]="'80px'" [style.background]="'#f3f4f6'" [style.borderRadius]="'12px'" [style.animation]="'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'"></div>
                  }
                </div>
              } @else if (availablePlans().length === 0) {
                <div [style.textAlign]="'center'" [style.padding]="'32px 0'" [style.color]="'#6b7280'" [style.fontSize]="'13px'">
                  <span class="material-icons" [style.fontSize]="'36px'" [style.color]="'#d1d5db'" [style.display]="'block'" [style.marginBottom]="'8px'">info</span>
                  No plans available at the moment.
                </div>
              } @else {
                <div [style.flex]="'1'" [style.overflowY]="'auto'" [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'12px'" [style.marginBottom]="'16px'" [style.paddingRight]="'4px'">
                  @for (plan of availablePlans(); track plan.id) {
                    <button (click)="selectedRenewPlanId.set(plan.id)"
                            [style.width]="'100%'" [style.textAlign]="'left'" [style.borderRadius]="'12px'"
                            [style.border]="selectedRenewPlanId() === plan.id ? '2px solid #059669' : '2px solid #d1d5db'"
                            [style.padding]="'16px'" [style.background]="selectedRenewPlanId() === plan.id ? '#ecfdf5' : '#fff'"
                            [style.cursor]="'pointer'" [style.transition]="'all 0.2s'">
                      <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.alignItems]="'flex-start'">
                        <div [style.flex]="'1'">
                          <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'">
                            <p [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'0'">{{ plan.plan_name }}</p>
                            @if (plan.id === subscription()!.subscription_plan_id) {
                              <span [style.padding]="'2px 6px'" [style.background]="'#ecfdf5'" [style.color]="'#059669'"
                                    [style.fontSize]="'10px'" [style.fontWeight]="'500'" [style.borderRadius]="'4px'">Current</span>
                            }
                          </div>
                          @if (plan.description) {
                            <p [style.fontSize]="'12px'" [style.color]="'#6b7280'" [style.margin]="'2px 0 0 0'">{{ plan.description }}</p>
                          }
                          <div [style.display]="'flex'" [style.gap]="'8px'" [style.marginTop]="'8px'" [style.fontSize]="'12px'" [style.color]="'#6b7280'">
                            @if (plan.duration_days) {
                              <span [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'4px'">
                                <span class="material-icons" [style.fontSize]="'12px'">schedule</span> {{ plan.duration_days }} days
                              </span>
                            }
                            @if (plan.meal_category_name) {
                              <span [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'4px'">
                                <span class="material-icons" [style.fontSize]="'12px'">restaurant</span> {{ plan.meal_category_name }}
                              </span>
                            }
                          </div>
                        </div>
                        <div [style.textAlign]="'right'" [style.marginLeft]="'12px'">
                          <p [style.fontWeight]="'700'" [style.color]="'#111827'" [style.margin]="'0'">₹{{ plan.effective_price || plan.price | number:'1.0-0' }}</p>
                          @if (plan.offer_price && plan.offer_price < plan.price) {
                            <p [style.fontSize]="'12px'" [style.color]="'#9ca3af'" [style.textDecoration]="'line-through'" [style.margin]="'0'">₹{{ plan.price | number:'1.0-0' }}</p>
                          }
                        </div>
                      </div>
                    </button>
                  }
                </div>
              }

              @if (selectedRenewPlanId()) {
                <div [style.background]="'#ecfdf5'" [style.border]="'1px solid #a7f3d0'" [style.borderRadius]="'10px'" [style.padding]="'12px'" [style.marginBottom]="'16px'" [style.fontSize]="'13px'">
                  <div [style.display]="'flex'" [style.justifyContent]="'space-between'" [style.color]="'#374151'">
                    <span>Renewal amount:</span>
                    <span [style.fontWeight]="'700'" [style.color]="'#059669'">₹{{ getRenewalAmount() | number:'1.2-2' }}</span>
                  </div>
                </div>
              }

              <div [style.display]="'flex'" [style.gap]="'12px'">
                <button (click)="showRenewModal.set(false); selectedRenewPlanId.set(null)"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#fff'" [style.color]="'#374151'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'1px solid #d1d5db'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'">Cancel</button>
                <button (click)="confirmRenew()" [disabled]="!selectedRenewPlanId() || actionLoading()"
                  [style.flex]="'1'" [style.padding]="'10px 0'" [style.background]="'#059669'" [style.color]="'#fff'"
                  [style.fontWeight]="'500'" [style.borderRadius]="'10px'" [style.border]="'none'"
                  [style.cursor]="'pointer'" [style.fontSize]="'13px'"
                  [style.opacity]="(!selectedRenewPlanId() || actionLoading()) ? '0.5' : '1'">
                  {{ actionLoading() ? 'Renewing...' : 'Confirm Renewal' }}
                </button>
              </div>
            </div>
          </div>
        }

      } @else {
        <!-- Not Found -->
        <div [style.background]="'#fff'" [style.borderRadius]="'12px'" [style.border]="'1px solid #e5e7eb'" [style.padding]="'48px 24px'" [style.textAlign]="'center'">
          <span class="material-icons" [style.fontSize]="'48px'" [style.color]="'#d1d5db'">error_outline</span>
          <h2 [style.fontSize]="'17px'" [style.fontWeight]="'600'" [style.color]="'#111827'" [style.margin]="'12px 0 4px 0'">Subscription Not Found</h2>
          <p [style.color]="'#6b7280'" [style.fontSize]="'13px'" [style.margin]="'0 0 24px 0'">This subscription doesn't exist or you don't have access.</p>
          <a routerLink="/customer/subscriptions" [style.display]="'inline-flex'" [style.alignItems]="'center'" [style.gap]="'8px'"
             [style.padding]="'10px 20px'" [style.background]="'#059669'" [style.color]="'#fff'" [style.fontWeight]="'500'"
             [style.borderRadius]="'12px'" [style.textDecoration]="'none'" [style.fontSize]="'13px'">
            <span class="material-icons" [style.fontSize]="'16px'">arrow_back</span> View My Subscriptions
          </a>
        </div>
      }
    </div>
  `,
})
export class SubscriptionDetailComponent implements OnInit, OnDestroy {
  private subApi = inject(CustomerSubscriptionApiService);
  private browseApi = inject(CustomerBrowseApiService);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private destroy$ = new Subject<void>();
  private messageTimeout: ReturnType<typeof setTimeout> | null = null;

  subscription = signal<CustomerSubscription | null>(null);
  loading = signal(true);
  actionLoading = signal(false);

  timeline = signal<TimelineEvent[]>([]);
  loadingTimeline = signal(false);
  activeTab = signal<'details' | 'timeline' | 'schedule'>('details');

  weeklyMenu = signal<WeeklyMenu | null>(null);
  loadingWeeklyMenu = signal(false);

  actionMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  showSkipModal = signal(false);
  showPauseModal = signal(false);
  showCancelModal = signal(false);
  showUpgradeModal = signal(false);
  showRenewModal = signal(false);

  availablePlans = signal<SubscriptionPlan[]>([]);
  loadingPlans = signal(false);
  selectedUpgradePlanId = signal<number | null>(null);
  selectedRenewPlanId = signal<number | null>(null);

  skipDate = '';
  pauseStartDate = '';
  pauseEndDate = '';
  cancelReason = '';

  today = new Date().toISOString().split('T')[0];
  todayStr = new Date().toISOString().split('T')[0];
  minSkipDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  isDesktop = signal(window.innerWidth >= 1024);

  daysRemaining = computed(() => {
    const sub = this.subscription();
    if (!sub || !sub.days_remaining) return 0;
    return Math.round(sub.days_remaining);
  });

  progressWidth = computed(() => {
    const sub = this.subscription();
    if (!sub || !sub.total_meals || sub.total_meals <= 0) return 0;
    return sub.progress_percentage || 0;
  });

  planFeatures = computed(() => {
    const sub = this.subscription();
    if (!sub) return [];
    return [
      { key: 'skip', label: 'Skip Meals', icon: 'event_busy', available: !!sub.plan_allow_skip },
      { key: 'pause', label: 'Pause Subscription', icon: 'pause', available: !!sub.plan_allow_pause },
      { key: 'resume', label: 'Resume Subscription', icon: 'play_arrow', available: !!sub.plan_allow_resume },
      { key: 'cancel', label: 'Cancel Anytime', icon: 'cancel', available: !!sub.plan_allow_cancel },
      { key: 'upgrade', label: 'Upgrade Plan', icon: 'upgrade', available: !!sub.plan_allow_upgrade },
      { key: 'downgrade', label: 'Downgrade Plan', icon: 'south_west', available: !!sub.plan_allow_downgrade },
    ];
  });

  calendarWeeks = computed(() => {
    const sub = this.subscription();
    if (!sub) return [];
    return this.buildCalendarWeeks(sub);
  });

  mealsByDate = computed<Record<string, WeeklyMenuItem[]>>(() => {
    const m = this.weeklyMenu();
    const map: Record<string, WeeklyMenuItem[]> = {};
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    for (const item of m?.items || []) {
      const dateStr = item.menu_date.split('T')[0];
      if (!map[dateStr]) {
        map[dateStr] = [];
      }
      map[dateStr].push(item);
    }
    for (const dateStr of Object.keys(map)) {
      map[dateStr].sort((a, b) => a.display_order - b.display_order);
    }
    return map;
  });

  todayMeals = computed<WeeklyMenuItem[]>(() => this.mealsByDate()[this.todayStr] || []);

  selectedDayMenu = signal<{ date: string; label: string; isToday: boolean; items: WeeklyMenuItem[] } | null>(null);

  openDayMenu(day: CalendarDay): void {
    const items = this.mealsByDate()[day.dateStr];
    if (!items || items.length === 0) {
      return;
    }
    this.selectedDayMenu.set({
      date: day.dateStr,
      label: new Date(`${day.dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      isToday: day.dateStr === this.todayStr,
      items,
    });
  }

  closeDayMenu(): void {
    this.selectedDayMenu.set(null);
  }

  getTodayLabel(): string {
    return new Date(`${this.todayStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  upgradePlans = computed(() => {
    const sub = this.subscription();
    const plans = this.availablePlans();
    if (!sub || !plans.length) return [];
    const currentPrice = parseFloat(sub.plan_price || '0') || 0;
    return plans
      .filter(p => p.is_active && p.status === 'active' && (p.effective_price || p.price) > currentPrice)
      .sort((a, b) => (a.effective_price || a.price) - (b.effective_price || b.price));
  });

  @HostListener('window:resize')
  onResize(): void {
    this.isDesktop.set(window.innerWidth >= 1024);
  }

  ngOnInit(): void {
    this.seo.setPageTitle('Subscription Details', 'View your subscription details');
    this.seo.setNoIndex();
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.loading.set(false);
          return of(null);
        }
        this.loading.set(true);
        return this.subApi.getMySubscription(id).pipe(
          catchError(() => { this.loading.set(false); return of(null); })
        );
      })
    ).subscribe(res => {
      this.loading.set(false);
      if (res && res.success && res.data) {
        this.subscription.set(res.data);
        this.selectedRenewPlanId.set(res.data.subscription_plan_id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }

  showActionResult(text: string, type: 'success' | 'error'): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.actionMessage.set({ text, type });
    this.messageTimeout = setTimeout(() => {
      this.actionMessage.set(null);
    }, 5000);
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      active: '#d1fae5',
      pending: '#fef3c7',
      paused: '#dbeafe',
      expired: '#f3f4f6',
      cancelled: '#fce4ec',
      completed: '#d1fae5',
      suspended: '#ffedd5',
    };
    return map[status] || '#f3f4f6';
  }

  getStatusText(status: string): string {
    const map: Record<string, string> = {
      active: '#065f46',
      pending: '#92400e',
      paused: '#1e40af',
      expired: '#6b7280',
      cancelled: '#b91c1c',
      completed: '#065f46',
      suspended: '#c2410c',
    };
    return map[status] || '#6b7280';
  }

  getPaymentStatusColor(status: string): string {
    const map: Record<string, string> = {
      paid: '#059669',
      pending: '#ca8a04',
      failed: '#dc2626',
    };
    return map[status] || '#111827';
  }

  refreshSubscription(): void {
    const sub = this.subscription();
    if (sub) {
      this.subApi.getMySubscription(sub.uuid).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.subscription.set(res.data);
          }
        }
      });
    }
  }

  loadAvailablePlans(): void {
    this.loadingPlans.set(true);
    this.browseApi.getSubscriptionPlans({ per_page: 100 }).subscribe({
      next: (res) => {
        this.availablePlans.set(res.data || []);
        this.loadingPlans.set(false);
      },
      error: () => {
        this.loadingPlans.set(false);
        this.showActionResult('Failed to load subscription plans.', 'error');
      }
    });
  }

  getUpgradePriceDifference(): number {
    const sub = this.subscription();
    const planId = this.selectedUpgradePlanId();
    if (!sub || !planId) return 0;
    const plan = this.upgradePlans().find(p => p.id === planId);
    if (!plan) return 0;
    const currentPrice = parseFloat(sub.plan_price || '0') || 0;
    const newPrice = plan.effective_price || plan.price;
    return Math.max(0, newPrice - currentPrice);
  }

  getRenewalAmount(): number {
    const planId = this.selectedRenewPlanId();
    if (!planId) return 0;
    const plan = this.availablePlans().find(p => p.id === planId);
    if (!plan) return 0;
    return plan.effective_price || plan.price;
  }

  // ── Actions ─────────────────────────────────────────────────────────────

  skipMeal(): void {
    const sub = this.subscription();
    if (!sub || !this.skipDate) return;
    this.actionLoading.set(true);
    this.subApi.skipMeal(sub.uuid, { skip_type: 'day', skip_date: this.skipDate }).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.showSkipModal.set(false);
        if (res.success && res.data) {
          this.subscription.set(res.data);
          this.skipDate = '';
          this.showActionResult('Meal skipped successfully.', 'success');
        } else {
          this.showActionResult(res.message || 'Unable to skip meal. Please try again.', 'error');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.showSkipModal.set(false);
        this.showActionResult(err.error?.message || 'Unable to skip meal.', 'error');
      }
    });
  }

  pauseSubscription(): void {
    const sub = this.subscription();
    if (!sub || !this.pauseStartDate) return;
    this.actionLoading.set(true);
    this.subApi.pauseSubscription(sub.uuid, {
      pause_start: this.pauseStartDate,
      pause_end: this.pauseEndDate || undefined,
    }).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.showPauseModal.set(false);
        if (res.success && res.data) {
          this.subscription.set(res.data);
          this.pauseStartDate = '';
          this.pauseEndDate = '';
          this.showActionResult('Subscription paused successfully.', 'success');
        } else {
          this.showActionResult(res.message || 'Unable to pause subscription.', 'error');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.showPauseModal.set(false);
        this.showActionResult(err.error?.message || 'Unable to pause subscription.', 'error');
      }
    });
  }

  resumeSubscription(): void {
    const sub = this.subscription();
    if (!sub) return;
    this.actionLoading.set(true);
    this.subApi.resumeSubscription(sub.uuid).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        if (res.success && res.data) {
          this.subscription.set(res.data);
          this.showActionResult('Subscription resumed successfully.', 'success');
        } else {
          this.showActionResult(res.message || 'Unable to resume subscription.', 'error');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.showActionResult(err.error?.message || 'Unable to resume subscription.', 'error');
      }
    });
  }

  cancelSubscription(): void {
    const sub = this.subscription();
    if (!sub) return;
    this.actionLoading.set(true);
    this.subApi.cancelSubscription(sub.uuid, {
      reason: this.cancelReason || undefined,
    }).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.showCancelModal.set(false);
        if (res.success && res.data) {
          this.subscription.set(res.data);
          this.cancelReason = '';
          this.showActionResult('Subscription cancelled.', 'success');
        } else {
          this.showActionResult(res.message || 'Unable to cancel subscription.', 'error');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.showCancelModal.set(false);
        this.showActionResult(err.error?.message || 'Unable to cancel subscription.', 'error');
      }
    });
  }

  confirmUpgrade(): void {
    const sub = this.subscription();
    const planId = this.selectedUpgradePlanId();
    if (!sub || !planId) return;
    this.actionLoading.set(true);
    this.subApi.upgradeSubscription(sub.uuid, { to_plan_id: planId }).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.showUpgradeModal.set(false);
        this.selectedUpgradePlanId.set(null);
        if (res.success && res.data) {
          this.subscription.set(res.data);
          this.showActionResult('Plan upgraded successfully!', 'success');
        } else {
          this.showActionResult(res.message || 'Unable to upgrade plan. Please try again.', 'error');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.showUpgradeModal.set(false);
        this.selectedUpgradePlanId.set(null);
        this.showActionResult(err.error?.message || 'Unable to upgrade plan.', 'error');
      }
    });
  }

  confirmRenew(): void {
    const sub = this.subscription();
    if (!sub) return;
    this.actionLoading.set(true);
    this.subApi.renewSubscription(sub.uuid).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.showRenewModal.set(false);
        this.selectedRenewPlanId.set(null);
        if (res.success && res.data) {
          this.subscription.set(res.data);
          this.showActionResult('Subscription renewed successfully!', 'success');
        } else {
          this.showActionResult(res.message || 'Unable to renew subscription.', 'error');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.showRenewModal.set(false);
        this.selectedRenewPlanId.set(null);
        this.showActionResult(err.error?.message || 'Unable to renew subscription.', 'error');
      }
    });
  }

  // ── Timeline ────────────────────────────────────────────────────────────

  loadTimeline(): void {
    const sub = this.subscription();
    if (!sub) return;
    this.loadingTimeline.set(true);
    this.subApi.getTimeline(sub.uuid).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const raw: unknown = res.data;
          const rawEvents: Record<string, unknown>[] = Array.isArray(raw)
            ? raw as Record<string, unknown>[]
            : (raw as { data?: Record<string, unknown>[] }).data || [];
          const events: TimelineEvent[] = rawEvents.map(e => this.mapTimelineEvent(e));
          this.timeline.set(events);
        }
        this.loadingTimeline.set(false);
      },
      error: () => { this.loadingTimeline.set(false); }
    });
  }

  switchToTimeline(): void {
    this.activeTab.set('timeline');
    if (this.timeline().length === 0 && !this.loadingTimeline()) {
      this.loadTimeline();
    }
  }

  switchToDeliverySchedule(): void {
    this.activeTab.set('schedule');
    this.loadWeeklyMenu();
  }

  private loadWeeklyMenu(): void {
    if (this.weeklyMenu() !== null || this.loadingWeeklyMenu()) {
      return;
    }
    this.loadingWeeklyMenu.set(true);
    this.browseApi.getCurrentWeekMenu().subscribe({
      next: (res) => {
        this.weeklyMenu.set(res.data ?? null);
        this.loadingWeeklyMenu.set(false);
      },
      error: () => {
        this.loadingWeeklyMenu.set(false);
      }
    });
  }

  getDayMeal(day: CalendarDay): WeeklyMenuItem | null {
    if (day.status === 'skipped' || day.status === 'paused') {
      return null;
    }
    return this.mealsByDate()[day.dateStr]?.[0] || null;
  }

  getMealPrice(item: WeeklyMenuItem): string {
    if (!item.meal) return item.meal_name ? '' : '';
    const offer = parseFloat(item.meal.offer_price);
    const price = parseFloat(item.meal.price);
    const value = offer > 0 && offer < price ? offer : price;
    return Number.isFinite(value) ? String(value) : '';
  }

  getWeeklyMenuRange(): string {
    const m = this.weeklyMenu();
    if (!m) return '';
    const start = new Date(`${m.week_start_date}T00:00:00`);
    const end = new Date(`${m.week_end_date}T00:00:00`);
    return this.formatWeekRange(start, end);
  }

  getTimelineDotColor(type: string): string {
    const map: Record<string, string> = {
      'created': '#3b82f6',
      'activated': '#10b981',
      'paused': '#eab308',
      'resumed': '#10b981',
      'skipped': '#a855f7',
      'upgraded': '#8b5cf6',
      'renewed': '#059669',
      'cancelled': '#ef4444',
      'expired': '#9ca3af',
      'status_change': '#3b82f6',
    };
    return map[type] || '#9ca3af';
  }

  private mapTimelineEvent(e: Record<string, unknown>): TimelineEvent {
    const type = e['type'] as string;
    const date = e['date'] as string || e['created_at'] as string;
    let label = '';
    let description = '';
    switch (type) {
      case 'status_change':
        label = 'Status Changed';
        description = `${e['from_status']} → ${e['to_status']}`;
        if (e['changed_by']) description += ` by ${e['changed_by']}`;
        if (e['reason']) description += ` — ${e['reason']}`;
        break;
      case 'pause':
        label = 'Subscription Paused';
        description = `${e['pause_days']} day(s) (${e['pause_start']} to ${e['pause_end']})`;
        if (e['reason']) description += ` — ${e['reason']}`;
        break;
      case 'skip':
        label = 'Delivery Skipped';
        description = `${e['skip_type']} on ${e['skip_date']}`;
        if (e['credit_amount']) description += ` (credit: ₹${e['credit_amount']})`;
        if (e['reason']) description += ` — ${e['reason']}`;
        break;
      case 'upgrade':
        label = e['action'] === 'downgrade' ? 'Plan Downgraded' : 'Plan Upgraded';
        description = `${e['from_plan']} → ${e['to_plan']}`;
        if (e['price_difference']) description += ` (₹${e['price_difference']})`;
        break;
      case 'renewal':
        label = 'Subscription Renewed';
        description = `${e['old_end_date']} → ${e['new_end_date']}`;
        if (e['final_amount']) description += ` (₹${e['final_amount']})`;
        break;
      default:
        label = type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        description = '';
        break;
    }
    return { type, label, description, timestamp: date };
  }

  // ── Delivery Calendar ───────────────────────────────────────────────────

  private buildCalendarWeeks(sub: CustomerSubscription): { label: string; days: CalendarDay[] }[] {
    return this.buildCalendarWeeksFromSub(sub);
  }

  private buildCalendarWeeksFromSub(sub: CustomerSubscription): { label: string; days: CalendarDay[] }[] {
    const startDate = new Date(sub.start_date);
    const endDate = new Date(sub.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const skippedDates = new Set<string>();
    if (sub.skip_history) {
      for (const skip of sub.skip_history) {
        if (skip.skip_date) {
          skippedDates.add(skip.skip_date.split('T')[0]);
        }
      }
    }

    const pausedIntervals: { start: Date; end: Date }[] = [];
    if (sub.pause_history) {
      for (const pause of sub.pause_history) {
        if (pause.pause_start) {
          pausedIntervals.push({
            start: new Date(pause.pause_start),
            end: pause.pause_end ? new Date(pause.pause_end) : endDate,
          });
        }
      }
    }

    const firstMonday = new Date(startDate);
    firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));

    const weeks: { label: string; days: CalendarDay[] }[] = [];
    let currentWeekStart = new Date(firstMonday);

    while (currentWeekStart <= endDate || weeks.length === 0) {
      const days: CalendarDay[] = [];
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      for (let d = 0; d < 7; d++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + d);
        const dateStr = this.toDateStr(date);

        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayLabel = dayLabels[date.getDay()];
        const dayNum = date.getDate();

        let status: CalendarDay['status'] = 'future';
        let isConsumed = false;

        if (date < startDate) {
          status = 'past';
        } else if (date > endDate) {
          status = 'future';
        } else if (skippedDates.has(dateStr)) {
          status = 'skipped';
        } else if (this.isDateInPausedRange(date, pausedIntervals)) {
          status = 'paused';
        } else if (date < today) {
          status = 'past';
          isConsumed = true;
        } else if (date >= startDate && date <= endDate) {
          status = 'scheduled';
        }

        if (date < today && status === 'scheduled') {
          status = 'past';
          isConsumed = true;
        }

        days.push({ date, dateStr, dayLabel, dayNum, status, isConsumed });
      }

      const weekLabel = this.formatWeekRange(currentWeekStart, weekEnd);
      weeks.push({ label: weekLabel, days });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      if (currentWeekStart > endDate && weeks.length > 0) break;
      if (weeks.length > 20) break;
    }

    return weeks;
  }

  private isDateInPausedRange(date: Date, intervals: { start: Date; end: Date }[]): boolean {
    for (const interval of intervals) {
      if (date >= interval.start && date <= interval.end) {
        return true;
      }
    }
    return false;
  }

  private toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatWeekRange(start: Date, end: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sMonth = months[start.getMonth()];
    const eMonth = months[end.getMonth()];
    const sDay = start.getDate();
    const eDay = end.getDate();
    const year = end.getFullYear();
    if (start.getMonth() === end.getMonth()) {
      return `${sMonth} ${sDay} – ${eDay}, ${year}`;
    }
    return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${year}`;
  }

  getCalendarDayBg(day: CalendarDay): string {
    const map: Record<CalendarDay['status'], string> = {
      past: '#f9fafb',
      scheduled: '#f0fdf4',
      skipped: '#fefce8',
      paused: '#f3f4f6',
      future: '#eff6ff',
    };
    return map[day.status];
  }

  getCalendarDayText(day: CalendarDay): string {
    const map: Record<CalendarDay['status'], string> = {
      past: '#9ca3af',
      scheduled: '#047857',
      skipped: '#ca8a04',
      paused: '#9ca3af',
      future: '#3b82f6',
    };
    return map[day.status];
  }

  getCalendarDayLabel(day: CalendarDay): string {
    const map: Record<CalendarDay['status'], string> = {
      past: day.isConsumed ? 'Delivered' : 'N/A',
      scheduled: 'Scheduled',
      skipped: 'Skipped',
      paused: 'Paused',
      future: 'Upcoming',
    };
    return map[day.status];
  }
}
