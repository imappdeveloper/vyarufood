import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionPlan } from '../../../core/models/subscription-plan/subscription-plan.model';

@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="['/subscriptions', plan.slug]"
       style="display: flex; flex-direction: column; background: #fff; border-radius: 1rem; border: 1px solid #e2e8f0; text-decoration: none; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: relative; height: 100%;"
       onmouseover="this.style.boxShadow='0 20px 50px rgba(0,0,0,0.08), 0 8px 20px rgba(5,150,105,0.06)'; this.style.borderColor='#a7f3d0'; this.style.transform='translateY(-4px)'"
       onmouseout="this.style.boxShadow='none'; this.style.borderColor='#e2e8f0'; this.style.transform='none'">

      @if (plan.is_popular) {
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #059669, #16a34a, #059669); border-radius: 1rem 1rem 0 0;"></div>
        <div style="position: absolute; top: -0.6rem; left: 50%; transform: translateX(-50%); z-index: 10; display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.875rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-size: 0.6rem; font-weight: 700; border-radius: 9999px; box-shadow: 0 4px 12px rgba(5,150,105,0.4); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;">
          <span class="material-icons" style="font-size: 12px;">workspace_premium</span> Most Popular
        </div>
      }

      @if (plan.is_recommended && !plan.is_popular) {
        <div style="position: absolute; top: -0.6rem; left: 50%; transform: translateX(-50%); z-index: 10; padding: 0.25rem 0.875rem; background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; font-size: 0.6rem; font-weight: 700; border-radius: 9999px; box-shadow: 0 4px 12px rgba(37,99,235,0.3); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;">
          Recommended
        </div>
      }

      <!-- Content -->
      <div style="padding: 1.5rem 1.5rem 0; flex: 1; display: flex; flex-direction: column;">
        <!-- Plan name + type badge -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.375rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; line-height: 1.3;">{{ plan.plan_name }}</h3>
          @if (plan.plan_type) {
            <span style="padding: 0.125rem 0.5rem; background: #f1f5f9; color: #475569; font-size: 0.6rem; font-weight: 600; border-radius: 9999px; white-space: nowrap; text-transform: capitalize;">{{ plan.plan_type }}</span>
          }
        </div>
        <p style="color: #64748b; font-size: 0.78rem; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ plan.description || 'Fresh meals delivered to your doorstep' }}</p>

        <!-- Price -->
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
          @if (plan.effective_price && plan.effective_price !== plan.price) {
            <span style="font-size: 0.85rem; color: #94a3b8; text-decoration: line-through;">&#8377;{{ plan.price }}</span>
          }
          <div style="display: flex; align-items: baseline; gap: 0.25rem;">
            <span style="font-size: 1.75rem; font-weight: 800; color: #0f172a;">&#8377;{{ plan.effective_price || plan.price }}</span>
            <span style="font-size: 0.78rem; color: #94a3b8;">/{{ plan.billing_cycle === 'monthly' ? 'mo' : plan.billing_cycle === 'weekly' ? 'wk' : plan.duration_days + ' days' }}</span>
          </div>
          @if (plan.effective_price && plan.effective_price !== plan.price) {
            <span style="display: inline-block; margin-top: 0.375rem; padding: 0.125rem 0.5rem; background: #ecfdf5; color: #047857; font-size: 0.65rem; font-weight: 600; border-radius: 9999px;">
              Save {{ getDiscountPercent() }}%
            </span>
          }
        </div>

        <!-- Features -->
        <ul style="list-style: none; padding: 0; margin: 0 0 1.25rem 0; display: flex; flex-direction: column; gap: 0.625rem; flex: 1;">
          @if (plan.duration_days) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              {{ plan.duration_days }} days of meals
            </li>
          }
          @if (plan.meal_selection_enabled) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              Meal selection included
            </li>
          }
          @if (plan.allow_skip && plan.maximum_skip_days) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              Skip meals ({{ plan.maximum_skip_days }} days)
            </li>
          }
          @if (plan.allow_pause) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              Pause subscription
            </li>
          }
          @if (plan.weekend_delivery) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              Weekend delivery
            </li>
          }
          @if (plan.delivery_charge === 0 || plan.delivery_charge === null) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              Free delivery
            </li>
          }
          @if (plan.allow_cancel) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              Cancel anytime
            </li>
          }
          @if (plan.auto_renew) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              Auto-renew{{ plan.renewal_discount ? ' (' + plan.renewal_discount + '% off)' : '' }}
            </li>
          }
          @if (plan.trial_days) {
            <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span>
              {{ plan.trial_days }} day trial
            </li>
          }
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="padding: 0 1.5rem 1.5rem;">
        @if (plan.is_popular) {
          <div style="width: 100%; padding: 0.75rem; text-align: center; border-radius: 0.75rem; font-weight: 700; font-size: 0.85rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; box-shadow: 0 4px 14px rgba(5,150,105,0.35); transition: all 0.25s; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.375rem;"
               onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)'"
               onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none'">
            <span class="material-icons" style="font-size: 18px;">card_membership</span>
            Subscribe Now
          </div>
        } @else {
          <div style="width: 100%; padding: 0.75rem; text-align: center; border-radius: 0.75rem; font-weight: 600; font-size: 0.85rem; background: #f1f5f9; color: #0f172a; transition: all 0.25s; cursor: pointer;"
               onmouseover="this.style.background='#e2e8f0'"
               onmouseout="this.style.background='#f1f5f9'">
            View Details
          </div>
        }
      </div>
    </a>
  `,
})
export class SubscriptionCardComponent {
  @Input({ required: true }) plan!: SubscriptionPlan;

  getDiscountPercent(): number {
    const p = this.plan;
    if (!p || !p.effective_price || !p.price || p.price === 0) return 0;
    return Math.round(((p.price - p.effective_price) / p.price) * 100);
  }
}
