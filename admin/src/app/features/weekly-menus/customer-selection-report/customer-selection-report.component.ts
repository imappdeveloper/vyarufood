import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WeeklyMenuApiService } from '../../../core/services/weekly-menu-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomerMealSelection, SelectionSummary, WeeklyMenu } from '../../../core/models/weekly-menu/weekly-menu.model';

@Component({
  selector: 'app-customer-selection-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="loading && selections.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading selections...</p>
      </div>
    </div>

    <div *ngIf="!loading || selections.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/weekly-menus" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Weekly Menus</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Customer Selections</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Customer Selections Report</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">View and analyze customer meal selections</p>
        </div>
        <button
          style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
          onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
          <span class="material-icons" style="font-size: 18px; color: #6b7280;">download</span> Export
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <select [(ngModel)]="selectedMenuId" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 200px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'">
            <option [ngValue]="null">All Menus</option>
            <option *ngFor="let menu of menus" [ngValue]="menu.id">{{ menu.title }}</option>
          </select>
          <input type="date" [(ngModel)]="selectedDate" (change)="onFilterChange()"
            style="padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; transition: all 0.2s ease; min-width: 150px;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.background='#f9fafb'" />
          <select [(ngModel)]="selectedKitchenId" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 160px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'">
            <option [ngValue]="null">All Kitchens</option>
            <option *ngFor="let k of kitchens" [ngValue]="k.id">{{ k.name }}</option>
          </select>
        </div>
      </div>

      <div *ngIf="summary">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">fact_check</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Selections</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ summary.total_selections }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Selected</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ summary.selected_count }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #1d4ed8;">autorenew</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Default</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ summary.default_count }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">skip_next</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Skipped</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ summary.skipped_count }}</p>
            </div>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && selections.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && selections.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">fact_check</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No selections found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">
            <span *ngIf="selectedMenuId || selectedDate || selectedKitchenId">Try adjusting your filter criteria</span>
            <span *ngIf="!selectedMenuId && !selectedDate && !selectedKitchenId">Customer selections will appear here once customers start selecting meals</span>
          </p>
        </div>

        <div *ngIf="!loading && selections.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Customer</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Category</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meal</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="md-cell">Selected At</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of visibleSelections; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px;">{{ row.menu_date | date:'EEE, MMM d, yyyy' }}</td>
                <td style="padding: 12px;">
                  <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 13px;">{{ row.customer_name || 'N/A' }}</p>
                  <p *ngIf="row.customer_email" style="font-size: 11px; color: #9ca3af; margin: 1px 0 0 0;">{{ row.customer_email }}</p>
                </td>
                <td style="padding: 12px;">
                  <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #d1fae5; color: #047857;">{{ row.meal_category_name || '-' }}</span>
                </td>
                <td style="padding: 12px; font-weight: 600; color: #1f2937;">{{ row.meal_name || '-' }}</td>
                <td style="padding: 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="row.selection_status === 'selected' ? '#d1fae5' : row.selection_status === 'default' ? '#dbeafe' : row.selection_status === 'skipped' ? '#fef3c7' : '#f3f4f6'"
                    [style.color]="row.selection_status === 'selected' ? '#047857' : row.selection_status === 'default' ? '#1d4ed8' : row.selection_status === 'skipped' ? '#b45309' : '#6b7280'">
                    {{ row.selection_status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; display: none;" [style.display]="'table-cell'" class="md-cell">
                  <span style="font-size: 12px; color: #9ca3af;">{{ row.selected_at ? (row.selected_at | date:'MMM d, h:mm a') : '-' }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 12px; color: #9ca3af;">Showing {{ getRangeLabel() }}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button (click)="goToPage(1)" [disabled]="currentPage <= 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">first_page</span>
              </button>
              <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_left</span>
              </button>
              <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage }} of {{ totalPages }}</span>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <button (click)="goToPage(totalPages)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">last_page</span>
              </button>
              <select (change)="onPerPageChange($event)" [style]="'padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;'"
                onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @media (min-width: 768px) { .md-cell { display: table-cell !important; } }
    </style>
  `,
})
export class CustomerSelectionReportComponent implements OnInit {
  private weeklyMenuApi = inject(WeeklyMenuApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);

  menus: WeeklyMenu[] = [];
  kitchens: any[] = [];
  selections: CustomerMealSelection[] = [];
  summary: SelectionSummary | null = null;

  loading = false;
  currentPage = 1;
  perPage = 10;
  totalCount = 0;
  totalPages = 1;
  selectedMenuId: number | null = null;
  selectedDate = '';
  selectedKitchenId: number | null = null;

  Math = Math;

  get visibleSelections(): CustomerMealSelection[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.selections.slice(start, start + this.perPage);
  }

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadSelections();
  }

  loadDropdowns(): void {
    this.weeklyMenuApi.getWeeklyMenus().subscribe({
      next: (res) => { this.menus = res.data || []; },
      error: () => {},
    });
    this.kitchenApi.getAll().subscribe({
      next: (res) => { this.kitchens = res.data || []; },
      error: () => {},
    });
  }

  loadSelections(): void {
    this.loading = true;
    const params: Record<string, string> = {};
    if (this.selectedMenuId) params['weekly_menu_id'] = this.selectedMenuId.toString();
    if (this.selectedDate) params['menu_date'] = this.selectedDate;

    this.weeklyMenuApi.getCustomerSelections(params).subscribe({
      next: (res) => {
        this.selections = res.data || [];
        this.totalCount = this.selections.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.perPage));
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load selections'); },
    });

    const summaryParams: Record<string, string> = {};
    if (this.selectedMenuId) summaryParams['menu_id'] = this.selectedMenuId.toString();

    this.weeklyMenuApi.getSelectionSummary(summaryParams).subscribe({
      next: (res) => { this.summary = res.data ?? null; },
      error: () => {},
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadSelections();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onPerPageChange(event: any): void {
    this.perPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  getSelectionStatusClass(status: string): string {
    switch (status) {
      case 'selected': return 'bg-emerald-100 text-emerald-700';
      case 'default': return 'bg-blue-100 text-blue-700';
      case 'skipped': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
