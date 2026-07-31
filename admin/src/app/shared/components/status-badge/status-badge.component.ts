import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" [ngClass]="getStatusClasses()">
      <span class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="getDotClasses()"></span>
      {{ label || status }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() label = '';

  getStatusClasses(): string {
    const classes: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    return classes[this.status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  getDotClasses(): string {
    const classes: Record<string, string> = {
      active: 'bg-green-500',
      inactive: 'bg-red-500',
      pending: 'bg-yellow-500',
      suspended: 'bg-blue-500',
      draft: 'bg-gray-500',
    };
    return classes[this.status?.toLowerCase()] || 'bg-gray-500';
  }
}
