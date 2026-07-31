import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { HolidayStatusService } from '../../../../../core/services/holiday-status.service';

@Component({
  selector: 'app-holiday-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (holidayStatus.loading()) {
      <div style="padding: 0.5rem 1rem; background: #f0fdf4; border-bottom: 1px solid #d1fae5; display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
        <span class="material-icons" style="font-size: 1rem; color: #059669; animation: spin 1s linear infinite;">refresh</span>
        <span style="font-size: 0.78rem; color: #065f46;">Checking today's service status...</span>
      </div>
    } @else if (holidayStatus.status(); as status) {
      @if (status.is_off_today) {
        <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border-bottom: 1px solid #fecaca; padding: 0.6rem 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
          <span class="material-icons" style="font-size: 1.1rem; color: #dc2626;">block</span>
          <span style="font-size: 0.82rem; color: #991b1b; font-weight: 600;">{{ status.message }}</span>
          <span style="font-size: 0.75rem; color: #b91c1c;">— No orders will be processed today.</span>
          <a routerLink="/holidays" style="font-size: 0.75rem; color: #059669; font-weight: 600; text-decoration: underline; cursor: pointer;">View schedule</a>
        </div>
      } @else {
        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-bottom: 1px solid #bbf7d0; padding: 0.4rem 1rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; flex-wrap: wrap;">
          <span class="material-icons" style="font-size: 1rem; color: #059669;">check_circle</span>
          <span style="font-size: 0.78rem; color: #065f46; font-weight: 500;">{{ status.message }}</span>
          @if (status.working_hours; as wh) {
            <span style="font-size: 0.72rem; color: #047857;">({{ wh.opening_time }} – {{ wh.closing_time }})</span>
          }
          <a routerLink="/holidays" style="font-size: 0.72rem; color: #059669; text-decoration: underline; cursor: pointer;">Schedule & holidays</a>
        </div>
      }
    }
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class HolidayBannerComponent implements OnInit, OnDestroy {
  holidayStatus = inject(HolidayStatusService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.holidayStatus.loadStatus();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.holidayStatus.loadStatus();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
