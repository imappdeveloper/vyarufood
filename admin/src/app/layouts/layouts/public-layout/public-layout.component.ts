import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerHeaderComponent } from '../../../features/customer/public/components/header/header.component';
import { FooterComponent } from '../../../features/customer/public/components/footer/footer.component';
import { MaintenanceComponent } from '../../../features/customer/public/maintenance/maintenance.component';
import { ClosedForHolidayComponent } from '../../../features/customer/public/closed/closed-for-holiday.component';
import { PublicApiService } from '../../../core/services/public-api.service';
import { HolidayStatusService } from '../../../core/services/holiday-status.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, CustomerHeaderComponent, FooterComponent, MaintenanceComponent, ClosedForHolidayComponent],
  template: `
    @if (maintenanceMode) {
      <app-maintenance />
    } @else if (holidayStatus.status()?.is_off_today && !holidayStatus.loading()) {
      <app-closed-for-holiday />
    } @else {
      <div style="display:flex;min-height:100vh;flex-direction:column;background:white;">
        <app-customer-header />
        <main style="flex:1;">
          <router-outlet />
        </main>
        <app-footer />
      </div>
    }
  `,
})
export class PublicLayoutComponent implements OnInit {
  private publicApi = inject(PublicApiService);
  holidayStatus = inject(HolidayStatusService);

  maintenanceMode = false;

  ngOnInit(): void {
    this.holidayStatus.loadStatus();
    this.publicApi.getMaintenanceStatus().subscribe({
      next: (res) => {
        this.maintenanceMode = res.data?.maintenance_mode === true;
      },
      error: () => {
        this.maintenanceMode = false;
      },
    });
  }
}
