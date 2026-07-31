import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { RoleApiService } from '../../core/services/role-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Role } from '../../core/models/auth/role.model';
import { TableColumn } from '../../core/interfaces/table.interface';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatDialogModule, PageHeaderComponent, DataTableComponent, StatusBadgeComponent],
  template: `
    <app-page-header title="Roles" subtitle="Manage system roles"
      [breadcrumbs]="[{ label: 'Home', url: '/dashboard' }, { label: 'Roles', url: '/roles' }]">
      <button mat-flat-button color="primary" routerLink="/roles/create">
        <mat-icon class="mr-1">add</mat-icon> Create Role
      </button>
    </app-page-header>

    <app-data-table [data]="roles" [columns]="columns" [actions]="actions" [meta]="meta" title="All Roles"
      (pageChange)="onPageChange($event)" (sortChange)="onSortChange($event)">
    </app-data-table>
  `,
})
export class RolesComponent implements OnInit {
  private roleApi = inject(RoleApiService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  roles: Role[] = [];
  meta: any;
  currentPage = 1;
  perPage = 15;
  sort = 'sort_order';
  order = 'asc';

  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'display_name', label: 'Display Name' },
    { key: 'description', label: 'Description' },
    { key: 'admins_count', label: 'Admins', align: 'center' },
    { key: 'is_default', label: 'Default', type: 'status', align: 'center' },
  ];

  actions = [
    { label: 'Edit', icon: 'edit', color: '#6366F1', callback: (row: Role) => this.editRole(row) },
    { label: 'Clone', icon: 'content_copy', color: '#F59E0B', callback: (row: Role) => this.cloneRole(row) },
    { label: 'Delete', icon: 'delete', color: '#EF4444', condition: (row: Role) => !row.is_default, callback: (row: Role) => this.deleteRole(row) },
  ];

  ngOnInit(): void { this.loadRoles(); }

  loadRoles(): void {
    this.roleApi.getPaginated({ page: this.currentPage, per_page: this.perPage, sort: this.sort, order: this.order as any }).subscribe({
      next: (res) => { this.roles = res.data; this.meta = res.meta; },
    });
  }

  onPageChange(event: PageEvent): void { this.currentPage = event.pageIndex + 1; this.perPage = event.pageSize; this.loadRoles(); }
  onSortChange(event: Sort): void { this.sort = event.active; this.order = event.direction || 'asc'; this.loadRoles(); }
  editRole(row: Role): void { this.router.navigate(['/admin/roles', row.id, 'edit']); }
  cloneRole(row: Role): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: { title: 'Clone Role', message: `Clone "${row.name}"? Enter new name in the next step.`, confirmText: 'Clone' } });
    dialogRef.afterClosed().subscribe((confirmed) => { if (confirmed) { /* clone logic */ } });
  }
  deleteRole(row: Role): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: { title: 'Delete Role', message: `Delete role "${row.name}"?`, confirmText: 'Delete', type: 'danger' } });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.roleApi.delete(row.id).subscribe({ next: () => { this.notification.success('Role deleted'); this.loadRoles(); }, error: (err) => this.notification.error(err.error?.message) });
      }
    });
  }
}
