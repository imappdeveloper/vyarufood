import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { CustomerBrowseApiService } from '../../../../core/services/customer-browse-api.service';
import { CustomerFrontAddressApiService } from '../../../../core/services/customer-front-address-api.service';
import { CustomerSubscriptionApiService, PurchaseSubscriptionPayload } from '../../../../core/services/customer-subscription-api.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import { SubscriptionPlan } from '../../../../core/models/subscription-plan/subscription-plan.model';
import { CustomerAddress, CreateCustomerAddress } from '../../../../core/models/customer/customer-address.model';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-subscription-configure',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div [style]="'max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem;'">
      <!-- Hero Banner -->
      <div style="background: linear-gradient(135deg, #059669, #10b981, #34d399); border-radius: 1rem; padding: 1.75rem 2rem; margin-bottom: 1.5rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -1.5rem; right: -1.5rem; width: 10rem; height: 10rem; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -2rem; left: 25%; width: 8rem; height: 8rem; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
        <div style="position: relative; z-index: 1;">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
            <span class="material-icons" style="color: white; font-size: 1.5rem;">card_membership</span>
            <span style="color: rgba(255,255,255,0.75); font-size: 0.875rem; font-weight: 500;">Configure</span>
          </div>
          <h1 style="color: white; font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0 0.25rem;">
            {{ plan() ? plan()!.plan_name : 'Configure Subscription' }}
          </h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 0.875rem;">Customise your subscription plan details</p>
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav [style]="'display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: #6b7280; margin-bottom: 1.5rem; flex-wrap: wrap;'">
        <a routerLink="/" style="color: #6b7280; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#6b7280'">Home</a>
        <span class="material-icons" style="font-size: 1rem; color: #d1d5db;">chevron_right</span>
        <a routerLink="/subscriptions" style="color: #6b7280; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#6b7280'">Plans</a>
        <span class="material-icons" style="font-size: 1rem; color: #d1d5db;">chevron_right</span>
        @if (plan()) {
          <a [routerLink]="['/subscriptions', plan()!.slug]" style="color: #6b7280; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#6b7280'">{{ plan()!.plan_name }}</a>
          <span class="material-icons" style="font-size: 1rem; color: #d1d5db;">chevron_right</span>
        }
        <span style="color: #111827; font-weight: 500;">Configure</span>
      </nav>

      <!-- Loading Skeleton -->
      @if (loading()) {
        <div [style]="'display: flex; flex-direction: column; gap: 1.5rem; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;'">
          <div style="height: 1.5rem; background: #e5e7eb; border-radius: 0.5rem; width: 33%;"></div>
          <div [style]="'display: grid; grid-template-columns: ' + (isDesktop() ? '2fr 1fr' : '1fr') + '; gap: 2rem;'">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="height: 10rem; background: #e5e7eb; border-radius: 1rem;"></div>
              <div style="height: 8rem; background: #e5e7eb; border-radius: 1rem;"></div>
              <div style="height: 12rem; background: #e5e7eb; border-radius: 1rem;"></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="height: 18rem; background: #e5e7eb; border-radius: 1rem;"></div>
            </div>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error() && !plan()) {
        <div style="text-align: center; padding: 5rem 1rem;">
          <span class="material-icons" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;">error_outline</span>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem;">Something went wrong</h2>
          <p style="color: #6b7280; margin-bottom: 1.5rem;">{{ error() }}</p>
          <a routerLink="/subscriptions" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #059669; color: white; font-weight: 600; border-radius: 0.75rem; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 1.25rem;">arrow_back</span> View All Plans
          </a>
        </div>
      }

      <!-- Main Content -->
      @if (plan()) {
        <!-- Action Message Banner -->
        @if (actionMessage()) {
          <div [style]="'margin-bottom: 1.5rem; padding: 1rem; border-radius: 0.75rem; display: flex; align-items: flex-start; gap: 0.75rem; transition: all 0.3s; ' + (actionMessage()!.type === 'error' ? 'background: #fef2f2; border: 1px solid #fecaca;' : 'background: #f0fdf4; border: 1px solid #bbf7d0;')">
            <span class="material-icons" [style]="'margin-top: 0.125rem; ' + (actionMessage()!.type === 'error' ? 'color: #ef4444;' : 'color: #22c55e;')" style="font-size: 1.25rem;">{{ actionMessage()!.type === 'error' ? 'error' : 'check_circle' }}</span>
            <div style="flex: 1; min-width: 0;">
              <p [style]="'font-size: 0.875rem; font-weight: 500; ' + (actionMessage()!.type === 'error' ? 'color: #b91c1c;' : 'color: #166534;')">{{ actionMessage()!.text }}</p>
              <button (click)="actionMessage.set(null)" [style]="'font-size: 0.75rem; text-decoration: underline; margin-top: 0.25rem; border: none; background: none; cursor: pointer; ' + (actionMessage()!.type === 'error' ? 'color: #ef4444;' : 'color: #22c55e;')">Dismiss</button>
            </div>
          </div>
        }

        <!-- Confirmation Modal -->
        @if (confirming()) {
          <div style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,0,0,0.25); backdrop-filter: blur(4px);" (click)="confirming.set(false)">
            <div style="background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 32rem; width: 100%; max-height: 90vh; overflow-y: auto; padding: 1.5rem 2rem; animation: slideUp 0.3s ease;" (click)="$event.stopPropagation()">
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                <div style="width: 2.5rem; height: 2.5rem; background: #d1fae5; border-radius: 9999px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-icons" style="color: #059669; font-size: 1.25rem;">receipt_long</span>
                </div>
                <div>
                  <h2 style="font-size: 1.125rem; font-weight: 700; color: #111827;">Confirm Subscription</h2>
                  <p style="font-size: 0.875rem; color: #6b7280;">Please review your order</p>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                <!-- Plan -->
                <div style="background: #f9fafb; border-radius: 0.75rem; padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span class="material-icons" style="color: #059669; font-size: 1.125rem;">card_membership</span>
                    <span style="font-size: 0.875rem; font-weight: 500; color: #6b7280;">Plan</span>
                  </div>
                  <p style="font-weight: 600; color: #111827;">{{ plan()!.plan_name }}</p>
                  <p style="font-size: 0.875rem; color: #6b7280;">{{ plan()!.duration_days }} days &middot; {{ plan()!.plan_type | titlecase }}</p>
                </div>

                <!-- Start Date -->
                <div style="background: #f9fafb; border-radius: 0.75rem; padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span class="material-icons" style="color: #059669; font-size: 1.125rem;">calendar_today</span>
                    <span style="font-size: 0.875rem; font-weight: 500; color: #6b7280;">Start Date</span>
                  </div>
                  <p style="font-weight: 600; color: #111827;">{{ formatDateForDisplay(startDate()) }}</p>
                </div>

                <!-- Delivery Slot -->
                @if (deliverySlot()) {
                  <div style="background: #f9fafb; border-radius: 0.75rem; padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <span class="material-icons" style="color: #059669; font-size: 1.125rem;">schedule</span>
                      <span style="font-size: 0.875rem; font-weight: 500; color: #6b7280;">Delivery Slot</span>
                    </div>
                    <p style="font-weight: 600; color: #111827;">{{ deliverySlot() | titlecase }}</p>
                  </div>
                }

                <!-- Address -->
                @if (selectedAddress()) {
                  <div style="background: #f9fafb; border-radius: 0.75rem; padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <span class="material-icons" style="color: #059669; font-size: 1.125rem;">location_on</span>
                      <span style="font-size: 0.875rem; font-weight: 500; color: #6b7280;">Delivery Address</span>
                    </div>
                    <p style="font-weight: 600; color: #111827;">{{ selectedAddress()!.address_line_1 }}</p>
                    @if (selectedAddress()!.address_line_2) {
                      <p style="font-size: 0.875rem; color: #4b5563;">{{ selectedAddress()!.address_line_2 }}</p>
                    }
                    <p style="font-size: 0.875rem; color: #6b7280;">{{ selectedAddress()!.city?.name || '' }}{{ selectedAddress()!.state?.name ? ', ' + selectedAddress()!.state.name : '' }}{{ selectedAddress()!.pincode ? ' - ' + selectedAddress()!.pincode : '' }}</p>
                  </div>
                }

                <!-- Total -->
                <div style="background: #d1fae5; border-radius: 0.75rem; padding: 1rem; border: 1px solid #a7f3d0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600; color: #111827;">Pay Now</span>
                    <span style="font-size: 1.25rem; font-weight: 700; color: #059669;">₹{{ payNow() }}</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; padding-top: 0.5rem; border-top: 1px dashed #a7f3d0;">
                    <span style="font-weight: 500; color: #6b7280;">Mode</span>
                    <span style="font-weight: 500; color: #111827;">{{ paymentMode() === 'full' ? 'Full Payment' : 'Security Deposit' }}</span>
                  </div>
                  @if (pendingAmount() > 0) {
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; padding-top: 0.25rem;">
                      <span style="font-weight: 500; color: #f59e0b;">Pending Amount</span>
                      <span style="font-weight: 600; color: #f59e0b;">₹{{ pendingAmount() }}</span>
                    </div>
                  }
                </div>
              </div>

              <p style="font-size: 0.75rem; color: #9ca3af; text-align: center; margin-bottom: 1.25rem;">By clicking Subscribe, you agree to our terms and conditions.</p>

              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <button (click)="confirming.set(false)" style="flex: 1; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; color: #374151; font-weight: 500; border-radius: 0.75rem; cursor: pointer; background: white; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">Go Back</button>
                <button (click)="confirmAndSubscribe()" [disabled]="submitting()" style="flex: 1; padding: 0.75rem 1rem; background: #059669; color: white; font-weight: 600; border: none; border-radius: 0.75rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center;" [style.opacity]="submitting() ? '0.5' : '1'" [style.cursor]="submitting() ? 'not-allowed' : 'pointer'" onmouseover="if(!submitting())this.style.background='#047857'" onmouseout="if(!submitting())this.style.background='#059669'">
                  @if (submitting()) {
                    <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                      <span style="width: 1rem; height: 1rem; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 9999px; animation: spin 1s linear infinite; display: inline-block;"></span>
                      Processing...
                    </span>
                  } @else {
                    Pay ₹{{ payNow() }}
                  }
                </button>
              </div>
            </div>
          </div>
        }

        <div [style]="'display: grid; grid-template-columns: ' + (isDesktop() ? '2fr 1fr' : '1fr') + '; gap: 2rem; align-items: start;'">
          <!-- Left: Configuration -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Plan Summary Card -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
              <h3 style="font-weight: 600; color: #111827; margin-bottom: 1rem; font-size: 1.0625rem;">Plan Summary</h3>
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div style="width: 3rem; height: 3rem; background: #d1fae5; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-icons" style="color: #059669; font-size: 1.5rem;">card_membership</span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                    <h4 style="font-weight: 600; color: #111827;">{{ plan()!.plan_name }}</h4>
                    @if (plan()!.is_popular) {
                      <span style="padding: 0.125rem 0.5rem; background: #059669; color: white; font-size: 0.75rem; font-weight: 700; border-radius: 9999px;">Popular</span>
                    }
                    @if (plan()!.is_recommended && !plan()!.is_popular) {
                      <span style="padding: 0.125rem 0.5rem; background: #3b82f6; color: white; font-size: 0.75rem; font-weight: 700; border-radius: 9999px;">Recommended</span>
                    }
                  </div>
                  <p style="font-size: 0.875rem; color: #6b7280;">
                    {{ plan()!.duration_days }} days
                    @if (plan()!.meal_category_name) {
                      <span style="margin: 0 0.25rem;">&middot;</span> {{ plan()!.meal_category_name }}
                    }
                    <span style="margin: 0 0.25rem;">&middot;</span> {{ plan()!.plan_type | titlecase }}
                  </p>
                  @if (plan()!.description) {
                    <p style="font-size: 0.875rem; color: #4b5563; margin-top: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ plan()!.description }}</p>
                  }
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  @if (hasDiscount()) {
                    <span style="color: #9ca3af; text-decoration: line-through; font-size: 0.875rem;">₹{{ originalPrice() }}</span>
                  }
                  <div style="font-size: 1.25rem; font-weight: 700; color: #111827;">₹{{ planPrice() }}</div>
                  <span style="font-size: 0.75rem; color: #9ca3af;">/{{ plan()!.duration_days }} days</span>
                </div>
              </div>
            </div>

            <!-- Start Date Card -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
              <h3 style="font-weight: 600; color: #111827; margin-bottom: 1rem; font-size: 1.0625rem;">Start Date</h3>
              <div style="max-width: 24rem;">
                <label for="start-date" style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Select when your subscription should begin</label>
                <input id="start-date" type="date" [value]="startDate()" [min]="minDate()" (change)="onStartDateChange($event)" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s; font-size: 0.9375rem; color: #111827; box-sizing: border-box;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.5rem;">Minimum start date is tomorrow</p>
              </div>
            </div>

            <!-- Delivery Slot Card -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
              <h3 style="font-weight: 600; color: #111827; margin-bottom: 1rem; font-size: 1.0625rem;">Delivery Slot <span style="font-weight: 400; color: #9ca3af; font-size: 0.75rem;">(Optional)</span></h3>
              <div style="max-width: 24rem;">
                <label for="delivery-slot" style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Select your preferred delivery time</label>
                <select id="delivery-slot" [value]="deliverySlot()" (change)="onDeliverySlotChange($event)" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s; font-size: 0.9375rem; color: #111827; box-sizing: border-box; background: white;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
                  <option value="">Select a time slot</option>
                  <option value="morning">Morning (7:00 AM - 10:00 AM)</option>
                  <option value="afternoon">Afternoon (12:00 PM - 3:00 PM)</option>
                  <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>

            <!-- Address Selection Card -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
              <h3 style="font-weight: 600; color: #111827; margin-bottom: 1rem; font-size: 1.0625rem;">Delivery Address</h3>
              @if (addresses().length === 0 && !showAddressForm()) {
                <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">No addresses found. Please add a delivery address.</p>
              }

              @for (addr of addresses(); track addr.uuid) {
                <label [style]="'display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; border-radius: 0.75rem; cursor: pointer; margin-bottom: 0.75rem; transition: all 0.2s; border: 2px solid ' + (selectedAddressUuid() === addr.uuid ? '#10b981' : '#e5e7eb') + '; ' + (selectedAddressUuid() === addr.uuid ? 'background: #f0fdf4;' : '')" onmouseover="if(this.style.borderColor!=='rgb(16, 185, 129)'){this.style.borderColor='#d1d5db'}" onmouseout="if(this.style.borderColor!=='rgb(16, 185, 129)'){this.style.borderColor='#e5e7eb'}">
                  <input type="radio" name="address" [value]="addr.uuid" [checked]="selectedAddressUuid() === addr.uuid" (change)="selectedAddressUuid.set(addr.uuid)" style="margin-top: 0.25rem; accent-color: #059669;" />
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <p style="font-weight: 500; color: #111827;">{{ addr.address_line_1 }}</p>
                      @if (addr.is_default) {
                        <span style="padding: 0.125rem 0.5rem; background: #d1fae5; color: #166534; font-size: 0.75rem; font-weight: 500; border-radius: 9999px;">Default</span>
                      }
                    </div>
                    @if (addr.address_line_2) {
                      <p style="font-size: 0.875rem; color: #6b7280;">{{ addr.address_line_2 }}</p>
                    }
                    <p style="font-size: 0.875rem; color: #6b7280;">{{ addr.city?.name || '' }}{{ addr.state?.name ? ', ' + addr.state.name : '' }}{{ addr.pincode ? ' - ' + addr.pincode : '' }}</p>
                    @if (addr.landmark) {
                      <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">Landmark: {{ addr.landmark }}</p>
                    }
                  </div>
                </label>
              }

              @if (!showAddressForm()) {
                <button (click)="showAddressForm.set(true)" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #059669; font-weight: 500; margin-top: 0.5rem; border: none; background: none; cursor: pointer; padding: 0; transition: color 0.2s;" onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">
                  <span class="material-icons" style="font-size: 1.25rem;">add_circle_outline</span>
                  Add new address
                </button>
              }

              @if (showAddressForm()) {
                <div style="border: 1px solid #a7f3d0; border-radius: 0.75rem; padding: 1rem; margin-top: 0.75rem; background: rgba(240,253,244,0.5);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                    <h4 style="font-weight: 500; color: #111827;">New Address</h4>
                    <button (click)="showAddressForm.set(false)" style="color: #9ca3af; border: none; background: none; cursor: pointer; padding: 0; transition: color 0.2s;" onmouseover="this.style.color='#4b5563'" onmouseout="this.style.color='#9ca3af'">
                      <span class="material-icons" style="font-size: 1.25rem;">close</span>
                    </button>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div>
                      <label style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Address Line 1 *</label>
                      <input type="text" [(ngModel)]="newAddress.address_line_1" placeholder="Flat/House No., Building Name, Street" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 0.875rem; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Address Line 2</label>
                      <input type="text" [(ngModel)]="newAddress.address_line_2" placeholder="Area, Colony, Locality" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 0.875rem; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                      <div>
                        <label style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Landmark</label>
                        <input type="text" [(ngModel)]="newAddress.landmark" placeholder="Near..." style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 0.875rem; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                      </div>
                      <div>
                        <label style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Pincode</label>
                        <input type="text" [(ngModel)]="newAddress.pincode" placeholder="400001" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 0.875rem; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                      </div>
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Contact Person</label>
                      <input type="text" [(ngModel)]="newAddress.contact_person" placeholder="Full Name" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 0.875rem; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Contact Mobile</label>
                      <input type="tel" [(ngModel)]="newAddress.contact_mobile" placeholder="+91 98765 43210" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 0.875rem; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding-top: 0.25rem;">
                      <input type="checkbox" id="new-addr-default" [(ngModel)]="newAddress.is_default" style="accent-color: #059669; border-radius: 0.25rem;" />
                      <label for="new-addr-default" style="font-size: 0.875rem; color: #6b7280;">Set as default address</label>
                    </div>
                    @if (addressFormError()) {
                      <p style="font-size: 0.875rem; color: #dc2626;">{{ addressFormError() }}</p>
                    }
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding-top: 0.5rem;">
                      <button (click)="saveNewAddress()" [disabled]="savingAddress() || !newAddress.address_line_1" style="padding: 0.5rem 1rem; background: #059669; color: white; font-size: 0.875rem; font-weight: 500; border: none; border-radius: 0.5rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 0.5rem;" [style.opacity]="(savingAddress() || !newAddress.address_line_1) ? '0.5' : '1'" [style.cursor]="(savingAddress() || !newAddress.address_line_1) ? 'not-allowed' : 'pointer'" onmouseover="if(!this.disabled)this.style.background='#047857'" onmouseout="if(!this.disabled)this.style.background='#059669'">
                        @if (savingAddress()) {
                          <span style="width: 0.875rem; height: 0.875rem; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 9999px; animation: spin 1s linear infinite; display: inline-block;"></span>
                          Saving...
                        } @else {
                          <span class="material-icons" style="font-size: 1rem;">check</span>
                          Save Address
                        }
                      </button>
                      <button (click)="showAddressForm.set(false)" style="padding: 0.5rem 1rem; font-size: 0.875rem; color: #6b7280; border: none; background: none; cursor: pointer; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='#111827'" onmouseout="this.style.color='#6b7280'">Cancel</button>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Payment / Wallet Card -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
              <h3 style="font-weight: 600; color: #111827; margin-bottom: 1rem; font-size: 1.0625rem;">Payment Mode</h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
                <label [style]="'display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 2px solid ' + (paymentMode() === 'full' ? '#10b981' : '#e5e7eb') + '; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; ' + (paymentMode() === 'full' ? 'background: #f0fdf4;' : '')" onmouseover="if(this.style.borderColor!=='rgb(16, 185, 129)'){this.style.borderColor='#d1d5db'}" onmouseout="if(this.style.borderColor!=='rgb(16, 185, 129)'){this.style.borderColor='#e5e7eb'}">
                  <input type="radio" name="paymentMode" value="full" [checked]="paymentMode() === 'full'" (change)="paymentMode.set('full')" style="accent-color: #059669;" />
                  <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; color: #111827; font-size: 0.9375rem;">Full Payment</p>
                    <p style="font-size: 0.8125rem; color: #6b7280;">Pay full amount &mdash; no pending dues</p>
                  </div>
                  <div style="text-align: right; flex-shrink: 0;">
                    <div style="font-weight: 700; color: #059669; font-size: 1.0625rem;">₹{{ planPrice() + deliveryCharge() }}</div>
                  </div>
                </label>
                <label [style]="'display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 2px solid ' + (paymentMode() === 'deposit' ? '#10b981' : '#e5e7eb') + '; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; ' + (paymentMode() === 'deposit' ? 'background: #f0fdf4;' : '')" onmouseover="if(this.style.borderColor!=='rgb(16, 185, 129)'){this.style.borderColor='#d1d5db'}" onmouseout="if(this.style.borderColor!=='rgb(16, 185, 129)'){this.style.borderColor='#e5e7eb'}">
                  <input type="radio" name="paymentMode" value="deposit" [checked]="paymentMode() === 'deposit'" (change)="paymentMode.set('deposit')" style="accent-color: #059669;" />
                  <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; color: #111827; font-size: 0.9375rem;">Security Deposit Payment</p>
                    <p style="font-size: 0.8125rem; color: #6b7280;">Pay deposit + delivery now; plan amount pending</p>
                  </div>
                  <div style="text-align: right; flex-shrink: 0;">
                    <div style="font-weight: 700; color: #059669; font-size: 1.0625rem;">₹{{ securityDeposit() + deliveryCharge() }}</div>
                  </div>
                </label>
              </div>

              <h3 style="font-weight: 600; color: #111827; margin-bottom: 0.75rem; font-size: 1.0625rem;">Wallet</h3>
              <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f9fafb; border-radius: 0.75rem;">
                <div style="width: 2.5rem; height: 2.5rem; background: #d1fae5; border-radius: 9999px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-icons" style="color: #059669; font-size: 1.25rem;">account_balance_wallet</span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <p style="font-size: 0.875rem; color: #6b7280;">Wallet Balance</p>
                  <p style="font-size: 1.125rem; font-weight: 700; color: #111827;">₹{{ walletBalance() | number:'1.2-2' }}</p>
                </div>
              </div>
              <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.75rem;">Wallet balance will be applied to your payment</p>
            </div>

            <!-- Remarks Card -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
              <h3 style="font-weight: 600; color: #111827; margin-bottom: 1rem; font-size: 1.0625rem;">Remarks</h3>
              <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.75rem;">Any special instructions for your subscription (optional)</p>
              <textarea [(ngModel)]="remarks" rows="3" placeholder="E.g., Extra spicy, no onions, deliver before 8 AM..." style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s; font-size: 0.875rem; color: #111827; resize: none; box-sizing: border-box; font-family: inherit;" onfocus="this.style.borderColor='#10b981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'"></textarea>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div>
            <div style="background: white; border-radius: 1rem; border: 1px solid #e5e7eb; padding: 1.5rem; position: sticky; top: 6rem;">
              <h3 style="font-weight: 600; color: #111827; margin-bottom: 1rem; font-size: 1.0625rem;">Order Summary</h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280;">Plan</span>
                  <span style="color: #111827; font-weight: 500;">{{ plan()!.plan_name }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280;">Duration</span>
                  <span style="color: #111827;">{{ plan()!.duration_days }} days</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280;">Plan Price</span>
                  <span style="color: #111827;">₹{{ planPrice() }}</span>
                </div>
                @if (securityDeposit() > 0) {
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #6b7280;">Security Deposit</span>
                    <span style="color: #111827;">₹{{ securityDeposit() }}</span>
                  </div>
                }
                @if (joiningFee() > 0) {
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #6b7280;">Joining Fee</span>
                    <span style="color: #111827;">₹{{ joiningFee() }}</span>
                  </div>
                }
                @if (deliveryCharge() > 0) {
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #6b7280;">Delivery Charge</span>
                    <span style="color: #111827;">₹{{ deliveryCharge() }}</span>
                  </div>
                }
                @if (hasDiscount()) {
                  <div style="display: flex; justify-content: space-between; color: #059669;">
                    <span>Discount</span>
                    <span>-₹{{ discountAmount() }}</span>
                  </div>
                }
                <div style="border-top: 1px solid #e5e7eb; padding-top: 0.75rem; display: flex; justify-content: space-between; font-weight: 600; font-size: 1rem;">
                  <span style="color: #111827;">Pay Now</span>
                  <span style="color: #059669;">₹{{ payNow() }}</span>
                </div>
                @if (pendingAmount() > 0) {
                  <div style="display: flex; justify-content: space-between; font-weight: 500; font-size: 0.875rem; padding-top: 0.25rem; border-top: 1px dashed #e5e7eb;">
                    <span style="color: #f59e0b;">Pending Amount</span>
                    <span style="color: #f59e0b;">₹{{ pendingAmount() }}</span>
                  </div>
                }
              </div>

              <button (click)="subscribe()" [disabled]="!canSubscribe() || submitting() || confirming()" style="width: 100%; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #059669; color: white; font-weight: 600; border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-size: 1rem;" [style.opacity]="(!canSubscribe() || submitting() || confirming()) ? '0.5' : '1'" [style.cursor]="(!canSubscribe() || submitting() || confirming()) ? 'not-allowed' : 'pointer'" onmouseover="if(this.style.cursor!=='not-allowed')this.style.background='#047857'" onmouseout="if(this.style.cursor!=='not-allowed')this.style.background='#059669'">
                @if (submitting()) {
                  <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 1rem; height: 1rem; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 9999px; animation: spin 1s linear infinite; display: inline-block;"></span>
                    Processing...
                  </span>
                } @else {
                  Pay ₹{{ payNow() }}
                }
              </button>

              <p style="font-size: 0.75rem; color: #9ca3af; text-align: center; margin-top: 0.75rem;">By subscribing, you agree to our terms and conditions.</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SubscriptionConfigureComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  private addressApi = inject(CustomerFrontAddressApiService);
  private subApi = inject(CustomerSubscriptionApiService);
  private appState = inject(AppStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  isDesktop = signal(window.innerWidth >= 1024);

  @HostListener('window:resize')
  onResize(): void {
    this.isDesktop.set(window.innerWidth >= 1024);
  }

  plan = signal<SubscriptionPlan | null>(null);
  addresses = signal<CustomerAddress[]>([]);
  selectedAddressUuid = signal<string | null>(null);
  startDate = signal<string>('');
  deliverySlot = signal<string>('');
  minDate = signal<string>('');
  loading = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);
  showAddressForm = signal(false);
  savingAddress = signal(false);
  addressFormError = signal<string | null>(null);
  confirming = signal(false);
  actionMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);
  paymentMode = signal<'full' | 'deposit'>('full');
  remarks = '';

  readonly walletBalance = this.appState.walletBalance;

  readonly originalPrice = computed(() => {
    const p = this.plan();
    if (!p) return 0;
    return Number(p.price);
  });

  readonly planPrice = computed(() => {
    const p = this.plan();
    if (!p) return 0;
    return Number(p.effective_price || p.price);
  });

  readonly hasDiscount = computed(() => {
    const p = this.plan();
    if (!p) return false;
    return Number(p.effective_price) > 0 && Number(p.price) > Number(p.effective_price);
  });

  readonly discountAmount = computed(() => {
    if (!this.hasDiscount()) return 0;
    return this.originalPrice() - this.planPrice();
  });

  readonly deliveryCharge = computed(() => {
    const p = this.plan();
    if (!p) return 0;
    return Number(p.delivery_charge);
  });

  readonly securityDeposit = computed(() => {
    const p = this.plan();
    if (!p) return 0;
    return Number(p.security_deposit);
  });

  readonly joiningFee = computed(() => {
    const p = this.plan();
    if (!p) return 0;
    return Number(p.joining_fee);
  });

  readonly payNow = computed(() => {
    if (this.paymentMode() === 'full') {
      return this.planPrice() + this.deliveryCharge();
    }
    return this.securityDeposit() + this.deliveryCharge();
  });

  readonly pendingAmount = computed(() => {
    if (this.paymentMode() === 'full') {
      return 0;
    }
    return Math.max(0, this.planPrice() - this.securityDeposit());
  });

  readonly selectedAddress = computed(() => {
    const uuid = this.selectedAddressUuid();
    if (!uuid) return null;
    return this.addresses().find((a) => a.uuid === uuid) ?? null;
  });

  newAddress: CreateCustomerAddress & { address_line_2?: string } = {
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    pincode: '',
    contact_person: '',
    contact_mobile: '',
    is_default: false,
    country_id: 1,
    state_id: 1,
    city_id: 1,
  };

  ngOnInit(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;
    this.minDate.set(tomorrowStr);
    this.startDate.set(tomorrowStr);

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug');
          if (!slug) {
            this.loading.set(false);
            this.error.set('Invalid plan URL.');
            this.actionMessage.set({ text: 'Invalid plan URL.', type: 'error' });
            return of(null);
          }
          this.loading.set(true);
          this.error.set(null);
          this.actionMessage.set(null);

          return forkJoin({
            plan: this.browseApi.getSubscriptionPlanBySlug(slug).pipe(catchError(() => of(null))),
            addresses: this.addressApi.getAddresses().pipe(catchError(() => of(null))),
          });
        })
      )
      .subscribe((result) => {
        this.loading.set(false);
        if (!result) return;

        if (result.plan && result.plan.success && result.plan.data) {
          this.plan.set(result.plan.data);
          this.seo.setPageTitle(
            `Configure ${result.plan.data.plan_name}`,
            `Configure your subscription for ${result.plan.data.plan_name}`
          );
        } else {
          const msg = 'Failed to load subscription plan. Please try again.';
          this.error.set(msg);
          this.actionMessage.set({ text: msg, type: 'error' });
        }

        if (result.addresses && result.addresses.success && result.addresses.data) {
          this.addresses.set(result.addresses.data);
          const defaultAddr = result.addresses.data.find(
            (a: CustomerAddress) => a.is_default && a.status === 'active'
          );
          if (defaultAddr) {
            this.selectedAddressUuid.set(defaultAddr.uuid);
          } else if (result.addresses.data.length === 1) {
            this.selectedAddressUuid.set(result.addresses.data[0].uuid);
          }
        }
      });
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.startDate.set(input.value);
  }

  onDeliverySlotChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.deliverySlot.set(select.value);
  }

  canSubscribe(): boolean {
    return !!this.plan() && !!this.selectedAddressUuid() && !!this.startDate();
  }

  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  }

  subscribe(): void {
    if (!this.canSubscribe() || !this.plan()) return;
    this.actionMessage.set(null);
    this.confirming.set(true);
  }

  confirmAndSubscribe(): void {
    if (!this.canSubscribe() || !this.plan()) return;
    this.submitting.set(true);
    this.error.set(null);
    this.actionMessage.set(null);

    const payload: PurchaseSubscriptionPayload & { payment_mode?: string } = {
      subscription_plan_id: this.plan()!.id,
      start_date: this.startDate(),
      address_uuid: this.selectedAddressUuid() || undefined,
      delivery_slot: this.deliverySlot() || undefined,
      remarks: this.remarks || undefined,
      payment_mode: this.paymentMode(),
    };

    this.subApi
      .purchaseSubscription(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const subUuid = res.data.uuid;
            this.actionMessage.set({ text: 'Subscription created successfully! Redirecting...', type: 'success' });
            setTimeout(() => {
              this.router.navigate(['/customer/subscriptions', subUuid]);
            }, 800);
          } else {
            const msg = res.message || 'Failed to purchase subscription.';
            this.error.set(msg);
            this.actionMessage.set({ text: msg, type: 'error' });
            this.confirming.set(false);
          }
        },
        error: (err) => {
          this.confirming.set(false);
          if (err.status === 422) {
            const errors = err.error?.errors;
            const msg = errors ? Object.values(errors).flat().join(', ') : 'Validation error.';
            this.error.set(msg as string);
            this.actionMessage.set({ text: msg as string, type: 'error' });
          } else {
            const msg = err.error?.message || 'Failed to purchase subscription. Please try again.';
            this.error.set(msg);
            this.actionMessage.set({ text: msg, type: 'error' });
          }
        },
      });
  }

  saveNewAddress(): void {
    if (!this.newAddress.address_line_1) return;
    this.savingAddress.set(true);
    this.addressFormError.set(null);

    this.addressApi.createAddress(this.newAddress).subscribe({
      next: (res) => {
        this.savingAddress.set(false);
        if (res.success && res.data) {
          const newAddr = res.data;
          this.addresses.update((addrs) => [...addrs, newAddr]);
          this.selectedAddressUuid.set(newAddr.uuid);
          this.showAddressForm.set(false);
          this.resetNewAddressForm();
          this.actionMessage.set({ text: 'Address saved successfully!', type: 'success' });
        } else {
          const msg = res.message || 'Failed to save address.';
          this.addressFormError.set(msg);
          this.actionMessage.set({ text: msg, type: 'error' });
        }
      },
      error: (err) => {
        this.savingAddress.set(false);
        if (err.status === 422) {
          const errors = err.error?.errors;
          const msg = errors ? Object.values(errors).flat().join(', ') : 'Validation error.';
          this.addressFormError.set(msg as string);
          this.actionMessage.set({ text: msg as string, type: 'error' });
        } else {
          const msg = err.error?.message || 'Failed to save address. Please try again.';
          this.addressFormError.set(msg);
          this.actionMessage.set({ text: msg, type: 'error' });
        }
      },
    });
  }

  private resetNewAddressForm(): void {
    this.newAddress = {
      address_line_1: '',
      address_line_2: '',
      landmark: '',
      pincode: '',
      contact_person: '',
      contact_mobile: '',
      is_default: false,
      country_id: 1,
      state_id: 1,
      city_id: 1,
    };
  }
}
