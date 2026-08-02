import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CustomerHeaderComponent } from '../../../features/customer/public/components/header/header.component';
import { MaintenanceComponent } from '../../../features/customer/public/maintenance/maintenance.component';
import { ClosedForHolidayComponent } from '../../../features/customer/public/closed/closed-for-holiday.component';
import { AreaNotServedComponent } from '../../../features/customer/public/area-not-served/area-not-served.component';
import { PublicLoadingComponent } from '../../../features/customer/public/public-loading/public-loading.component';
import { MobileBottomNavComponent } from '../../../features/customer/shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { PublicApiService } from '../../../core/services/public-api.service';
import { HolidayStatusService } from '../../../core/services/holiday-status.service';
import { PincodeStateService } from '../../../core/services/pincode-state.service';
import { LoadingService } from '../../../core/services/loading.service';

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

      @if (navLoading()) {
        <app-public-loading message="Loading…" />
      }
    }
  `,
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  private publicApi = inject(PublicApiService);
  private router = inject(Router);
  private loading = inject(LoadingService);
  holidayStatus = inject(HolidayStatusService);
  pincodeState = inject(PincodeStateService);

  maintenanceMode = false;
  maintenanceChecked = false;

  navLoading = signal(false);
  private routerSub?: Subscription;
  private navCheckTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
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

    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
      .subscribe(() => {
        this.navLoading.set(true);
        clearTimeout(this.navCheckTimer);
      });

    this.router.events
      .pipe(filter((e: Event) => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError))
      .subscribe(() => {
        const started = Date.now();
        const check = () => {
          if (!this.loading.isLoading || Date.now() - started > 8000) {
            this.navLoading.set(false);
          } else {
            this.navCheckTimer = setTimeout(check, 250);
          }
        };
        check();
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    clearTimeout(this.navCheckTimer);
  }
}
