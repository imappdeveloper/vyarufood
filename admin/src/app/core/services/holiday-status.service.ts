import { Injectable, inject, signal } from '@angular/core';
import { CustomerBrowseApiService, KitchenHolidayStatus } from './customer-browse-api.service';

@Injectable({ providedIn: 'root' })
export class HolidayStatusService {
  private api = inject(CustomerBrowseApiService);

  status = signal<KitchenHolidayStatus | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  loadStatus(kitchenId?: number): void {
    this.loading.set(true);
    this.api.getKitchenHolidayStatus(kitchenId).subscribe({
      next: (res) => {
        this.status.set(res.data ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load holiday status');
        this.loading.set(false);
      },
    });
  }
}
