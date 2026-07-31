import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseApiService } from '../../../core/services/expense-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ExpenseCategory, PAYMENT_METHODS, RECURRING_FREQUENCIES } from '../../../core/models/expense/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/expenses" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Expenses
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEdit">Edit Expense</span>
          <span *ngIf="!isEdit">Create Expense</span>
        </h1>
        <p *ngIf="!isEdit" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to create a new expense</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 80px 24px;">
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af;">Loading expense...</p>
        </div>
      </div>

      <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">receipt_long</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Title, category, date, and vendor</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Expense Title <span style="color: #dc2626;">*</span></label>
              <input formControlName="expense_title" placeholder="e.g. Monthly Kitchen Rent"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('expense_title')?.invalid && form.get('expense_title')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('expense_title')?.invalid && form.get('expense_title')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Title is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Category <span style="color: #dc2626;">*</span></label>
              <select formControlName="expense_category_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('expense_category_id')?.invalid && form.get('expense_category_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null" disabled>Select category</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.category_name }}</option>
              </select>
              <p *ngIf="form.get('expense_category_id')?.invalid && form.get('expense_category_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Category is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Expense Date <span style="color: #dc2626;">*</span></label>
              <input type="date" formControlName="expense_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('expense_date')?.invalid && form.get('expense_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('expense_date')?.invalid && form.get('expense_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Vendor / Supplier Name</label>
              <input formControlName="vendor_name" placeholder="e.g. ABC Suppliers"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Description</label>
              <textarea formControlName="expense_description" rows="3" placeholder="Detailed description of the expense..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">payments</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Amount & Payment</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Amount, tax, discount, and payment details</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Amount (₹) <span style="color: #dc2626;">*</span></label>
              <input type="number" formControlName="amount" placeholder="0.00" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('amount')?.invalid && form.get('amount')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('amount')?.invalid && form.get('amount')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Amount is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Tax Amount (₹)</label>
              <input type="number" formControlName="tax_amount" placeholder="0.00" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Discount Amount (₹)</label>
              <input type="number" formControlName="discount_amount" placeholder="0.00" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Payment Method <span style="color: #dc2626;">*</span></label>
              <select formControlName="payment_method"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let m of paymentMethods" [value]="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Payment Account</label>
              <input formControlName="payment_account" placeholder="e.g. SBI Main Account"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Transaction Reference</label>
              <input formControlName="transaction_reference" placeholder="e.g. UPI Ref #12345"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Invoice Number</label>
              <input formControlName="invoice_number" placeholder="e.g. INV-001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Invoice Date</label>
              <input type="date" formControlName="invoice_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">settings</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Additional Options</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Recurring settings and remarks</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; padding-top: 4px;">
              <input type="checkbox" formControlName="is_recurring" id="is_recurring"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="is_recurring" style="font-size: 13px; color: #374151;">Recurring Expense</label>
            </div>

            <div *ngIf="form.get('is_recurring')?.value">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Recurring Frequency</label>
              <select formControlName="recurring_frequency"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let f of frequencies" [value]="f.value">{{ f.label }}</option>
              </select>
            </div>

            <div *ngIf="form.get('is_recurring')?.value">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Next Due Date</label>
              <input type="date" formControlName="next_due_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>

            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="2" placeholder="Any additional notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEdit">Changes will be saved immediately</span>
            <span *ngIf="!isEdit">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/expenses"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="form.invalid || saving ? '0.5' : '1'"
              [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEdit">Update Expense</span>
              <span *ngIf="!isEdit">Create Expense</span>
            </button>
          </div>
        </div>
      </form>
    </section>

    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class ExpenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private expenseApi = inject(ExpenseApiService);
  private notification = inject(NotificationService);

  form!: FormGroup;
  categories: ExpenseCategory[] = [];
  isEdit = false;
  loading = false;
  saving = false;
  expenseUuid = '';

  paymentMethods = PAYMENT_METHODS;
  frequencies = RECURRING_FREQUENCIES;

  ngOnInit(): void {
    this.form = this.fb.group({
      expense_title: ['', Validators.required],
      expense_category_id: [null, Validators.required],
      expense_date: [this.formatDate(new Date()), Validators.required],
      expense_description: [''],
      vendor_name: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      tax_amount: [0],
      discount_amount: [0],
      payment_method: ['cash', Validators.required],
      payment_account: [''],
      transaction_reference: [''],
      invoice_number: [''],
      invoice_date: [null],
      is_recurring: [false],
      recurring_frequency: [null],
      next_due_date: [null],
      remarks: [''],
    });

    this.loadCategories();

    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid && this.router.url.includes('/edit')) {
      this.isEdit = true;
      this.expenseUuid = uuid;
      this.loadExpense(uuid);
    }
  }

  loadCategories(): void {
    this.expenseApi.getActiveCategories().subscribe({
      next: (res) => { this.categories = res.data || []; },
    });
  }

  loadExpense(uuid: string): void {
    this.loading = true;
    this.expenseApi.getExpense(uuid).subscribe({
      next: (res) => {
        const e = res.data!;
        this.form.patchValue({
          expense_title: e.expense_title,
          expense_category_id: e.expense_category_id,
          expense_date: this.formatDate(e.expense_date),
          expense_description: e.expense_description,
          vendor_name: e.vendor_name,
          amount: e.amount,
          tax_amount: e.tax_amount,
          discount_amount: e.discount_amount,
          payment_method: e.payment_method,
          payment_account: e.payment_account,
          transaction_reference: e.transaction_reference,
          invoice_number: e.invoice_number,
          invoice_date: e.invoice_date ? this.formatDate(e.invoice_date) : null,
          is_recurring: e.is_recurring,
          recurring_frequency: e.recurring_frequency,
          next_due_date: e.next_due_date ? this.formatDate(e.next_due_date) : null,
          remarks: e.remarks,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load expense');
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const formData = { ...this.form.value };
    if (formData.expense_date instanceof Date) {
      formData.expense_date = formData.expense_date.toISOString().split('T')[0];
    }
    if (formData.invoice_date instanceof Date) {
      formData.invoice_date = formData.invoice_date.toISOString().split('T')[0];
    }
    if (formData.next_due_date instanceof Date) {
      formData.next_due_date = formData.next_due_date.toISOString().split('T')[0];
    }

    const request = this.isEdit
      ? this.expenseApi.updateExpense(this.expenseUuid, formData)
      : this.expenseApi.createExpense(formData);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Expense updated successfully' : 'Expense created successfully');
        this.router.navigate(['/admin/expenses']);
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to save expense');
      },
    });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
