import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Settings" subtitle="Manage your application settings"
                     [breadcrumbs]="[{ label: 'Home', url: '/dashboard' }, { label: 'Settings', url: '/settings' }]" />
    <div class="bg-white rounded-lg border p-6">
      <p class="text-gray-500 text-center py-8">Settings module coming soon.</p>
    </div>
  `,
})
export class SettingsComponent {}
