import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerSubscriptionApiService } from '../../../core/services/customer-subscription-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomerSubscription } from '../../../core/models/customer-subscription/customer-subscription.model';

@Component({
  selector: 'app-customer-subscription-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading subscription details...</p>
      </div>
    </div>

    <div *ngIf="!loading && subscription" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/customer-subscriptions" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Customer Subscriptions
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ subscription.subscription_number_display || subscription.subscription_number }}</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBg(subscription.subscription_status)"
                [style.color]="getStatusText(subscription.subscription_status)">
                {{ subscription.subscription_status | titlecase }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
              {{ subscription.plan_name || 'No Plan' }} &bull; {{ subscription.customer_name || 'Unknown Customer' }}
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="editSubscription()"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </button>
            <button (click)="toggleShowActions()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">more_vert</span> Actions
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <div *ngIf="showActions" style="position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 100; animation: fadeIn 0.1s ease-out;" (click)="toggleShowActions()">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 16px; padding: 8px; min-width: 240px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);" (click)="$event.stopPropagation()">
          <button (click)="editSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
          </button>
          <button *ngIf="subscription.subscription_status === 'active'" (click)="pauseSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #d97706;">pause_circle</span> Pause
          </button>
          <button *ngIf="subscription.subscription_status === 'active'" (click)="skipMeal(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #3b82f6;">skip_next</span> Skip Meal
          </button>
          <button *ngIf="subscription.subscription_status === 'active'" (click)="upgradeSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #7c3aed;">upgrade</span> Upgrade
          </button>
          <button *ngIf="subscription.subscription_status === 'active'" (click)="cancelSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
          </button>
          <button *ngIf="subscription.subscription_status === 'paused'" (click)="resumeSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #059669;">play_circle</span> Resume
          </button>
          <button *ngIf="subscription.subscription_status === 'paused'" (click)="forceResumeSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #059669;">play_for_work</span> Force Resume
          </button>
          <button *ngIf="subscription.subscription_status === 'paused'" (click)="cancelSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
          </button>
          <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
          <button (click)="renewSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #3b82f6;">autorenew</span> Renew
          </button>
          <button (click)="suspendSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #7c3aed;">block</span> Suspend
          </button>
          <button (click)="adjustMeals(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #059669;">restaurant_menu</span> Adjust Meals
          </button>
          <button (click)="adjustWallet(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #059669;">account_balance_wallet</span> Adjust Wallet
          </button>
          <button (click)="changePaymentStatus(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px; color: #d97706;">payments</span> Change Payment Status
          </button>
          <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
          <button (click)="restoreSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #059669; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px;">restore</span> Restore
          </button>
          <button (click)="deleteSubscription(); toggleShowActions()"
            style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
            onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
            <span class="material-icons" style="font-size: 18px;">delete</span> Delete
          </button>
        </div>
      </div>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #e0e7ff; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 20px; color: #4f46e5;">trending_up</span>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Progress</p>
                <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ subscription.consumed_meals }}/{{ subscription.total_meals }}</p>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="width: 100%; background: #f3f4f6; border-radius: 8px; height: 8px; overflow: hidden;">
                <div style="background: #059669; height: 8px; border-radius: 8px; transition: width 0.3s ease;" [style.width.%]="subscription.progress_percentage"></div>
              </div>
              <p style="font-size: 10px; color: #9ca3af; margin-top: 4px;">{{ subscription.progress_percentage }}% consumed</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; transition: all 0.2s ease; display: flex; align-items: center; gap: 14px;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">restaurant</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Remaining Meals</p>
              <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ subscription.remaining_meals }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; transition: all 0.2s ease; display: flex; align-items: center; gap: 14px;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">schedule</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Days Remaining</p>
              <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ subscription.days_remaining }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; transition: all 0.2s ease; display: flex; align-items: center; gap: 14px;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;"
              [style.background]="subscription.payment_status === 'paid' ? '#d1fae5' : '#fce4ec'">
              <span class="material-icons" style="font-size: 20px;"
                [style.color]="subscription.payment_status === 'paid' ? '#059669' : '#e53935'">payments</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Payment Status</p>
              <p style="font-size: 20px; font-weight: 800; margin: 0;"
                [style.color]="getPaymentStatusTextClass(subscription.payment_status)">{{ subscription.payment_status | titlecase }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">person</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Customer Info</h2>
              </div>
              <div style="height: 1px; background: #f3f4f6; margin-bottom: 20px;"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Customer Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.customer_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Customer Email</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.customer_email || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Customer ID</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">#{{ subscription.customer_id }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Subscription Info</h2>
              </div>
              <div style="height: 1px; background: #f3f4f6; margin-bottom: 20px;"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Subscription #</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ subscription.subscription_number_display || subscription.subscription_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Plan</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.plan_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Kitchen</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.kitchen_name || 'All Kitchens' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Billing Cycle</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.billing_cycle | titlecase }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Start Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.start_date | date:'mediumDate' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">End Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.end_date | date:'mediumDate' }}</p>
                </div>
                <div *ngIf="subscription.activation_date">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Activation Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.activation_date | date:'mediumDate' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Auto Renew</p>
                  <p style="font-size: 14px; font-weight: 600; margin: 0;"
                    [style.color]="subscription.auto_renew ? '#059669' : '#9ca3af'">{{ subscription.auto_renew ? 'Yes' : 'No' }}</p>
                </div>
                <div *ngIf="subscription.renewal_date">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Renewal Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.renewal_date | date:'mediumDate' }}</p>
                </div>
                <div *ngIf="subscription.cancellation_date">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Cancellation Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.cancellation_date | date:'mediumDate' }}</p>
                </div>
                <div *ngIf="subscription.cancellation_reason" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Cancellation Reason</p>
                  <p style="font-size: 13px; color: #6b7280; margin: 0;">{{ subscription.cancellation_reason }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">restaurant_menu</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Meal Summary</h2>
              </div>
              <div style="height: 1px; background: #f3f4f6; margin-bottom: 20px;"></div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                <div style="text-align: center; padding: 16px; border-radius: 10px; background: #f9fafb;">
                  <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ subscription.total_meals }}</p>
                  <p style="font-size: 10px; color: #9ca3af; margin: 4px 0 0 0;">Total Meals</p>
                </div>
                <div style="text-align: center; padding: 16px; border-radius: 10px; background: #d1fae5;">
                  <p style="font-size: 22px; font-weight: 800; color: #047857; margin: 0;">{{ subscription.consumed_meals }}</p>
                  <p style="font-size: 10px; color: #6b7280; margin: 4px 0 0 0;">Consumed</p>
                </div>
                <div style="text-align: center; padding: 16px; border-radius: 10px; background: #fef3c7;">
                  <p style="font-size: 22px; font-weight: 800; color: #b45309; margin: 0;">{{ subscription.skipped_meals }}</p>
                  <p style="font-size: 10px; color: #6b7280; margin: 4px 0 0 0;">Skipped</p>
                </div>
                <div style="text-align: center; padding: 16px; border-radius: 10px; background: #e0e7ff;">
                  <p style="font-size: 22px; font-weight: 800; color: #4338ca; margin: 0;">{{ subscription.remaining_meals }}</p>
                  <p style="font-size: 10px; color: #6b7280; margin: 4px 0 0 0;">Remaining</p>
                </div>
              </div>
              <div *ngIf="subscription.paused_days && subscription.paused_days > 0" style="margin-top: 12px; padding: 12px; border-radius: 10px; background: #ffedd5; display: flex; align-items: center; gap: 12px;">
                <span class="material-icons" style="font-size: 20px; color: #ea580c;">pause_circle</span>
                <div>
                  <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">{{ subscription.paused_days }} days paused</p>
                  <p *ngIf="subscription.pause_start && subscription.pause_end" style="font-size: 11px; color: #6b7280; margin: 2px 0 0 0;">{{ subscription.pause_start | date:'mediumDate' }} - {{ subscription.pause_end | date:'mediumDate' }}</p>
                </div>
              </div>
              <div *ngIf="subscription.wallet_adjustment && subscription.wallet_adjustment !== '0'" style="margin-top: 12px; padding: 12px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; gap: 12px;">
                <span class="material-icons" style="font-size: 20px; color: #2563eb;">account_balance_wallet</span>
                <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">Wallet Adjustment: {{ subscription.wallet_adjustment }}</p>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
              <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
                <button (click)="setActiveTab('pause')"
                  style="flex: 1; padding: 12px 8px; border: none; background: none; cursor: pointer; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.15s ease;"
                  [style.color]="activeTab === 'pause' ? '#059669' : '#9ca3af'"
                  [style.borderBottom]="activeTab === 'pause' ? '2px solid #059669' : '2px solid transparent'"
                  (mouseenter)="tabMouseEnter($event)" (mouseleave)="tabMouseLeave($event, 'pause')">Pause History</button>
                <button (click)="setActiveTab('skip')"
                  style="flex: 1; padding: 12px 8px; border: none; background: none; cursor: pointer; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.15s ease;"
                  [style.color]="activeTab === 'skip' ? '#059669' : '#9ca3af'"
                  [style.borderBottom]="activeTab === 'skip' ? '2px solid #059669' : '2px solid transparent'"
                  (mouseenter)="tabMouseEnter($event)" (mouseleave)="tabMouseLeave($event, 'skip')">Skip History</button>
                <button (click)="setActiveTab('upgrade')"
                  style="flex: 1; padding: 12px 8px; border: none; background: none; cursor: pointer; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.15s ease;"
                  [style.color]="activeTab === 'upgrade' ? '#059669' : '#9ca3af'"
                  [style.borderBottom]="activeTab === 'upgrade' ? '2px solid #059669' : '2px solid transparent'"
                  (mouseenter)="tabMouseEnter($event)" (mouseleave)="tabMouseLeave($event, 'upgrade')">Upgrade History</button>
                <button (click)="setActiveTab('renewal')"
                  style="flex: 1; padding: 12px 8px; border: none; background: none; cursor: pointer; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.15s ease;"
                  [style.color]="activeTab === 'renewal' ? '#059669' : '#9ca3af'"
                  [style.borderBottom]="activeTab === 'renewal' ? '2px solid #059669' : '2px solid transparent'"
                  (mouseenter)="tabMouseEnter($event)" (mouseleave)="tabMouseLeave($event, 'renewal')">Renewal History</button>
                <button (click)="setActiveTab('status')"
                  style="flex: 1; padding: 12px 8px; border: none; background: none; cursor: pointer; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.15s ease;"
                  [style.color]="activeTab === 'status' ? '#059669' : '#9ca3af'"
                  [style.borderBottom]="activeTab === 'status' ? '2px solid #059669' : '2px solid transparent'"
                  (mouseenter)="tabMouseEnter($event)" (mouseleave)="tabMouseLeave($event, 'status')">Status History</button>
              </div>

              <div style="padding: 16px;">
                <div *ngIf="activeTab === 'pause'">
                  <div *ngIf="subscription.pause_history && subscription.pause_history.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
                    <div *ngFor="let pause of subscription.pause_history" style="padding: 12px; border-radius: 10px; background: #f9fafb; border: 1px solid #f3f4f6;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;"
                          [style.background]="pause.status === 'approved' ? '#d1fae5' : pause.status === 'pending' ? '#fef3c7' : '#fce4ec'"
                          [style.color]="pause.status === 'approved' ? '#047857' : pause.status === 'pending' ? '#d97706' : '#e53935'">
                          {{ pause.status | titlecase }}
                        </span>
                        <span style="font-size: 10px; color: #9ca3af;">{{ pause.created_at | date:'short' }}</span>
                      </div>
                      <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0 0 2px 0;">{{ pause.pause_days }} days</p>
                      <p *ngIf="pause.pause_start && pause.pause_end" style="font-size: 11px; color: #6b7280; margin: 0;">{{ pause.pause_start | date:'mediumDate' }} - {{ pause.pause_end | date:'mediumDate' }}</p>
                      <p *ngIf="pause.reason" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; font-style: italic;">{{ pause.reason }}</p>
                    </div>
                  </div>
                  <div *ngIf="!subscription.pause_history || subscription.pause_history.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 24px;">
                    <span class="material-icons" style="font-size: 28px; color: #d1d5db; margin-bottom: 8px;">pause_circle</span>
                    <p style="font-size: 12px; color: #9ca3af;">No pause history</p>
                  </div>
                </div>

                <div *ngIf="activeTab === 'skip'">
                  <div *ngIf="subscription.skip_history && subscription.skip_history.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
                    <div *ngFor="let skip of subscription.skip_history" style="padding: 12px; border-radius: 10px; background: #f9fafb; border: 1px solid #f3f4f6;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;"
                          [style.background]="skip.status === 'approved' ? '#d1fae5' : skip.status === 'pending' ? '#fef3c7' : '#fce4ec'"
                          [style.color]="skip.status === 'approved' ? '#047857' : skip.status === 'pending' ? '#d97706' : '#e53935'">
                          {{ skip.status | titlecase }}
                        </span>
                        <span style="font-size: 10px; color: #9ca3af;">{{ skip.created_at | date:'short' }}</span>
                      </div>
                      <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0 0 2px 0;">{{ skip.skip_type | titlecase }}</p>
                      <p style="font-size: 11px; color: #6b7280; margin: 0;">{{ skip.skip_date | date:'mediumDate' }}</p>
                      <p *ngIf="skip.meal_name" style="font-size: 11px; color: #6b7280; margin: 2px 0 0 0;">{{ skip.meal_name }}</p>
                      <p style="font-size: 11px; color: #6b7280; margin: 2px 0 0 0;">{{ skip.meals_credited }} meals credited ({{ skip.credit_amount }})</p>
                      <p *ngIf="skip.reason" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; font-style: italic;">{{ skip.reason }}</p>
                    </div>
                  </div>
                  <div *ngIf="!subscription.skip_history || subscription.skip_history.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 24px;">
                    <span class="material-icons" style="font-size: 28px; color: #d1d5db; margin-bottom: 8px;">skip_next</span>
                    <p style="font-size: 12px; color: #9ca3af;">No skip history</p>
                  </div>
                </div>

                <div *ngIf="activeTab === 'upgrade'">
                  <div *ngIf="subscription.upgrade_history && subscription.upgrade_history.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
                    <div *ngFor="let upgrade of subscription.upgrade_history" style="padding: 12px; border-radius: 10px; background: #f9fafb; border: 1px solid #f3f4f6;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;"
                          [style.background]="upgrade.status === 'approved' ? '#d1fae5' : upgrade.status === 'pending' ? '#fef3c7' : '#fce4ec'"
                          [style.color]="upgrade.status === 'approved' ? '#047857' : upgrade.status === 'pending' ? '#d97706' : '#e53935'">
                          {{ upgrade.status | titlecase }}
                        </span>
                        <span style="font-size: 10px; color: #9ca3af;">{{ upgrade.created_at | date:'short' }}</span>
                      </div>
                      <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0 0 2px 0;">{{ upgrade.from_plan_name }} -> {{ upgrade.to_plan_name }}</p>
                      <p style="font-size: 11px; color: #6b7280; margin: 0;">Price diff: {{ upgrade.price_difference }}</p>
                      <p *ngIf="upgrade.reason" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; font-style: italic;">{{ upgrade.reason }}</p>
                    </div>
                  </div>
                  <div *ngIf="!subscription.upgrade_history || subscription.upgrade_history.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 24px;">
                    <span class="material-icons" style="font-size: 28px; color: #d1d5db; margin-bottom: 8px;">upgrade</span>
                    <p style="font-size: 12px; color: #9ca3af;">No upgrade history</p>
                  </div>
                </div>

                <div *ngIf="activeTab === 'renewal'">
                  <div *ngIf="subscription.renew_history && subscription.renew_history.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
                    <div *ngFor="let renewal of subscription.renew_history" style="padding: 12px; border-radius: 10px; background: #f9fafb; border: 1px solid #f3f4f6;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; background: #dbeafe; color: #2563eb;">{{ renewal.renewal_type | titlecase }}</span>
                        <span style="font-size: 10px; color: #9ca3af;">{{ renewal.created_at | date:'short' }}</span>
                      </div>
                      <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0 0 2px 0;">{{ renewal.from_plan_name }} -> {{ renewal.to_plan_name }}</p>
                      <p style="font-size: 11px; color: #6b7280; margin: 0;">{{ renewal.old_end_date | date:'mediumDate' }} -> {{ renewal.new_end_date | date:'mediumDate' }}</p>
                      <p style="font-size: 11px; color: #6b7280; margin: 0;">Amount: {{ renewal.final_amount }}</p>
                      <p *ngIf="renewal.reason" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; font-style: italic;">{{ renewal.reason }}</p>
                    </div>
                  </div>
                  <div *ngIf="!subscription.renew_history || subscription.renew_history.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 24px;">
                    <span class="material-icons" style="font-size: 28px; color: #d1d5db; margin-bottom: 8px;">autorenew</span>
                    <p style="font-size: 12px; color: #9ca3af;">No renewal history</p>
                  </div>
                </div>

                <div *ngIf="activeTab === 'status'">
                  <div *ngIf="subscription.status_history && subscription.status_history.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
                    <div *ngFor="let history of subscription.status_history" style="padding: 12px; border-radius: 10px; background: #f9fafb; border: 1px solid #f3f4f6;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;"
                            [style.background]="getStatusBg(history.from_status)"
                            [style.color]="getStatusText(history.from_status)">{{ history.from_status | titlecase }}</span>
                          <span class="material-icons" style="font-size: 12px; color: #9ca3af;">arrow_forward</span>
                          <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;"
                            [style.background]="getStatusBg(history.to_status)"
                            [style.color]="getStatusText(history.to_status)">{{ history.to_status | titlecase }}</span>
                        </div>
                        <span style="font-size: 10px; color: #9ca3af;">{{ history.created_at | date:'short' }}</span>
                      </div>
                      <p *ngIf="history.changed_by_name" style="font-size: 11px; color: #6b7280; margin: 0;">By: {{ history.changed_by_name }}</p>
                      <p *ngIf="history.reason" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; font-style: italic;">{{ history.reason }}</p>
                    </div>
                  </div>
                  <div *ngIf="!subscription.status_history || subscription.status_history.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 24px;">
                    <span class="material-icons" style="font-size: 28px; color: #d1d5db; margin-bottom: 8px;">history</span>
                    <p style="font-size: 12px; color: #9ca3af;">No status history</p>
                  </div>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #6b7280;">timeline</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Timeline</h2>
              </div>
              <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
              <div *ngIf="timeline && timeline.length > 0" style="display: flex; flex-direction: column;">
                <div *ngFor="let event of timeline; let last = last" style="display: flex; gap: 16px;">
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;"
                      [style.background]="getTimelineDotBg(event)"
                      [style.borderColor]="getTimelineDotBorder(event)"
                      [style.borderWidth]="'2px'"
                      [style.borderStyle]="'solid'"></div>
                    <div *ngIf="!last" style="width: 2px; min-height: 40px; background: #e5e7eb; margin-top: 4px;"></div>
                  </div>
                  <div style="flex: 1; padding-bottom: 16px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">{{ event.title || event.action || 'Event' }}</p>
                      <span style="font-size: 10px; color: #9ca3af;">{{ event.created_at | date:'short' }}</span>
                    </div>
                    <p *ngIf="event.description || event.details" style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0;">{{ event.description || event.details }}</p>
                    <p *ngIf="event.changed_by_name" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">By {{ event.changed_by_name }}</p>
                  </div>
                </div>
              </div>
              <div *ngIf="!timeline || timeline.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 24px;">
                <span class="material-icons" style="font-size: 28px; color: #d1d5db; margin-bottom: 8px;">timeline</span>
                <p style="font-size: 12px; color: #9ca3af;">No timeline events</p>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #6b7280;">history</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h2>
              </div>
              <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <p style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 2px 0;">Created At</p>
                  <p style="font-size: 12px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.created_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                  <p style="font-size: 12px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.updated_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 2px 0;">Created By</p>
                  <p style="font-size: 12px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.created_by_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 2px 0;">Updated By</p>
                  <p style="font-size: 12px; font-weight: 600; color: #1f2937; margin: 0;">{{ subscription.updated_by_name || '-' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button (click)="editSubscription()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Subscription
                </button>
                <button (click)="renewSubscription()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #3b82f6;">autorenew</span> Renew
                </button>
                <button (click)="adjustMeals()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #059669;">restaurant_menu</span> Adjust Meals
                </button>
                <button (click)="adjustWallet()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #059669;">account_balance_wallet</span> Adjust Wallet
                </button>
                <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button (click)="deleteSubscription()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete Subscription
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
export class CustomerSubscriptionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscriptionApi = inject(CustomerSubscriptionApiService);
  private notification = inject(NotificationService);

  subscription: CustomerSubscription | null = null;
  timeline: any[] = [];
  loading = true;
  activeTab = 'pause';
  showActions = false;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadSubscription(uuid); }
  }

  setActiveTab(tab: string): void { this.activeTab = tab; }

  tabMouseEnter(event: MouseEvent): void {
    (event.target as HTMLElement).style.color = '#059669';
  }

  tabMouseLeave(event: MouseEvent, tab: string): void {
    (event.target as HTMLElement).style.color = this.activeTab === tab ? '#059669' : '#9ca3af';
  }

  toggleShowActions(): void { this.showActions = !this.showActions; }

  loadSubscription(uuid: string): void {
    this.subscriptionApi.getSubscription(uuid).subscribe({
      next: (res) => {
        this.subscription = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.notification.error('Failed to load subscription'); this.router.navigate(['/admin/customer-subscriptions']); },
    });
    this.subscriptionApi.getAdminTimeline(uuid).subscribe({
      next: (res) => { this.timeline = res.data ?? []; },
      error: () => {},
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'paused': return 'bg-orange-100 text-orange-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'suspended': return 'bg-purple-100 text-purple-700';
      case 'skipped': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'pending': return '#fef3c7';
      case 'active': return '#d1fae5';
      case 'paused': return '#ffedd5';
      case 'expired': return '#fce4ec';
      case 'cancelled': return '#ffe4e6';
      case 'completed': return '#dbeafe';
      case 'suspended': return '#f3e8ff';
      case 'skipped': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return '#d97706';
      case 'active': return '#047857';
      case 'paused': return '#ea580c';
      case 'expired': return '#e53935';
      case 'cancelled': return '#e11d48';
      case 'completed': return '#2563eb';
      case 'suspended': return '#7c3aed';
      case 'skipped': return '#6b7280';
      default: return '#6b7280';
    }
  }

  getPaymentStatusTextClass(status: string): string {
    switch (status) {
      case 'paid': return '#059669';
      case 'pending': return '#d97706';
      case 'failed': return '#e53935';
      case 'refunded': return '#2563eb';
      case 'partial_refund': return '#ea580c';
      default: return '#6b7280';
    }
  }

  getTimelineDotBg(event: any): string {
    const action = (event.action || event.to_status || '').toLowerCase();
    if (action.includes('activate') || action.includes('resume') || action === 'active') return '#d1fae5';
    if (action.includes('pause') || action === 'paused') return '#fef3c7';
    if (action.includes('cancel') || action === 'cancelled') return '#fce4ec';
    if (action.includes('skip') || action === 'skipped') return '#dbeafe';
    if (action.includes('upgrade')) return '#f3e8ff';
    if (action.includes('renew')) return '#e0e7ff';
    if (action.includes('suspend') || action === 'suspended') return '#fce4ec';
    return '#f3f4f6';
  }

  getTimelineDotBorder(event: any): string {
    const action = (event.action || event.to_status || '').toLowerCase();
    if (action.includes('activate') || action.includes('resume') || action === 'active') return '#059669';
    if (action.includes('pause') || action === 'paused') return '#d97706';
    if (action.includes('cancel') || action === 'cancelled') return '#e53935';
    if (action.includes('skip') || action === 'skipped') return '#2563eb';
    if (action.includes('upgrade')) return '#7c3aed';
    if (action.includes('renew')) return '#4f46e5';
    if (action.includes('suspend') || action === 'suspended') return '#e91e63';
    return '#9ca3af';
  }

  editSubscription(): void {
    if (this.subscription) {
      this.router.navigate(['/admin/customer-subscriptions', this.subscription.uuid, 'edit']);
    }
  }

  pauseSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Pause this subscription?')) {
      this.subscriptionApi.pauseSubscription(this.subscription.uuid, {}).subscribe({
        next: (res) => { this.notification.success('Subscription paused'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  resumeSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Resume this subscription?')) {
      this.subscriptionApi.resumeSubscription(this.subscription.uuid).subscribe({
        next: () => { this.notification.success('Subscription resumed'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  forceResumeSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Force resume this subscription?')) {
      this.subscriptionApi.forceResumeSubscription(this.subscription.uuid).subscribe({
        next: () => { this.notification.success('Subscription force resumed'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  skipMeal(): void {
    if (!this.subscription) return;
    if (window.confirm('Skip meal for this subscription?')) {
      this.subscriptionApi.skipMeal(this.subscription.uuid, {}).subscribe({
        next: () => { this.notification.success('Meal skipped'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  upgradeSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Upgrade this subscription?')) {
      this.subscriptionApi.upgradeSubscription(this.subscription.uuid, {}).subscribe({
        next: () => { this.notification.success('Subscription upgraded'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  renewSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Renew this subscription?')) {
      this.subscriptionApi.renewSubscription(this.subscription.uuid).subscribe({
        next: () => { this.notification.success('Subscription renewed'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Cancel this subscription? This action cannot be undone.')) {
      this.subscriptionApi.cancelSubscription(this.subscription.uuid, {}).subscribe({
        next: () => { this.notification.success('Subscription cancelled'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  suspendSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Suspend this subscription?')) {
      this.subscriptionApi.suspendSubscription(this.subscription.uuid).subscribe({
        next: () => { this.notification.success('Subscription suspended'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  adjustMeals(): void {
    if (!this.subscription) return;
    const meals = prompt('Enter meal adjustment amount (positive to add, negative to subtract):');
    if (meals === null) return;
    this.subscriptionApi.adjustMeals(this.subscription.uuid, { adjustment: parseInt(meals, 10) }).subscribe({
      next: () => { this.notification.success('Meals adjusted'); this.loadSubscription(this.subscription!.uuid); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  changePaymentStatus(): void {
    if (!this.subscription) return;
    const status = prompt('Enter new payment status (pending / paid / failed / refunded / partial_refund):');
    if (!status) return;
    const validStatuses = ['pending', 'paid', 'failed', 'refunded', 'partial_refund'];
    if (!validStatuses.includes(status)) {
      this.notification.error('Invalid status. Use: pending, paid, failed, refunded, partial_refund');
      return;
    }
    this.subscriptionApi.updateSubscription(this.subscription.uuid, { payment_status: status }).subscribe({
      next: () => { this.notification.success('Payment status updated'); this.loadSubscription(this.subscription!.uuid); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  adjustWallet(): void {
    if (!this.subscription) return;
    const amount = prompt('Enter wallet adjustment amount (positive to add, negative to subtract):');
    if (amount === null) return;
    this.subscriptionApi.adjustWallet(this.subscription.uuid, { adjustment: amount }).subscribe({
      next: () => { this.notification.success('Wallet adjusted'); this.loadSubscription(this.subscription!.uuid); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  deleteSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Delete this subscription? This action cannot be undone.')) {
      this.subscriptionApi.deleteSubscription(this.subscription.uuid).subscribe({
        next: () => { this.notification.success('Subscription deleted'); this.router.navigate(['/admin/customer-subscriptions']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreSubscription(): void {
    if (!this.subscription) return;
    if (window.confirm('Restore this subscription?')) {
      this.subscriptionApi.restoreSubscription(this.subscription.uuid).subscribe({
        next: () => { this.notification.success('Subscription restored'); this.loadSubscription(this.subscription!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
