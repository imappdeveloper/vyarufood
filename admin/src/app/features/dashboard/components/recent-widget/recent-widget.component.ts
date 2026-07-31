import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recent-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="card-modern overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
        @if (viewAllRoute && items.length > 0) {
          <a [routerLink]="viewAllRoute" class="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">View all</a>
        }
      </div>
      @if (loading) {
        <div class="p-5 space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="flex items-center gap-3 animate-pulse">
              <div class="w-8 h-8 rounded-full bg-gray-200"></div>
              <div class="flex-1 space-y-1.5">
                <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                <div class="h-2.5 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          }
        </div>
      } @else if (items.length === 0) {
        <div class="flex flex-col items-center justify-center py-10 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style="background: #F8FAFC;">
            <mat-icon class="text-gray-300" style="font-size:24px;width:24px;height:24px;">{{ emptyIcon }}</mat-icon>
          </div>
          <p class="text-sm text-gray-400">{{ emptyMessage }}</p>
        </div>
      } @else {
        <div class="divide-y divide-gray-50">
          @for (item of items | slice:0:5; track $index; let i = $index) {
            <div class="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                   [style.background]="getAvatarColor(i)">
                {{ getInitials(item) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-700 truncate">{{ getPrimaryText(item) }}</p>
                <p class="text-xs text-gray-400 truncate">{{ getSecondaryText(item) }}</p>
              </div>
              <div class="text-right shrink-0">
                @if (getBadgeText(item)) {
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        [class]="getBadgeClass(item)">
                    {{ getBadgeText(item) }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class RecentWidgetComponent {
  @Input() title = '';
  @Input() items: any[] = [];
  @Input() emptyMessage = 'No data available';
  @Input() emptyIcon = 'inbox';
  @Input() viewAllRoute = '';
  @Input() loading = false;

  private colors = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

  getAvatarColor(i: number): string { return this.colors[i % this.colors.length]; }

  getInitials(item: any): string {
    const name = item.name || item.full_name || item.first_name || item.email || 'U';
    return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getPrimaryText(item: any): string {
    return item.full_name || item.name || item.title || item.email || item.order_number || `#${item.id || ''}`;
  }

  getSecondaryText(item: any): string {
    return item.email || item.description || item.status || item.created_at?.split('T')[0] || '';
  }

  getBadgeText(item: any): string {
    return item.status || '';
  }

  getBadgeClass(item: any): string {
    const s = (item.status || '').toLowerCase();
    const map: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-700', delivered: 'bg-emerald-50 text-emerald-700',
      pending: 'bg-amber-50 text-amber-700', preparing: 'bg-blue-50 text-blue-700',
      cancelled: 'bg-red-50 text-red-700', inactive: 'bg-red-50 text-red-700',
      expired: 'bg-gray-100 text-gray-600', ready: 'bg-indigo-50 text-indigo-700',
    };
    return map[s] || 'bg-gray-100 text-gray-600';
  }
}
