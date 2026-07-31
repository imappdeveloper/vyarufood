import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExpenseApiService } from '../../../core/services/expense-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Expense } from '../../../core/models/expense/expense.model';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading expense details...</p>
      </div>
    </div>

    <div *ngIf="!loading && expense" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/expenses" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Expenses
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ expense.expense_title }}</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="expense.approval_status === 'approved' ? '#d1fae5' : expense.approval_status === 'pending_approval' ? '#fef3c7' : expense.approval_status === 'rejected' ? '#fee2e2' : '#f3f4f6'"
                [style.color]="expense.approval_status === 'approved' ? '#047857' : expense.approval_status === 'pending_approval' ? '#b45309' : expense.approval_status === 'rejected' ? '#dc2626' : '#6b7280'">
                <span *ngIf="expense.approval_status === 'approved'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                {{ expense.approval_status | titlecase }}
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="expense.expense_status === 'paid' ? '#d1fae5' : expense.expense_status === 'approved' ? '#dbeafe' : expense.expense_status === 'rejected' ? '#fee2e2' : expense.expense_status === 'cancelled' ? '#f3f4f6' : '#fef3c7'"
                [style.color]="expense.expense_status === 'paid' ? '#047857' : expense.expense_status === 'approved' ? '#1d4ed8' : expense.expense_status === 'rejected' ? '#dc2626' : expense.expense_status === 'cancelled' ? '#6b7280' : '#b45309'">
                {{ expense.expense_status | titlecase }}
              </span>
              <span *ngIf="expense.is_recurring" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.2); color: white;">
                <span class="material-icons" style="font-size: 12px;">loop</span> Recurring
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ expense.expense_number }} &bull; {{ expense.category_name }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button *ngIf="expense.approval_status === 'pending_approval'" (click)="approve()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.2); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.3); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">check_circle</span> Approve
            </button>
            <button *ngIf="expense.approval_status === 'pending_approval'" (click)="reject()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">cancel</span> Reject
            </button>
            <button *ngIf="expense.approval_status === 'approved' && expense.expense_status !== 'paid'" (click)="markPaid()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.2); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.3); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">payment</span> Mark Paid
            </button>
            <a [routerLink]="['/admin/expenses', expense.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteExpense()"
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
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; text-align: center;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Amount</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ expense.amount | currency:'INR':'symbol':'1.0-0' }}</p>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; text-align: center;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Tax</p>
            <p style="font-size: 22px; font-weight: 800; color: #d97706; margin: 0;">{{ expense.tax_amount | currency:'INR':'symbol':'1.0-0' }}</p>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; text-align: center;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Discount</p>
            <p style="font-size: 22px; font-weight: 800; color: #047857; margin: 0;">-{{ expense.discount_amount | currency:'INR':'symbol':'1.0-0' }}</p>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; text-align: center;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Total</p>
            <p style="font-size: 22px; font-weight: 800; color: #059669; margin: 0;">{{ expense.total_amount | currency:'INR':'symbol':'1.0-0' }}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; gap: 8px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 6px; margin-bottom: 4px;">
              <button (click)="activeTab = 'details'"
                style="flex: 1; padding: 10px 16px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; text-align: center;"
                [style.background]="activeTab === 'details' ? '#059669' : 'transparent'"
                [style.color]="activeTab === 'details' ? 'white' : '#374151'"
                onmouseover="if(this.activeTab !== 'details'){this.style.background='#f0fdf4'}" onmouseout="if(this.activeTab !== 'details'){this.style.background='transparent'}">Details</button>
              <button (click)="activeTab = 'timeline'"
                style="flex: 1; padding: 10px 16px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; text-align: center;"
                [style.background]="activeTab === 'timeline' ? '#059669' : 'transparent'"
                [style.color]="activeTab === 'timeline' ? 'white' : '#374151'"
                onmouseover="if(this.activeTab !== 'timeline'){this.style.background='#f0fdf4'}" onmouseout="if(this.activeTab !== 'timeline'){this.style.background='transparent'}">Timeline</button>
            </div>

            <div *ngIf="activeTab === 'details'" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">receipt_long</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Expense Details</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Expense Number</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ expense.expense_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Category</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.category_name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.expense_date | date:'dd MMMM yyyy' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Vendor / Supplier</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.vendor_name || expense.supplier_name || 'N/A' }}</p>
                </div>
                <div *ngIf="expense.expense_description" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Description</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.expense_description }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Payment Method</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ expense.payment_method | titlecase }}</p>
                </div>
                <div *ngIf="expense.payment_account">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Payment Account</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.payment_account }}</p>
                </div>
                <div *ngIf="expense.invoice_number">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Invoice Number</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.invoice_number }}</p>
                </div>
                <div *ngIf="expense.invoice_date">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Invoice Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.invoice_date | date:'dd MMM yyyy' }}</p>
                </div>
                <div *ngIf="expense.transaction_reference" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Transaction Reference</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.transaction_reference }}</p>
                </div>
                <div *ngIf="expense.next_due_date">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Next Due Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.next_due_date | date:'dd MMM yyyy' }}</p>
                </div>
                <div *ngIf="expense.remarks" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Remarks</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.remarks }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created By</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.created_by_name || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div *ngIf="activeTab === 'timeline'" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">timeline</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Timeline</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span class="material-icons" style="font-size: 16px; color: #047857;">add_circle</span>
                  </div>
                  <div>
                    <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">Created</p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">{{ expense.created_at | date:'dd MMM yyyy, HH:mm' }}</p>
                  </div>
                </div>
                <div *ngIf="expense.approved_at" style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span class="material-icons" style="font-size: 16px; color: #047857;">check_circle</span>
                  </div>
                  <div>
                    <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">Approved</p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">{{ expense.approved_at | date:'dd MMM yyyy, HH:mm' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Payment Info</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Amount</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.amount | currency:'INR':'symbol':'1.0-0' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Tax</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.tax_amount | currency:'INR':'symbol':'1.0-0' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Discount</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.discount_amount | currency:'INR':'symbol':'1.0-0' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Total</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.total_amount | currency:'INR':'symbol':'1.0-0' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Payment Method</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ expense.payment_method | titlecase }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Status</p>
                  <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="expense.expense_status === 'paid' ? '#d1fae5' : expense.expense_status === 'approved' ? '#dbeafe' : expense.expense_status === 'rejected' ? '#fee2e2' : expense.expense_status === 'cancelled' ? '#f3f4f6' : '#fef3c7'"
                    [style.color]="expense.expense_status === 'paid' ? '#047857' : expense.expense_status === 'approved' ? '#1d4ed8' : expense.expense_status === 'rejected' ? '#dc2626' : expense.expense_status === 'cancelled' ? '#6b7280' : '#b45309'">
                    <span *ngIf="expense.expense_status === 'paid'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ expense.expense_status | titlecase }}
                  </span>
                </div>
                <div style="padding: 10px 0 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Recurring</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ expense.is_recurring ? (expense.recurring_frequency | titlecase) : 'No' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a [routerLink]="['/admin/expenses', expense.uuid, 'edit']"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Expense
                </a>
                <button *ngIf="expense.approval_status === 'pending_approval'" (click)="approve()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Approve
                </button>
                <button *ngIf="expense.approval_status === 'pending_approval'" (click)="reject()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#fecaca'; this.style.background='#fef2f2'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #dc2626;">cancel</span> Reject
                </button>
                <button *ngIf="expense.approval_status === 'approved' && expense.expense_status !== 'paid'" (click)="markPaid()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #2563eb;">payment</span> Mark Paid
                </button>
                <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button (click)="deleteExpense()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete Expense
                </button>
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
export class ExpenseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private expenseApi = inject(ExpenseApiService);
  private notification = inject(NotificationService);

  expense: Expense | null = null;
  loading = true;
  activeTab: 'details' | 'timeline' = 'details';

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadExpense(uuid);
    }
  }

  loadExpense(uuid: string): void {
    this.loading = true;
    this.expenseApi.getExpense(uuid).subscribe({
      next: (res) => {
        this.expense = res.data ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load expense');
      },
    });
  }

  approve(): void {
    if (!this.expense) return;
    this.expenseApi.approveExpense(this.expense.uuid).subscribe({
      next: () => {
        this.notification.success('Expense approved');
        this.loadExpense(this.expense!.uuid);
      },
    });
  }

  reject(): void {
    if (!this.expense) return;
    this.expenseApi.rejectExpense(this.expense.uuid).subscribe({
      next: () => {
        this.notification.success('Expense rejected');
        this.loadExpense(this.expense!.uuid);
      },
    });
  }

  markPaid(): void {
    if (!this.expense) return;
    this.expenseApi.markPaid(this.expense.uuid).subscribe({
      next: () => {
        this.notification.success('Expense marked as paid');
        this.loadExpense(this.expense!.uuid);
      },
    });
  }

  deleteExpense(): void {
    if (!this.expense) return;
    if (confirm(`Are you sure you want to delete ${this.expense.expense_number}?`)) {
      this.expenseApi.deleteExpense(this.expense.uuid).subscribe({
        next: () => {
          this.notification.success('Expense deleted');
          this.router.navigate(['/admin/expenses']);
        },
      });
    }
  }
}
