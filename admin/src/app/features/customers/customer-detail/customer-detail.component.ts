import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerApiService } from '../../../core/services/customer-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Customer } from '../../../core/models/customer/customer.model';
import { WalletTransaction } from '../../../core/models/payment/payment.model';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading customer details...</p>
      </div>
    </div>

    <div *ngIf="!loading && customer" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/customers" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Customers
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ customer.full_name }}</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBg(customer.status)" [style.color]="getStatusColor(customer.status)">
                <span *ngIf="customer.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                {{ customer.status_label }}
              </span>
              <span *ngIf="customer.is_blocked" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; color: white;">
                <span class="material-icons" style="font-size: 12px; vertical-align: middle;">block</span> Blocked
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ customer.email }} &bull; {{ customer.country_code }} {{ customer.phone }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button *ngIf="customer.is_blocked" (click)="unblockCustomer()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">check_circle</span> Unblock
            </button>
            <button *ngIf="!customer.is_blocked" (click)="blockCustomer()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">block</span> Block
            </button>
            <button (click)="toggleStatus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">{{ customer.status === 'active' ? 'pause' : 'play_arrow' }}</span>
              {{ customer.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <a [routerLink]="['/admin/customers', customer.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteCustomer()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">delete</span> Delete
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">person</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Personal Information</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">First Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.first_name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Last Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.last_name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Email</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.email }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Phone</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.country_code }} {{ customer.phone }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Gender</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ customer.gender || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Date of Birth</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.date_of_birth || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Email Verified</p>
                  <span style="display: inline-flex; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;"
                    [style.background]="customer.email_verified ? '#d1fae5' : '#f3f4f6'"
                    [style.color]="customer.email_verified ? '#047857' : '#6b7280'">
                    {{ customer.email_verified ? 'Verified' : 'Not Verified' }}
                  </span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Phone Verified</p>
                  <span style="display: inline-flex; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;"
                    [style.background]="customer.phone_verified ? '#d1fae5' : '#f3f4f6'"
                    [style.color]="customer.phone_verified ? '#047857' : '#6b7280'">
                    {{ customer.phone_verified ? 'Verified' : 'Not Verified' }}
                  </span>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #0d9488;">location_on</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Address</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Address</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.address_line_1 || '-' }}{{ customer.address_line_2 ? ', ' + customer.address_line_2 : '' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">City</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.city?.name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">State</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.state?.name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Country</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.country?.name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Pincode</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ customer.pincode || '-' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="material-icons" style="font-size: 18px; color: #059669;">receipt_long</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Wallet Transactions</h2>
                </div>
                <button (click)="loadTransactions()" style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #059669; display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600;"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 16px;">refresh</span> Refresh
                </button>
              </div>

              <div *ngIf="transactionsLoading" style="display: flex; align-items: center; justify-content: center; padding: 24px;">
                <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              </div>

              <div *ngIf="!transactionsLoading && transactions.length === 0" style="text-align: center; padding: 24px;">
                <span class="material-icons" style="font-size: 36px; color: #e5e7eb; margin-bottom: 8px;">receipt_long</span>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">No transactions yet</p>
              </div>

              <div *ngIf="!transactionsLoading && transactions.length > 0" style="display: flex; flex-direction: column; gap: 0;">
                <div *ngFor="let txn of displayedTransactions; let i = index" style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; transition: background 0.15s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                    <div style="min-width: 0;">
                      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span style="font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px;"
                          [style.background]="txn.transaction_type === 'credit' ? '#d1fae5' : '#fee2e2'"
                          [style.color]="txn.transaction_type === 'credit' ? '#047857' : '#dc2626'">
                          {{ txn.transaction_type_label }}
                        </span>
                        <span style="font-size: 11px; font-weight: 600; color: #6b7280;">{{ txn.reference_type_label || txn.reference_type }}</span>
                      </div>
                      <p style="font-size: 12px; color: #374151; margin: 4px 0 0 0; word-wrap: break-word;">{{ txn.remarks || '-' }}</p>
                      <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                        <span style="font-size: 10px; color: #9ca3af;">
                          <span class="material-icons" style="font-size: 10px; vertical-align: middle;">person</span>
                          {{ txn.performed_by?.name || 'Customer' }}
                        </span>
                        <span style="font-size: 10px; color: #9ca3af;">{{ txn.created_at | date:'MMM d, h:mm a' }}</span>
                      </div>
                    </div>
                    <div style="text-align: right; flex-shrink: 0;">
                      <p style="font-size: 15px; font-weight: 800; margin: 0;"
                        [style.color]="txn.transaction_type === 'credit' ? '#047857' : '#dc2626'">
                        {{ txn.transaction_type === 'credit' ? '+' : '-' }}&#8377;{{ txn.amount | number:'1.2-2' }}
                      </p>
                      <p style="font-size: 10px; color: #9ca3af; margin: 2px 0 0 0;">Bal: &#8377;{{ txn.closing_balance | number:'1.2-2' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="!transactionsLoading && transactionsTotalPages > 1" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding-top: 12px;">
                <button (click)="prevPage()" [disabled]="transactionsPage <= 1"
                  style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151;"
                  [style.opacity]="transactionsPage <= 1 ? '0.4' : '1'"
                  [style.cursor]="transactionsPage <= 1 ? 'not-allowed' : 'pointer'">
                  <span class="material-icons" style="font-size: 14px;">chevron_left</span>
                </button>
                <span style="font-size: 12px; color: #6b7280;">Page {{ transactionsPage }} of {{ transactionsTotalPages }}</span>
                <button (click)="nextPage()" [disabled]="transactionsPage >= transactionsTotalPages"
                  style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151;"
                  [style.opacity]="transactionsPage >= transactionsTotalPages ? '0.4' : '1'"
                  [style.cursor]="transactionsPage >= transactionsTotalPages ? 'not-allowed' : 'pointer'">
                  <span class="material-icons" style="font-size: 14px;">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">wallet</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Wallet</h2>
              </div>
              <div style="text-align: center; padding: 12px 0;">
                <p style="font-size: 28px; font-weight: 800; color: #166534; margin: 0;">&#8377;{{ customer.wallet_balance | number:'1.2-2' }}</p>
                <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0 0;">{{ customer.wallet_currency }} balance</p>
              </div>
              <button (click)="showRechargeOverlay = true"
                style="width: 100%; margin-top: 12px; padding: 10px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
                onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
                <span class="material-icons" style="font-size: 18px;">account_balance_wallet</span> Manage Wallet
              </button>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #d97706;">link</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Referral</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Referral Code</p>
                  <span *ngIf="customer.referral_code" style="display: inline-block; padding: 3px 10px; background: #d1fae5; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: monospace; color: #047857;">{{ customer.referral_code }}</span>
                  <span *ngIf="!customer.referral_code" style="font-size: 13px; color: #9ca3af;">-</span>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Referred By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.referrer?.full_name || 'None (Direct)' }}</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Referrals Made</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.referralsCount || 0 }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">schedule</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Metadata</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Status</p>
                  <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(customer.status)" [style.color]="getStatusColor(customer.status)">
                    <span *ngIf="customer.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ customer.status_label }}
                  </span>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Last Login</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.last_login_at ? (customer.last_login_at | date:'MMM d, y, h:mm a') : 'Never' }}</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Registered</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ customer.created_at | date:'MMM d, y, h:mm a' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a [routerLink]="['/admin/customers', customer.uuid, 'edit']"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Customer
                </a>
                <button (click)="toggleStatus()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;" [style.color]="customer.status === 'active' ? '#dc2626' : '#059669'">{{ customer.status === 'active' ? 'pause' : 'play_arrow' }}</span>
                  {{ customer.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
                <button *ngIf="!customer.is_blocked" (click)="blockCustomer()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#fecaca'; this.style.background='#fef2f2'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #dc2626;">block</span> Block Customer
                </button>
                <button *ngIf="customer.is_blocked" (click)="unblockCustomer()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span> Unblock Customer
                </button>
                <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button (click)="deleteCustomer()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete Customer
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>

    <div *ngIf="showRechargeOverlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease-out;">
      <div style="background: white; border-radius: 16px; padding: 28px; width: 440px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">account_balance_wallet</span>
            </div>
            <div>
              <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Manage Wallet</h3>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Current balance: &#8377;{{ customer!.wallet_balance | number:'1.2-2' }}</p>
            </div>
          </div>
          <button (click)="closeRechargeOverlay()" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px; line-height: 0;"
            onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 22px; color: #9ca3af;">close</span>
          </button>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
          <button (click)="walletActionType = 'credit'"
            style="flex: 1; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; border: 2px solid; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 6px;"
            [style.background]="walletActionType === 'credit' ? '#d1fae5' : 'white'"
            [style.borderColor]="walletActionType === 'credit' ? '#059669' : '#e5e7eb'"
            [style.color]="walletActionType === 'credit' ? '#047857' : '#6b7280'">
            <span class="material-icons" style="font-size: 18px;">add_circle</span> Credit
          </button>
          <button (click)="walletActionType = 'debit'"
            style="flex: 1; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; border: 2px solid; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 6px;"
            [style.background]="walletActionType === 'debit' ? '#fee2e2' : 'white'"
            [style.borderColor]="walletActionType === 'debit' ? '#dc2626' : '#e5e7eb'"
            [style.color]="walletActionType === 'debit' ? '#dc2626' : '#6b7280'">
            <span class="material-icons" style="font-size: 18px;">remove_circle</span> Debit
          </button>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Amount <span style="color: #dc2626;">*</span></label>
          <div style="position: relative;">
            <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; font-weight: 700; color: #9ca3af;">&#8377;</span>
            <input type="number" [(ngModel)]="rechargeAmount" placeholder="0.00" step="0.01" min="1"
              style="width: 100%; padding: 12px 14px 12px 36px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 18px; font-weight: 700; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: inherit;"
              [style.borderColor]="rechargeAmount && rechargeAmount <= 0 ? '#dc2626' : '#e5e7eb'"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          </div>
          <p *ngIf="rechargeAmount && rechargeAmount <= 0" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Amount must be greater than 0</p>
        </div>

        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks <span style="color: #9ca3af;">(optional)</span></label>
          <input type="text" [(ngModel)]="rechargeRemarks" placeholder="e.g. Bonus credit, promo adjustment"
            style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button (click)="closeRechargeOverlay()"
            style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</button>
          <button (click)="adjustWallet()" [disabled]="recharging || !rechargeAmount || rechargeAmount <= 0"
            style="padding: 10px 28px; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); font-weight: 700;"
            [style.background]="walletActionType === 'debit' ? '#dc2626' : '#059669'"
            [style.color]="'white'"
            [style.opacity]="recharging || !rechargeAmount || rechargeAmount <= 0 ? '0.5' : '1'"
            [style.cursor]="recharging || !rechargeAmount || rechargeAmount <= 0 ? 'not-allowed' : 'pointer'"
            onmouseover="if(!this.disabled){this.style.background=walletActionType === 'debit' ? '#b91c1c' : '#047857';this.style.transform='translateY(-1px)'}" onmouseout="if(!this.disabled){this.style.transform=''}">
            <span *ngIf="recharging" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
            <span *ngIf="!recharging">{{ walletActionType === 'debit' ? 'Deduct' : 'Add' }} &#8377;{{ rechargeAmount || 0 | number:'1.2-2' }}</span>
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
export class CustomerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerApi = inject(CustomerApiService);
  private notification = inject(NotificationService);

  customer: Customer | null = null;
  loading = true;
  showRechargeOverlay = false;
  walletActionType: 'credit' | 'debit' = 'credit';
  rechargeAmount: number | null = null;
  rechargeRemarks = '';
  recharging = false;

  transactions: WalletTransaction[] = [];
  transactionsLoading = false;
  transactionsPage = 1;
  transactionsPerPage = 5;
  transactionsTotal = 0;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadCustomer(uuid); } else { this.router.navigate(['/admin/customers']); }
  }

  loadCustomer(uuid: string): void {
    this.loading = true;
    this.customerApi.getById(uuid).subscribe({
      next: (res) => {
        if (res.data) { this.customer = res.data; } else { this.router.navigate(['/admin/customers']); }
        this.loading = false;
        this.loadTransactions();
      },
      error: () => { this.loading = false; this.notification.error('Failed to load customer'); this.router.navigate(['/admin/customers']); },
    });
  }

  get displayedTransactions(): WalletTransaction[] {
    const start = (this.transactionsPage - 1) * this.transactionsPerPage;
    return this.transactions.slice(start, start + this.transactionsPerPage);
  }

  get transactionsTotalPages(): number {
    return Math.max(1, Math.ceil(this.transactionsTotal / this.transactionsPerPage));
  }

  closeRechargeOverlay(): void {
    this.showRechargeOverlay = false;
    this.walletActionType = 'credit';
    this.rechargeAmount = null;
    this.rechargeRemarks = '';
  }

  adjustWallet(): void {
    if (!this.customer || !this.rechargeAmount || this.rechargeAmount <= 0) return;
    this.recharging = true;
    const amount = this.walletActionType === 'debit' ? -this.rechargeAmount : this.rechargeAmount;
    this.customerApi.adjustWallet(this.customer.uuid, amount, this.rechargeRemarks || undefined).subscribe({
      next: (res) => {
        if (res.data?.customer) {
          this.customer = res.data.customer;
        } else {
          this.loadCustomer(this.customer!.uuid);
        }
        this.closeRechargeOverlay();
        this.recharging = false;
        this.notification.success(`Wallet ${this.walletActionType === 'debit' ? 'debited' : 'credited'} successfully`);
        this.loadTransactions();
      },
      error: (err) => {
        this.recharging = false;
        this.notification.error(err.error?.message || 'Failed to update wallet');
      },
    });
  }

  loadTransactions(): void {
    if (!this.customer) return;
    this.transactionsLoading = true;
    this.customerApi.getWalletTransactions(this.customer.uuid).subscribe({
      next: (res) => {
        this.transactions = res.data || [];
        this.transactionsTotal = res.meta?.total || this.transactions.length;
        this.transactionsPage = 1;
        this.transactionsLoading = false;
      },
      error: () => {
        this.transactionsLoading = false;
      },
    });
  }

  prevPage(): void {
    if (this.transactionsPage > 1) this.transactionsPage--;
  }

  nextPage(): void {
    if (this.transactionsPage < this.transactionsTotalPages) this.transactionsPage++;
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#f3f4f6';
      case 'suspended': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'inactive': return '#6b7280';
      case 'suspended': return '#dc2626';
      default: return '#6b7280';
    }
  }

  toggleStatus(): void {
    if (!this.customer) return;
    const newStatus = this.customer.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${this.customer.full_name}"?`)) {
      this.customerApi.setStatus(this.customer.uuid, newStatus).subscribe({
        next: (res) => {
          this.customer = res.data ?? null;
          this.notification.success(`Customer ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  blockCustomer(): void {
    if (!this.customer) return;
    const reason = window.prompt(`Block "${this.customer.full_name}"? Enter reason (optional):`);
    if (reason !== null) {
      this.customerApi.block(this.customer.uuid, reason || undefined).subscribe({
        next: (res) => { this.customer = res.data ?? null; this.notification.success('Customer blocked'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  unblockCustomer(): void {
    if (!this.customer) return;
    if (window.confirm(`Unblock "${this.customer.full_name}"?`)) {
      this.customerApi.unblock(this.customer.uuid).subscribe({
        next: (res) => { this.customer = res.data ?? null; this.notification.success('Customer unblocked'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteCustomer(): void {
    if (!this.customer) return;
    if (window.confirm(`Delete "${this.customer.full_name}"? This action cannot be undone.`)) {
      this.customerApi.delete(this.customer.uuid).subscribe({
        next: () => { this.notification.success('Customer deleted'); this.router.navigate(['/admin/customers']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
