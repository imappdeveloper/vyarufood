import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlanApiService } from '../../../core/services/subscription-plan-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { MealCategoryApiService } from '../../../core/services/meal-category-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PLAN_TYPES, BILLING_CYCLES, PLAN_STATUSES } from '../../../core/models/subscription-plan/subscription-plan.model';

@Component({
  selector: 'app-subscription-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/subscription-plans" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Subscription Plans
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditMode">Edit Subscription Plan</span>
          <span *ngIf="!isEditMode">Create Subscription Plan</span>
        </h1>
        <p *ngIf="isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing subscription plan</p>
        <p *ngIf="!isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to create a new subscription plan</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="planForm" (ngSubmit)="onSubmit()">
        <div style="display: flex; gap: 4px; background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 6px; margin-bottom: 16px; overflow-x: auto;">
          <button type="button" (click)="activeTab = 'basic'"
            style="padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;"
            [style.background]="activeTab === 'basic' ? '#059669' : 'transparent'"
            [style.color]="activeTab === 'basic' ? 'white' : '#6b7280'"
            onmouseover="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='#f3f4f6'}" onmouseout="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='transparent'}">
            <span class="material-icons" style="font-size: 16px;">info</span> Basic Info
          </button>
          <button type="button" (click)="activeTab = 'pricing'"
            style="padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;"
            [style.background]="activeTab === 'pricing' ? '#059669' : 'transparent'"
            [style.color]="activeTab === 'pricing' ? 'white' : '#6b7280'"
            onmouseover="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='#f3f4f6'}" onmouseout="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='transparent'}">
            <span class="material-icons" style="font-size: 16px;">attach_money</span> Pricing
          </button>
          <button type="button" (click)="activeTab = 'settings'"
            style="padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;"
            [style.background]="activeTab === 'settings' ? '#059669' : 'transparent'"
            [style.color]="activeTab === 'settings' ? 'white' : '#6b7280'"
            onmouseover="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='#f3f4f6'}" onmouseout="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='transparent'}">
            <span class="material-icons" style="font-size: 16px;">settings</span> Settings
          </button>
          <button type="button" (click)="activeTab = 'features'"
            style="padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;"
            [style.background]="activeTab === 'features' ? '#059669' : 'transparent'"
            [style.color]="activeTab === 'features' ? 'white' : '#6b7280'"
            onmouseover="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='#f3f4f6'}" onmouseout="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='transparent'}">
            <span class="material-icons" style="font-size: 16px;">checklist</span> Features
          </button>
          <button type="button" (click)="activeTab = 'display'"
            style="padding: 8px 16px; border-radius: 10px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;"
            [style.background]="activeTab === 'display' ? '#059669' : 'transparent'"
            [style.color]="activeTab === 'display' ? 'white' : '#6b7280'"
            onmouseover="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='#f3f4f6'}" onmouseout="if(this.style.background!=='rgb(5, 150, 105)'){this.style.background='transparent'}">
            <span class="material-icons" style="font-size: 16px;">visibility</span> Display
          </button>
        </div>

        <div *ngIf="activeTab === 'basic'" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">info</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Plan code, name, and configuration</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Plan Code <span style="color: #dc2626;">*</span></label>
              <input formControlName="plan_code" placeholder="e.g. PLAN-001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="planForm.get('plan_code')?.invalid && planForm.get('plan_code')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
              <p *ngIf="planForm.get('plan_code')?.invalid && planForm.get('plan_code')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Plan code is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Plan Name <span style="color: #dc2626;">*</span></label>
              <input formControlName="plan_name" placeholder="e.g. Monthly Veg Premium"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="planForm.get('plan_name')?.invalid && planForm.get('plan_name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
              <p *ngIf="planForm.get('plan_name')?.invalid && planForm.get('plan_name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Plan name is required</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Description</label>
              <textarea formControlName="description" rows="3" maxlength="1000" placeholder="Plan description"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';"></textarea>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ planForm.get('description')?.value?.length || 0 }}/1000</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Plan Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="plan_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';">
                <option *ngFor="let pt of planTypes; trackBy: trackByValue" [ngValue]="pt.value">{{ pt.label }}</option>
              </select>
              <p *ngIf="planForm.get('plan_type')?.invalid && planForm.get('plan_type')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Plan type is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Billing Cycle <span style="color: #dc2626;">*</span></label>
              <select formControlName="billing_cycle"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';">
                <option *ngFor="let bc of billingCycles; trackBy: trackByValue" [ngValue]="bc.value">{{ bc.label }}</option>
              </select>
              <p *ngIf="planForm.get('billing_cycle')?.invalid && planForm.get('billing_cycle')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Billing cycle is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Duration (Days) <span style="color: #dc2626;">*</span></label>
              <input formControlName="duration_days" type="number" min="1"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="planForm.get('duration_days')?.invalid && planForm.get('duration_days')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
              <p *ngIf="planForm.get('duration_days')?.invalid && planForm.get('duration_days')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Duration is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meal Category <span style="color: #dc2626;">*</span></label>
              <select formControlName="meal_category_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Category</option>
                <option *ngFor="let mc of mealCategories; trackBy: trackById" [ngValue]="mc.id">{{ mc.name }}</option>
              </select>
              <p *ngIf="planForm.get('meal_category_id')?.invalid && planForm.get('meal_category_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Meal category is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen</label>
              <select formControlName="kitchen_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';">
                <option [ngValue]="null">All Kitchens</option>
                <option *ngFor="let k of kitchens; trackBy: trackById" [ngValue]="k.id">{{ k.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'pricing'" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">attach_money</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Pricing</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Set plan pricing and fees</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Price <span style="color: #dc2626;">*</span></label>
              <input formControlName="price" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="planForm.get('price')?.invalid && planForm.get('price')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
              <p *ngIf="planForm.get('price')?.invalid && planForm.get('price')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Price is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Offer Price</label>
              <input formControlName="offer_price" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Leave 0 if no offer</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Security Deposit</label>
              <input formControlName="security_deposit" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Tax Percentage</label>
              <input formControlName="tax_percentage" type="number" min="0" max="100" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Charge</label>
              <input formControlName="delivery_charge" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Joining Fee</label>
              <input formControlName="joining_fee" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Minimum Order Amount</label>
              <input formControlName="minimum_order_amount" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'settings'" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">settings</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Settings</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Plan limits and renewal settings</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Maximum Skip Days</label>
              <input formControlName="maximum_skip_days" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Maximum Pause Days</label>
              <input formControlName="maximum_pause_days" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Maximum Active Subscriptions</label>
              <input formControlName="maximum_active_subscriptions" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Renewal Discount (%)</label>
              <input formControlName="renewal_discount" type="number" min="0" max="100" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Trial Days</label>
              <input formControlName="trial_days" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding-top: 6px;">
              <input type="checkbox" formControlName="auto_renew" id="auto_renew"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="auto_renew" style="font-size: 13px; color: #374151; font-weight: 600;">Auto Renew</label>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'features'" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">checklist</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Features</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Enable or disable plan features</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="meal_selection_enabled" id="meal_selection_enabled"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="meal_selection_enabled" style="font-size: 13px; color: #374151;">Meal Selection Enabled</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="custom_meal_selection" id="custom_meal_selection"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="custom_meal_selection" style="font-size: 13px; color: #374151;">Custom Meal Selection</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="default_meal_assignment" id="default_meal_assignment"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="default_meal_assignment" style="font-size: 13px; color: #374151;">Default Meal Assignment</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="carry_forward_skipped_meals" id="carry_forward_skipped_meals"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="carry_forward_skipped_meals" style="font-size: 13px; color: #374151;">Carry Forward Skipped Meals</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="weekend_delivery" id="weekend_delivery"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="weekend_delivery" style="font-size: 13px; color: #374151;">Weekend Delivery</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="holiday_delivery" id="holiday_delivery"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="holiday_delivery" style="font-size: 13px; color: #374151;">Holiday Delivery</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="allow_upgrade" id="allow_upgrade"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="allow_upgrade" style="font-size: 13px; color: #374151;">Allow Upgrade</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="allow_downgrade" id="allow_downgrade"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="allow_downgrade" style="font-size: 13px; color: #374151;">Allow Downgrade</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="allow_pause" id="allow_pause"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="allow_pause" style="font-size: 13px; color: #374151;">Allow Pause</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="allow_resume" id="allow_resume"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="allow_resume" style="font-size: 13px; color: #374151;">Allow Resume</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="allow_skip" id="allow_skip"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="allow_skip" style="font-size: 13px; color: #374151;">Allow Skip</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" formControlName="allow_cancel" id="allow_cancel"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="allow_cancel" style="font-size: 13px; color: #374151;">Allow Cancel</label>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'display'" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fce7f3; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #db2777;">visibility</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Display Settings</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Visibility and display configuration</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; padding-top: 6px;">
              <input type="checkbox" formControlName="is_popular" id="is_popular"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="is_popular" style="font-size: 13px; color: #374151; font-weight: 600;">Mark as Popular</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding-top: 6px;">
              <input type="checkbox" formControlName="is_recommended" id="is_recommended"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="is_recommended" style="font-size: 13px; color: #374151; font-weight: 600;">Mark as Recommended</label>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Display Order</label>
              <input formControlName="display_order" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status</label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';">
                <option *ngFor="let ps of planStatuses; trackBy: trackByValue" [ngValue]="ps.value">{{ ps.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Starts At</label>
              <input formControlName="starts_at" type="datetime-local"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Ends At</label>
              <input formControlName="ends_at" type="datetime-local"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="3"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditMode">Changes will be saved immediately</span>
            <span *ngIf="!isEditMode">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/subscription-plans"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="planForm.invalid || saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="planForm.invalid || saving ? '0.5' : '1'"
              [style.cursor]="planForm.invalid || saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEditMode">Update Plan</span>
              <span *ngIf="!isEditMode">Create Plan</span>
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
export class SubscriptionPlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscriptionPlanApi = inject(SubscriptionPlanApiService);
  private kitchenApi = inject(KitchenApiService);
  private mealCategoryApi = inject(MealCategoryApiService);
  private notification = inject(NotificationService);

  planForm!: FormGroup;
  isEditMode = false;
  planUuid = '';
  saving = false;

  mealCategories: any[] = [];
  kitchens: any[] = [];

  planTypes = PLAN_TYPES;
  billingCycles = BILLING_CYCLES;
  planStatuses = PLAN_STATUSES;

  activeTab = 'basic';

  ngOnInit(): void {
    this.buildForm();
    this.planUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditMode = !!this.planUuid;
    this.loadDropdowns();
    if (this.isEditMode) { this.loadPlan(); }
  }

  buildForm(): void {
    this.planForm = this.fb.group({
      plan_code: ['', Validators.required],
      plan_name: ['', Validators.required],
      description: [''],
      plan_type: ['monthly', Validators.required],
      billing_cycle: ['monthly', Validators.required],
      duration_days: [30, [Validators.required, Validators.min(1)]],
      meal_category_id: [null, Validators.required],
      kitchen_id: [null],
      price: [0, [Validators.required, Validators.min(0)]],
      offer_price: [0],
      security_deposit: [0],
      tax_percentage: [0],
      delivery_charge: [0],
      joining_fee: [0],
      minimum_order_amount: [0],
      maximum_skip_days: [0],
      maximum_pause_days: [0],
      maximum_active_subscriptions: [1],
      auto_renew: [false],
      renewal_discount: [0],
      trial_days: [0],
      meal_selection_enabled: [true],
      custom_meal_selection: [false],
      default_meal_assignment: [true],
      carry_forward_skipped_meals: [false],
      weekend_delivery: [true],
      holiday_delivery: [false],
      allow_upgrade: [true],
      allow_downgrade: [true],
      allow_pause: [true],
      allow_resume: [true],
      allow_skip: [true],
      allow_cancel: [true],
      is_popular: [false],
      is_recommended: [false],
      display_order: [0],
      status: ['draft'],
      starts_at: [null],
      ends_at: [null],
      remarks: [''],
    });
  }

  loadDropdowns(): void {
    this.kitchenApi.getAll().subscribe({ next: (res) => { this.kitchens = res.data || []; } });
    this.mealCategoryApi.getAll().subscribe({ next: (res) => { this.mealCategories = res.data || []; } });
  }

  loadPlan(): void {
    this.subscriptionPlanApi.getSubscriptionPlan(this.planUuid).subscribe({
      next: (res) => {
        const plan = res.data!;
        this.planForm.patchValue({
          plan_code: plan.plan_code,
          plan_name: plan.plan_name,
          description: plan.description || '',
          plan_type: plan.plan_type,
          billing_cycle: plan.billing_cycle,
          duration_days: plan.duration_days,
          meal_category_id: plan.meal_category_id,
          kitchen_id: plan.kitchen_id,
          price: plan.price,
          offer_price: plan.offer_price,
          security_deposit: plan.security_deposit,
          tax_percentage: plan.tax_percentage,
          delivery_charge: plan.delivery_charge,
          joining_fee: plan.joining_fee,
          minimum_order_amount: plan.minimum_order_amount,
          maximum_skip_days: plan.maximum_skip_days,
          maximum_pause_days: plan.maximum_pause_days,
          maximum_active_subscriptions: plan.maximum_active_subscriptions,
          auto_renew: plan.auto_renew,
          renewal_discount: plan.renewal_discount,
          trial_days: plan.trial_days,
          meal_selection_enabled: plan.meal_selection_enabled,
          custom_meal_selection: plan.custom_meal_selection,
          default_meal_assignment: plan.default_meal_assignment,
          carry_forward_skipped_meals: plan.carry_forward_skipped_meals,
          weekend_delivery: plan.weekend_delivery,
          holiday_delivery: plan.holiday_delivery,
          allow_upgrade: plan.allow_upgrade,
          allow_downgrade: plan.allow_downgrade,
          allow_pause: plan.allow_pause,
          allow_resume: plan.allow_resume,
          allow_skip: plan.allow_skip,
          allow_cancel: plan.allow_cancel,
          is_popular: plan.is_popular,
          is_recommended: plan.is_recommended,
          display_order: plan.display_order,
          status: plan.status,
          starts_at: plan.starts_at ? plan.starts_at.substring(0, 16) : null,
          ends_at: plan.ends_at ? plan.ends_at.substring(0, 16) : null,
          remarks: plan.remarks || '',
        });
      },
      error: () => { this.notification.error('Failed to load plan'); this.router.navigate(['/admin/subscription-plans']); },
    });
  }

  onSubmit(): void {
    if (this.planForm.invalid) return;
    this.saving = true;

    const data = { ...this.planForm.value };
    if (data.starts_at) { data.starts_at = new Date(data.starts_at).toISOString(); }
    if (data.ends_at) { data.ends_at = new Date(data.ends_at).toISOString(); }

    const obs = this.isEditMode
      ? this.subscriptionPlanApi.updateSubscriptionPlan(this.planUuid, data)
      : this.subscriptionPlanApi.createSubscriptionPlan(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditMode ? 'Plan updated' : 'Plan created');
        const uuid = res.data?.uuid || this.planUuid;
        this.router.navigate(['/admin/subscription-plans', uuid]);
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }

  trackByValue(index: number, item: any): any { return item.value; }
  trackById(index: number, item: any): any { return item.id; }
}
