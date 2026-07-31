import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SeoService } from '../../../../core/services/seo.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import {
  CustomerNotificationApiService,
  NotificationListParams,
} from '../../../../core/services/customer-notification-api.service';
import {
  CustomerNotification,
  NotificationFilterType,
  NOTIFICATION_TYPE_CONFIG,
  NOTIFICATION_EVENT_MAP,
} from '../../../../core/models/customer/notification-summary.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 900px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Toast -->
      @if (toast) {
        <div style="position: fixed; top: 24px; right: 24px; z-index: 50; animation: slideIn 0.3s ease-out;">
          <div [style]="getToastStyle(toast.type)">
            <span class="material-icons" style="font-size: 20px;">{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</span>
            {{ toast.message }}
            <button (click)="toast = null" style="background: none; border: none; cursor: pointer; opacity: 0.6; padding: 2px;">
              <span class="material-icons" style="font-size: 16px;">close</span>
            </button>
          </div>
        </div>
      }

      <!-- Hero Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 28px 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <p style="color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 2px 0;">NOTIFICATIONS</p>
            <h1 style="color: #fff; font-size: 26px; font-weight: 700; margin: 0;">Notifications</h1>
            @if (!loading && unreadCount > 0) {
              <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 2px 0 0;">{{ unreadCount }} unread notification{{ unreadCount !== 1 ? 's' : '' }}</p>
            }
          </div>
          @if (unreadCount > 0 && !markingAllRead) {
            <button (click)="markAllAsRead()" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 20px; background: rgba(255,255,255,0.2); color: #fff; font-size: 13px; font-weight: 500; border-radius: 10px; border: 1px solid rgba(255,255,255,0.3); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 16px;">done_all</span>
              Mark all as read
            </button>
          }
          @if (markingAllRead) {
            <button disabled style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 20px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 500; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); cursor: not-allowed; opacity: 0.6;">
              <span class="material-icons" style="font-size: 16px; animation: spin 1s linear infinite;">refresh</span>
              Marking...
            </button>
          }
        </div>
      </div>

      <!-- Filter Tabs -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;">
        @for (tab of filterTabs; track tab.value) {
          <button (click)="switchFilter(tab.value)"
            [style]="activeFilter === tab.value
              ? 'padding: 7px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 600; background: #059669; color: #fff; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s;'
              : 'padding: 7px 16px; border-radius: 10px; border: 1px solid #e5e7eb; font-size: 13px; font-weight: 500; background: #fff; color: #6b7280; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s;'"
            onmouseover="this.style.borderColor='#059669';this.style.color='#059669'"
            onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#6b7280'">
            {{ tab.label }}
            @if (tab.value === 'unread' && unreadCount > 0) {
              <span [style]="activeFilter === 'unread'
                ? 'font-size: 11px; padding: 1px 7px; border-radius: 20px; background: rgba(255,255,255,0.25); color: #fff;'
                : 'font-size: 11px; padding: 1px 7px; border-radius: 20px; background: #fee2e2; color: #dc2626;'">
                {{ unreadCount }}
              </span>
            }
          </button>
        }
      </div>

      <!-- Loading Skeleton -->
      @if (loading) {
        <div style="display: flex; flex-direction: column; gap: 12px;">
          @for (i of [1,2,3,4,5]; track i) {
            <div style="background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px;">
              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                  <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 180px; margin-bottom: 8px;"></div>
                  <div style="height: 11px; background: #e5e7eb; border-radius: 4px; width: 100%; margin-bottom: 4px;"></div>
                  <div style="height: 11px; background: #e5e7eb; border-radius: 4px; width: 80px;"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Error State -->
      @if (error && !loading) {
        <div style="background: #fff; border-radius: 20px; padding: 48px 24px; border: 1px solid #e5e7eb; text-align: center;">
          <div style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 16px; background: #fef2f2; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 28px; color: #dc2626;">error_outline</span>
          </div>
          <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">Unable to load notifications</h2>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px 0;">{{ error }}</p>
          <button (click)="loadNotifications()" style="padding: 10px 24px; background: #059669; color: #fff; font-size: 14px; font-weight: 600; border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            Try Again
          </button>
        </div>
      }

      <!-- Empty State -->
      @if (!loading && !error && notifications.length === 0) {
        <div style="background: #fff; border-radius: 20px; padding: 48px 24px; border: 1px solid #e5e7eb; text-align: center;">
          <div style="width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px; background: #f0fdf4; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">{{ activeFilter === 'unread' ? 'mark_email_read' : 'notifications_none' }}</span>
          </div>
          <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">
            {{ activeFilter === 'unread' ? 'No unread notifications' : 'No notifications yet' }}
          </h2>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            {{ activeFilter === 'unread' ? 'All caught up!' : 'We will notify you about orders, payments, subscriptions and important updates.' }}
          </p>
        </div>
      }

      <!-- Notification List -->
      @if (!loading && !error && notifications.length > 0) {
        <div style="display: flex; flex-direction: column; gap: 8px;">
          @for (notif of notifications; track notif.uuid) {
            <div (click)="openNotification(notif)"
              [style]="'background: #fff; border-radius: 14px; border: 1px solid ' + (notif.read_at ? '#e5e7eb' : '#059669') + '; padding: 16px; display: flex; align-items: flex-start; gap: 14px; cursor: pointer; transition: all 0.2s;' + (notif.read_at ? '' : ' box-shadow: 0 0 0 1px rgba(5,150,105,0.1);')"
              onmouseover="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)';this.style.borderColor='#059669'" (mouseout)="resetNotifCardStyle($event, notif.read_at)">

              <!-- Icon Circle -->
              <div [style]="getTypeCircleStyle(notif)" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <span class="material-icons" [style]="'font-size: 18px; ' + getTypeColor(notif)">{{ getNotifIcon(notif) }}</span>
              </div>

              <!-- Content -->
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                  <p [style]="'font-size: 14px; font-weight: ' + (notif.read_at ? '600' : '700') + '; color: #111827; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'">
                    {{ notif.title }}
                  </p>
                  <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                    @if (!notif.read_at) {
                      <span style="width: 8px; height: 8px; background: #059669; border-radius: 50%; display: inline-block;" title="Unread"></span>
                    }
                    <span style="font-size: 11px; color: #9ca3af; white-space: nowrap;">{{ formatTime(notif.created_at) }}</span>
                  </div>
                </div>
                <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ notif.message }}</p>
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">
                  <span [style]="getChannelBadgeStyle(notif.channel)" style="font-size: 11px; padding: 2px 10px; border-radius: 20px; font-weight: 500;">{{ capitalize(notif.channel) }}</span>
                  @if (notif.priority === 'high' || notif.priority === 'critical') {
                    <span style="font-size: 11px; padding: 2px 10px; border-radius: 20px; font-weight: 500; background: #fee2e2; color: #dc2626;">{{ capitalize(notif.priority) }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Pagination -->
      @if (!loading && totalPages > 1) {
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px;">
          <p style="font-size: 13px; color: #6b7280; margin: 0;">Page {{ currentPage }} of {{ totalPages }}</p>
          <div style="display: flex; gap: 8px;">
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1"
              [style]="'padding: 8px 16px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; cursor: pointer; color: #374151; transition: all 0.15s;' + (currentPage <= 1 ? ' opacity: 0.5; cursor: not-allowed;' : '')"
              onmouseover="if(!this.disabled)this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">Previous</button>
            <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages"
              [style]="'padding: 8px 16px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; cursor: pointer; color: #374151; transition: all 0.15s;' + (currentPage >= totalPages ? ' opacity: 0.5; cursor: not-allowed;' : '')"
              onmouseover="if(!this.disabled)this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">Next</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notifApi = inject(CustomerNotificationApiService);
  private appState = inject(AppStateService);
  private seo = inject(SeoService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  notifications: CustomerNotification[] = [];
  loading = true;
  error: string | null = null;
  unreadCount = 0;
  markingAllRead = false;
  activeFilter: NotificationFilterType = 'all';
  currentPage = 1;
  totalPages = 1;
  perPage = 20;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  filterTabs: { label: string; value: NotificationFilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Orders', value: 'order' },
    { label: 'Payments', value: 'payment' },
    { label: 'Subscriptions', value: 'subscription' },
    { label: 'Wallet', value: 'wallet' },
    { label: 'Promotions', value: 'promotion' },
    { label: 'Support', value: 'support' },
    { label: 'System', value: 'system' },
  ];

  ngOnInit(): void {
    this.seo.setPageTitle('Notifications');
    this.seo.setNoIndex();
    this.loadUnreadCount();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.seo.clearNoIndex();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUnreadCount(): void {
    this.notifApi.getUnreadCount().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.unreadCount = res.data.unread_count;
          this.appState.updateNotificationCount(res.data.unread_count);
        }
      },
    });
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = null;

    const params: NotificationListParams = {
      page: this.currentPage,
      per_page: this.perPage,
    };

    if (this.activeFilter === 'unread') {
      params.read = '0';
    } else if (this.activeFilter !== 'all') {
      params.search = this.activeFilter;
    }

    this.notifApi.getNotifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.notifications = res.data || [];
          this.totalPages = res.meta?.last_page || 1;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to load notifications.';
      },
    });
  }

  switchFilter(filter: NotificationFilterType): void {
    if (this.activeFilter === filter) return;
    this.activeFilter = filter;
    this.currentPage = 1;
    this.loadNotifications();
  }

  openNotification(notif: CustomerNotification): void {
    if (!notif.read_at) {
      this.notifApi.markAsRead(notif.uuid).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          notif.read_at = new Date().toISOString();
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          this.appState.updateNotificationCount(this.unreadCount);
        },
      });
    }

    const target = this.getNavigationTarget(notif);
    if (target) {
      this.router.navigate([target]);
    }
  }

  markAllAsRead(): void {
    this.markingAllRead = true;
    this.notifApi.markAllAsRead().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.markingAllRead = false;
        this.unreadCount = 0;
        this.appState.updateNotificationCount(0);
        this.showToast('All notifications marked as read.', 'success');
        this.loadNotifications();
      },
      error: (err) => {
        this.markingAllRead = false;
        this.showToast(err.error?.message || 'Failed to mark notifications as read.', 'error');
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadNotifications();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getNotifConfig(notif: CustomerNotification): { icon: string; color: string; bgColor: string } {
    const eventKey = notif.event_name || '';
    const type = NOTIFICATION_EVENT_MAP[eventKey] || notif.channel || 'system';
    return NOTIFICATION_TYPE_CONFIG[type] || NOTIFICATION_TYPE_CONFIG['system'];
  }

  getNotifIcon(notif: CustomerNotification): string {
    return this.getNotifConfig(notif).icon;
  }

  getTypeCircleStyle(notif: CustomerNotification): string {
    const type = this.getNotifConfig(notif);
    return 'background: ' + this.tailwindBgToHex(type.bgColor) + ';';
  }

  getTypeColor(notif: CustomerNotification): string {
    const type = this.getNotifConfig(notif);
    return 'color: ' + this.tailwindTextToHex(type.color) + ';';
  }

  private tailwindBgToHex(cls: string): string {
    const map: Record<string, string> = {
      'bg-blue-100': '#dbeafe',
      'bg-emerald-100': '#d1fae5',
      'bg-purple-100': '#f3e8ff',
      'bg-amber-100': '#fef3c7',
      'bg-pink-100': '#fce7f3',
      'bg-orange-100': '#ffedd5',
      'bg-gray-100': '#f3f4f6',
      'bg-red-100': '#fee2e2',
    };
    return map[cls] || '#f3f4f6';
  }

  private tailwindTextToHex(cls: string): string {
    const map: Record<string, string> = {
      'text-blue-600': '#2563eb',
      'text-emerald-600': '#059669',
      'text-purple-600': '#9333ea',
      'text-amber-600': '#d97706',
      'text-pink-600': '#db2777',
      'text-orange-600': '#ea580c',
      'text-gray-600': '#6b7280',
      'text-red-600': '#dc2626',
    };
    return map[cls] || '#6b7280';
  }

  getChannelBadgeStyle(channel: string): string {
    const map: Record<string, { bg: string; color: string }> = {
      push: { bg: '#dbeafe', color: '#1d4ed8' },
      email: { bg: '#f3e8ff', color: '#7e22ce' },
      sms: { bg: '#fef3c7', color: '#b45309' },
      in_app: { bg: '#f3f4f6', color: '#374151' },
      whatsapp: { bg: '#d1fae5', color: '#15803d' },
    };
    const style = map[channel] || map['in_app'];
    return 'background: ' + style.bg + '; color: ' + style.color + ';';
  }

  capitalize(str: string): string {
    return str.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  }

  getNavigationTarget(notif: CustomerNotification): string | null {
    const eventKey = notif.event_name || '';
    const payload = notif.payload || {};

    if (eventKey.startsWith('order.') && payload['order_id']) {
      return `/customer/orders/${payload['order_id']}`;
    }
    if (eventKey.startsWith('subscription.') && payload['subscription_id']) {
      return `/customer/subscriptions/${payload['subscription_id']}`;
    }
    if (eventKey.startsWith('wallet.') || eventKey === 'refund.processed') {
      return '/customer/wallet';
    }
    if (eventKey.startsWith('payment.') && payload['order_id']) {
      return `/customer/orders/${payload['order_id']}`;
    }
    if (eventKey.startsWith('support.') && payload['ticket_id']) {
      return '/customer/support';
    }
    if (eventKey.startsWith('promotion.')) {
      return '/meals';
    }
    return null;
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  resetNotifCardStyle(event: Event, readAt: string | null): void {
    const el = event.currentTarget as HTMLElement;
    if (readAt) {
      el.style.boxShadow = 'none';
      el.style.borderColor = '#e5e7eb';
    } else {
      el.style.boxShadow = '0 0 0 1px rgba(5,150,105,0.1)';
      el.style.borderColor = '#059669';
    }
  }

  getToastStyle(type: string): string {
    const base = 'display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); font-size: 13px; font-weight: 500;';
    if (type === 'success') {
      return base + ' background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;';
    } else if (type === 'error') {
      return base + ' background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;';
    }
    return base + ' background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;';
  }

  private showToast(message: string, type: 'success' | 'error' | 'info'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 5000);
  }
}
