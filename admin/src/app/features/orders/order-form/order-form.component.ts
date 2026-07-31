import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderApiService } from '../../../core/services/order-api.service';
import { CustomerApiService } from '../../../core/services/customer-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { MealApiService } from '../../../core/services/meal-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/orders" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Orders
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">Create New Order</h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details to place a new order</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 40vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading form data...</p>
      </div>
    </div>

    <section *ngIf="!loading" style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">person</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Customer & Kitchen</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Select customer and kitchen</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Customer <span style="color: #dc2626;">*</span></label>
              <select formControlName="customer_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('customer_id')?.invalid && form.get('customer_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null" disabled>Select customer</option>
                <option *ngFor="let c of customers; trackBy: trackById" [value]="c.id">{{ c.first_name }} {{ c.last_name }}</option>
              </select>
              <p *ngIf="form.get('customer_id')?.invalid && form.get('customer_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Customer is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen</label>
              <select formControlName="kitchen_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select kitchen</option>
                <option *ngFor="let k of kitchens; trackBy: trackById" [value]="k.id">{{ k.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">receipt_long</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Order Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Order type, dates, and meal</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Order Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="order_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('order_type')?.invalid && form.get('order_type')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="single">Single Meal</option>
                <option value="subscription">Subscription</option>
                <option value="guest">Guest</option>
                <option value="corporate">Corporate</option>
              </select>
              <p *ngIf="form.get('order_type')?.invalid && form.get('order_type')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Order type is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meal</label>
              <select formControlName="meal_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select meal</option>
                <option *ngFor="let m of meals; trackBy: trackById" [value]="m.id">{{ m.name }} - {{ m.price | currency:'INR' }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Date <span style="color: #dc2626;">*</span></label>
              <input type="date" formControlName="delivery_date" [min]="minDateStr"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('delivery_date')?.invalid && form.get('delivery_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('delivery_date')?.invalid && form.get('delivery_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Delivery date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Quantity <span style="color: #dc2626;">*</span></label>
              <input type="number" formControlName="quantity" min="1"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('quantity')?.invalid && form.get('quantity')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('quantity')?.invalid && form.get('quantity')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Quantity is required (min 1)</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Slot</label>
              <select formControlName="delivery_slot"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="08:00-09:00">08:00 - 09:00</option>
                <option value="12:00-13:00">12:00 - 13:00</option>
                <option value="18:00-19:00">18:00 - 19:00</option>
                <option value="20:00-21:00">20:00 - 21:00</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Payment Method</label>
              <select formControlName="payment_method"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="wallet">Wallet</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">notes</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Notes</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Additional instructions</p>
            </div>
          </div>
          <textarea formControlName="notes" rows="3" placeholder="Any notes or special instructions..."
            style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Fields marked with * are required</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/orders"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || submitting"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="form.invalid || submitting ? '0.5' : '1'"
              [style.cursor]="form.invalid || submitting ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="submitting" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span class="material-icons" style="font-size: 18px;" *ngIf="!submitting">save</span>
              <span *ngIf="!submitting">Create Order</span>
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
export class OrderFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private orderApi = inject(OrderApiService);
  private customerApi = inject(CustomerApiService);
  private kitchenApi = inject(KitchenApiService);
  private mealApi = inject(MealApiService);
  private notification = inject(NotificationService);

  form = this.fb.group({
    customer_id: [null, Validators.required],
    kitchen_id: [null],
    order_type: ['single', Validators.required],
    meal_id: [null],
    delivery_date: [new Date(), Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    delivery_slot: ['12:00-13:00'],
    payment_method: ['wallet'],
    notes: [''],
  });

  customers: any[] = [];
  kitchens: any[] = [];
  meals: any[] = [];
  loading = true;
  submitting = false;
  minDate = new Date();

  get minDateStr(): string {
    return this.minDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    forkJoin({
      customers: this.customerApi.getAll({ per_page: '100' }),
      kitchens: this.kitchenApi.getAll({ per_page: '100' }),
      meals: this.mealApi.getAll({ per_page: '100' }),
    }).subscribe({
      next: (res) => {
        this.customers = res.customers.data ?? [];
        this.kitchens = res.kitchens.data ?? [];
        this.meals = res.meals.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load form data');
      },
    });
  }

  trackById(_: number, item: any): any { return item.id; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    const formValue = this.form.value;
    const selectedMeal = this.meals.find(m => m.id === formValue.meal_id);
    const payload: any = {
      customer_id: formValue.customer_id,
      order_type: formValue.order_type,
      kitchen_id: formValue.kitchen_id,
      meal_id: formValue.meal_id,
      unit_price: selectedMeal?.price ?? 0,
      delivery_date: formValue.delivery_date instanceof Date
        ? formValue.delivery_date.toISOString().split('T')[0]
        : formValue.delivery_date,
      quantity: formValue.quantity,
      delivery_slot: formValue.delivery_slot,
      payment_method: formValue.payment_method,
      notes: formValue.notes,
    };

    this.orderApi.createOrder(payload).subscribe({
      next: (res) => {
        this.notification.success('Order created successfully');
        this.router.navigate(['/admin/orders']);
      },
      error: (err) => {
        this.submitting = false;
        this.notification.error(err.error?.message || 'Failed to create order');
      },
    });
  }
}
