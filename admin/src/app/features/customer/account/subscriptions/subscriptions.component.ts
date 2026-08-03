import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerSubscriptionApiService } from '../../../../core/services/customer-subscription-api.service';
import { CustomerSubscription } from '../../../../core/models/customer-subscription/customer-subscription.model';
import { SeoService } from '../../../../core/services/seo.service';

type TabKey = 'all' | 'active' | 'paused' | 'expired' | 'cancelled' | 'completed';

interface TabDef {
  key: TabKey;
  label: string;
  statuses: string[];
  emptyIcon: string;
  emptyTitle: string;
  emptyMessage: string;
}

const TABS: TabDef[] = [
  {
    key: 'all', label: 'All', statuses: [],
    emptyIcon: 'card_membership', emptyTitle: 'No subscriptions yet', emptyMessage: 'Subscribe to a plan and enjoy daily meals!',
  },
  {
    key: 'active', label: 'Active', statuses: ['active', 'pending'],
    emptyIcon: 'play_circle', emptyTitle: 'No active subscriptions', emptyMessage: 'You don\'t have any active subscriptions right now.',
  },
  {
    key: 'paused', label: 'Paused', statuses: ['paused', 'suspended'],
    emptyIcon: 'pause_circle', emptyTitle: 'No paused subscriptions', emptyMessage: 'You don\'t have any paused subscriptions.',
  },
  {
    key: 'expired', label: 'Expired', statuses: ['expired'],
    emptyIcon: 'schedule', emptyTitle: 'No expired subscriptions', emptyMessage: 'You don\'t have any expired subscriptions.',
  },
  {
    key: 'cancelled', label: 'Cancelled', statuses: ['cancelled'],
    emptyIcon: 'cancel', emptyTitle: 'No cancelled subscriptions', emptyMessage: 'You don\'t have any cancelled subscriptions.',
  },
  {
    key: 'completed', label: 'Completed', statuses: ['completed'],
    emptyIcon: 'check_circle', emptyTitle: 'No completed subscriptions', emptyMessage: 'You haven\'t completed any subscriptions yet.',
  },
];

@Component({
  selector: 'app-customer-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Hero Header -->
      <div class="subscriptions-hero" style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 4px 0;">SUBSCRIPTIONS</p>
            <h1 style="color: #fff; font-size: 28px; font-weight: 700; margin: 0 0 6px 0;">My Subscriptions</h1>
            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Manage your meal plans and track deliveries</p>
          </div>
          <a routerLink="/subscriptions" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: #fff; color: #059669; font-weight: 600; font-size: 14px; border-radius: 12px; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
            <span class="material-icons" style="font-size: 20px;">add_circle</span> Browse Plans
          </a>
        </div>
      </div>

      <!-- Tabs -->
      @if (!loading()) {
        <div style="display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 4px;">
          @for (tab of tabs; track tab.key) {
            <button (click)="activeTab.set(tab.key)"
                    [style]="activeTab() === tab.key
                      ? 'padding: 8px 16px; font-size: 13px; font-weight: 600; border-radius: 10px; white-space: nowrap; border: none; cursor: pointer; transition: all 0.2s; background: #059669; color: #fff; box-shadow: 0 2px 8px rgba(5,150,105,0.25);'
                      : 'padding: 8px 16px; font-size: 13px; font-weight: 500; border-radius: 10px; white-space: nowrap; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s; background: #fff; color: #6b7280;'"
                    onmouseover="this.style.background='#ecfdf5';this.style.color='#059669';this.style.borderColor='#059669'"
                    onmouseout="this.style.background='#fff';this.style.color='#6b7280';this.style.borderColor='#e5e7eb'">
              {{ tab.label }}
              <span style="margin-left: 6px; padding: 1px 8px; font-size: 11px; border-radius: 20px; font-weight: 600; {{ activeTab() === tab.key ? 'background: rgba(255,255,255,0.2); color: #fff;' : 'background: #f3f4f6; color: #6b7280;' }}">
                {{ tabCounts()[tab.key] }}
              </span>
            </button>
          }
        </div>
      }

      <!-- Loading Skeleton -->
      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 16px;">
          @for (i of [1, 2, 3]; track i) {
            <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="height: 20px; background: #e5e7eb; border-radius: 4px; width: 160px;"></div>
                    <div style="height: 20px; background: #e5e7eb; border-radius: 20px; width: 64px;"></div>
                  </div>
                  <div style="display: flex; gap: 16px;">
                    <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 120px;"></div>
                    <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 140px;"></div>
                    <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 130px;"></div>
                  </div>
                </div>
                <div style="height: 24px; background: #e5e7eb; border-radius: 4px; width: 24px;"></div>
              </div>
              <div style="margin-top: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <div style="height: 10px; background: #e5e7eb; border-radius: 4px; width: 100px;"></div>
                  <div style="height: 10px; background: #e5e7eb; border-radius: 4px; width: 30px;"></div>
                </div>
                <div style="height: 6px; background: #e5e7eb; border-radius: 10px; width: 100%;"></div>
              </div>
            </div>
          }
        </div>
      } @else if (filteredSubscriptions().length === 0) {
        <!-- Empty State -->
        @for (tab of tabs; track tab.key) {
          @if (activeTab() === tab.key) {
            <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 48px 24px; text-align: center;">
              <div style="width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px; background: #f0fdf4; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 32px; color: #059669;">{{ tab.emptyIcon }}</span>
              </div>
              <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">{{ tab.emptyTitle }}</h2>
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">{{ tab.emptyMessage }}</p>
              @if (activeTab() === 'all') {
                <a routerLink="/subscriptions" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: #059669; color: #fff; font-size: 14px; font-weight: 600; border-radius: 12px; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
                  <span class="material-icons" style="font-size: 18px;">card_membership</span> View Plans
                </a>
              }
              @if (activeTab() === 'active') {
                <a routerLink="/subscriptions" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: #059669; color: #fff; font-size: 14px; font-weight: 600; border-radius: 12px; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
                  <span class="material-icons" style="font-size: 18px;">add_circle</span> Subscribe Now
                </a>
              }
            </div>
          }
        }
      } @else {
        <!-- Subscription Cards -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          @for (sub of filteredSubscriptions(); track sub.id) {
            <a [routerLink]="['/customer/subscriptions', sub.uuid]"
               style="display: block; background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px; text-decoration: none; transition: all 0.2s;"
               onmouseover="this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';this.style.borderColor='#059669';this.style.transform='translateY(-1px)'"
               onmouseout="this.style.boxShadow='';this.style.borderColor='#e5e7eb';this.style.transform=''">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0;">{{ sub.plan_name || 'Subscription' }}</h3>
                    @if (sub.subscription_status) {
                      <span style="padding: 2px 10px; font-size: 11px; font-weight: 600; border-radius: 20px; background: {{ statusBg(sub.subscription_status) }}; color: {{ statusColor(sub.subscription_status) }};">{{ sub.subscription_status_label || sub.subscription_status }}</span>
                    }
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 16px; row-gap: 6px; font-size: 13px; color: #6b7280;">
                    <span style="display: flex; align-items: center; gap: 4px;">
                      <span class="material-icons" style="font-size: 16px; color: #9ca3af;">confirmation_number</span>
                      {{ sub.subscription_number_display || sub.subscription_number }}
                    </span>
                    @if (sub.start_date) {
                      <span style="display: flex; align-items: center; gap: 4px;">
                        <span class="material-icons" style="font-size: 16px; color: #9ca3af;">event</span>
                        {{ sub.start_date | date:'MMM d, y' }} - {{ sub.end_date | date:'MMM d, y' }}
                      </span>
                    }
                    @if (sub.remaining_meals > 0) {
                      <span style="display: flex; align-items: center; gap: 4px;">
                        <span class="material-icons" style="font-size: 16px; color: #9ca3af;">restaurant</span>
                        {{ sub.remaining_meals }} meals remaining
                      </span>
                    }
                    @if (sub.next_delivery_date) {
                      <span style="display: flex; align-items: center; gap: 4px;">
                        <span class="material-icons" style="font-size: 16px; color: #9ca3af;">local_shipping</span>
                        Next: {{ sub.next_delivery_date | date:'MMM d' }}
                      </span>
                    }
                  </div>
                </div>
                <span style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #f0fdf4; flex-shrink: 0;">
                  <span class="material-icons" style="font-size: 16px; color: #059669;">chevron_right</span>
                </span>
              </div>

              <!-- Progress Bar -->
              @if (sub.total_meals > 0) {
                <div style="margin-top: 16px;">
                  <div style="display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; margin-bottom: 6px;">
                    <span>{{ sub.consumed_meals }} consumed of {{ sub.total_meals }}</span>
                    <span style="font-weight: 600; color: #059669;">{{ sub.progress_percentage || 0 }}%</span>
                  </div>
                  <div style="width: 100%; background: #e5e7eb; border-radius: 10px; height: 6px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #059669, #34d399); height: 6px; border-radius: 10px; transition: width 0.3s;" [style.width.%]="sub.progress_percentage || 0"></div>
                  </div>
                </div>
              }
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @media (max-width: 1023px) {
      .subscriptions-hero { display: none !important; }
    }
    @media (max-width: 768px) {
      :host > div > div:nth-child(2) { overflow-x: auto !important; }
    }
  `]
})
export class SubscriptionsComponent implements OnInit {
  private subApi = inject(CustomerSubscriptionApiService);
  private seo = inject(SeoService);

  readonly tabs = TABS;

  subscriptions = signal<CustomerSubscription[]>([]);
  loading = signal(true);
  activeTab = signal<TabKey>('all');

  readonly tabCounts = computed(() => {
    const all = this.subscriptions();
    const counts: Record<TabKey, number> = {
      all: all.length, active: 0, paused: 0, expired: 0, cancelled: 0, completed: 0,
    };
    for (const sub of all) {
      const s = sub.subscription_status;
      if (s === 'active' || s === 'pending') counts.active++;
      if (s === 'paused' || s === 'suspended') counts.paused++;
      if (s === 'expired') counts.expired++;
      if (s === 'cancelled') counts.cancelled++;
      if (s === 'completed') counts.completed++;
    }
    return counts;
  });

  readonly filteredSubscriptions = computed(() => {
    const tabKey = this.activeTab();
    const all = this.subscriptions();
    const tab = TABS.find((t) => t.key === tabKey);
    if (!tab || tab.statuses.length === 0) return all;
    return all.filter((sub) => tab.statuses.includes(sub.subscription_status));
  });

  statusBg(status: string): string {
    const map: Record<string, string> = {
      active: '#dcfce7', pending: '#fef3c7', paused: '#dbeafe',
      expired: '#f3f4f6', cancelled: '#fee2e2', completed: '#dcfce7', suspended: '#ffedd5',
    };
    return map[status] || '#f3f4f6';
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      active: '#166534', pending: '#92400e', paused: '#1e40af',
      expired: '#6b7280', cancelled: '#991b1b', completed: '#166534', suspended: '#9a3412',
    };
    return map[status] || '#6b7280';
  }

  ngOnInit(): void {
    this.seo.setPageTitle('My Subscriptions', 'Manage your tiffin subscriptions');
    this.seo.setNoIndex();
    this.subApi.getMySubscriptions({ per_page: 100 }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) this.subscriptions.set(res.data);
      },
      error: () => this.loading.set(false),
    });
  }
}
