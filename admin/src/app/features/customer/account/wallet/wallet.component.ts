import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SeoService } from '../../../../core/services/seo.service';
import { CustomerWalletApiService } from '../../../../core/services/customer-wallet-api.service';
import { CustomerPaymentApiService } from '../../../../core/services/customer-payment-api.service';
import { Wallet, WalletTransaction, PaymentTransaction } from '../../../../core/models/payment/payment.model';
import { loadRazorpayScript, openRazorpayCheckout, RazorpayResponse } from '../../../../core/utils/razorpay';
@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Toast -->
      @if (toast) {
        <div style="position: fixed; top: 24px; right: 24px; z-index: 50; animation: slideIn 0.3s ease-out;">
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); font-size: 13px; font-weight: 500;
            {{ toast.type === 'success' ? 'background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;' : toast.type === 'error' ? 'background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;' : 'background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;' }}
          ">
            <span class="material-icons" style="font-size: 20px;">{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</span>
            {{ toast.message }}
            <button (click)="toast = null" style="background: none; border: none; cursor: pointer; opacity: 0.6; padding: 2px;">
              <span class="material-icons" style="font-size: 16px;">close</span>
            </button>
          </div>
        </div>
      }

      <!-- Loading skeleton -->
      @if (loading) {
        <div>
          <div style="height: 24px; background: #e5e7eb; border-radius: 4px; width: 160px; margin-bottom: 24px;"></div>
          <div style="background: linear-gradient(135deg, #e5e7eb, #d1d5db); border-radius: 20px; height: 180px; margin-bottom: 32px;"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 32px;">
            <div style="background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; height: 80px;"></div>
            <div style="background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; height: 80px;"></div>
            <div style="background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; height: 80px;"></div>
          </div>
          <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; height: 400px;"></div>
        </div>
      }

      <!-- Error -->
      @if (error && !loading) {
        <div style="background: #fff; border-radius: 20px; padding: 48px 24px; border: 1px solid #e5e7eb; text-align: center;">
          <span class="material-icons" style="font-size: 56px; color: #fca5a5; margin-bottom: 16px;">error_outline</span>
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">Something went wrong</h2>
          <p style="color: #6b7280; margin: 0 0 24px 0;">{{ error }}</p>
          <button (click)="ngOnInit()" style="padding: 10px 24px; background: #059669; color: #fff; font-size: 14px; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">Try Again</button>
        </div>
      }

      <!-- Content -->
      @if (!loading && !error) {
        <!-- Hero Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
          <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
          <div style="position: relative; z-index: 1;">
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 4px 0;">WALLET</p>
            <h1 style="color: #fff; font-size: 28px; font-weight: 700; margin: 0 0 16px 0;">My Wallet</h1>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px;">
              <div>
                <p style="color: rgba(255,255,255,0.75); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px 0;">Available Balance</p>
                <p style="color: #fff; font-size: 36px; font-weight: 700; margin: 0;">₹{{ walletBalance }}</p>
              </div>
              <div>
                <p style="color: rgba(255,255,255,0.75); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px 0;">Total Credit</p>
                <p style="color: #fff; font-size: 24px; font-weight: 600; margin: 0;">₹{{ totalCredit }}</p>
              </div>
              <div>
                <p style="color: rgba(255,255,255,0.75); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px 0;">Total Debit</p>
                <p style="color: #fff; font-size: 24px; font-weight: 600; margin: 0;">₹{{ totalDebit }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recharge Section -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 28px;">
          <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
            <span class="material-icons" style="font-size: 20px; color: #059669;">add_circle</span> Recharge Wallet
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
            @for (amt of quickAmounts; track amt) {
              <button (click)="selectRechargeAmount(amt)"
                [style]="selectedAmount === amt
                  ? 'padding: 10px 20px; background: #059669; color: #fff; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; font-size: 14px; box-shadow: 0 2px 8px rgba(5,150,105,0.25); transition: all 0.2s;'
                  : 'padding: 10px 20px; background: #f3f4f6; color: #374151; font-weight: 500; border-radius: 12px; border: none; cursor: pointer; font-size: 14px; transition: all 0.2s;'"
                onmouseover="this.style.background='#ecfdf5';this.style.color='#059669'"
                onmouseout="this.style.background='#f3f4f6';this.style.color='#374151'">₹{{ amt }}</button>
            }
          </div>
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div style="position: relative; flex: 1; max-width: 240px;">
              <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-weight: 500;">₹</span>
              <input type="number" [(ngModel)]="customAmount" (focus)="selectedAmount = 0" placeholder="Custom amount" min="1" style="width: 100%; padding: 10px 14px 10px 32px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 16px; font-weight: 500; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
            </div>
            <button (click)="recharge()" [disabled]="recharging || rechargeAmount <= 0" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: #059669; color: #fff; font-size: 14px; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s; {{ (recharging || rechargeAmount <= 0) ? 'opacity: 0.5; cursor: not-allowed;' : '' }}" onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#059669';this.style.transform=''">
              @if (recharging) {
                <span class="material-icons" style="font-size: 16px; animation: spin 1s linear infinite;">refresh</span>
              } @else {
                <span class="material-icons" style="font-size: 16px;">account_balance_wallet</span>
              }
              {{ recharging ? 'Processing...' : 'Recharge Now' }}
            </button>
          </div>
        </div>

        <!-- Transaction History -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">
            <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">receipt_long</span> Transaction History
            </h2>
          </div>

          <!-- Tabs -->
          <div style="display: flex; gap: 8px; padding: 16px 24px 0; border-bottom: 1px solid #e5e7eb; overflow-x: auto;">
            @for (tab of tabs; track tab.value) {
              <button (click)="switchTab(tab.value)"
                [style]="activeTab === tab.value
                  ? 'padding: 8px 16px; font-size: 13px; font-weight: 600; border-radius: 8px; background: #059669; color: #fff; border: none; cursor: pointer; white-space: nowrap; transition: all 0.2s;'
                  : 'padding: 8px 16px; font-size: 13px; font-weight: 500; border-radius: 8px; background: transparent; color: #6b7280; border: none; cursor: pointer; white-space: nowrap; transition: all 0.2s;'"
                onmouseover="this.style.background='#f0fdf4';this.style.color='#059669'"
                onmouseout="this.style.background='transparent';this.style.color='#6b7280'">{{ tab.label }}</button>
            }
          </div>

          <!-- Empty state -->
          @if (!historyLoading && transactions.length === 0 && paymentHistory.length === 0) {
            <div style="padding: 48px 24px; text-align: center;">
              <div style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 12px; background: #f0fdf4; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 28px; color: #059669;">receipt</span>
              </div>
              <p style="color: #6b7280; margin: 0;">No transactions yet.</p>
            </div>
          }

          <!-- Transaction list skeleton -->
          @if (historyLoading) {
            <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
              @for (i of [1,2,3,4,5]; track i) {
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb;"></div>
                  <div style="flex: 1;">
                    <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 180px; margin-bottom: 6px;"></div>
                    <div style="height: 10px; background: #e5e7eb; border-radius: 4px; width: 100px;"></div>
                  </div>
                  <div style="height: 16px; background: #e5e7eb; border-radius: 4px; width: 80px;"></div>
                </div>
              }
            </div>
          }

          <!-- Wallet Transaction List -->
          @if (!historyLoading && activeTab !== 'payments') {
            @for (txn of transactions; track txn.id) {
              <div (click)="openTransactionDetail(txn)" style="display: flex; align-items: center; gap: 12px; padding: 14px 24px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f9fafb;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; {{ txn.transaction_type === 'credit' ? 'background: #dcfce7;' : txn.transaction_type === 'debit' ? 'background: #fee2e2;' : 'background: #dbeafe;' }}">
                  <span class="material-icons" style="font-size: 18px; {{ txn.transaction_type === 'credit' ? 'color: #16a34a;' : txn.transaction_type === 'debit' ? 'color: #dc2626;' : 'color: #2563eb;' }}">{{ txn.transaction_type === 'credit' ? 'arrow_downward' : txn.transaction_type === 'debit' ? 'arrow_upward' : 'tune' }}</span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <p style="font-size: 13px; font-weight: 600; color: #111827; margin: 0 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ formatTransactionType(txn.transaction_type) }}</p>
                  <p style="font-size: 11px; color: #6b7280; margin: 0;">{{ txn.remarks || txn.transaction_number }}</p>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <p style="font-size: 13px; font-weight: 600; margin: 0; {{ txn.transaction_type === 'credit' ? 'color: #16a34a;' : txn.transaction_type === 'debit' ? 'color: #dc2626;' : 'color: #2563eb;' }}">
                    {{ txn.transaction_type === 'credit' ? '+' : txn.transaction_type === 'debit' ? '-' : '' }}₹{{ parseFloat(txn.amount).toFixed(2) }}
                  </p>
                  <p style="font-size: 11px; color: #9ca3af; margin: 0;">{{ formatDate(txn.created_at) }}</p>
                </div>
              </div>
            }
          }

          <!-- Payment Transaction List -->
          @if (!historyLoading && activeTab === 'payments') {
            @for (txn of paymentHistory; track txn.id) {
              <div (click)="openPaymentDetail(txn)" style="display: flex; align-items: center; gap: 12px; padding: 14px 24px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f9fafb;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; {{ txn.status === 'completed' ? 'background: #dcfce7;' : txn.status === 'pending' ? 'background: #fef3c7;' : txn.status === 'failed' ? 'background: #fee2e2;' : 'background: #f3f4f6;' }}">
                  <span class="material-icons" style="font-size: 18px; {{ txn.status === 'completed' ? 'color: #16a34a;' : txn.status === 'pending' ? 'color: #d97706;' : txn.status === 'failed' ? 'color: #dc2626;' : 'color: #6b7280;' }}">{{ txn.status === 'completed' ? 'check_circle' : txn.status === 'pending' ? 'hourglass_empty' : txn.status === 'failed' ? 'error' : 'cancel' }}</span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <p style="font-size: 13px; font-weight: 600; color: #111827; margin: 0 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ txn.transaction_number }}</p>
                  <p style="font-size: 11px; color: #6b7280; margin: 0;">{{ txn.payment_method?.toUpperCase() }} &middot; {{ txn.gateway_name }}</p>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <p style="font-size: 13px; font-weight: 600; color: #111827; margin: 0;">₹{{ parseFloat(txn.amount).toFixed(2) }}</p>
                  <p style="font-size: 11px; color: #9ca3af; margin: 0;">{{ formatDate(txn.created_at) }}</p>
                </div>
              </div>
            }
          }

          <!-- Pagination -->
          @if (totalPages > 1) {
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 13px; color: #6b7280; margin: 0;">Page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} transactions)</p>
              <div style="display: flex; gap: 8px;">
                <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1" style="padding: 6px 14px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; color: #374151; transition: all 0.15s; {{ currentPage <= 1 ? 'opacity: 0.5; cursor: not-allowed;' : '' }}" onmouseover="if(!this.disabled)this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">Previous</button>
                <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages" style="padding: 6px 14px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; color: #374151; transition: all 0.15s; {{ currentPage >= totalPages ? 'opacity: 0.5; cursor: not-allowed;' : '' }}" onmouseover="if(!this.disabled)this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">Next</button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Transaction Detail Modal (Wallet) -->
    @if (selectedWalletTxn) {
      <div (click)="selectedWalletTxn = null" style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px;">
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);"></div>
        <div (click)="$event.stopPropagation()" style="position: relative; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-width: 440px; width: 100%; padding: 24px; z-index: 10;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">Transaction Details</h3>
            <button (click)="selectedWalletTxn = null" style="padding: 4px; border: none; background: none; cursor: pointer; border-radius: 8px; transition: all 0.15s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 20px; color: #9ca3af;">close</span>
            </button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Transaction #</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">{{ selectedWalletTxn.transaction_number }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #6b7280;">Type</span>
              <span style="padding: 2px 10px; font-size: 11px; font-weight: 600; border-radius: 20px; {{ selectedWalletTxn.transaction_type === 'credit' ? 'background: #dcfce7; color: #166534;' : selectedWalletTxn.transaction_type === 'debit' ? 'background: #fee2e2; color: #991b1b;' : 'background: #dbeafe; color: #1e40af;' }}">{{ formatTransactionType(selectedWalletTxn.transaction_type) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Amount</span>
              <span style="font-size: 18px; font-weight: 700; {{ selectedWalletTxn.transaction_type === 'credit' ? 'color: #16a34a;' : selectedWalletTxn.transaction_type === 'debit' ? 'color: #dc2626;' : 'color: #2563eb;' }}">
                {{ selectedWalletTxn.transaction_type === 'credit' ? '+' : selectedWalletTxn.transaction_type === 'debit' ? '-' : '' }}₹{{ parseFloat(selectedWalletTxn.amount).toFixed(2) }}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Opening Balance</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">₹{{ parseFloat(selectedWalletTxn.opening_balance).toFixed(2) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Closing Balance</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">₹{{ parseFloat(selectedWalletTxn.closing_balance).toFixed(2) }}</span>
            </div>
            @if (selectedWalletTxn.remarks) {
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 13px; color: #6b7280;">Remarks</span>
                <span style="font-size: 13px; font-weight: 600; color: #111827; text-align: right; max-width: 200px;">{{ selectedWalletTxn.remarks }}</span>
              </div>
            }
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Date</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">{{ formatDateFull(selectedWalletTxn.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Payment Detail Modal -->
    @if (selectedPaymentTxn) {
      <div (click)="selectedPaymentTxn = null" style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px;">
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);"></div>
        <div (click)="$event.stopPropagation()" style="position: relative; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-width: 440px; width: 100%; padding: 24px; z-index: 10;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">Payment Details</h3>
            <button (click)="selectedPaymentTxn = null" style="padding: 4px; border: none; background: none; cursor: pointer; border-radius: 8px; transition: all 0.15s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 20px; color: #9ca3af;">close</span>
            </button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Transaction #</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">{{ selectedPaymentTxn.transaction_number }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #6b7280;">Status</span>
              <span style="padding: 2px 10px; font-size: 11px; font-weight: 600; border-radius: 20px; {{ selectedPaymentTxn.status === 'completed' ? 'background: #dcfce7; color: #166534;' : selectedPaymentTxn.status === 'pending' ? 'background: #fef3c7; color: #92400e;' : selectedPaymentTxn.status === 'failed' ? 'background: #fee2e2; color: #991b1b;' : 'background: #f3f4f6; color: #6b7280;' }}">{{ selectedPaymentTxn.status }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Amount</span>
              <span style="font-size: 18px; font-weight: 700; color: #111827;">₹{{ parseFloat(selectedPaymentTxn.amount).toFixed(2) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Payment Method</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">{{ selectedPaymentTxn.payment_method?.toUpperCase() }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Gateway</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">{{ selectedPaymentTxn.gateway_name }}</span>
            </div>
            @if (selectedPaymentTxn.gateway_transaction_id) {
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 13px; color: #6b7280;">Gateway ID</span>
                <span style="font-size: 13px; font-weight: 600; color: #111827; text-align: right; max-width: 200px; word-break: break-all;">{{ selectedPaymentTxn.gateway_transaction_id }}</span>
              </div>
            }
            @if (selectedPaymentTxn.failure_reason) {
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 13px; color: #6b7280;">Failure Reason</span>
                <span style="font-size: 13px; font-weight: 600; color: #dc2626; text-align: right; max-width: 200px;">{{ selectedPaymentTxn.failure_reason }}</span>
              </div>
            }
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #6b7280;">Date</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">{{ formatDateFull(selectedPaymentTxn.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class WalletComponent implements OnInit, OnDestroy {
  private walletApi = inject(CustomerWalletApiService);
  private paymentApi = inject(CustomerPaymentApiService);
  private seo = inject(SeoService);
  private destroy$ = new Subject<void>();

  wallet: Wallet | null = null;
  loading = true;
  error: string | null = null;
  recharging = false;
  historyLoading = true;

  walletBalance = '0.00';
  blockedBalance = '0.00';
  totalCredit = '0.00';
  totalDebit = '0.00';

  quickAmounts = [100, 200, 500, 1000, 2000, 5000];
  selectedAmount = 0;
  customAmount: number | null = null;

  get rechargeAmount(): number {
    return this.selectedAmount || this.customAmount || 0;
  }

  activeTab = 'all';
  tabs = [
    { label: 'All', value: 'all' },
    { label: 'Credit', value: 'credit' },
    { label: 'Debit', value: 'debit' },
    { label: 'Adjustment', value: 'adjustment' },
    { label: 'Payments', value: 'payments' },
  ];

  transactions: WalletTransaction[] = [];
  paymentHistory: PaymentTransaction[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  perPage = 15;

  selectedWalletTxn: WalletTransaction | null = null;
  selectedPaymentTxn: PaymentTransaction | null = null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  ngOnInit(): void {
    this.seo.setPageTitle('My Wallet');
    this.seo.setNoIndex();
    this.loadWallet();
    this.loadHistory();
  }

  ngOnDestroy(): void {
    this.seo.clearNoIndex();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWallet(): void {
    this.loading = true;
    this.error = null;
    this.walletApi.getWallet().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.wallet = res.data;
          this.walletBalance = this.parseFloat(res.data.current_balance).toFixed(2);
          this.blockedBalance = this.parseFloat(res.data.blocked_balance).toFixed(2);
          this.totalCredit = this.parseFloat(res.data.total_credit).toFixed(2);
          this.totalDebit = this.parseFloat(res.data.total_debit).toFixed(2);
        } else {
          this.wallet = null;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to load wallet.';
      },
    });
  }

  selectRechargeAmount(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount = null;
  }

  recharge(): void {
    const amount = this.rechargeAmount;
    if (amount <= 0) return;

    this.recharging = true;

    loadRazorpayScript().then((loaded) => {
      if (!loaded) {
        this.recharging = false;
        this.showToast('Failed to load payment gateway. Please try again.', 'error');
        return;
      }

      this.paymentApi.createPaymentOrder(0, amount, 'upi').pipe(takeUntil(this.destroy$)).subscribe({
        next: async (res) => {
          if (!res.success || !res.data) {
            this.recharging = false;
            this.showToast(res.message || 'Failed to initiate recharge.', 'error');
            return;
          }

          const orderData = res.data;
          try {
            const rzpResponse = await openRazorpayCheckout({
              key: 'rzp_test_placeholder',
              amount: Math.round(amount * 100),
              currency: 'INR',
              name: 'VyaruFood & Tiffin Service',
              description: `Wallet Recharge ₹${amount.toFixed(2)}`,
              order_id: orderData.gateway_order_id,
              handler: (response: RazorpayResponse) => {
                this.verifyPayment(orderData.transaction_id, response);
              },
              prefill: {},
              theme: { color: '#059669' },
            });
          } catch (e: any) {
            this.recharging = false;
            if (e.message !== 'Payment cancelled') {
              this.showToast(e.message || 'Payment failed.', 'error');
            }
          }
        },
        error: (err) => {
          this.recharging = false;
          this.showToast(err.error?.message || 'Failed to initiate recharge.', 'error');
        },
      });
    });
  }

  private verifyPayment(transactionId: number, rzpResponse: RazorpayResponse): void {
    this.paymentApi.verifyPayment(
      transactionId,
      rzpResponse.razorpay_payment_id,
      rzpResponse.razorpay_order_id,
      rzpResponse.razorpay_signature
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.recharging = false;
        this.showToast('Wallet recharged successfully!', 'success');
        this.selectedAmount = 0;
        this.customAmount = null;
        this.loadWallet();
        this.loadHistory();
      },
      error: (err) => {
        this.recharging = false;
        this.showToast(err.error?.message || 'Payment verification failed. Please contact support.', 'error');
      },
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyLoading = true;

    if (this.activeTab === 'payments') {
      this.walletApi.getPaymentHistory({
        per_page: this.perPage,
        page: this.currentPage,
        payment_type: 'wallet_recharge',
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.historyLoading = false;
          if (res.success) {
            this.paymentHistory = res.data || [];
            this.totalPages = res.meta?.last_page || 1;
            this.totalItems = res.meta?.total || 0;
          }
        },
        error: () => { this.historyLoading = false; },
      });
    } else {
      const typeFilter = this.activeTab === 'all' ? undefined : this.activeTab;
      this.walletApi.getHistory({
        per_page: this.perPage,
        page: this.currentPage,
        transaction_type: typeFilter,
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.historyLoading = false;
          if (res.success) {
            this.transactions = res.data || [];
            this.totalPages = res.meta?.last_page || 1;
            this.totalItems = res.meta?.total || 0;
          }
        },
        error: () => { this.historyLoading = false; },
      });
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadHistory();
  }

  openTransactionDetail(txn: WalletTransaction): void {
    this.selectedWalletTxn = txn;
  }

  openPaymentDetail(txn: PaymentTransaction): void {
    this.selectedPaymentTxn = txn;
  }

  formatTransactionType(type: string): string {
    const map: Record<string, string> = {
      credit: 'Credit',
      debit: 'Debit',
      adjustment: 'Admin Adjustment',
      admin_adjustment: 'Admin Adjustment',
    };
    return map[type] || type;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatDateFull(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  parseFloat(val: any): number {
    return Number(val) || 0;
  }

  private showToast(message: string, type: 'success' | 'error' | 'info'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 5000);
  }
}
