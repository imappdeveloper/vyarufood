import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Users" subtitle="Manage system users"
                     [breadcrumbs]="[{ label: 'Home', url: '/dashboard' }, { label: 'Users', url: '/users' }]" />
    <div class="bg-white rounded-lg border p-6">
      <p class="text-gray-500 text-center py-8">Users module coming soon.</p>
    </div>
  `,
})
export class UsersComponent {}
