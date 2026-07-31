import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardApiService } from '../../../../core/services/dashboard-api.service';
import { SystemHealth } from '../../../../core/models/dashboard/dashboard-types.model';

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="card-modern p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-900">System Health</h3>
        <span class="text-xs text-gray-400">{{ health?.server_time }}</span>
      </div>
      @if (loading) {
        <div class="space-y-2.5">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="flex items-center justify-between animate-pulse">
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
              <div class="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          }
        </div>
      } @else if (health) {
        <div class="space-y-3">
          @for (item of healthItems; track item.label) {
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ item.label }}</span>
              <div class="flex items-center gap-1.5">
                @if (item.type === 'status') {
                  <span class="w-1.5 h-1.5 rounded-full" [class]="item.value === 'connected' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  <span class="text-xs font-medium" [class]="item.value === 'connected' ? 'text-emerald-600' : 'text-red-500'">{{ item.value }}</span>
                } @else {
                  <span class="text-xs font-medium text-gray-700">{{ item.value }}</span>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <p class="text-xs text-gray-400 text-center py-4">Unable to load system health</p>
      }
    </div>
  `,
})
export class SystemHealthComponent implements OnInit {
  private dashboardApi = inject(DashboardApiService);
  health: SystemHealth | null = null;
  loading = true;

  healthItems: { label: string; value: string; type?: string }[] = [];

  ngOnInit(): void {
    this.dashboardApi.getSystemHealth().subscribe({
      next: (res) => {
        this.health = res.data ?? null;
        this.buildItems();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  private buildItems(): void {
    if (!this.health) return;
    this.healthItems = [
      { label: 'App Version', value: this.health.app_version },
      { label: 'Laravel', value: this.health.laravel_version },
      { label: 'PHP', value: this.health.php_version },
      { label: 'MySQL', value: this.health.mysql_status, type: 'status' },
      { label: 'Redis', value: this.health.redis_status, type: 'status' },
      { label: 'Queue Jobs', value: this.health.queue_size.toString() },
      { label: 'Timezone', value: this.health.timezone },
      { label: 'Storage', value: this.formatBytes(this.health.storage_used) },
    ];
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
