import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import {
  Notification, NotificationDashboardStats,
  DELIVERY_STATUSES, NOTIFICATION_CHANNELS
} from '../../../../core/models/notification/notification.model';

@Component({
  selector: 'app-notification-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading && recentNotifications.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading dashboard...</p>
      </div>
    </div>

    <div *ngIf="!loading || recentNotifications.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Home</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Notification Dashboard</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Notification & Communication</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Overview of notifications, delivery stats, and communication channels</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">notifications</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Notifications</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total_notifications || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">send</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Sent</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.sent || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Delivered</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.delivered || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef2f2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #dc2626;">error</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Failed</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.failed || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">pending</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Pending</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.pending || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #ede9fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #7c3aed;">visibility</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Read</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.read || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #cffafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #0891b2;">today</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Today's Sent</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.today_sent || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px;">
        <button (click)="navigateTo('/notifications/list')"
          style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;"
          onmouseover="this.style.borderColor='#a7f3d0';this.style.background='#f0fdf4';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white';this.style.transform=''">
          <span class="material-icons" style="font-size: 24px; color: #059669;">notifications</span>
          <span style="font-size: 12px; font-weight: 700; color: #374151;">All Notifications</span>
        </button>
        <button (click)="navigateTo('/notifications/templates')"
          style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;"
          onmouseover="this.style.borderColor='#a7f3d0';this.style.background='#f0fdf4';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white';this.style.transform=''">
          <span class="material-icons" style="font-size: 24px; color: #059669;">description</span>
          <span style="font-size: 12px; font-weight: 700; color: #374151;">Templates</span>
        </button>
        <button (click)="navigateTo('/notifications/broadcast')"
          style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;"
          onmouseover="this.style.borderColor='#a7f3d0';this.style.background='#f0fdf4';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white';this.style.transform=''">
          <span class="material-icons" style="font-size: 24px; color: #059669;">campaign</span>
          <span style="font-size: 12px; font-weight: 700; color: #374151;">Broadcast</span>
        </button>
        <button (click)="navigateTo('/notifications/logs')"
          style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;"
          onmouseover="this.style.borderColor='#a7f3d0';this.style.background='#f0fdf4';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white';this.style.transform=''">
          <span class="material-icons" style="font-size: 24px; color: #059669;">receipt_long</span>
          <span style="font-size: 12px; font-weight: 700; color: #374151;">Delivery Logs</span>
        </button>
        <button (click)="navigateTo('/notifications/templates/create')"
          style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;"
          onmouseover="this.style.borderColor='#a7f3d0';this.style.background='#f0fdf4';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white';this.style.transform=''">
          <span class="material-icons" style="font-size: 24px; color: #059669;">add_circle</span>
          <span style="font-size: 12px; font-weight: 700; color: #374151;">New Template</span>
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div *ngIf="deliveryStats && deliveryStats.by_channel" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
            <h2 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0;">Delivery by Channel</h2>
          </div>
          <div style="padding: 16px 20px;">
            <div *ngFor="let ch of deliveryStats.by_channel" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">{{ getChannelIcon(ch.channel) }}</span>
                <span style="font-size: 13px; font-weight: 600; color: #374151; text-transform: capitalize;">{{ ch.channel }}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 120px; background: #e5e7eb; border-radius: 999px; height: 6px;">
                  <div style="background: #059669; height: 6px; border-radius: 999px; transition: width 0.3s ease;" [style.width.%]="getChannelPercent(ch.count)"></div>
                </div>
                <span style="font-size: 13px; font-weight: 700; color: #374151; width: 40px; text-align: right;">{{ ch.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="deliveryStats && deliveryStats.by_status" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
            <h2 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0;">Delivery by Status</h2>
          </div>
          <div style="padding: 16px 20px;">
            <div *ngFor="let st of deliveryStats.by_status" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
              <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBadgeStyle(st.status).background" [style.color]="getStatusBadgeStyle(st.status).color">
                {{ getStatusLabel(st.status) }}
              </span>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 120px; background: #e5e7eb; border-radius: 999px; height: 6px;">
                  <div style="background: #059669; height: 6px; border-radius: 999px; transition: width 0.3s ease;" [style.width.%]="getStatusPercent(st.count)"></div>
                </div>
                <span style="font-size: 13px; font-weight: 700; color: #374151; width: 40px; text-align: right;">{{ st.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
          <h2 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0;">Recent Notifications</h2>
        </div>
        <div *ngIf="recentNotifications.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">notifications_none</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No recent notifications</h3>
        </div>
        <div *ngIf="recentNotifications.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 160px;">Notification #</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Title</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Channel</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Priority</th>
                <th style="padding: 10px 16px 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of recentNotifications; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 12px;">
                  <a [routerLink]="['/admin/notifications/list', row.uuid]" style="font-size: 13px; font-weight: 700; color: #059669; text-decoration: none; transition: color 0.2s ease;"
                    onmouseover="this.style.color='#047857';this.style.textDecoration='underline'" onmouseout="this.style.color='#059669';this.style.textDecoration='none'">{{ row.notification_number }}</a>
                </td>
                <td style="padding: 12px 12px;"><span style="font-size: 13px; color: #374151;">{{ row.title }}</span></td>
                <td style="padding: 12px 12px;"><span style="font-size: 13px; color: #374151; text-transform: capitalize;">{{ row.channel }}</span></td>
                <td style="padding: 12px 12px;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBadgeStyle(row.delivery_status).background" [style.color]="getStatusBadgeStyle(row.delivery_status).color">
                    {{ getStatusLabel(row.delivery_status) }}
                  </span>
                </td>
                <td style="padding: 12px 12px;"><span style="font-size: 13px; color: #374151; text-transform: capitalize;">{{ row.priority }}</span></td>
                <td style="padding: 12px 16px 12px 12px;"><span style="font-size: 12px; color: #9ca3af;">{{ row.created_at | date:'dd MMM yyyy, hh:mm a' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class NotificationDashboardComponent implements OnInit {
  private notificationApi = inject(NotificationApiService);
  private router = inject(Router);

  stats: NotificationDashboardStats | null = null;
  deliveryStats: any = null;
  recentNotifications: Notification[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.notificationApi.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res.data!;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
    this.notificationApi.getDeliveryStats().subscribe({
      next: (res) => { this.deliveryStats = res.data; },
    });
    this.notificationApi.getNotifications({ per_page: '5', sort: 'created_at', order: 'desc' }).subscribe({
      next: (res) => { this.recentNotifications = res.data ?? []; },
    });
  }

  navigateTo(path: string): void {
    this.router.navigate(['/admin' + path]);
  }

  getChannelIcon(channel: string): string {
    const ch = NOTIFICATION_CHANNELS.find(c => c.value === channel);
    return ch ? ch.icon : 'notifications';
  }

  getChannelPercent(count: number): number {
    if (!this.stats || this.stats.total_notifications === 0) return 0;
    return Math.round((count / this.stats.total_notifications) * 100);
  }

  getStatusPercent(count: number): number {
    if (!this.stats || this.stats.total_notifications === 0) return 0;
    return Math.round((count / this.stats.total_notifications) * 100);
  }

  getStatusLabel(status: string): string {
    const found = DELIVERY_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getStatusBadgeStyle(status: string): any {
    const styles: Record<string, any> = {
      pending: { background: '#f3f4f6', color: '#6b7280' },
      queued: { background: '#dbeafe', color: '#1d4ed8' },
      sent: { background: '#e0e7ff', color: '#4338ca' },
      delivered: { background: '#d1fae5', color: '#047857' },
      read: { background: '#ede9fe', color: '#6d28d9' },
      failed: { background: '#fee2e2', color: '#b91c1c' },
      cancelled: { background: '#f3f4f6', color: '#6b7280' },
    };
    return styles[status] || { background: '#f3f4f6', color: '#6b7280' };
  }
}
