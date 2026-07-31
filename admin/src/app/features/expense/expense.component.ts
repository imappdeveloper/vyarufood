import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ExpenseApiService } from '../../core/services/expense-api.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  Expense,
  ExpenseCategory,
  EXPENSE_STATUSES,
  PAYMENT_METHODS,
} from '../../core/models/expense/expense.model';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && expenses.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading expenses...</p>
      </div>
    </div>

    <div *ngIf="!loading || expenses.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Expense Management</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Expenses</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Track and manage business expenses, approvals, and payments</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="showCategories = !showCategories"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">category</span>
            {{ showCategories ? 'Show Expenses' : 'Categories' }}
          </button>
          <button (click)="addExpense()"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease; border: none;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Expense
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">receipt_long</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Expenses</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Paid</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.paid || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">pending_actions</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Pending Approval</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.pending_approval || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #6b7280;">account_balance_wallet</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">This Month</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ (stats?.this_month_total || 0) | number:'1.0-0' }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="showCategories" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Expense Categories</h2>
          <button (click)="addCategory()"
            style="padding: 8px 16px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 12px; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 16px;">add</span> Add Category
          </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px;">
          <div *ngFor="let cat of categories; let i = index" (click)="editCategory(cat)"
            style="border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.06)'" onmouseout="this.style.boxShadow=''">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
                [style.background]="cat.color ? cat.color + '20' : '#e0e7ff'">
                <span class="material-icons" [style.color]="cat.color || '#4F46E5'" style="font-size: 20px;">{{ cat.icon || 'category' }}</span>
              </div>
              <div style="flex: 1; min-width: 0;">
                <h3 style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ cat.category_name }}</h3>
                <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ cat.category_code }}</p>
              </div>
              <span style="display: inline-flex; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase;"
                [style.background]="cat.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                [style.color]="cat.status === 'active' ? '#047857' : '#6b7280'">
                {{ cat.status }}
              </span>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <span *ngIf="cat.is_recurring" style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: #dbeafe; color: #1d4ed8;">Recurring</span>
              <span *ngIf="cat.is_taxable" style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: #ffedd5; color: #c2410c;">Taxable</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!showCategories">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="position: relative; flex: 1; min-width: 200px;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" placeholder="Search expenses..."
                style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              <button *ngIf="searchTerm" (click)="clearSearch()"
                style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
              </button>
            </div>
            <select [(ngModel)]="filterStatus" (change)="loadExpenses()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Statuses</option>
              <option *ngFor="let s of statuses" [value]="s.value">{{ s.label }}</option>
            </select>
            <select [(ngModel)]="filterCategory" (change)="loadExpenses()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Categories</option>
              <option *ngFor="let cat of allCategories" [value]="cat.id">{{ cat.category_name }}</option>
            </select>
            <select [(ngModel)]="filterPayment" (change)="loadExpenses()"
              style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
              <option value="">All Methods</option>
              <option *ngFor="let m of paymentMethods" [value]="m.value">{{ m.label }}</option>
            </select>
          </div>
        </div>

        <div *ngIf="selectedExpenses.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
          <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedExpenses.size }} selected</span>
          <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
          <button (click)="clearSelection()"
            style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; color: #9ca3af;"
            onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px;">close</span>
          </button>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div *ngIf="loading && expenses.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
            <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>

          <div *ngIf="!loading && expenses.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No expenses found</h3>
            <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
              <span *ngIf="searchTerm || filterStatus || filterCategory || filterPayment">Try adjusting your search or filter criteria</span>
              <span *ngIf="!searchTerm && !filterStatus && !filterCategory && !filterPayment">Get started by creating your first expense</span>
            </p>
            <button *ngIf="!searchTerm && !filterStatus && !filterCategory && !filterPayment" (click)="addExpense()"
              style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
              onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
              <span class="material-icons" style="font-size: 18px;">add</span> Add Expense
            </button>
            <button *ngIf="searchTerm || filterStatus || filterCategory || filterPayment" (click)="clearFilters()"
              style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
          </div>

          <div *ngIf="!loading && expenses.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 8px 10px 16px; text-align: left; width: 44px;">
                    <input type="checkbox" (change)="toggleAllRows($event)"
                      [checked]="isAllSelected()"
                      style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                  </th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px;">Expense #</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 180px;">Title</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Payment</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Payment Status</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of expenses; let i = index" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=this.getAttribute('data-bg') || ''">
                  <td [attr.data-bg]="i % 2 === 0 ? 'transparent' : '#f9fafb'" style="padding: 12px 8px 12px 16px;">
                    <input type="checkbox" (click)="$event.stopPropagation()" (change)="toggleRow(row)"
                      [checked]="selectedExpenses.has(row)" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                  </td>
                  <td style="padding: 12px 12px;">
                    <a [routerLink]="['/admin/expenses', row.uuid]" style="font-size: 13px; font-weight: 700; color: #059669; text-decoration: none; transition: color 0.15s ease;"
                      onmouseover="this.style.color='#047857';this.style.textDecoration='underline'" onmouseout="this.style.color='#059669';this.style.textDecoration='none'">
                      {{ row.expense_number }}
                    </a>
                  </td>
                  <td style="padding: 12px 12px;">
                    <div>
                      <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">{{ row.expense_title }}</p>
                      <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ row.category_name }}</p>
                    </div>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #6b7280;">{{ row.expense_date | date:'dd MMM yyyy' }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.total_amount | currency:'INR':'symbol':'1.0-0' }}</span>
                    <p *ngIf="row.tax_amount > 0" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">incl. {{ row.tax_amount | currency:'INR':'symbol':'1.0-0' }} tax</p>
                  </td>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; color: #6b7280; text-transform: capitalize;">{{ row.payment_method | titlecase }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="row.approval_status === 'approved' ? '#d1fae5' : row.approval_status === 'pending_approval' ? '#fef3c7' : row.approval_status === 'rejected' ? '#fee2e2' : '#f3f4f6'"
                      [style.color]="row.approval_status === 'approved' ? '#047857' : row.approval_status === 'pending_approval' ? '#b45309' : row.approval_status === 'rejected' ? '#dc2626' : '#6b7280'">
                      {{ row.approval_status | titlecase }}
                    </span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="row.expense_status === 'paid' ? '#d1fae5' : row.expense_status === 'approved' ? '#dbeafe' : row.expense_status === 'rejected' ? '#fee2e2' : row.expense_status === 'cancelled' ? '#f3f4f6' : '#fef3c7'"
                      [style.color]="row.expense_status === 'paid' ? '#047857' : row.expense_status === 'approved' ? '#1d4ed8' : row.expense_status === 'rejected' ? '#dc2626' : row.expense_status === 'cancelled' ? '#6b7280' : '#b45309'">
                      {{ row.expense_status | titlecase }}
                    </span>
                  </td>
                  <td style="padding: 12px 16px 12px 12px; text-align: center;">
                    <div style="position: relative;">
                      <button (click)="toggleActionMenu(row); $event.stopPropagation()"
                        style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.15s ease; line-height: 0;"
                        onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">more_vert</span>
                      </button>
                      <div *ngIf="activeActionRow?.uuid === row.uuid" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 180px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;"
                        (click)="$event.stopPropagation()">
                        <a [routerLink]="['/admin/expenses', row.uuid]"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease; text-decoration: none; box-sizing: border-box;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''"
                          (click)="toggleActionMenu(null)">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View
                        </a>
                        <a [routerLink]="['/admin/expenses', row.uuid, 'edit']"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease; text-decoration: none; box-sizing: border-box;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''"
                          (click)="toggleActionMenu(null)">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </a>
                        <button *ngIf="row.approval_status === 'pending_approval'" (click)="approveExpense(row); toggleActionMenu(null);"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Approve
                        </button>
                        <button *ngIf="row.approval_status === 'pending_approval'" (click)="rejectExpense(row); toggleActionMenu(null);"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #dc2626;">cancel</span> Reject
                        </button>
                        <button *ngIf="row.approval_status === 'approved' && row.expense_status !== 'paid'" (click)="markPaid(row); toggleActionMenu(null);"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #2563eb;">payment</span> Mark Paid
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteExpense(row); toggleActionMenu(null);"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">delete</span> Delete
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
                <select (change)="onPerPageChange($event)"
                  style="padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;"
                  onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                  <option value="10">10 / page</option>
                  <option value="15" [selected]="pageSize === 15">15 / page</option>
                  <option value="25">25 / page</option>
                  <option value="50">50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    </style>
  `,
})
export class ExpenseComponent implements OnInit {
  private expenseApi = inject(ExpenseApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  expenses: Expense[] = [];
  categories: ExpenseCategory[] = [];
  allCategories: ExpenseCategory[] = [];
  stats: any = {};
  loading = false;
  showCategories = false;
  searchTerm = '';
  filterStatus = '';
  filterCategory = '';
  filterPayment = '';
  currentPage = 1;
  pageSize = 15;
  totalItems = 0;

  selectedExpenses = new Set<Expense>();
  activeActionRow: Expense | null = null;

  statuses = EXPENSE_STATUSES;
  paymentMethods = PAYMENT_METHODS;
  displayedColumns = ['expense_number', 'expense_title', 'expense_date', 'total_amount', 'payment_method', 'approval_status', 'expense_status', 'actions'];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 1;
      this.loadExpenses();
    });
    this.loadExpenses();
    this.loadStats();
    this.loadCategories();
  }

  loadExpenses(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchTerm) params['search'] = this.searchTerm;
    if (this.filterStatus) params['status'] = this.filterStatus;
    if (this.filterCategory) params['category_id'] = this.filterCategory;
    if (this.filterPayment) params['payment_method'] = this.filterPayment;
    this.expenseApi.getExpenses(params).subscribe({
      next: (res) => {
        this.expenses = res.data!;
        this.totalItems = res.meta?.total || 0;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  loadStats(): void {
    this.expenseApi.getStats().subscribe({
      next: (res) => { this.stats = res.data!; },
    });
  }

  loadCategories(): void {
    const params: Record<string, string> = { per_page: '100' };
    this.expenseApi.getCategories(params).subscribe({
      next: (res) => {
        this.categories = res.data!;
        this.allCategories = res.data!;
      },
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadExpenses();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterCategory = '';
    this.filterPayment = '';
    this.currentPage = 1;
    this.loadExpenses();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadExpenses();
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadExpenses();
  }

  getRangeLabel(): string {
    if (this.totalItems === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}\u2013${end} of ${this.totalItems}`;
  }

  isAllSelected(): boolean {
    return this.expenses.length > 0 && this.selectedExpenses.size === this.expenses.length;
  }

  toggleAllRows(event: any): void {
    if (event.target.checked) {
      this.expenses.forEach(e => this.selectedExpenses.add(e));
    } else {
      this.selectedExpenses.clear();
    }
    this.activeActionRow = null;
  }

  toggleRow(row: Expense): void {
    if (this.selectedExpenses.has(row)) {
      this.selectedExpenses.delete(row);
    } else {
      this.selectedExpenses.add(row);
    }
    this.activeActionRow = null;
  }

  clearSelection(): void {
    this.selectedExpenses.clear();
  }

  toggleActionMenu(row: Expense | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  addExpense(): void {
    this.router.navigate(['/admin/expenses/create']);
  }

  addCategory(): void {
    this.router.navigate(['/admin/expenses/categories/create']);
  }

  editCategory(cat: ExpenseCategory): void {
    this.router.navigate(['/admin/expenses/categories', cat.uuid, 'edit']);
  }

  approveExpense(expense: Expense): void {
    this.expenseApi.approveExpense(expense.uuid).subscribe({
      next: () => {
        this.notification.success('Expense approved successfully');
        this.loadExpenses();
        this.loadStats();
      },
    });
  }

  rejectExpense(expense: Expense): void {
    this.expenseApi.rejectExpense(expense.uuid).subscribe({
      next: () => {
        this.notification.success('Expense rejected');
        this.loadExpenses();
        this.loadStats();
      },
    });
  }

  markPaid(expense: Expense): void {
    this.expenseApi.markPaid(expense.uuid).subscribe({
      next: () => {
        this.notification.success('Expense marked as paid');
        this.loadExpenses();
        this.loadStats();
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'pending_approval': return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-600';
      default: return 'bg-amber-100 text-amber-700';
    }
  }

  deleteExpense(expense: Expense): void {
    if (confirm(`Are you sure you want to delete ${expense.expense_number}?`)) {
      this.expenseApi.deleteExpense(expense.uuid).subscribe({
        next: () => {
          this.notification.success('Expense deleted successfully');
          this.loadExpenses();
          this.loadStats();
        },
      });
    }
  }
}
