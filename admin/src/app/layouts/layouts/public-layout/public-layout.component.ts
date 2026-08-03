import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerHeaderComponent } from '../../../features/customer/public/components/header/header.component';
import { MaintenanceComponent } from '../../../features/customer/public/maintenance/maintenance.component';
import { ClosedForHolidayComponent } from '../../../features/customer/public/closed/closed-for-holiday.component';
import { AreaNotServedComponent } from '../../../features/customer/public/area-not-served/area-not-served.component';
import { PublicLoadingComponent } from '../../../features/customer/public/public-loading/public-loading.component';
import { MobileBottomNavComponent } from '../../../features/customer/shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { PublicApiService } from '../../../core/services/public-api.service';
import { HolidayStatusService } from '../../../core/services/holiday-status.service';
import { PincodeStateService } from '../../../core/services/pincode-state.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, CustomerHeaderComponent, MaintenanceComponent, ClosedForHolidayComponent, AreaNotServedComponent, PublicLoadingComponent, MobileBottomNavComponent],
  template: `
    @if (!pincodeState.autoCheckResolved() || holidayStatus.loading() || !maintenanceChecked) {
      <app-public-loading message="Checking if we deliver to your area…" />
    } @else if (pincodeState.showAreaNotServed()) {
      <app-area-not-served />
    } @else if (holidayStatus.status()?.is_off_today) {
      <app-closed-for-holiday />
    } @else if (maintenanceMode) {
      <app-maintenance />
    } @else {
      <div style="display:flex;min-height:100vh;flex-direction:column;background:white;padding-top:67px;">
        <app-customer-header />
        @if (pincodeState.locationPrompt(); as prompt) {
          <div style="background:#fffbeb;border-bottom:1px solid #fde68a;padding:0.6rem 24px;display:flex;align-items:center;gap:0.5rem;justify-content:center;flex-wrap:wrap;">
            <span class="material-icons" style="font-size:1rem;color:#d97706;">location_off</span>
            <span style="font-size:0.8rem;color:#92400e;flex:1;min-width:200px;">{{ prompt }} You can also check your pincode manually from the Meals page.</span>
            <button (click)="pincodeState.dismissLocationPrompt()"
              style="border:1px solid #fde68a;background:white;color:#92400e;font-size:0.72rem;font-weight:600;padding:0.3rem 0.8rem;border-radius:999px;cursor:pointer;flex-shrink:0;">
              Dismiss
            </button>
          </div>
        }
        @if (pincodeState.autoNotice(); as notice) {
          <div style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:0.6rem 24px;display:flex;align-items:center;gap:0.5rem;justify-content:center;">
            <span class="material-icons" style="font-size:1rem;color:#059669;">check_circle</span>
            <span style="font-size:0.8rem;color:#065f46;font-weight:500;">{{ notice }}</span>
            <button (click)="pincodeState.dismissAutoNotice()" title="Close"
              style="border:none;background:transparent;color:#059669;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span class="material-icons" style="font-size:1rem;">close</span>
            </button>
          </div>
        }
        <main style="flex:1;">
          <router-outlet />
        </main>
        <div class="bottom-nav-spacer"></div>
      </div>

      <app-mobile-bottom-nav />
    }

    @if (isOffline()) {
      <div style="position: fixed; inset: 0; z-index: 9999; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 32px; text-align: center;">
        <div style="width: 96px; height: 96px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(5,150,105,0.15);">
          <span class="material-icons" style="font-size: 48px; color: #059669;">wifi_off</span>
        </div>
        <h2 style="font-size: 22px; font-weight: 800; color: #1e293b; margin: 0;">No Internet Connection</h2>
        <p style="font-size: 14px; color: #64748b; margin: 0; max-width: 280px; line-height: 1.5;">Please check your internet connection and try again.</p>
        <button (click)="retryConnection()"
          style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #059669; color: #fff; font-weight: 600; font-size: 14px; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(5,150,105,0.25);"
          onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
          <span class="material-icons" style="font-size: 18px;">refresh</span> Try Again
        </button>
      </div>
    }
  `,
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  private publicApi = inject(PublicApiService);
  holidayStatus = inject(HolidayStatusService);
  pincodeState = inject(PincodeStateService);

  maintenanceMode = false;
  maintenanceChecked = false;

  isOffline = signal(typeof navigator !== 'undefined' && !navigator.onLine);
  private offlineHandler = () => this.isOffline.set(true);
  private onlineHandler = () => this.isOffline.set(false);

  ngOnInit(): void {
    window.addEventListener('offline', this.offlineHandler);
    window.addEventListener('online', this.onlineHandler);
    this.holidayStatus.loadStatus();
    this.pincodeState.autoDetectPincode();
    this.publicApi.getMaintenanceStatus().subscribe({
      next: (res) => {
        this.maintenanceMode = res.data?.maintenance_mode === true;
        this.maintenanceChecked = true;
      },
      error: () => {
        this.maintenanceMode = false;
        this.maintenanceChecked = true;
      },
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('offline', this.offlineHandler);
    window.removeEventListener('online', this.onlineHandler);
  }

  retryConnection(): void {
    if (navigator.onLine) {
      this.isOffline.set(false);
    } else {
      window.location.reload();
    }
  }
}
