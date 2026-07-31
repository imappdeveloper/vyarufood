import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsApiService } from '../../../../core/services/settings-api.service';

interface MaintenanceStatus {
  is_enabled: boolean;
  enabled_at: string | null;
}

@Component({
  selector: 'app-maintenance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `],
  template: `
    <div style="background:#f8fafc;min-height:100vh;">
      <div style="position:relative;background:linear-gradient(135deg,#059669,#047857,#166534);padding:32px 40px 56px;overflow:hidden;">
        <div style="position:absolute;top:-30px;right:-30px;width:180px;height:180px;background:rgba(255,255,255,0.06);border-radius:50%;"></div>
        <div style="position:absolute;bottom:-40px;left:20%;width:140px;height:140px;background:rgba(255,255,255,0.04);border-radius:50%;"></div>
        <div style="max-width:1200px;margin:0 auto;position:relative;z-index:2;">
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,0.75);margin-bottom:16px;">
            <a routerLink="/admin/settings" style="color:rgba(255,255,255,0.75);text-decoration:none;transition:color 0.2s;"
              onmouseenter="this.style.color='#a7f3d0'" onmouseleave="this.style.color='rgba(255,255,255,0.75)'">Settings</a>
            <span class="material-icons" style="font-size:14px;line-height:1;color:rgba(255,255,255,0.4);">chevron_right</span>
            <span style="color:white;font-weight:500;">Maintenance Mode</span>
          </div>
          <div>
            <h1 style="font-size:28px;font-weight:800;color:white;margin:0 0 6px 0;">
              <span class="material-icons" style="font-size:24px;vertical-align:middle;margin-right:8px;">construction</span>
              Maintenance Mode
            </h1>
            <p style="font-size:14px;color:rgba(255,255,255,0.85);margin:0;">Enable or disable maintenance mode for the application</p>
          </div>
        </div>
        <svg style="position:absolute;bottom:-2px;left:0;width:100%;height:40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafc"/>
        </svg>
      </div>

      <div style="padding:0 32px 32px;margin-top:-20px;max-width:1000px;margin-left:auto;margin-right:auto;">
        @if (loading) {
          <div style="display:flex;justify-content:center;padding:80px 0;">
            <div style="width:36px;height:36px;border-radius:50%;border:3px solid #d1fae5;border-top-color:#059669;animation:spin 0.8s linear infinite;"></div>
          </div>
        } @else {
          <div style="background:white;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.04);padding:32px;margin-bottom:24px;">
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:32px;">
              <div style="width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
                [style.background]="status?.is_enabled ? '#fef2f2' : '#ecfdf5'">
                <span class="material-icons" style="font-size:32px;line-height:1;"
                  [style.color]="status?.is_enabled ? '#dc2626' : '#059669'"
                  [style.animation]="status?.is_enabled ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none'">
                  {{ status?.is_enabled ? 'warning' : 'check_circle' }}
                </span>
              </div>
              <div>
                <div style="font-size:22px;font-weight:700;color:#0f172a;">{{ status?.is_enabled ? 'Maintenance Mode Active' : 'System Operational' }}</div>
                <div style="font-size:14px;color:#64748b;margin-top:4px;">
                  {{ status?.is_enabled ? 'The customer website is currently under maintenance. Visitors will see a maintenance page.' : 'The customer website is live and accessible to all visitors.' }}
                </div>
              </div>
            </div>

            @if (status?.is_enabled && status?.enabled_at) {
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;display:flex;align-items:center;gap:12px;margin-bottom:32px;">
                <span class="material-icons" style="font-size:20px;line-height:1;color:#ef4444;">schedule</span>
                <div>
                  <div style="font-size:13px;font-weight:600;color:#991b1b;">Enabled Since</div>
                  <div style="font-size:13px;color:#b91c1c;">{{ status?.enabled_at | date:'medium' }}</div>
                </div>
              </div>
            }

            <div style="display:flex;align-items:center;gap:16px;">
              @if (status?.is_enabled) {
                <button (click)="disableMaintenance()" [disabled]="isToggling"
                  style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:linear-gradient(135deg,#059669,#16a34a);color:white;font-size:14px;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 16px rgba(5,150,105,0.25);"
                  [style.opacity]="isToggling ? '0.6' : '1'"
                  [style.cursor]="isToggling ? 'not-allowed' : 'pointer'"
                  onmouseenter="if(!this.disabled){this.style.boxShadow='0 6px 24px rgba(5,150,105,0.35)';this.style.transform='translateY(-1px)'}"
                  onmouseleave="if(!this.disabled){this.style.boxShadow='0 4px 16px rgba(5,150,105,0.25)';this.style.transform='translateY(0)'}">
                  @if (isToggling) {
                    <div style="width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                  } @else {
                    <span class="material-icons" style="font-size:18px;line-height:1;">power_settings_new</span>
                  }
                  Disable Maintenance Mode
                </button>
              } @else {
                <button (click)="enableMaintenance()" [disabled]="isToggling"
                  style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:white;color:#dc2626;font-size:14px;font-weight:700;border:2px solid #fecaca;border-radius:12px;cursor:pointer;transition:all 0.3s ease;"
                  [style.opacity]="isToggling ? '0.6' : '1'"
                  [style.cursor]="isToggling ? 'not-allowed' : 'pointer'"
                  onmouseenter="if(!this.disabled){this.style.background='#fef2f2';this.style.borderColor='#fca5a5'}"
                  onmouseleave="if(!this.disabled){this.style.background='white';this.style.borderColor='#fecaca'}">
                  @if (isToggling) {
                    <div style="width:18px;height:18px;border:2px solid #fecaca;border-top-color:#dc2626;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                  } @else {
                    <span class="material-icons" style="font-size:18px;line-height:1;">power_settings_new</span>
                  }
                  Enable Maintenance Mode
                </button>
              }
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);padding:24px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#ecfdf5;">
                  <span class="material-icons" style="font-size:20px;line-height:1;color:#059669;">info</span>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:600;color:#0f172a;">Current Status</div>
                  <div style="font-size:13px;color:#64748b;margin-top:2px;">{{ status?.is_enabled ? 'Enabled' : 'Disabled' }}</div>
                </div>
              </div>
            </div>
            <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);padding:24px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fef3c7;">
                  <span class="material-icons" style="font-size:20px;line-height:1;color:#f59e0b;">public</span>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:600;color:#0f172a;">Customer Access</div>
                  <div style="font-size:13px;color:#64748b;margin-top:2px;">{{ status?.is_enabled ? 'Blocked — showing maintenance page' : 'Allowed — website is live' }}</div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      @if (feedbackMessage) {
        <div style="position:fixed;bottom:24px;right:24px;z-index:50;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 10px 40px rgba(0,0,0,0.15);transition:all 0.3s;display:flex;align-items:center;gap:8px;"
          [style.background]="feedbackType === 'success' ? '#059669' : '#ef4444'"
          [style.color]="'white'">
          <span class="material-icons" style="font-size:18px;line-height:1;">{{ feedbackType === 'success' ? 'check_circle' : 'error_outline' }}</span>
          {{ feedbackMessage }}
        </div>
      }
    </div>
  `,
})
export class MaintenanceDashboardComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);
  private cdr = inject(ChangeDetectorRef);

  status: MaintenanceStatus | null = null;
  loading = false;
  isToggling = false;

  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.loading = true;
    this.settingsApi.getMaintenanceStatus().subscribe({
      next: (res) => {
        this.status = res.data || null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.showFeedback('Failed to load maintenance status', 'error');
      },
    });
  }

  enableMaintenance(): void {
    if (!window.confirm('Enable maintenance mode? Users will not be able to access the application.')) return;
    this.isToggling = true;
    this.settingsApi.enableMaintenance().subscribe({
      next: (res) => {
        this.isToggling = false;
        this.showFeedback(res.message || 'Maintenance mode enabled', 'success');
        this.loadStatus();
      },
      error: (err) => {
        this.isToggling = false;
        this.showFeedback(err.error?.message || 'Failed to enable maintenance mode', 'error');
      },
    });
  }

  disableMaintenance(): void {
    this.isToggling = true;
    this.settingsApi.disableMaintenance().subscribe({
      next: (res) => {
        this.isToggling = false;
        this.showFeedback(res.message || 'Maintenance mode disabled', 'success');
        this.loadStatus();
      },
      error: (err) => {
        this.isToggling = false;
        this.showFeedback(err.error?.message || 'Failed to disable maintenance mode', 'error');
      },
    });
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 3000);
  }
}
