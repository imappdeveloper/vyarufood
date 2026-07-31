import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FinanceApiService } from '../../../../core/services/finance-api.service';
import { JournalEntry } from '../../../../core/models/finance/finance.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-journal-entry-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out;">
      <div *ngIf="loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">Loading journal entry...</p>
      </div>

      <div *ngIf="!loading && journal">
        <div style="display: flex; align-items: center; gap: 8px; padding: 20px 24px 0; max-width: 1280px; margin: 0 auto;">
          <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <a routerLink="/admin/finance" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Finance &amp; Accounting</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <a routerLink="/admin/finance/journals" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Journal Entries</a>
          <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
          <span style="font-size: 12px; color: #374151; font-weight: 600;">{{ journal.journal_number }}</span>
        </div>

        <div style="background: linear-gradient(135deg, #059669, #047857, #166534); padding: 36px 24px 56px; position: relative; overflow: hidden; margin-top: 16px;">
          <div style="position: absolute; top: -40px; right: -40px; width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
          <div style="position: absolute; top: -80px; right: 60px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
          <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1;">
            <div>
              <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px 0;">Journal Entry {{ journal.journal_number }}</h1>
              <p style="font-size: 13px; color: rgba(255,255,255,0.75); margin: 0;">{{ journal.entry_type | titlecase }} &middot; {{ journal.journal_date | date:'dd MMMM yyyy' }}</p>
            </div>
            <div style="display: flex; gap: 10px;">
              <button *ngIf="journal.posting_status === 'draft'" (click)="postJournal()"
                style="display: inline-flex; align-items: center; gap: 6px; background: white; color: #047857; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s ease;"
                onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
                <span class="material-icons" style="font-size: 18px;">check_circle</span> Post
              </button>
              <button *ngIf="journal.posting_status === 'posted'" (click)="showReverseDialog = true"
                style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); color: white; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; border: 1px solid rgba(255,255,255,0.3); cursor: pointer; transition: all 0.2s ease;"
                onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
                <span class="material-icons" style="font-size: 18px;">undo</span> Reverse
              </button>
              <a routerLink="/admin/finance/journals"
                style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); color: white; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; transition: all 0.2s ease;"
                onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
                <span class="material-icons" style="font-size: 18px;">arrow_back</span> Back to List
              </a>
            </div>
          </div>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style="position: absolute; bottom: -1px; left: 0; width: 100%; height: 60px; display: block;">
            <path fill="#f3f4f6" d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,60 L0,60 Z"></path>
          </svg>
        </div>

        <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 60px; position: relative; z-index: 2;">
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: -28px; margin-bottom: 24px;">
            <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 20px; text-align: center;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Journal Number</p>
              <p style="font-size: 16px; font-weight: 800; color: #059669; margin: 0;">{{ journal.journal_number }}</p>
            </div>
            <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 20px; text-align: center;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Date</p>
              <p style="font-size: 16px; font-weight: 800; color: #1f2937; margin: 0;">{{ journal.journal_date | date:'dd MMM yyyy' }}</p>
            </div>
            <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 20px; text-align: center;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Total Debit</p>
              <p style="font-size: 16px; font-weight: 800; color: #1d4ed8; margin: 0;">{{ formatNumber(journal.total_debit) }}</p>
            </div>
            <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 20px; text-align: center;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Total Credit</p>
              <p style="font-size: 16px; font-weight: 800; color: #7c3aed; margin: 0;">{{ formatNumber(journal.total_credit) }}</p>
            </div>
            <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 20px; text-align: center;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Status</p>
              <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;"
                [style.background]="getStatusClass(journal.posting_status).bg"
                [style.color]="getStatusClass(journal.posting_status).color">
                {{ journal.posting_status | titlecase }}
              </span>
            </div>
          </div>

          <div *ngIf="journal.description" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 15px; font-weight: 700; color: #1f2937; margin: 0 0 12px 0;">Description</h2>
            <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin: 0;">{{ journal.description }}</p>
          </div>

          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 15px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">Journal Entry Lines</h2>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb; border-radius: 10px;">
                    <th style="padding: 10px 12px 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 200px;">Account</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 160px;">Description</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 130px;">Debit</th>
                    <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 130px;">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let line of journal.lines; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                    [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                    <td style="padding: 12px 12px 12px 16px;">
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ line.account_name || 'N/A' }}</p>
                      <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ line.account_code || '' }}</p>
                    </td>
                    <td style="padding: 12px 12px; font-size: 13px; color: #6b7280;">{{ line.description || '—' }}</td>
                    <td style="padding: 12px 12px; text-align: right; font-size: 13px; font-weight: 600; color: #1f2937;">
                      <span *ngIf="line.debit_amount > 0">{{ formatNumber(line.debit_amount) }}</span>
                      <span *ngIf="line.debit_amount <= 0" style="color: #9ca3af;">—</span>
                    </td>
                    <td style="padding: 12px 16px 12px 12px; text-align: right; font-size: 13px; font-weight: 600; color: #1f2937;">
                      <span *ngIf="line.credit_amount > 0">{{ formatNumber(line.credit_amount) }}</span>
                      <span *ngIf="line.credit_amount <= 0" style="color: #9ca3af;">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div *ngIf="showReverseDialog" style="background: white; border-radius: 14px; border: 1px solid #fecaca; padding: 24px; margin-bottom: 24px; animation: fadeIn 0.25s ease-out;">
            <h2 style="font-size: 15px; font-weight: 700; color: #991b1b; margin: 0 0 8px 0;">Reverse Journal Entry</h2>
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 16px 0;">Please provide a reason for reversing this journal entry.</p>
            <textarea [(ngModel)]="reverseReason" rows="3" placeholder="Enter reason for reversal..."
              style="width: 100%; max-width: 512px; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: inherit; resize: vertical; display: block;"
              [style.borderColor]="!reverseReason.trim() && reverseReason ? '#dc2626' : ''"
              onfocus="this.style.borderColor='#dc2626';this.style.boxShadow='0 0 0 3px rgba(220,38,38,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'"></textarea>
            <div style="display: flex; gap: 12px; margin-top: 16px;">
              <button (click)="reverseJournal()" [disabled]="!reverseReason.trim()"
                style="padding: 10px 24px; background: #dc2626; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(220,38,38,0.3); transition: all 0.2s ease;"
                [style.opacity]="!reverseReason.trim() ? '0.5' : '1'"
                [style.cursor]="!reverseReason.trim() ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.background='#b91c1c';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#dc2626';this.style.transform=''">
                Confirm Reverse
              </button>
              <button (click)="showReverseDialog = false; reverseReason = ''"
                style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
                onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</button>
            </div>
          </div>

          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px;">
            <h2 style="font-size: 15px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">Details</h2>
            <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="width: 200px; color: #6b7280; font-size: 13px; font-weight: 500; flex-shrink: 0;">Entry Type</span>
              <span style="flex: 1; color: #111827; font-size: 13px;">{{ journal.entry_type | titlecase }}</span>
            </div>
            <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="width: 200px; color: #6b7280; font-size: 13px; font-weight: 500; flex-shrink: 0;">Financial Year</span>
              <span style="flex: 1; color: #111827; font-size: 13px;">{{ journal.financial_year_name || 'N/A' }}</span>
            </div>
            <div *ngIf="journal.posted_by_name" style="display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="width: 200px; color: #6b7280; font-size: 13px; font-weight: 500; flex-shrink: 0;">Posted By</span>
              <span style="flex: 1; color: #111827; font-size: 13px;">{{ journal.posted_by_name }}</span>
            </div>
            <div *ngIf="journal.posted_at" style="display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="width: 200px; color: #6b7280; font-size: 13px; font-weight: 500; flex-shrink: 0;">Posted At</span>
              <span style="flex: 1; color: #111827; font-size: 13px;">{{ journal.posted_at | date:'dd MMM yyyy, HH:mm' }}</span>
            </div>
            <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="width: 200px; color: #6b7280; font-size: 13px; font-weight: 500; flex-shrink: 0;">Created By</span>
              <span style="flex: 1; color: #111827; font-size: 13px;">{{ journal.created_by_name || 'N/A' }}</span>
            </div>
            <div style="display: flex; padding: 12px 0;">
              <span style="width: 200px; color: #6b7280; font-size: 13px; font-weight: 500; flex-shrink: 0;">Created At</span>
              <span style="flex: 1; color: #111827; font-size: 13px;">{{ journal.created_at | date:'dd MMM yyyy, HH:mm' }}</span>
            </div>
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
export class JournalEntryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private financeApi = inject(FinanceApiService);
  private notification = inject(NotificationService);

  journal: JournalEntry | null = null;
  loading = true;
  showReverseDialog = false;
  reverseReason = '';

  lineColumns = ['account', 'description', 'debit', 'credit'];

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadJournal(uuid);
    }
  }

  loadJournal(uuid: string): void {
    this.loading = true;
    this.financeApi.getJournal(uuid).subscribe({
      next: (res) => {
        this.journal = res.data ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load journal entry');
      },
    });
  }

  postJournal(): void {
    if (!this.journal) return;
    this.financeApi.postJournal(this.journal.uuid).subscribe({
      next: () => {
        this.notification.success('Journal entry posted successfully');
        this.loadJournal(this.journal!.uuid);
      },
      error: () => {
        this.notification.error('Failed to post journal entry');
      },
    });
  }

  reverseJournal(): void {
    if (!this.journal || !this.reverseReason.trim()) return;
    this.financeApi.reverseJournal(this.journal.uuid, { reason: this.reverseReason.trim() }).subscribe({
      next: () => {
        this.notification.success('Journal entry reversed successfully');
        this.showReverseDialog = false;
        this.reverseReason = '';
        this.loadJournal(this.journal!.uuid);
      },
      error: () => {
        this.notification.error('Failed to reverse journal entry');
      },
    });
  }

  getStatusClass(status: string): { bg: string; color: string } {
    switch (status) {
      case 'posted': return { bg: '#d1fae5', color: '#047857' };
      case 'reversed': return { bg: '#fee2e2', color: '#b91c1c' };
      case 'draft': return { bg: '#f3f4f6', color: '#4b5563' };
      default: return { bg: '#f3f4f6', color: '#4b5563' };
    }
  }

  formatNumber(value: number): string {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
