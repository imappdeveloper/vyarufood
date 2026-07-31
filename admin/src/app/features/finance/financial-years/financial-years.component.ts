import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FinanceApiService } from '../../../core/services/finance-api.service';
import { FinancialYear } from '../../../core/models/finance/finance.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-financial-years',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/finance" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Finance &amp; Accounting</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Financial Years</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Financial Years</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage fiscal year periods and closing</p>
        </div>
        <button (click)="toggleForm()"
          style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
          [style.background]="showForm ? '#dc2626' : '#059669'"
          [style.boxShadow]="showForm ? '0 4px 12px rgba(220,38,38,0.3)' : '0 4px 12px rgba(5,150,105,0.3)'"
          onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
          <span class="material-icons" style="font-size: 18px;">{{ showForm ? 'close' : 'add' }}</span>
          {{ showForm ? 'Cancel' : 'Create Financial Year' }}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">calendar_month</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Years</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ years.length }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #1d4ed8;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Current Year</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ currentYearName || 'None' }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #ffedd5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">lock</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Closed Years</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ closedCount }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="showForm" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 24px; animation: fadeIn 0.25s ease-out;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 18px; color: #059669;">calendar_month</span>
          </div>
          <h2 style="font-size: 16px; font-weight: 700; color: #1f2937; margin: 0;">Create Financial Year</h2>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
              Year Name <span style="color: #dc2626;">*</span>
            </label>
            <input type="text" [(ngModel)]="newYear.year_name" placeholder="e.g. FY 2025-26"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
              Start Date <span style="color: #dc2626;">*</span>
            </label>
            <input type="date" [ngModel]="newYear.start_date | date:'yyyy-MM-dd'" (ngModelChange)="onDateChange('start_date', $event)"
              style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
              End Date <span style="color: #dc2626;">*</span>
            </label>
            <input type="date" [ngModel]="newYear.end_date | date:'yyyy-MM-dd'" (ngModelChange)="onDateChange('end_date', $event)"
              style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button (click)="createYear()" [disabled]="creating"
            style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            [style.opacity]="creating ? '0.5' : '1'"
            onmouseover="if(this.disabled===false){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span *ngIf="creating" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
            Create Year
          </button>
          <button (click)="toggleForm()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</button>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px;">
          <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Loading financial years...</p>
        </div>

        <div *ngIf="!loading && years.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">calendar_month</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No financial years found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">Get started by creating your first financial year</p>
          <button (click)="toggleForm()"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Create Financial Year
          </button>
        </div>

        <div *ngIf="!loading && years.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 160px;">Year Name</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 130px;">Start Date</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 130px;">End Date</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 90px;">Current</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 90px;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of years; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='#f9fafb'">
                <td style="padding: 12px 12px 12px 16px;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">{{ row.year_name }}</span>
                  <span *ngIf="row.is_current" style="display: inline-flex; margin-left: 8px; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; background: #d1fae5; color: #047857;">Current</span>
                </td>
                <td style="padding: 12px 12px; font-size: 13px; color: #6b7280;">{{ row.start_date | date:'dd MMM yyyy' }}</td>
                <td style="padding: 12px 12px; font-size: 13px; color: #6b7280;">{{ row.end_date | date:'dd MMM yyyy' }}</td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span *ngIf="row.is_current" class="material-icons" style="font-size: 20px; color: #059669; vertical-align: middle;">check_circle</span>
                  <span *ngIf="!row.is_current" class="material-icons" style="font-size: 20px; color: #d1d5db; vertical-align: middle;">cancel</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="row.is_closed ? '#ffedd5' : '#d1fae5'"
                    [style.color]="row.is_closed ? '#b45309' : '#047857'">
                    {{ row.is_closed ? 'Closed' : 'Open' }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: right;">
                  <button *ngIf="!row.is_closed && !row.is_current" (click)="closeYear(row)"
                    style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border: 1.5px solid #fcd34d; background: #fffbeb; color: #d97706; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s ease;"
                    onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#fffbeb'">
                    <span class="material-icons" style="font-size: 14px;">lock</span> Close Year
                  </button>
                  <span *ngIf="row.is_closed" style="font-size: 11px; color: #9ca3af;">
                    <span *ngIf="row.closed_at">Closed {{ row.closed_at | date:'dd MMM yyyy' }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class FinancialYearsComponent implements OnInit {
  private financeApi = inject(FinanceApiService);
  private notification = inject(NotificationService);

  years: FinancialYear[] = [];
  loading = false;
  creating = false;
  showForm = false;
  displayedColumns = ['year_name', 'start_date', 'end_date', 'is_current', 'is_closed', 'actions'];

  newYear = {
    year_name: '',
    start_date: null as Date | null,
    end_date: null as Date | null,
  };

  get currentYearName(): string {
    return this.years.find(y => y.is_current)?.year_name || '';
  }

  get closedCount(): number {
    return this.years.filter(y => y.is_closed).length;
  }

  ngOnInit(): void {
    this.loadYears();
  }

  loadYears(): void {
    this.loading = true;
    this.financeApi.getFinancialYears().subscribe({
      next: (res) => {
        this.years = res.data || [];
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.newYear = { year_name: '', start_date: null, end_date: null };
    }
  }

  onDateChange(field: 'start_date' | 'end_date', value: string): void {
    this.newYear[field] = value ? new Date(value) : null;
  }

  createYear(): void {
    if (!this.newYear.year_name || !this.newYear.start_date || !this.newYear.end_date) {
      this.notification.error('Please fill in all required fields');
      return;
    }
    this.creating = true;
    const payload = {
      year_name: this.newYear.year_name,
      start_date: this.newYear.start_date.toISOString().split('T')[0],
      end_date: this.newYear.end_date.toISOString().split('T')[0],
    };
    this.financeApi.createFinancialYear(payload).subscribe({
      next: () => {
        this.notification.success('Financial year created successfully');
        this.creating = false;
        this.showForm = false;
        this.newYear = { year_name: '', start_date: null, end_date: null };
        this.loadYears();
      },
      error: () => {
        this.creating = false;
        this.notification.error('Failed to create financial year');
      },
    });
  }

  closeYear(year: FinancialYear): void {
    if (!confirm(`Are you sure you want to close ${year.year_name}? This action cannot be undone.`)) {
      return;
    }
    this.financeApi.closeFinancialYear(year.uuid, { closing_remarks: 'Year closed by admin' }).subscribe({
      next: () => {
        this.notification.success(`${year.year_name} has been closed successfully`);
        this.loadYears();
      },
      error: () => {
        this.notification.error('Failed to close financial year');
      },
    });
  }
}
