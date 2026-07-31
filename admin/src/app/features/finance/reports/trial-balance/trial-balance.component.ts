import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FinanceApiService } from '../../../../core/services/finance-api.service';
import { TrialBalance, FinancialYear } from '../../../../core/models/finance/finance.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-trial-balance',
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
        <a routerLink="/admin/finance/reports" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Reports</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Trial Balance</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Trial Balance</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Verify that total debits equal total credits</p>
        </div>
        <button *ngIf="report" (click)="printReport()"
          style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; background: white; border: 1.5px solid #a7f3d0; color: #047857; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease;"
          onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 18px;">print</span> Print
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: end;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
              Financial Year <span style="color: #dc2626;">*</span>
            </label>
            <select [(ngModel)]="selectedYearId" (change)="onYearChange()"
              style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; appearance: none; -webkit-appearance: none; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option *ngFor="let year of financialYears" [ngValue]="year.id">{{ year.year_name }} {{ year.is_current ? '(Current)' : '' }}</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">As Of Date (Optional)</label>
            <input type="date" [ngModel]="asOfDate | date:'yyyy-MM-dd'" (ngModelChange)="onAsOfDateChange($event)"
              style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <button (click)="generateReport()" [disabled]="!selectedYearId || generating"
            style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            [style.opacity]="!selectedYearId || generating ? '0.5' : '1'"
            [style.cursor]="!selectedYearId || generating ? 'not-allowed' : 'pointer'"
            onmouseover="if(this.disabled===false){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span *ngIf="generating" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
            <span class="material-icons" style="font-size: 18px;">assessment</span> Generate
          </button>
        </div>
      </div>

      <div *ngIf="report" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">
          <h2 style="font-size: 18px; font-weight: 800; color: #166534; margin: 0 0 4px 0;">Trial Balance</h2>
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            Financial Year: {{ selectedYearName }}
            <span *ngIf="asOfDate"> | As of {{ asOfDate | date:'dd MMM yyyy' }}</span>
          </p>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 100px;">Code</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 200px;">Account Name</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">Type</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px;">Debit (₹)</th>
                <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px;">Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of report.accounts; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                <td style="padding: 12px 12px 12px 16px;"><span style="font-size: 12px; font-weight: 700; font-family: monospace; color: #059669;">{{ row.account_code }}</span></td>
                <td style="padding: 12px 12px; font-weight: 600; color: #1f2937;">{{ row.account_name }}</td>
                <td style="padding: 12px 12px;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize;"
                    [style.background]="getTypeClass(row.account_type).bg"
                    [style.color]="getTypeClass(row.account_type).color">
                    {{ row.account_type }}
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: right;">
                  <span *ngIf="row.debit > 0" style="font-weight: 700; color: #1f2937;">{{ formatNumber(row.debit) }}</span>
                  <span *ngIf="row.debit <= 0" style="color: #9ca3af;">-</span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: right;">
                  <span *ngIf="row.credit > 0" style="font-weight: 700; color: #1f2937;">{{ formatNumber(row.credit) }}</span>
                  <span *ngIf="row.credit <= 0" style="color: #9ca3af;">-</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="background: #f3f4f6; border-top: 2px solid #e5e7eb; font-weight: 800; color: #374151;">
                <td colspan="3" style="padding: 12px 16px;">Totals</td>
                <td style="padding: 12px 12px; text-align: right;">{{ formatNumber(report.total_debit) }}</td>
                <td style="padding: 12px 16px 12px 12px; text-align: right;">{{ formatNumber(report.total_credit) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div style="background: #eff6ff; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 12px; font-weight: 600; color: #1d4ed8; margin: 0 0 4px 0;">Total Debit</p>
              <p style="font-size: 20px; font-weight: 800; color: #1d4ed8; margin: 0;">{{ formatCurrency(report.total_debit) }}</p>
            </div>
            <div style="background: #eff6ff; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 12px; font-weight: 600; color: #1d4ed8; margin: 0 0 4px 0;">Total Credit</p>
              <p style="font-size: 20px; font-weight: 800; color: #1d4ed8; margin: 0;">{{ formatCurrency(report.total_credit) }}</p>
            </div>
            <div style="border-radius: 12px; padding: 16px; text-align: center;"
              [style.background]="report.is_balanced ? '#ecfdf5' : '#fef2f2'">
              <p style="font-size: 12px; font-weight: 600; margin: 0 0 4px 0;"
                [style.color]="report.is_balanced ? '#047857' : '#b91c1c'">Balanced</p>
              <p style="font-size: 20px; font-weight: 800; margin: 0;"
                [style.color]="report.is_balanced ? '#047857' : '#b91c1c'">
                {{ report.is_balanced ? 'Yes' : 'No' }}
              </p>
              <p *ngIf="!report.is_balanced" style="font-size: 11px; margin: 4px 0 0 0; color: #b91c1c;">
                Difference: {{ formatCurrency(report.total_debit - report.total_credit) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!report && !generating" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; text-align: center; padding: 64px 24px;">
        <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
          <span class="material-icons" style="font-size: 32px; color: #059669;">assessment</span>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">Select a financial year and click Generate to view the Trial Balance</p>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class TrialBalanceComponent implements OnInit {
  private financeApi = inject(FinanceApiService);
  private notification = inject(NotificationService);

  financialYears: FinancialYear[] = [];
  selectedYearId: number | null = null;
  asOfDate: Date | null = null;
  report: TrialBalance | null = null;
  generating = false;
  displayedColumns = ['account_code', 'account_name', 'account_type', 'debit', 'credit'];

  get selectedYearName(): string {
    return this.financialYears.find(y => y.id === this.selectedYearId)?.year_name || '';
  }

  ngOnInit(): void {
    this.loadFinancialYears();
  }

  loadFinancialYears(): void {
    this.financeApi.getFinancialYears().subscribe({
      next: (res) => {
        this.financialYears = res.data || [];
        const current = this.financialYears.find(y => y.is_current);
        if (current) {
          this.selectedYearId = current.id;
        }
      },
    });
  }

  onYearChange(): void {
    this.report = null;
  }

  onAsOfDateChange(value: string): void {
    this.asOfDate = value ? new Date(value) : null;
  }

  generateReport(): void {
    if (!this.selectedYearId) return;
    this.generating = true;
    const asOfDateStr = this.asOfDate ? this.asOfDate.toISOString().split('T')[0] : undefined;
    this.financeApi.getTrialBalance(this.selectedYearId, asOfDateStr).subscribe({
      next: (res) => {
        this.report = res.data!;
        this.generating = false;
      },
      error: () => {
        this.generating = false;
        this.notification.error('Failed to generate trial balance');
      },
    });
  }

  printReport(): void {
    window.print();
  }

  getTypeClass(type: string): { bg: string; color: string } {
    switch (type) {
      case 'asset': return { bg: '#dbeafe', color: '#1e40af' };
      case 'liability': return { bg: '#fee2e2', color: '#991b1b' };
      case 'equity': return { bg: '#ede9fe', color: '#6d28d9' };
      case 'income': return { bg: '#d1fae5', color: '#047857' };
      case 'expense': return { bg: '#ffedd5', color: '#9a3412' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  }

  formatCurrency(value: number): string {
    return '₹' + this.formatNumber(value);
  }

  formatNumber(value: number): string {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
