import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlanApiService } from '../../../core/services/subscription-plan-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubscriptionPlan } from '../../../core/models/subscription-plan/subscription-plan.model';

@Component({
  selector: 'app-subscription-plan-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading plan details...</p>
      </div>
    </div>

    <div *ngIf="!loading && plan" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/subscription-plans" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Subscription Plans
          </a>
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ plan.plan_name }}</h1>
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
              [style.background]="getStatusBg(plan.status)"
              [style.color]="getStatusText(plan.status)">
              <span *ngIf="plan.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
              {{ plan.status | titlecase }}
            </span>
          </div>
          <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 8px 0 0 0;">
            {{ plan.plan_code }}
            &bull; {{ plan.plan_type | titlecase }}
            &bull; {{ plan.billing_cycle | titlecase }}
            &bull; {{ plan.duration_days }} days
          </p>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <a [routerLink]="['/admin/subscription-plans', plan.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform='';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="duplicatePlan()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">content_copy</span> Duplicate
            </button>
            <button (click)="deletePlan()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)';this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)';this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">delete</span> Delete
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">inventory_2</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Price</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ plan.price | number:'1.2-2' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">local_offer</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Offer Price</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ plan.offer_price && plan.offer_price > 0 ? (plan.offer_price | number:'1.2-2') : '-' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">schedule</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Duration</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ plan.duration_days }} days</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Info</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Plan Code</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ plan.plan_code }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Plan Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.plan_name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Plan Type</p>
                  <span style="display: inline-flex; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">{{ plan.plan_type | titlecase }}</span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Billing Cycle</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.billing_cycle | titlecase }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Meal Category</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.meal_category_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Kitchen</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.kitchen_name || 'All Kitchens' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Display Order</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.display_order }}</p>
                </div>
                <div *ngIf="plan.description" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Description</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.description }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">attach_money</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Pricing</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Price</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.price | number:'1.2-2' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Offer Price</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.offer_price && plan.offer_price > 0 ? (plan.offer_price | number:'1.2-2') : '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Effective Price</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.effective_price | number:'1.2-2' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Security Deposit</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.security_deposit | number:'1.2-2' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Tax Percentage</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.tax_percentage }}%</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Delivery Charge</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.delivery_charge | number:'1.2-2' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Joining Fee</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.joining_fee | number:'1.2-2' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Minimum Order Amount</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.minimum_order_amount | number:'1.2-2' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">checklist</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Features</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.meal_selection_enabled ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.meal_selection_enabled ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.meal_selection_enabled ? 'check_circle' : 'cancel' }}</span> Meal Selection
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.custom_meal_selection ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.custom_meal_selection ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.custom_meal_selection ? 'check_circle' : 'cancel' }}</span> Custom Selection
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.default_meal_assignment ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.default_meal_assignment ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.default_meal_assignment ? 'check_circle' : 'cancel' }}</span> Default Assignment
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.carry_forward_skipped_meals ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.carry_forward_skipped_meals ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.carry_forward_skipped_meals ? 'check_circle' : 'cancel' }}</span> Carry Forward
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.weekend_delivery ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.weekend_delivery ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.weekend_delivery ? 'check_circle' : 'cancel' }}</span> Weekend Delivery
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.holiday_delivery ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.holiday_delivery ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.holiday_delivery ? 'check_circle' : 'cancel' }}</span> Holiday Delivery
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.allow_upgrade ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.allow_upgrade ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.allow_upgrade ? 'check_circle' : 'cancel' }}</span> Allow Upgrade
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.allow_downgrade ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.allow_downgrade ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.allow_downgrade ? 'check_circle' : 'cancel' }}</span> Allow Downgrade
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.allow_pause ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.allow_pause ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.allow_pause ? 'check_circle' : 'cancel' }}</span> Allow Pause
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.allow_resume ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.allow_resume ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.allow_resume ? 'check_circle' : 'cancel' }}</span> Allow Resume
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.allow_skip ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.allow_skip ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.allow_skip ? 'check_circle' : 'cancel' }}</span> Allow Skip
                </span>
                <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;"
                  [style.background]="plan.allow_cancel ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="plan.allow_cancel ? '#047857' : '#9ca3af'">
                  <span class="material-icons" style="font-size: 16px;">{{ plan.allow_cancel ? 'check_circle' : 'cancel' }}</span> Allow Cancel
                </span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #d97706;">settings</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Settings</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Max Skip Days</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.maximum_skip_days }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Max Pause Days</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.maximum_pause_days }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Max Active Subscriptions</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.maximum_active_subscriptions }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Auto Renew</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;" [style.color]="plan.auto_renew ? '#047857' : '#9ca3af'">{{ plan.auto_renew ? 'Yes' : 'No' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Renewal Discount</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.renewal_discount }}%</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Trial Days</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.trial_days }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #db2777;">visibility</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Display</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Status</p>
                  <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(plan.status)"
                    [style.color]="getStatusText(plan.status)">
                    <span *ngIf="plan.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ plan.status | titlecase }}
                  </span>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Popular</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;" [style.color]="plan.is_popular ? '#3b82f6' : '#9ca3af'">{{ plan.is_popular ? 'Yes' : 'No' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Recommended</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;" [style.color]="plan.is_recommended ? '#7c3aed' : '#9ca3af'">{{ plan.is_recommended ? 'Yes' : 'No' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Starts At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.starts_at | date:'medium' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Ends At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.ends_at | date:'medium' }}</p>
                </div>
                <div *ngIf="plan.remarks" style="padding: 10px 0 0; border-top: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Remarks</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.remarks }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">restaurant_menu</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Plan Meals ({{ plan.plan_meals?.length || 0 }})</h2>
              </div>
              <div *ngIf="plan.plan_meals && plan.plan_meals.length > 0" style="display: flex; flex-direction: column; gap: 8px;">
                <div *ngFor="let meal of plan.plan_meals; trackBy: trackByMealId" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 8px; background: #f9fafb;">
                  <div>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.meal_name }}</p>
                    <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ meal.meal_category_name }} <span *ngIf="meal.day_of_week">&bull; {{ meal.day_of_week | titlecase }}</span></p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 11px; color: #9ca3af;">x{{ meal.quantity }}</span>
                    <span *ngIf="meal.is_optional" style="padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #fef3c7; color: #b45309;">Optional</span>
                    <span *ngIf="meal.is_default" style="padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #dbeafe; color: #1d4ed8;">Default</span>
                  </div>
                </div>
              </div>
              <div *ngIf="!plan.plan_meals || plan.plan_meals.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px;">
                <span class="material-icons" style="font-size: 28px; color: #d1d5db; margin-bottom: 8px;">restaurant_menu</span>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">No meals configured for this plan</p>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">history</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.created_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.updated_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.created_by_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Updated By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ plan.updated_by_name || '-' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a [routerLink]="['/admin/subscription-plans', plan.uuid, 'edit']"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Plan
                </a>
                <button (click)="duplicatePlan()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #3b82f6;">content_copy</span> Duplicate Plan
                </button>
                <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button (click)="deletePlan()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete Plan
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
export class SubscriptionPlanDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscriptionPlanApi = inject(SubscriptionPlanApiService);
  private notification = inject(NotificationService);

  plan: SubscriptionPlan | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadPlan(uuid); }
  }

  loadPlan(uuid: string): void {
    this.subscriptionPlanApi.getSubscriptionPlan(uuid).subscribe({
      next: (res) => {
        this.plan = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.notification.error('Failed to load plan'); this.router.navigate(['/admin/subscription-plans']); },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#fef2f2';
      case 'draft': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'inactive': return '#dc2626';
      case 'draft': return '#b45309';
      default: return '#6b7280';
    }
  }

  duplicatePlan(): void {
    if (!this.plan) return;
    if (window.confirm('Duplicate this subscription plan?')) {
      this.subscriptionPlanApi.duplicateSubscriptionPlan(this.plan.uuid).subscribe({
        next: (res) => {
          this.notification.success('Plan duplicated');
          if (res.data) { this.router.navigate(['/admin/subscription-plans', res.data.uuid]); }
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deletePlan(): void {
    if (!this.plan) return;
    if (window.confirm(`Delete "${this.plan.plan_name}"? This action cannot be undone.`)) {
      this.subscriptionPlanApi.deleteSubscriptionPlan(this.plan.uuid).subscribe({
        next: () => { this.notification.success('Plan deleted'); this.router.navigate(['/admin/subscription-plans']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restorePlan(): void {
    if (!this.plan) return;
    if (window.confirm('Restore this subscription plan?')) {
      this.subscriptionPlanApi.restoreSubscriptionPlan(this.plan.uuid).subscribe({
        next: () => { this.notification.success('Plan restored'); this.loadPlan(this.plan!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  trackByMealId(index: number, meal: any): any { return meal.id; }
}
