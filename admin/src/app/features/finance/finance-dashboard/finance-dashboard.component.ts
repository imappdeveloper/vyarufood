import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FinanceApiService } from '../../../core/services/finance-api.service';
import { FinanceDashboardStats } from '../../../core/models/finance/finance.model';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading && !stats" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading finance dashboard...</p>
      </div>
    </div>

    <div *ngIf="!loading || stats" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Finance Dashboard</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Finance Dashboard</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Overview of financial entries, journals, and quick actions</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">description</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Journals This Month</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total_journals_this_month || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Posted Journals</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.posted_count || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">edit_note</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Draft Journals</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.draft_count || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #ede9fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #7c3aed;">pending_actions</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Pending Journals</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.pending_count || 0 }}</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 16px 0;">Quick Actions</h2>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
          <button (click)="navigateTo('/finance/accounts')"
            style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.1)';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">account_tree</span>
            </div>
            <span style="font-size: 13px; font-weight: 600; color: #374151;">Chart of Accounts</span>
          </button>
          <button (click)="navigateTo('/finance/journals')"
            style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.1)';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">receipt_long</span>
            </div>
            <span style="font-size: 13px; font-weight: 600; color: #374151;">Journal Entries</span>
          </button>
          <button (click)="navigateTo('/finance/reports/trial-balance')"
            style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.1)';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">balance</span>
            </div>
            <span style="font-size: 13px; font-weight: 600; color: #374151;">Trial Balance</span>
          </button>
          <button (click)="navigateTo('/finance/reports/profit-loss')"
            style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.1)';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">trending_up</span>
            </div>
            <span style="font-size: 13px; font-weight: 600; color: #374151;">Profit &amp; Loss</span>
          </button>
          <button (click)="navigateTo('/finance/reports/balance-sheet')"
            style="background: white; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.1)';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">account_balance</span>
            </div>
            <span style="font-size: 13px; font-weight: 600; color: #374151;">Balance Sheet</span>
          </button>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class FinanceDashboardComponent implements OnInit {
  private financeApi = inject(FinanceApiService);
  private router = inject(Router);

  stats: FinanceDashboardStats | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.financeApi.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res.data!;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  navigateTo(path: string): void {
    this.router.navigate(['/admin' + path]);
  }
}
