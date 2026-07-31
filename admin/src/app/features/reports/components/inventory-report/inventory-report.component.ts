import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartCardComponent } from '../../../../features/dashboard/components/chart-card/chart-card.component';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { GROUP_BY_OPTIONS } from '../../../../core/models/report/report.model';

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ChartCardComponent],
  template: `
    <div *ngIf="loading && !reportData" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading inventory report...</p>
      </div>
    </div>

    <div *ngIf="!loading || reportData" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/reports" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Reports</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Inventory Report</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Inventory Report</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Stock levels, value, and expiring items overview</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="exportReport()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">download</span> Export
          </button>
        </div>
      </div>

      <div *ngIf="reportData" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div *ngFor="let card of statCards" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
            [style.background]="card.bg">
            <span class="material-icons" style="font-size: 22px;" [style.color]="card.color">{{ card.icon }}</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">{{ card.label }}</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap;">
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0; display: block;">Group By</label>
            <select [(ngModel)]="groupBy"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option *ngFor="let opt of groupByOptions" [ngValue]="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0; display: block;">Date From</label>
            <input type="date" [(ngModel)]="selectedDateFrom"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0; display: block;">Date To</label>
            <input type="date" [(ngModel)]="selectedDateTo"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <button (click)="loadReport()"
            style="padding: 9px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">search</span> Search
          </button>
        </div>
      </div>

      <div *ngIf="loading && reportData" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
        <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
      </div>

      <div *ngIf="reportData" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
          <h3 style="font-size: 13px; font-weight: 700; color: #374151; margin: 0;">Inventory Data</h3>
        </div>
        <div *ngIf="reportData.data?.length" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item Name</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">SKU</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Current Stock</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Reorder Level</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Available Stock</th>
                <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Stock Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of reportData.data; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 12px 12px 16px; font-weight: 600; color: #374151;">{{ row.item_name ?? '—' }}</td>
                <td style="padding: 12px 12px; font-family: monospace; font-size: 12px; color: #9ca3af;">{{ row.sku ?? '—' }}</td>
                <td style="padding: 12px 12px; text-align: right; font-weight: 700; color: #374151;">{{ row.current_stock?.toLocaleString('en-IN') }}</td>
                <td style="padding: 12px 12px; text-align: right; color: #374151;">{{ row.reorder_level?.toLocaleString('en-IN') }}</td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; align-items: center; gap: 4px;"
                    [style.background]="row.available_stock > row.reorder_level ? '#d1fae5' : row.available_stock <= row.reorder_level && row.available_stock > 0 ? '#fef3c7' : '#fee2e2'"
                    [style.color]="row.available_stock > row.reorder_level ? '#047857' : row.available_stock <= row.reorder_level && row.available_stock > 0 ? '#b45309' : '#dc2626'">
                    {{ row.available_stock?.toLocaleString('en-IN') }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: right; font-weight: 700; color: #059669;">{{ formatCurrency(row.stock_value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="!reportData.data?.length" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">search_off</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No inventory data found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">No records found for the selected filters</p>
        </div>
      </div>

      <div *ngIf="!reportData" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
        <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span class="material-icons" style="font-size: 32px; color: #059669;">search_off</span>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No inventory data found</h3>
        <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">No records found for the selected filters</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
        <div *ngIf="reportData?.chart?.stock_value != null" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">paid</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Stock Value</p>
            <p style="font-size: 22px; font-weight: 800; color: #059669; margin: 0;">{{ formatCurrency(reportData.chart.stock_value) }}</p>
          </div>
        </div>

        <div *ngIf="reportData?.chart?.expiring_soon?.length" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="display: flex; align-items: center; gap: 8px; padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
            <span class="material-icons" style="font-size: 18px; color: #d97706;">schedule</span>
            <h3 style="font-size: 13px; font-weight: 700; color: #374151; margin: 0;">Expiring Soon</h3>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 12px 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Expiry Date</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of reportData.chart.expiring_soon; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                  <td [attr.data-idx]="i" style="padding: 12px 12px 12px 16px; font-weight: 600; color: #374151;">{{ row.item_name ?? '—' }}</td>
                  <td style="padding: 12px 12px; color: #9ca3af;">{{ row.expiry_date ?? '—' }}</td>
                  <td style="padding: 12px 16px 12px 12px; text-align: right; font-weight: 700; color: #374151;">{{ row.quantity?.toLocaleString('en-IN') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class InventoryReportComponent implements OnInit {
  private reportApi = inject(ReportApiService);

  loading = true;
  reportData: any = null;
  groupBy = 'day';
  selectedDateFrom = '';
  selectedDateTo = '';

  groupByOptions = GROUP_BY_OPTIONS;
  displayedColumns = ['item_name', 'sku', 'current_stock', 'reorder_level', 'available_stock', 'stock_value'];
  expiringColumns = ['item_name', 'expiry_date', 'quantity'];

  get statCards() {
    const s = this.reportData?.summary;
    return [
      { label: 'Total Items', value: (s?.total_items ?? 0).toLocaleString('en-IN'), icon: 'inventory_2', bg: '#dbeafe', color: '#2563eb' },
      { label: 'Low Stock Items', value: (s?.low_stock_count ?? 0).toLocaleString('en-IN'), icon: 'warning', bg: '#fef3c7', color: '#d97706' },
      { label: 'Out of Stock', value: (s?.out_of_stock_count ?? 0).toLocaleString('en-IN'), icon: 'remove_circle', bg: '#fee2e2', color: '#dc2626' },
      { label: 'Total Stock Value', value: this.formatCurrency(this.reportData?.chart?.stock_value), icon: 'paid', bg: '#d1fae5', color: '#059669' },
    ];
  }

  ngOnInit(): void {
    this.loadReport();
  }

  formatCurrency(value: number): string {
    if (value === undefined || value === null) return '₹0';
    return '₹' + value.toLocaleString('en-IN');
  }

  loadReport(): void {
    this.loading = true;
    this.reportApi.getReport('inventory', {
      group_by: this.groupBy,
      date_from: this.selectedDateFrom || null,
      date_to: this.selectedDateTo || null,
    }).subscribe({
      next: (res) => {
        this.reportData = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  exportReport(): void {
    const rows = this.reportData?.data;
    if (!rows || !rows.length) return;
    const cols = Object.keys(rows[0]);
    const csv = [cols.join(','), ...rows.map((r: any) => cols.map((c: any) => JSON.stringify(r[c] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'inventory-report.csv'; a.click();
    window.URL.revokeObjectURL(url);
  }
}
