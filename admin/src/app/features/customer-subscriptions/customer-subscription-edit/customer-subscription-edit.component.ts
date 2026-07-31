import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerSubscriptionApiService } from '../../../core/services/customer-subscription-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomerSubscription } from '../../../core/models/customer-subscription/customer-subscription.model';

@Component({
  selector: 'app-customer-subscription-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading subscription...</p>
      </div>
    </div>

    <div *ngIf="!loading && subscription" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/customer-subscriptions/{{ subscription.uuid }}" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Details
          </a>
          <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">Edit Subscription</h1>
          <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ subscription.subscription_number_display || subscription.subscription_number }}</p>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <form (ngSubmit)="save()">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 20px; color: #047857;">edit</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Subscription Details</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Dates, billing, and payment information</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Start Date</label>
                <input type="date" [(ngModel)]="formData.start_date" name="start_date"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">End Date</label>
                <input type="date" [(ngModel)]="formData.end_date" name="end_date"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Billing Cycle</label>
                <select [(ngModel)]="formData.billing_cycle" name="billing_cycle"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box; appearance: none; -webkit-appearance: none;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                  <option value="">Select billing cycle</option>
                  <option value="one_time">One Time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Payment Status</label>
                <select [(ngModel)]="formData.payment_status" name="payment_status"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box; appearance: none; -webkit-appearance: none;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                  <option value="partial_refund">Partial Refund</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; padding-top: 20px;">
                <input type="checkbox" id="auto_renew" [(ngModel)]="formData.auto_renew" name="auto_renew"
                  style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer;" />
                <label for="auto_renew" style="font-size: 13px; font-weight: 600; color: #374151; cursor: pointer;">Auto Renew</label>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 20px; color: #6b7280;">notes</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Remarks</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Additional notes and comments</p>
              </div>
            </div>
            <div>
              <textarea [(ngModel)]="formData.remarks" name="remarks" rows="3" placeholder="Enter any additional notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>

          <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">Changes will be saved immediately</p>
            <div style="display: flex; align-items: center; gap: 10px;">
              <a routerLink="/admin/customer-subscriptions/{{ subscription.uuid }}"
                style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
                onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
                Cancel
              </a>
              <button type="submit" [disabled]="saving"
                style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
                [style.opacity]="saving ? '0.5' : '1'"
                [style.cursor]="saving ? 'not-allowed' : 'pointer'"
                onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
                onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
                <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class CustomerSubscriptionEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscriptionApi = inject(CustomerSubscriptionApiService);
  private notification = inject(NotificationService);

  subscription: CustomerSubscription | null = null;
  loading = true;
  saving = false;

  formData = {
    start_date: '',
    end_date: '',
    billing_cycle: '',
    payment_status: '',
    auto_renew: false,
    remarks: '',
  };

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.subscriptionApi.getSubscription(uuid).subscribe({
        next: (res) => {
          this.subscription = res.data ?? null;
          if (this.subscription) {
            this.formData.start_date = this.subscription.start_date?.split('T')[0] || '';
            this.formData.end_date = this.subscription.end_date?.split('T')[0] || '';
            this.formData.billing_cycle = this.subscription.billing_cycle || '';
            this.formData.payment_status = this.subscription.payment_status || '';
            this.formData.auto_renew = this.subscription.auto_renew || false;
            this.formData.remarks = this.subscription.remarks || '';
          }
          this.loading = false;
        },
        error: () => {
          this.notification.error('Failed to load subscription');
          this.router.navigate(['/admin/customer-subscriptions']);
        },
      });
    }
  }

  save(): void {
    if (!this.subscription) return;
    this.saving = true;
    this.subscriptionApi.updateSubscription(this.subscription.uuid, this.formData).subscribe({
      next: () => {
        this.notification.success('Subscription updated');
        this.router.navigate(['/admin/customer-subscriptions', this.subscription!.uuid]);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Update failed');
      },
    });
  }
}
