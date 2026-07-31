import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsApiService } from '../../../../core/services/settings-api.service';

@Component({
  selector: 'app-settings-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background:#f8fafc;">
      <div style="background:linear-gradient(135deg,#022c22,#064e3b,#065f46);padding:32px 40px 48px;">
        <div>
          <h1 class="text-2xl font-bold text-white" style="letter-spacing:-0.02em;">Settings</h1>
          <p class="text-emerald-200/70 mt-1.5 text-sm">Manage system configuration, content, and application settings</p>
        </div>
      </div>

      <div style="margin-top:-24px;padding:0 32px 32px;">
        @if (loading) {
          <div style="display:flex;justify-content:center;padding:64px 0;">
            <div style="width:40px;height:40px;border-radius:50%;border:3px solid #d1fae5;border-top-color:#059669;animation:spin 0.8s linear infinite;"></div>
          </div>
        } @else {
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-bottom:32px;">
            <div *ngFor="let stat of summaryCards"
              style="background:white;border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);transition:all 0.2s;cursor:default;"
              onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
              onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div>
                  <div style="font-size:12px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">{{ stat.label }}</div>
                  <div style="font-size:28px;font-weight:700;color:#0f172a;margin-top:4px;">{{ stat.value }}</div>
                </div>
                <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
                  [style.background]="stat.bg">
                  <span class="material-icons" [style.color]="stat.color" style="font-size:22px;line-height:1;">{{ stat.icon }}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style="font-size:15px;font-weight:600;color:#0f172a;margin-bottom:16px;">Configuration Modules</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">
              <a *ngFor="let item of navItems" [routerLink]="item.route"
                style="display:flex;align-items:flex-start;gap:16px;background:white;border-radius:14px;padding:20px;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.04);transition:all 0.2s;border:1px solid transparent;"
                onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)';this.style.borderColor='#d1fae5'"
                onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)';this.style.borderColor='transparent'">
                <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
                  [style.background]="item.bg">
                  <span class="material-icons" [style.color]="item.color" style="font-size:22px;line-height:1;">{{ item.icon }}</span>
                </div>
                <div style="min-width:0;">
                  <div style="font-size:14px;font-weight:600;color:#0f172a;">{{ item.label }}</div>
                  <div style="font-size:12px;color:#64748b;margin-top:3px;line-height:1.4;">{{ item.desc }}</div>
                </div>
                <span class="material-icons" style="margin-left:auto;font-size:18px;color:#cbd5e1;flex-shrink:0;margin-top:2px;">chevron_right</span>
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class SettingsDashboardComponent implements OnInit {
  private settingsApi: SettingsApiService = inject(SettingsApiService);
  loading = true;
  summaryCards: { label: string; value: string | number; icon: string; color: string; bg: string }[] = [];

  navItems = [
    { route: '/admin/settings/general', icon: 'tune', label: 'General Settings', desc: 'Site name, localization, security, API config', color: '#059669', bg: '#ecfdf5' },
    { route: '/admin/settings/company', icon: 'business', label: 'Company Profile', desc: 'Business name, address, GST, FSSAI details', color: '#0284c7', bg: '#f0f9ff' },
    { route: '/admin/settings/branding', icon: 'palette', label: 'Branding', desc: 'Logo, favicon, color scheme customization', color: '#7c3aed', bg: '#f5f3ff' },
    { route: '/admin/settings/seo', icon: 'travel_explore', label: 'SEO Manager', desc: 'Meta tags, analytics, sitemap, robots.txt', color: '#ea580c', bg: '#fff7ed' },
    { route: '/admin/settings/payments', icon: 'payments', label: 'Payment Gateway', desc: 'Razorpay keys, webhook, sandbox mode', color: '#0d9488', bg: '#f0fdfa' },
    { route: '/admin/settings/notifications-config', icon: 'notifications_active', label: 'Notification Config', desc: 'SMTP email, SMS provider, Firebase Cloud', color: '#db2777', bg: '#fdf2f8' },
    { route: '/admin/settings/cms', icon: 'article', label: 'CMS Pages', desc: 'About us, Privacy policy, Terms & conditions', color: '#ca8a04', bg: '#fefce8' },
    { route: '/admin/settings/versions', icon: 'system_update', label: 'App Versions', desc: 'Android & iOS version release management', color: '#dc2626', bg: '#fef2f2' },
    { route: '/admin/settings/backups', icon: 'backup', label: 'Backup Manager', desc: 'Database, storage backup & restore', color: '#4f46e5', bg: '#eef2ff' },
    { route: '/admin/settings/maintenance', icon: 'engineering', label: 'Maintenance', desc: 'Enable/disable maintenance mode', color: '#d97706', bg: '#fffbeb' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.settingsApi.getSettingsGroups().subscribe({
      next: (res) => {
        const data = res.data!;
        if (!data) { this.loading = false; return; }
        const totalSettings = Object.values(data.groups).reduce((a: number, b: number) => a + b, 0);
        this.summaryCards = [
          { label: 'Total Settings', value: totalSettings, icon: 'settings', color: '#0284c7', bg: '#f0f9ff' },
          { label: 'Setting Groups', value: Object.keys(data.groups).length, icon: 'category', color: '#059669', bg: '#ecfdf5' },
          { label: 'Active', value: data.status_counts['active'] || 0, icon: 'check_circle', color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Inactive', value: data.status_counts['inactive'] || 0, icon: 'pause_circle', color: '#d97706', bg: '#fffbeb' },
        ];
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
