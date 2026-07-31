import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PermissionApiService } from '../../core/services/permission-api.service';
import { PermissionGroup } from '../../core/models/auth/permission.model';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatChipsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Permissions" subtitle="View all system permissions"
      [breadcrumbs]="[{ label: 'Home', url: '/dashboard' }, { label: 'Permissions', url: '/permissions' }]" />

    <div class="bg-white rounded-lg border p-6">
      @for (group of permissionGroups; track group.group) {
        <mat-expansion-panel class="mb-2">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <span class="font-semibold">{{ group.group }}</span>
              <span class="ml-2 text-gray-400">({{ group.permissions.length }})</span>
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="flex flex-wrap gap-2">
            @for (perm of group.permissions; track perm.id) {
              <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">{{ perm.display_name || perm.name }}</span>
            }
          </div>
        </mat-expansion-panel>
      }
    </div>
  `,
})
export class PermissionsComponent implements OnInit {
  private permApi = inject(PermissionApiService);
  permissionGroups: PermissionGroup[] = [];

  ngOnInit(): void {
    this.permApi.getGrouped().subscribe({ next: (res) => { this.permissionGroups = res.data ?? []; } });
  }
}
