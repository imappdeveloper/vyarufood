import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FinanceApiService } from '../../../../core/services/finance-api.service';
import { ProfitAndLoss, FinancialYear } from '../../../../core/models/finance/finance.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-profit-loss',
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
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Profit &amp; Loss</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Profit &amp; Loss Statement</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Income, expenses, and net profit analysis</p>
        </div>
        <button *ngIf="report" (click)="printReport()"
          style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; background: white; border: 1.5px solid #a7f3d0; color: #047857; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease;"
          onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 18px;">print</span> Print
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 16px; align-items: end;">
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
            <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">From Date</label>
            <input type="date" [ngModel]="fromDate | date:'yyyy-MM-dd'" (ngModelChange)="onFromDateChange($event)"
              style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">To Date</label>
            <input type="date" [ngModel]="toDate | date:'yyyy-MM-dd'" (ngModelChange)="onToDateChange($event)"
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

      <div *ngIf="report">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 24px;">
          <div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">
            <h2 style="font-size: 18px; font-weight: 800; color: #166534; margin: 0 0 4px 0;">Profit &amp; Loss Statement</h2>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              Financial Year: {{ selectedYearName }}
              <span *ngIf="fromDate && toDate"> | {{ fromDate | date:'dd MMM yyyy' }} - {{ toDate | date:'dd MMM yyyy' }}</span>
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px;">
            <div>
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="font-size: 20px; color: #047857;">trending_up</span>
                </div>
                <div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #047857; margin: 0;">Income</h3>
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">Total: {{ formatCurrency(report.total_income) }}</p>
                </div>
              </div>
              <p *ngIf="report.income.length === 0" style="font-size: 13px; color: #9ca3af; text-align: center; padding: 16px 0; margin: 0;">No income entries</p>
              <div *ngIf="report.income.length > 0" style="border: 1px solid #a7f3d0; border-radius: 12px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background: #ecfdf5;">
                      <th style="text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; padding: 8px 16px;">Code</th>
                      <th style="text-align: left; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; padding: 8px 16px;">Account</th>
                      <th style="text-align: right; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; padding: 8px 16px;">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of report.income; let i = index" style="border-top: 1px solid #d1fae5;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#f0fdf4'">
                      <td style="padding: 10px 16px;"><span style="font-size: 12px; font-weight: 700; font-family: monospace; color: #047857;">{{ item.account_code }}</span></td>
                      <td style="padding: 10px 16px; color: #1f2937;">{{ item.account_name }}</td>
                      <td style="padding: 10px 16px; text-align: right; font-weight: 700; color: #047857;">{{ formatNumber(item.amount) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style="background: #d1fae5; border-top: 2px solid #6ee7b7;">
                      <td colspan="2" style="padding: 12px 16px; font-size: 13px; font-weight: 800; color: #047857;">Total Income</td>
                      <td style="padding: 12px 16px; text-align: right; font-size: 13px; font-weight: 800; color: #047857;">{{ formatNumber(report.total_income) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div>
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: #fee2e2; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="font-size: 20px; color: #b91c1c;">trending_down</span>
                </div>
                <div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #b91c1c; margin: 0;">Expenses</h3>
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">Total: {{ formatCurrency(report.total_expenses) }}</p>
                </div>
              </div>
              <p *ngIf="report.expenses.length === 0" style="font-size: 13px; color: #9ca3af; text-align: center; padding: 16px 0; margin: 0;">No expense entries</p>
              <div *ngIf="report.expenses.length > 0" style="border: 1px solid #fecaca; border-radius: 12px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background: #fef2f2;">
                      <th style="text-align: left; font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase; padding: 8px 16px;">Code</th>
                      <th style="text-align: left; font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase; padding: 8px 16px;">Account</th>
                      <th style="text-align: right; font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase; padding: 8px 16px;">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of report.expenses; let i = index" style="border-top: 1px solid #fecaca;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#fef2f2'">
                      <td style="padding: 10px 16px;"><span style="font-size: 12px; font-weight: 700; font-family: monospace; color: #b91c1c;">{{ item.account_code }}</span></td>
                      <td style="padding: 10px 16px; color: #1f2937;">{{ item.account_name }}</td>
                      <td style="padding: 10px 16px; text-align: right; font-weight: 700; color: #b91c1c;">{{ formatNumber(item.amount) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style="background: #fee2e2; border-top: 2px solid #fca5a5;">
                      <td colspan="2" style="padding: 12px 16px; font-size: 13px; font-weight: 800; color: #b91c1c;">Total Expenses</td>
                      <td style="padding: 12px 16px; text-align: right; font-size: 13px; font-weight: 800; color: #b91c1c;">{{ formatNumber(report.total_expenses) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px;">
          <h3 style="font-size: 15px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">Summary</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div style="background: #ecfdf5; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 12px; font-weight: 600; color: #047857; margin: 0 0 4px 0;">Total Income</p>
              <p style="font-size: 20px; font-weight: 800; color: #047857; margin: 0;">{{ formatCurrency(report.total_income) }}</p>
            </div>
            <div style="background: #fef2f2; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 12px; font-weight: 600; color: #b91c1c; margin: 0 0 4px 0;">Total Expenses</p>
              <p style="font-size: 20px; font-weight: 800; color: #b91c1c; margin: 0;">{{ formatCurrency(report.total_expenses) }}</p>
            </div>
            <div style="border-radius: 12px; padding: 16px; text-align: center;"
              [style.background]="report.net_profit >= 0 ? '#ecfdf5' : '#ffedd5'">
              <p style="font-size: 12px; font-weight: 600; margin: 0 0 4px 0;"
                [style.color]="report.net_profit >= 0 ? '#047857' : '#c2410c'">
                Net {{ report.net_profit >= 0 ? 'Profit' : 'Loss' }}
              </p>
              <p style="font-size: 20px; font-weight: 800; margin: 0;"
                [style.color]="report.net_profit >= 0 ? '#047857' : '#c2410c'">
                {{ formatCurrency(report.net_profit) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!report && !generating" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; text-align: center; padding: 64px 24px;">
        <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
          <span class="material-icons" style="font-size: 32px; color: #059669;">assessment</span>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">Select a financial year and click Generate to view the Profit &amp; Loss statement</p>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class ProfitLossComponent implements OnInit {
  private financeApi = inject(FinanceApiService);
  private notification = inject(NotificationService);

  financialYears: FinancialYear[] = [];
  selectedYearId: number | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  report: ProfitAndLoss | null = null;
  generating = false;

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

  onFromDateChange(value: string): void {
    this.fromDate = value ? new Date(value) : null;
  }

  onToDateChange(value: string): void {
    this.toDate = value ? new Date(value) : null;
  }

  generateReport(): void {
    if (!this.selectedYearId) return;
    this.generating = true;
    const fromDateStr = this.fromDate ? this.fromDate.toISOString().split('T')[0] : undefined;
    const toDateStr = this.toDate ? this.toDate.toISOString().split('T')[0] : undefined;
    this.financeApi.getProfitAndLoss(this.selectedYearId, fromDateStr, toDateStr).subscribe({
      next: (res) => {
        this.report = res.data!;
        this.generating = false;
      },
      error: () => {
        this.generating = false;
        this.notification.error('Failed to generate profit & loss statement');
      },
    });
  }

  printReport(): void {
    window.print();
  }

  formatCurrency(value: number): string {
    return '₹' + this.formatNumber(value);
  }

  formatNumber(value: number): string {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
