import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { LoginHistoryApiService } from '../../core/services/login-history-api.service';
import { LoginHistory } from '../../core/models/auth/login-history.model';
import { TableColumn } from '../../core/interfaces/table.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, PageHeaderComponent, DataTableComponent],
  template: `
    <app-page-header title="Login History" subtitle="Track all login activities"
      [breadcrumbs]="[{ label: 'Home', url: '/dashboard' }, { label: 'Login History', url: '/login-history' }]" />
    <app-data-table [data]="history" [columns]="columns" [meta]="meta" title="Login Records"
      (pageChange)="onPageChange($event)">
    </app-data-table>
  `,
})
export class LoginHistoryComponent implements OnInit {
  private historyApi = inject(LoginHistoryApiService);
  history: LoginHistory[] = [];
  meta: any;
  currentPage = 1;

  columns: TableColumn[] = [
    { key: 'admin_name', label: 'Admin' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'device', label: 'Device' },
    { key: 'browser', label: 'Browser' },
    { key: 'is_successful', label: 'Status', type: 'status' },
    { key: 'login_at', label: 'Login Time', type: 'date' },
  ];

  ngOnInit(): void { this.loadHistory(); }

  loadHistory(): void {
    this.historyApi.getPaginated({ page: this.currentPage, per_page: 15, sort: 'created_at', order: 'desc' }).subscribe({
      next: (res) => {
        this.history = res.data.map((h: any) => ({ ...h, admin_name: h.admin?.full_name || 'Unknown' }));
        this.meta = res.meta;
      },
    });
  }

  onPageChange(event: PageEvent): void { this.currentPage = event.pageIndex + 1; this.loadHistory(); }
}
