import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <mat-icon class="text-6xl text-gray-300 mb-4">{{ icon }}</mat-icon>
      <h3 class="text-lg font-medium text-gray-700 mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-500 max-w-sm">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'No Data';
  @Input() message = 'No data available at the moment.';
  @Input() icon = 'inbox';
}
