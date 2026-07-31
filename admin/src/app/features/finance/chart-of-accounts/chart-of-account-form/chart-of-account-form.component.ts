import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FinanceApiService } from '../../../../core/services/finance-api.service';
import { ChartOfAccount, ACCOUNT_TYPES } from '../../../../core/models/finance/finance.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-chart-of-account-form',
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
        <a routerLink="/admin/finance/accounts" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Chart of Accounts</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">{{ isEdit ? 'Edit Account' : 'Create Account' }}</span>
      </div>

      <div style="background: linear-gradient(135deg, #059669, #047857, #166534); padding: 36px 24px 56px; position: relative; overflow: hidden; margin-top: 16px;">
        <div style="position: absolute; top: -40px; right: -40px; width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
        <div style="position: absolute; top: -80px; right: 60px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1;">
          <div>
            <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px 0;">{{ isEdit ? 'Edit Account' : 'Create New Account' }}</h1>
            <p style="font-size: 13px; color: rgba(255,255,255,0.75); margin: 0;">Add or update accounts in your chart of accounts</p>
          </div>
          <a routerLink="/admin/finance/accounts"
            style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); color: white; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s ease;"
            onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
            <span class="material-icons" style="font-size: 18px;">arrow_back</span> Back to Accounts
          </a>
        </div>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style="position: absolute; bottom: -1px; left: 0; width: 100%; height: 60px; display: block;">
          <path fill="#f3f4f6" d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,60 L0,60 Z"></path>
        </svg>
      </div>

      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 120px; position: relative; z-index: 2;">
        <div *ngIf="loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; margin-top: -28px;">
          <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Loading account details...</p>
        </div>

        <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 28px; margin-top: -28px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">account_balance</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #1f2937; margin: 0;">Account Details</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Basic information about this account</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
                  Account Code <span style="color: #dc2626;">*</span>
                </label>
                <input type="text" formControlName="account_code" placeholder="e.g. 1001"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  [style.borderColor]="form.get('account_code')?.invalid && form.get('account_code')?.touched ? '#dc2626' : ''"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor=this.value===''&&this.getAttribute('aria-invalid')?'#dc2626':'#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
                <p *ngIf="form.get('account_code')?.invalid && form.get('account_code')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Account code is required</p>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
                  Account Name <span style="color: #dc2626;">*</span>
                </label>
                <input type="text" formControlName="account_name" placeholder="e.g. Cash in Hand"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  [style.borderColor]="form.get('account_name')?.invalid && form.get('account_name')?.touched ? '#dc2626' : ''"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor=this.value===''&&this.getAttribute('aria-invalid')?'#dc2626':'#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
                <p *ngIf="form.get('account_name')?.invalid && form.get('account_name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Account name is required</p>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">
                  Account Type <span style="color: #dc2626;">*</span>
                </label>
                <select formControlName="account_type"
                  style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; appearance: none; -webkit-appearance: none; box-sizing: border-box;"
                  [style.borderColor]="form.get('account_type')?.invalid && form.get('account_type')?.touched ? '#dc2626' : ''"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
                  <option *ngFor="let type of accountTypes" [ngValue]="type.value">{{ type.label }}</option>
                </select>
                <p *ngIf="form.get('account_type')?.invalid && form.get('account_type')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Account type is required</p>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Parent Account</label>
                <select formControlName="parent_account_id"
                  style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; appearance: none; -webkit-appearance: none; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
                  <option [ngValue]="null">None (Top Level)</option>
                  <option *ngFor="let account of parentAccounts" [ngValue]="account.id">{{ account.account_code }} - {{ account.account_name }}</option>
                </select>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04); padding: 28px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 18px; color: #1d4ed8;">settings</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #1f2937; margin: 0;">Balance &amp; Settings</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Financial defaults and status for this account</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Opening Balance (₹)</label>
                <input type="number" formControlName="opening_balance" placeholder="0.00"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Currency</label>
                <input type="text" formControlName="currency" placeholder="INR"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Status</label>
                <select formControlName="status"
                  style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; appearance: none; -webkit-appearance: none; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Remarks</label>
                <input type="text" formControlName="remarks" placeholder="Additional notes about this account..."
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div *ngIf="!loading" style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); border-top: 1px solid #e5e7eb; padding: 12px 24px; z-index: 100; box-shadow: 0 -4px 16px rgba(0,0,0,0.05);">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
          <button type="button" routerLink="/admin/finance/accounts"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</button>
          <button type="button" (click)="onSubmit()" [disabled]="form.invalid || saving"
            style="padding: 10px 32px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            [style.opacity]="form.invalid || saving ? '0.5' : '1'"
            [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
            onmouseover="if(this.disabled===false){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
            {{ isEdit ? 'Update Account' : 'Create Account' }}
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
export class ChartOfAccountFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private financeApi = inject(FinanceApiService);
  private notification = inject(NotificationService);

  form!: FormGroup;
  isEdit = false;
  loading = false;
  saving = false;
  accountUuid = '';
  accountId: number | null = null;
  allAccounts: ChartOfAccount[] = [];
  accountTypes = ACCOUNT_TYPES;

  get parentAccounts(): ChartOfAccount[] {
    if (this.isEdit && this.accountId != null) {
      return this.allAccounts.filter(a => a.id !== this.accountId);
    }
    return this.allAccounts;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      account_code: ['', Validators.required],
      account_name: ['', Validators.required],
      account_type: ['asset', Validators.required],
      parent_account_id: [null],
      opening_balance: [0],
      currency: ['INR'],
      status: ['active'],
      remarks: [''],
    });

    this.loadAccountsForParent();

    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid && this.router.url.includes('/edit')) {
      this.isEdit = true;
      this.accountUuid = uuid;
      this.loadAccount(uuid);
    }
  }

  loadAccountsForParent(): void {
    this.financeApi.getAccounts({ per_page: '1000' }).subscribe({
      next: (res) => {
        this.allAccounts = res.data ?? [];
      },
    });
  }

  loadAccount(uuid: string): void {
    this.loading = true;
    this.financeApi.getAccount(uuid).subscribe({
      next: (res) => {
        const a = res.data!;
        this.accountId = a.id;
        this.form.patchValue({
          account_code: a.account_code,
          account_name: a.account_name,
          account_type: a.account_type,
          parent_account_id: a.parent_account_id,
          opening_balance: a.opening_balance,
          currency: a.currency,
          status: a.status,
          remarks: a.remarks || '',
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load account');
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const formData = { ...this.form.value };

    const request = this.isEdit
      ? this.financeApi.updateAccount(this.accountUuid, formData)
      : this.financeApi.createAccount(formData);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Account updated successfully' : 'Account created successfully');
        this.router.navigate(['/admin/finance/accounts']);
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to save account');
      },
    });
  }
}
