import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="w-80 bg-white rounded-lg shadow-lg border">
      <div class="p-4 border-b font-semibold">Notifications</div>
      <div class="max-h-96 overflow-y-auto">
        <div class="p-4 border-b hover:bg-gray-50">
          <div class="text-sm font-medium">No notifications</div>
          <div class="text-xs text-gray-500 mt-1">You're all caught up!</div>
        </div>
      </div>
    </div>
  `,
})
export class NotificationPanelComponent {}
