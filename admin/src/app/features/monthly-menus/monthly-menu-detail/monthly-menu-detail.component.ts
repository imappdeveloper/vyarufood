import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MonthlyMenuApiService } from '../../../core/services/monthly-menu-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MonthlyMenu, MonthlyMenuItem } from '../../../core/models/monthly-menu/monthly-menu.model';
import { MonthlyMenuCalendarComponent } from '../monthly-menu-calendar/monthly-menu-calendar.component';

@Component({
  selector: 'app-monthly-menu-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MonthlyMenuCalendarComponent],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading menu details...</p>
      </div>
    </div>

    <div *ngIf="!loading && menu" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/monthly-menus" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Monthly Menus
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ menu.title }}</h1>
              <span style="display: inline-flex; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="menu.status === 'published' ? '#d1fae5' : menu.status === 'draft' ? '#fef3c7' : menu.status === 'approved' ? '#dbeafe' : '#f3f4f6'"
                [style.color]="menu.status === 'published' ? '#047857' : menu.status === 'draft' ? '#b45309' : menu.status === 'approved' ? '#1d4ed8' : '#6b7280'">
                {{ menu.status | titlecase }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
              {{ formatMonthYear(menu.month, menu.year) }}
              &bull; {{ menu.days_in_month }} days
              <span *ngIf="menu.template_name"> &bull; {{ menu.template_name }}</span>
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button *ngIf="menu.status !== 'published' && menu.status !== 'approved'" (click)="publishMenu()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">publish</span> Publish
            </button>
            <button *ngIf="menu.status === 'published'" (click)="unpublishMenu()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">unpublished</span> Unpublish
            </button>
            <button *ngIf="menu.status === 'published'" (click)="approveMenu()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">check_circle</span> Approve
            </button>
            <button *ngIf="menu.status === 'approved'" (click)="generateWeeklyMenus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">date_range</span> Generate Weekly Menus
            </button>
            <a [routerLink]="['/admin/monthly-menus', menu.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <div style="position: relative;">
              <button (click)="showMoreActions = !showMoreActions"
                style="padding: 8px 12px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
                onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                <span class="material-icons" style="font-size: 18px;">more_vert</span>
              </button>
              <div *ngIf="showMoreActions" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 180px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;"
                (mouseleave)="showMoreActions = false">
                <button (click)="duplicateMenu()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                  onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #2563eb;">content_copy</span> Duplicate
                </button>
                <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button (click)="deleteMenu()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">restaurant</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Items</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ menu.items_count || menu.items?.length || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">event</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Days in Month</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ menu.days_in_month }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">schedule</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Status</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ menu.status | titlecase }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #7c3aed;">edit_note</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Template</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ menu.template_name || '-' }}</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
            <button (click)="activeTab = 'calendar'"
              style="flex: 1; padding: 14px 20px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.15s ease; display: inline-flex; align-items: center; justify-content: center; gap: 6px;"
              [style.color]="activeTab === 'calendar' ? '#059669' : '#6b7280'"
              [style.borderBottom]="activeTab === 'calendar' ? '2px solid #059669' : '2px solid transparent'"
              onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 18px;">calendar_month</span> Calendar View
            </button>
            <button (click)="activeTab = 'items'"
              style="flex: 1; padding: 14px 20px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.15s ease; display: inline-flex; align-items: center; justify-content: center; gap: 6px;"
              [style.color]="activeTab === 'items' ? '#059669' : '#6b7280'"
              [style.borderBottom]="activeTab === 'items' ? '2px solid #059669' : '2px solid transparent'"
              onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 18px;">table_rows</span> Menu Items ({{ menu.items_count || menu.items?.length || 0 }})
            </button>
          </div>

          <div *ngIf="activeTab === 'calendar'" style="padding: 20px;">
            <app-monthly-menu-calendar
              [monthlyMenu]="menu"
              [items]="menu.items || []"
              [readonly]="menu.status === 'published' || menu.status === 'approved'">
            </app-monthly-menu-calendar>
          </div>

          <div *ngIf="activeTab === 'items'" style="padding: 20px;">
            <div *ngIf="menu.items && menu.items.length > 0" style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Day</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Category</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meal</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Order</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of menu.items; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                    [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                    <td style="padding: 10px 12px; color: #374151;">{{ row.menu_date | date:'EEE, MMM d' }}</td>
                    <td style="padding: 10px 12px; color: #6b7280;">{{ row.day_name || '-' }}</td>
                    <td style="padding: 10px 12px;">
                      <span style="display: inline-flex; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #d1fae5; color: #047857;">{{ row.meal_category_name || '-' }}</span>
                    </td>
                    <td style="padding: 10px 12px; font-weight: 600; color: #1f2937;">{{ row.meal_name || '-' }}</td>
                    <td style="padding: 10px 12px; color: #6b7280;">{{ row.meal_type_name || '-' }}</td>
                    <td style="padding: 10px 12px; text-align: center;">{{ row.display_order }}</td>
                    <td style="padding: 10px 12px;">
                      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        <span *ngIf="row.is_default" style="padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #dbeafe; color: #1d4ed8; text-transform: uppercase;">Default</span>
                        <span *ngIf="row.is_optional" style="padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #fef3c7; color: #b45309; text-transform: uppercase;">Optional</span>
                        <span *ngIf="row.is_special" style="padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #d1fae5; color: #047857; text-transform: uppercase;">Special</span>
                        <span *ngIf="row.is_festival" style="padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #ede9fe; color: #5b21b6; text-transform: uppercase;">Festival</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="!menu.items || menu.items.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
              <div style="width: 64px; height: 64px; border-radius: 16px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 28px; color: #d1d5db;">restaurant_menu</span>
              </div>
              <h4 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No items yet</h4>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">Items will appear here once the menu is populated</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class MonthlyMenuDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private monthlyMenuApi = inject(MonthlyMenuApiService);
  private notification = inject(NotificationService);

  menu: MonthlyMenu | null = null;
  loading = true;
  activeTab = 'calendar';
  showMoreActions = false;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadMenu(uuid); }
  }

  loadMenu(uuid: string): void {
    this.monthlyMenuApi.getMonthlyMenu(uuid).subscribe({
      next: (res) => {
        this.menu = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.notification.error('Failed to load menu'); this.router.navigate(['/admin/monthly-menus']); },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  formatMonthYear(month: number, year: number): string {
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long' }) + ' ' + year;
  }

  publishMenu(): void {
    if (!this.menu) return;
    if (window.confirm(`Publish "${this.menu.title}"? Customers will be able to see this menu.`)) {
      this.monthlyMenuApi.publishMonthlyMenu(this.menu.uuid).subscribe({
        next: (res) => { this.menu = res.data ?? null; this.notification.success('Menu published'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  unpublishMenu(): void {
    if (!this.menu) return;
    if (window.confirm(`Unpublish "${this.menu.title}"?`)) {
      this.monthlyMenuApi.unpublishMonthlyMenu(this.menu.uuid).subscribe({
        next: (res) => { this.menu = res.data ?? null; this.notification.success('Menu unpublished'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  approveMenu(): void {
    if (!this.menu) return;
    if (window.confirm(`Approve "${this.menu.title}"?`)) {
      this.monthlyMenuApi.approveMonthlyMenu(this.menu.uuid).subscribe({
        next: (res) => { this.menu = res.data ?? null; this.notification.success('Menu approved'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  generateWeeklyMenus(): void {
    if (!this.menu) return;
    if (window.confirm(`Generate weekly menus from "${this.menu.title}"?`)) {
      this.monthlyMenuApi.generateWeeklyMenus(this.menu.uuid).subscribe({
        next: () => { this.notification.success('Weekly menus generated'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  duplicateMenu(): void {
    if (!this.menu) return;
    const targetMonth = window.prompt('Target month (1-12):', String(this.menu.month));
    if (targetMonth === null) return;
    const targetYear = window.prompt('Target year:', String(this.menu.year));
    if (targetYear === null) return;
    const month = parseInt(targetMonth, 10);
    const year = parseInt(targetYear, 10);
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      this.notification.error('Invalid month or year');
      return;
    }
    this.monthlyMenuApi.duplicateMonthlyMenu(this.menu.uuid, { target_month: month, target_year: year }).subscribe({
      next: (res) => {
        this.notification.success('Menu duplicated');
        if (res.data) { this.router.navigate(['/admin/monthly-menus', res.data.uuid]); }
      },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  deleteMenu(): void {
    if (!this.menu) return;
    if (window.confirm(`Delete "${this.menu.title}"? This action cannot be undone.`)) {
      this.monthlyMenuApi.deleteMonthlyMenu(this.menu.uuid).subscribe({
        next: () => { this.notification.success('Menu deleted'); this.router.navigate(['/admin/monthly-menus']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
