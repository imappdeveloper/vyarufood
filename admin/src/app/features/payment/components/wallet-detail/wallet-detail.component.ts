import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Wallet, WalletTransaction, WALLET_STATUSES } from '../../../../core/models/payment/payment.model';

@Component({
  selector: 'app-wallet-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading wallet details...</p>
      </div>
    </div>

    <div *ngIf="!loading && wallet" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/payment/wallets" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Wallets
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">Wallet Detail</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getStatusBadgeStyles(wallet.status)">{{ getStatusLabel(wallet.status) }}</span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ wallet.wallet_number }} &bull; Customer #{{ wallet.customer_id }}</p>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">account_balance_wallet</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Current Balance</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">₹{{ wallet.current_balance }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">lock</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Blocked Balance</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">₹{{ wallet.blocked_balance }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">add_circle</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Credit</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">₹{{ wallet.total_credit }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #dc2626;">remove_circle</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Debit</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">₹{{ wallet.total_debit }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; margin-bottom: 24px;">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 18px; color: #047857;">account_balance_wallet</span>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Wallet Information</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Wallet Number</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ wallet.wallet_number }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Status</p>
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;" [ngStyle]="getStatusBadgeStyles(wallet.status)">{{ getStatusLabel(wallet.status) }}</span>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Customer ID</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">#{{ wallet.customer_id }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created At</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ wallet.created_at | date:'dd MMM yyyy, hh:mm a' }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Last Updated</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ wallet.updated_at | date:'dd MMM yyyy, hh:mm a' }}</p>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">balance</span>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Balance Summary</h2>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="background: #d1fae5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px;">
                <p style="font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Current Balance</p>
                <p style="font-size: 22px; font-weight: 800; color: #064e3b; margin: 0;">₹{{ wallet.current_balance }}</p>
              </div>
              <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px;">
                <p style="font-size: 11px; font-weight: 600; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Blocked Balance</p>
                <p style="font-size: 20px; font-weight: 800; color: #78350f; margin: 0;">₹{{ wallet.blocked_balance }}</p>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: #d1fae5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 12px;">
                  <p style="font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Total Credit</p>
                  <p style="font-size: 16px; font-weight: 800; color: #064e3b; margin: 0;">₹{{ wallet.total_credit }}</p>
                </div>
                <div style="background: #fee2e2; border: 1px solid #fecaca; border-radius: 12px; padding: 12px;">
                  <p style="font-size: 11px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Total Debit</p>
                  <p style="font-size: 16px; font-weight: 800; color: #991b1b; margin: 0;">₹{{ wallet.total_debit }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 18px; color: #047857;">tune</span>
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Adjust Balance</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: end;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Adjustment Type <span style="color: #dc2626;">*</span></label>
              <select [value]="adjustType" (change)="onAdjustTypeChange($event)"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="credit">Credit (Add)</option>
                <option value="debit">Debit (Subtract)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Amount (₹) <span style="color: #dc2626;">*</span></label>
              <input type="number" [value]="adjustAmount !== null ? adjustAmount : ''" (input)="onAdjustAmountChange($event)" placeholder="0.00" min="0.01" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks <span style="color: #dc2626;">*</span></label>
              <input type="text" [value]="adjustRemarks" (input)="onAdjustRemarksChange($event)" placeholder="Adjustment reason..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <button (click)="adjustBalance()" [disabled]="!adjustAmount || !adjustRemarks || adjusting"
              style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="!adjustAmount || !adjustRemarks || adjusting ? '0.5' : '1'"
              [style.cursor]="!adjustAmount || !adjustRemarks || adjusting ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="adjusting" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              Adjust
            </button>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="display: flex; align-items: center; gap: 8px; padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <span class="material-icons" style="font-size: 18px; color: #047857;">receipt_long</span>
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Transaction History</h2>
          </div>

          <div *ngIf="loadingTransactions" style="display: flex; align-items: center; justify-content: center; padding: 48px;">
            <div style="text-align: center;">
              <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>
              <p style="font-size: 12px; color: #9ca3af;">Loading transactions...</p>
            </div>
          </div>

          <div *ngIf="!loadingTransactions && transactions.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No transactions</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">No transactions have been recorded for this wallet</p>
          </div>

          <div *ngIf="!loadingTransactions && transactions.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Txn #</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Before</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">After</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Remarks</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Reference</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of transactions; let i = index" [attr.data-idx]="i"
                  style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 16px;">
                    <span style="font-size: 13px; font-weight: 600; color: #047857;">{{ row.transaction_number }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [ngStyle]="row.transaction_type === 'credit' ? { background: '#d1fae5', color: '#065f46' } : { background: '#fee2e2', color: '#991b1b' }">
                      {{ row.transaction_type | titlecase }}
                    </span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700;" [style.color]="row.transaction_type === 'credit' ? '#059669' : '#dc2626'">{{ row.transaction_type === 'credit' ? '+' : '-' }}₹{{ row.amount }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; color: #9ca3af;">₹{{ row.opening_balance }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">₹{{ row.closing_balance }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #374151;">{{ row.remarks || '—' }}</span>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #9ca3af;">{{ row.reference_type || '—' }}</span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px;">
                    <span style="font-size: 13px; color: #9ca3af;">{{ row.created_at | date:'dd MMM yyyy, hh:mm a' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 12px; color: #9ca3af;">Showing {{ getTxnRangeLabel() }}</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button (click)="goToTxnPage(1)" [disabled]="txnCurrentPage <= 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnCurrentPage <= 1 ? '0.4' : '1'"
                  [style.cursor]="txnCurrentPage <= 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">first_page</span>
                </button>
                <button (click)="goToTxnPage(txnCurrentPage - 1)" [disabled]="txnCurrentPage <= 1"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnCurrentPage <= 1 ? '0.4' : '1'"
                  [style.cursor]="txnCurrentPage <= 1 ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_left</span>
                </button>
                <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ txnCurrentPage }} of {{ txnTotalPages }}</span>
                <button (click)="goToTxnPage(txnCurrentPage + 1)" [disabled]="txnCurrentPage >= txnTotalPages"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnCurrentPage >= txnTotalPages ? '0.4' : '1'"
                  [style.cursor]="txnCurrentPage >= txnTotalPages ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">chevron_right</span>
                </button>
                <button (click)="goToTxnPage(txnTotalPages)" [disabled]="txnCurrentPage >= txnTotalPages"
                  style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                  [style.opacity]="txnCurrentPage >= txnTotalPages ? '0.4' : '1'"
                  [style.cursor]="txnCurrentPage >= txnTotalPages ? 'not-allowed' : 'pointer'"
                  onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                  <span class="material-icons" style="font-size: 14px;">last_page</span>
                </button>
                <select (change)="onTxnPerPageChange($event)"
                  style="padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;"
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
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class WalletDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentApi = inject(PaymentApiService);
  private notification = inject(NotificationService);

  wallet: Wallet | null = null;
  transactions: WalletTransaction[] = [];
  loading = false;
  loadingTransactions = false;
  adjusting = false;

  adjustType = 'credit';
  adjustAmount: number | null = null;
  adjustRemarks = '';

  txnCurrentPage = 1;
  txnPageSize = 15;
  totalTxnItems = 0;

  transactionColumns = ['transaction_number', 'transaction_type', 'amount', 'balance_before', 'balance_after', 'remarks', 'reference_type', 'created_at'];

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadWallet(uuid);
      this.loadTransactions(uuid);
    }
  }

  loadWallet(uuid: string): void {
    this.loading = true;
    this.paymentApi.getWallet(uuid).subscribe({
      next: (res) => {
        this.wallet = res.data!;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load wallet');
      },
    });
  }

  loadTransactions(uuid: string): void {
    this.loadingTransactions = true;
    const params: Record<string, string> = {
      page: String(this.txnCurrentPage),
      per_page: String(this.txnPageSize),
    };
    this.paymentApi.getWalletTransactions(uuid, params).subscribe({
      next: (res) => {
        this.transactions = res.data ?? [];
        this.loadingTransactions = false;
      },
      error: () => { this.loadingTransactions = false; },
    });
  }

  get txnTotalPages(): number { return Math.max(1, Math.ceil(this.totalTxnItems / this.txnPageSize)); }

  goToTxnPage(page: number): void {
    if (page < 1 || page > this.txnTotalPages) return;
    this.txnCurrentPage = page;
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) this.loadTransactions(uuid);
  }

  onTxnPerPageChange(event: any): void {
    this.txnPageSize = parseInt(event.target.value, 10);
    this.txnCurrentPage = 1;
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) this.loadTransactions(uuid);
  }

  getTxnRangeLabel(): string {
    if (this.totalTxnItems === 0) return '0 of 0';
    const start = (this.txnCurrentPage - 1) * this.txnPageSize + 1;
    const end = Math.min(this.txnCurrentPage * this.txnPageSize, this.totalTxnItems);
    return `${start}\u2013${end} of ${this.totalTxnItems}`;
  }

  onAdjustTypeChange(event: any): void {
    this.adjustType = event.target?.value || 'credit';
  }

  onAdjustAmountChange(event: any): void {
    const value = event.target?.value as string | undefined;
    this.adjustAmount = value ? Number(value) : null;
  }

  onAdjustRemarksChange(event: any): void {
    this.adjustRemarks = event.target?.value || '';
  }

  adjustBalance(): void {
    if (!this.wallet || !this.adjustAmount || !this.adjustRemarks) return;
    this.adjusting = true;
    this.paymentApi.adjustWalletBalance(this.wallet.uuid, {
      type: this.adjustType,
      amount: this.adjustAmount,
      remarks: this.adjustRemarks,
    }).subscribe({
      next: (res) => {
        this.wallet = res.data!;
        this.notification.success('Balance adjusted successfully');
        this.adjustAmount = null;
        this.adjustRemarks = '';
        this.adjusting = false;
        this.loadTransactions(this.wallet!.uuid);
      },
      error: () => {
        this.adjusting = false;
        this.notification.error('Failed to adjust balance');
      },
    });
  }

  getStatusLabel(status: string): string {
    const found = WALLET_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getStatusBadgeClass(status: string): string {
    const found = WALLET_STATUSES.find(s => s.value === status);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  }

  getStatusBadgeStyles(status: string): { background: string; color: string } {
    const colors: Record<string, { background: string; color: string }> = {
      'bg-amber-100 text-amber-800': { background: '#fef3c7', color: '#92400e' },
      'bg-blue-100 text-blue-800': { background: '#dbeafe', color: '#1e40af' },
      'bg-emerald-100 text-emerald-800': { background: '#d1fae5', color: '#065f46' },
      'bg-red-100 text-red-800': { background: '#fee2e2', color: '#991b1b' },
      'bg-gray-100 text-gray-800': { background: '#f3f4f6', color: '#374151' },
    };
    const found = WALLET_STATUSES.find(s => s.value === status);
    return colors[found?.color ?? ''] ?? { background: '#f3f4f6', color: '#374151' };
  }
}
