import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FinanceApiService } from '../../../core/services/finance-api.service';
import { JournalEntry, POSTING_STATUSES } from '../../../core/models/finance/finance.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-journal-entries',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/finance" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Finance &amp; Accounting</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Journal Entries</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Journal Entries</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage and track all journal entries</p>
        </div>
        <button (click)="createJournal()"
          style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
          onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
          <span class="material-icons" style="font-size: 18px;">add</span> Create Journal Entry
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">receipt_long</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Journals</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats.total }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Posted</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats.posted }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #ffedd5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">edit_note</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Draft</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats.draft }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #1d4ed8;">arrow_downward</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Debit</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ formatNumber(stats.totalDebit) }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #ede9fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #7c3aed;">arrow_upward</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Credit</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ formatNumber(stats.totalCredit) }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px;">
          <div style="position: relative;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadJournals()" placeholder="Search journals..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="searchTerm" (click)="searchTerm = ''; loadJournals()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="filterStatus" (change)="loadJournals()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; width: 100%; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="''">All Statuses</option>
            <option *ngFor="let s of postingStatuses" [ngValue]="s.value">{{ s.label }}</option>
          </select>
          <input type="date" [ngModel]="dateFrom | date:'yyyy-MM-dd'" (ngModelChange)="onDateFromChange($event)"
            placeholder="Date From"
            style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          <input type="date" [ngModel]="dateTo | date:'yyyy-MM-dd'" (ngModelChange)="onDateToChange($event)"
            placeholder="Date To"
            style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && journals.length === 0" style="display: flex; align-items: center; justify-content: center; padding: 80px 24px;">
          <div style="text-align: center;">
            <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">Loading journal entries...</p>
          </div>
        </div>

        <div *ngIf="!loading && journals.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No journal entries found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="searchTerm || filterStatus || dateFrom || dateTo">Try adjusting your filters</span>
            <span *ngIf="!searchTerm && !filterStatus && !dateFrom && !dateTo">Get started by creating your first journal entry</span>
          </p>
          <a *ngIf="!searchTerm && !filterStatus && !dateFrom && !dateTo" routerLink="/admin/finance/journals/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Create Journal Entry
          </a>
        </div>

        <div *ngIf="journals.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px;">Journal #</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px;">Date</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 220px;">Description</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px;">Debit</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px;">Credit</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of journals; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='#f9fafb'">
                <td style="padding: 12px 12px 12px 16px;">
                  <a routerLink="/admin/finance/journals/{{ row.uuid }}" style="font-size: 13px; font-weight: 700; color: #059669; text-decoration: none; transition: color 0.15s ease;"
                    onmouseover="this.style.color='#047857';this.style.textDecoration='underline'" onmouseout="this.style.color='#059669';this.style.textDecoration='none'">
                    {{ row.journal_number }}
                  </a>
                </td>
                <td style="padding: 12px 12px; font-size: 13px; color: #6b7280;">{{ row.journal_date | date:'dd MMM yyyy' }}</td>
                <td style="padding: 12px 12px;">
                  <p style="font-size: 13px; color: #1f2937; margin: 0; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ row.description || '—' }}</p>
                </td>
                <td style="padding: 12px 12px; text-align: right; font-size: 13px; font-weight: 700; color: #1f2937;">{{ formatNumber(row.total_debit) }}</td>
                <td style="padding: 12px 12px; text-align: right; font-size: 13px; font-weight: 700; color: #1f2937;">{{ formatNumber(row.total_credit) }}</td>
                <td style="padding: 12px 12px;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusClass(row.posting_status).bg"
                    [style.color]="getStatusClass(row.posting_status).color">
                    {{ row.posting_status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="position: relative; display: inline-block;">
                    <button (click)="toggleActionMenu(row)"
                      style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.15s ease; line-height: 0;"
                      onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px;">more_vert</span>
                    </button>
                    <div *ngIf="activeActionRow?.uuid === row.uuid" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 180px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                      <button (click)="viewJournal(row); toggleActionMenu(null)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                        onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View
                      </button>
                      <button *ngIf="row.posting_status === 'draft'" (click)="postJournal(row); toggleActionMenu(null)"
                        style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #047857; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">check_circle</span> Post
                      </button>
                    </div>
                  </div>
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
                <option value="15">15 / page</option>
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
    </style>
  `,
})
export class JournalEntriesComponent implements OnInit {
  private financeApi = inject(FinanceApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  journals: JournalEntry[] = [];
  loading = false;
  searchTerm = '';
  filterStatus = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  currentPage = 1;
  pageSize = 15;
  totalItems = 0;
  selectedIds: number[] = [];
  activeActionRow: JournalEntry | null = null;

  displayedColumns = ['journal_number', 'journal_date', 'description', 'debit', 'credit', 'posting_status', 'actions'];
  postingStatuses = POSTING_STATUSES;

  stats = { total: 0, posted: 0, draft: 0, totalDebit: 0, totalCredit: 0 };

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchTerm) params['search'] = this.searchTerm;
    if (this.filterStatus) params['posting_status'] = this.filterStatus;
    if (this.dateFrom) params['date_from'] = this.dateFrom.toISOString().split('T')[0];
    if (this.dateTo) params['date_to'] = this.dateTo.toISOString().split('T')[0];

    this.financeApi.getJournals(params).subscribe({
      next: (res) => {
        this.journals = res.data ?? [];
        this.totalItems = this.journals.length;
        this.computeStats(this.journals);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  computeStats(data: JournalEntry[]): void {
    this.stats.total = this.totalItems;
    this.stats.posted = data.filter(j => j.posting_status === 'posted').length;
    this.stats.draft = data.filter(j => j.posting_status === 'draft').length;
    this.stats.totalDebit = data.reduce((sum, j) => sum + j.total_debit, 0);
    this.stats.totalCredit = data.reduce((sum, j) => sum + j.total_credit, 0);
  }

  onDateFromChange(value: string): void {
    this.dateFrom = value ? new Date(value) : null;
    this.loadJournals();
  }

  onDateToChange(value: string): void {
    this.dateTo = value ? new Date(value) : null;
    this.loadJournals();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadJournals();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadJournals();
  }

  getRangeLabel(): string {
    if (this.totalItems === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}\u2013${end} of ${this.totalItems}`;
  }

  toggleActionMenu(row: JournalEntry | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  viewJournal(journal: JournalEntry): void {
    this.activeActionRow = null;
    this.router.navigate(['/admin/finance/journals', journal.uuid]);
  }

  createJournal(): void {
    this.router.navigate(['/admin/finance/journals/create']);
  }

  postJournal(journal: JournalEntry): void {
    this.activeActionRow = null;
    this.financeApi.postJournal(journal.uuid).subscribe({
      next: () => {
        this.notification.success('Journal entry posted successfully');
        this.loadJournals();
      },
      error: () => {
        this.notification.error('Failed to post journal entry');
      },
    });
  }

  bulkPost(): void {
    if (this.selectedIds.length === 0) {
      this.notification.error('Select at least one draft journal to post');
      return;
    }
    this.financeApi.bulkPostJournals(this.selectedIds).subscribe({
      next: () => {
        this.notification.success('Selected journal entries posted successfully');
        this.selectedIds = [];
        this.loadJournals();
      },
      error: () => {
        this.notification.error('Failed to bulk post journal entries');
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
    return value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
