import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { FinanceApiService } from '../../../../core/services/finance-api.service';
import { ChartOfAccount, JOURNAL_ENTRY_TYPES } from '../../../../core/models/finance/finance.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-journal-entry-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out;">
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
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Create</span>
      </div>

      <div style="background: linear-gradient(135deg, #059669, #047857, #166534); padding: 36px 24px 56px; position: relative; overflow: hidden; margin-top: 16px;">
        <div style="position: absolute; top: -40px; right: -40px; width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
        <div style="position: absolute; top: -80px; right: 60px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1;">
          <div>
            <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px 0;">Create Journal Entry</h1>
            <p style="font-size: 13px; color: rgba(255,255,255,0.75); margin: 0;">Record a balanced journal entry with multiple lines</p>
          </div>
          <a routerLink="/admin/finance/journals"
            style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); color: white; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s ease;"
            onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
            <span class="material-icons" style="font-size: 18px;">arrow_back</span> Back to Journals
          </a>
        </div>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style="position: absolute; bottom: -1px; left: 0; width: 100%; height: 60px; display: block;">
          <path fill="#f3f4f6" d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,60 L0,60 Z"></path>
        </svg>
      </div>

      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 120px; position: relative; z-index: 2;">
        <div *ngIf="loadingAccounts" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; margin-top: -28px;">
          <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Loading accounts...</p>
        </div>

        <form *ngIf="!loadingAccounts" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 28px; margin-top: -28px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">info</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #1f2937; margin: 0;">Journal Information</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Basic details of this journal entry</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
                  Journal Date <span style="color: #dc2626;">*</span>
                </label>
                <input type="date" [value]="form.get('journal_date')?.value | date:'yyyy-MM-dd'" (input)="onDateInput($event)"
                  style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  [style.borderColor]="form.get('journal_date')?.invalid && form.get('journal_date')?.touched ? '#dc2626' : ''"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
                <p *ngIf="form.get('journal_date')?.invalid && form.get('journal_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Date is required</p>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
                  Entry Type <span style="color: #dc2626;">*</span>
                </label>
                <select formControlName="entry_type"
                  style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; appearance: none; -webkit-appearance: none; box-sizing: border-box;"
                  [style.borderColor]="form.get('entry_type')?.invalid && form.get('entry_type')?.touched ? '#dc2626' : ''"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
                  <option *ngFor="let type of entryTypes" [ngValue]="type.value">{{ type.label }}</option>
                </select>
                <p *ngIf="form.get('entry_type')?.invalid && form.get('entry_type')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Entry type is required</p>
              </div>
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Description</label>
                <textarea formControlName="description" rows="3" placeholder="Description for this journal entry..."
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: inherit; resize: vertical;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'"></textarea>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 28px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 10px; background: #ede9fe; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="font-size: 18px; color: #7c3aed;">table_rows</span>
                </div>
                <h2 style="font-size: 16px; font-weight: 700; color: #1f2937; margin: 0;">Journal Entry Lines</h2>
              </div>
              <div style="display: flex; align-items: center; gap: 16px; font-size: 13px; flex-wrap: wrap;">
                <span style="color: #6b7280;">Total Debit: <span style="font-weight: 700; color: #1f2937;">{{ formatNumber(totalDebit) }}</span></span>
                <span style="color: #6b7280;">Total Credit: <span style="font-weight: 700; color: #1f2937;">{{ formatNumber(totalCredit) }}</span></span>
                <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                  [style.background]="isBalanced ? '#d1fae5' : '#fee2e2'"
                  [style.color]="isBalanced ? '#047857' : '#b91c1c'">
                  {{ isBalanced ? 'Balanced' : 'Unbalanced' }}
                </span>
              </div>
            </div>

            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <th style="text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 12px 12px 0;">Account *</th>
                    <th style="text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 12px 12px; width: 170px;">Debit Amount</th>
                    <th style="text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 12px 12px; width: 170px;">Credit Amount</th>
                    <th style="text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 12px 12px;">Description</th>
                    <th style="text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 0 12px; width: 56px;"></th>
                  </tr>
                </thead>
                <tbody formArrayName="lines">
                  <tr *ngFor="let line of lines.controls; let i = index" [formGroupName]="i" style="border-top: 1px solid #f3f4f6;">
                    <td style="padding: 10px 12px 10px 0;">
                      <select formControlName="account_id"
                        style="width: 100%; padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; appearance: none; -webkit-appearance: none; box-sizing: border-box; min-width: 220px;"
                        [style.borderColor]="lines.controls[i].get('account_id')?.invalid && lines.controls[i].get('account_id')?.touched ? '#dc2626' : ''"
                        onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
                        <option *ngFor="let account of accounts" [ngValue]="account.id">{{ account.account_code }} - {{ account.account_name }}</option>
                      </select>
                    </td>
                    <td style="padding: 10px 12px;">
                      <input type="number" formControlName="debit_amount" placeholder="0.00" (input)="recalculateTotals()"
                        style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; text-align: right;"
                        onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
                    </td>
                    <td style="padding: 10px 12px;">
                      <input type="number" formControlName="credit_amount" placeholder="0.00" (input)="recalculateTotals()"
                        style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; text-align: right;"
                        onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
                    </td>
                    <td style="padding: 10px 12px;">
                      <input type="text" formControlName="description" placeholder="Line description"
                        style="width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
                    </td>
                    <td style="padding: 10px 0; text-align: center;">
                      <button *ngIf="lines.length > 1" type="button" (click)="removeLine(i)"
                        style="width: 34px; height: 34px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #dc2626; transition: all 0.15s ease; line-height: 0;"
                        onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button type="button" (click)="addLine()"
              style="margin-top: 16px; display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; background: white; border: 1.5px solid #a7f3d0; color: #047857; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease;"
              onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='white'">
              <span class="material-icons" style="font-size: 18px;">add</span> Add Line
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="!loadingAccounts" style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); border-top: 1px solid #e5e7eb; padding: 12px 24px; z-index: 100; box-shadow: 0 -4px 16px rgba(0,0,0,0.05);">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
          <button type="button" routerLink="/admin/finance/journals"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</button>
          <button type="button" (click)="onSubmit()" [disabled]="form.invalid || saving || !isBalanced || lines.length < 2"
            style="padding: 10px 32px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            [style.opacity]="form.invalid || saving || !isBalanced || lines.length < 2 ? '0.5' : '1'"
            [style.cursor]="form.invalid || saving || !isBalanced || lines.length < 2 ? 'not-allowed' : 'pointer'"
            onmouseover="if(this.disabled===false){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
            Create Journal Entry
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
export class JournalEntryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private financeApi = inject(FinanceApiService);
  private notification = inject(NotificationService);

  form!: FormGroup;
  accounts: ChartOfAccount[] = [];
  loadingAccounts = true;
  saving = false;

  entryTypes = JOURNAL_ENTRY_TYPES;

  lines = new FormArray([
    this.fb.group({
      account_id: [null, Validators.required],
      debit_amount: [0],
      credit_amount: [0],
      description: [''],
    }),
  ]);

  totalDebit = 0;
  totalCredit = 0;
  isBalanced = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      journal_date: [new Date(), Validators.required],
      entry_type: ['general', Validators.required],
      description: [''],
      lines: this.lines,
    });

    this.loadAccounts();
    this.recalculateTotals();
  }

  loadAccounts(): void {
    this.loadingAccounts = true;
    this.financeApi.getAccounts({ per_page: '500', status: 'active' }).subscribe({
      next: (res) => {
        this.accounts = res.data ?? [];
        this.loadingAccounts = false;
      },
      error: () => {
        this.loadingAccounts = false;
        this.notification.error('Failed to load accounts');
      },
    });
  }

  onDateInput(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.form.get('journal_date')?.setValue(value ? new Date(value) : null);
  }

  addLine(): void {
    this.lines.push(
      this.fb.group({
        account_id: [null, Validators.required],
        debit_amount: [0],
        credit_amount: [0],
        description: [''],
      })
    );
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) {
      this.lines.removeAt(index);
      this.recalculateTotals();
    }
  }

  recalculateTotals(): void {
    this.totalDebit = this.lines.controls.reduce((sum, ctrl) => sum + (Number(ctrl.get('debit_amount')?.value) || 0), 0);
    this.totalCredit = this.lines.controls.reduce((sum, ctrl) => sum + (Number(ctrl.get('credit_amount')?.value) || 0), 0);
    this.isBalanced = this.totalDebit === this.totalCredit && this.totalDebit > 0;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.isBalanced || this.lines.length < 2) return;
    this.saving = true;

    const formData = { ...this.form.value };
    if (formData.journal_date instanceof Date) {
      formData.journal_date = formData.journal_date.toISOString().split('T')[0];
    }

    this.financeApi.createJournal(formData).subscribe({
      next: (res) => {
        this.notification.success('Journal entry created successfully');
        this.router.navigate(['/admin/finance/journals', res.data!.uuid]);
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to create journal entry');
      },
    });
  }

  formatNumber(value: number): string {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
