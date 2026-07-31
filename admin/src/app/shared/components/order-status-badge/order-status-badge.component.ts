import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" [class]="badgeClass">
      <span class="w-1.5 h-1.5 rounded-full" [class]="dotClass"></span>
      {{ label }}
    </span>
  `,
})
export class OrderStatusBadgeComponent {
  @Input() status = '';

  get label(): string {
    return this.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get badgeClass(): string {
    const map: Record<string, string> = {
      'new': 'bg-blue-50 text-blue-700',
      'confirmed': 'bg-indigo-50 text-indigo-700',
      'preparing': 'bg-yellow-50 text-yellow-700',
      'ready': 'bg-purple-50 text-purple-700',
      'out_for_delivery': 'bg-orange-50 text-orange-700',
      'delivered': 'bg-green-50 text-green-700',
      'cancelled': 'bg-red-50 text-red-700',
      'refunded': 'bg-gray-100 text-gray-600',
      'active': 'bg-green-50 text-green-700',
      'paused': 'bg-yellow-50 text-yellow-700',
      'expired': 'bg-gray-100 text-gray-600',
      'completed': 'bg-green-50 text-green-700',
      'pending': 'bg-yellow-50 text-yellow-700',
      'paid': 'bg-green-50 text-green-700',
      'failed': 'bg-red-50 text-red-700',
    };
    return map[this.status] || 'bg-gray-100 text-gray-600';
  }

  get dotClass(): string {
    const map: Record<string, string> = {
      'new': 'bg-blue-500',
      'confirmed': 'bg-indigo-500',
      'preparing': 'bg-yellow-500',
      'ready': 'bg-purple-500',
      'out_for_delivery': 'bg-orange-500',
      'delivered': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'active': 'bg-green-500',
      'paused': 'bg-yellow-500',
      'completed': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'paid': 'bg-green-500',
      'failed': 'bg-red-500',
    };
    return map[this.status] || 'bg-gray-400';
  }
}
