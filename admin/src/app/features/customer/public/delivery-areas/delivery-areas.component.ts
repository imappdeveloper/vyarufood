import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerBrowseApiService, PincodeCheckResponse } from '../../../../core/services/customer-browse-api.service';

@Component({
  selector: 'app-delivery-areas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section style="background: linear-gradient(135deg, #059669, #047857, #166534); padding: 4rem 1rem 3rem; text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; inset: 0; opacity: 0.06; pointer-events: none;">
        <div style="position: absolute; top: -4rem; left: -3rem; width: 14rem; height: 14rem; background: #fff; border-radius: 50%; filter: blur(60px);"></div>
        <div style="position: absolute; bottom: -4rem; right: -3rem; width: 12rem; height: 12rem; background: #fff; border-radius: 50%; filter: blur(60px);"></div>
      </div>
      <div style="position: relative; z-index: 10; max-width: 48rem; margin: 0 auto;">
        <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border-radius: 9999px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 1rem; animation: daSlideIn 0.5s ease-out;">
          <span class="material-icons" style="font-size: 14px; color: #facc15;">local_shipping</span>
          <span style="color: #fff; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Service</span>
        </div>
        <h1 style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; animation: daSlideIn 0.5s ease-out 0.1s both;">Delivery Areas</h1>
        <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; max-width: 28rem; margin: 0 auto; animation: daSlideIn 0.5s ease-out 0.2s both;">
          We deliver fresh homestyle meals to your doorstep. Check if we serve your area.
        </p>
      </div>
    </section>

    <section style="max-width: 56rem; margin: -1.5rem auto 0; padding: 0 1rem; position: relative; z-index: 20;">
      <!-- Pincode Checker Card -->
      <div style="background: #fff; border-radius: 1rem; box-shadow: 0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e5e7eb; padding: 2rem; animation: daSlideIn 0.5s ease-out 0.3s both;">
        <h2 style="font-size: 1.125rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem;">Check Your Pincode</h2>
        <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 1.25rem;">Enter your 6-digit pincode to check delivery availability</p>

        <form (ngSubmit)="checkDelivery()" style="display: flex; gap: 0.75rem;">
          <div style="position: relative; flex: 1;">
            <span class="material-icons" style="position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 20px;">pin_drop</span>
            <input
              type="text"
              [(ngModel)]="pincode"
              name="pincode"
              placeholder="Enter 6-digit pincode"
              maxlength="6"
              pattern="[0-9]*"
              inputmode="numeric"
              aria-label="Pincode"
              style="width: 100%; padding: 0.875rem 0.875rem 0.875rem 3rem; border-radius: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; color: #1e293b; font-size: 0.9rem; outline: none; font-weight: 500; transition: all 0.3s;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.12)'; this.style.background='#fff';"
              onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'; this.style.background='#f8fafc';" />
          </div>
          <button type="submit"
                  [disabled]="checking()"
                  style="padding: 0.875rem 2rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-weight: 600; font-size: 0.875rem; border-radius: 0.75rem; box-shadow: 0 4px 14px rgba(5,150,105,0.35); border: none; cursor: pointer; white-space: nowrap; transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem;"
                  onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)';"
                  onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none';"
                  [style.opacity]="checking() ? 0.5 : 1">
            @if (checking()) {
              <span class="material-icons" style="font-size: 18px; animation: spin 0.8s linear infinite;">refresh</span>
            } @else {
              <span class="material-icons" style="font-size: 18px;">search</span>
            }
            Check Availability
          </button>
        </form>

        <!-- Result -->
        @if (result()) {
          <div style="margin-top: 1.25rem; padding: 1rem 1.25rem; border-radius: 0.75rem; animation: daResultPop 0.3s ease-out;"
               [style.background]="result()!.deliverable ? '#ecfdf5' : '#fef2f2'"
               [style.border]="result()!.deliverable ? '1px solid #a7f3d0' : '1px solid #fecaca'">
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
              <span class="material-icons" style="font-size: 1.5rem; margin-top: 0.125rem;"
                    [style.color]="result()!.deliverable ? '#059669' : '#dc2626'">
                {{ result()!.deliverable ? 'check_circle' : 'cancel' }}
              </span>
              <div style="flex: 1;">
                <p style="font-weight: 700; font-size: 0.9rem;" [style.color]="result()!.deliverable ? '#065f46' : '#991b1b'">{{ result()!.message }}</p>
                @if (result()!.deliverable) {
                  <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.75rem;">
                    @if (result()!.zone_name) {
                      <div style="display: flex; align-items: center; gap: 0.375rem;">
                        <span class="material-icons" style="font-size: 16px; color: #059669;">my_location</span>
                        <div>
                          <p style="font-size: 0.65rem; color: #64748b; margin: 0;">Zone</p>
                          <p style="font-size: 0.8rem; font-weight: 600; color: #0f172a; margin: 0;">{{ result()!.zone_name }}</p>
                        </div>
                      </div>
                    }
                    <div style="display: flex; align-items: center; gap: 0.375rem;">
                      <span class="material-icons" style="font-size: 16px; color: #059669;">schedule</span>
                      <div>
                        <p style="font-size: 0.65rem; color: #64748b; margin: 0;">Estimated Time</p>
                        <p style="font-size: 0.8rem; font-weight: 600; color: #0f172a; margin: 0;">{{ result()!.estimated_delivery_time || 30 }} min</p>
                      </div>
                    </div>
                    @if (result()!.delivery_charge !== undefined) {
                      <div style="display: flex; align-items: center; gap: 0.375rem;">
                        <span class="material-icons" style="font-size: 16px; color: #059669;">payments</span>
                        <div>
                          <p style="font-size: 0.65rem; color: #64748b; margin: 0;">Delivery Fee</p>
                          <p style="font-size: 0.8rem; font-weight: 600; color: #0f172a; margin: 0;">
                            {{ result()!.delivery_charge === 0 ? 'Free!' : '&#8377;' + result()!.delivery_charge }}
                          </p>
                        </div>
                      </div>
                    }
                    @if (result()!.minimum_order_amount) {
                      <div style="display: flex; align-items: center; gap: 0.375rem;">
                        <span class="material-icons" style="font-size: 16px; color: #059669;">receipt</span>
                        <div>
                          <p style="font-size: 0.65rem; color: #64748b; margin: 0;">Min Order</p>
                          <p style="font-size: 0.8rem; font-weight: 600; color: #0f172a; margin: 0;">&#8377;{{ result()!.minimum_order_amount }}</p>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- How It Works -->
    <section style="max-width: 56rem; margin: 2.5rem auto 0; padding: 0 1rem;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;">
        @for (step of deliverySteps; track step.title) {
          <div style="text-align: center; padding: 1.5rem 1rem; background: #fff; border-radius: 1rem; border: 1px solid #e5e7eb; transition: all 0.3s;"
               onmouseover="this.style.boxShadow='0 8px 24px rgba(5,150,105,0.08)'; this.style.borderColor='#a7f3d0';"
               onmouseout="this.style.boxShadow='none'; this.style.borderColor='#e5e7eb';">
            <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
              <span class="material-icons">{{ step.icon }}</span>
            </div>
            <h3 style="font-weight: 700; color: #0f172a; font-size: 0.85rem; margin-bottom: 0.25rem;">{{ step.title }}</h3>
            <p style="color: #64748b; font-size: 0.75rem; line-height: 1.5;">{{ step.description }}</p>
          </div>
        }
      </div>
    </section>

    <!-- FAQs -->
    <section style="max-width: 56rem; margin: 2.5rem auto 0; padding: 0 1rem 3rem;">
      <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 1.5rem;">Frequently Asked Questions</h2>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        @for (faq of deliveryFaqs; track faq.q) {
          <div style="background: #fff; border-radius: 0.75rem; border: 1px solid #e5e7eb; padding: 1.25rem 1.5rem; cursor: pointer; transition: all 0.3s;"
               (click)="toggleFaq(faq)"
               onmouseover="this.style.borderColor='#a7f3d0';"
               onmouseout="this.style.borderColor='#e5e7eb';">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <p style="font-weight: 600; color: #0f172a; font-size: 0.875rem;">{{ faq.q }}</p>
              <span class="material-icons" style="color: #94a3b8; font-size: 20px; transition: transform 0.3s;"
                    [style.transform]="faq.open ? 'rotate(180deg)' : 'rotate(0)'">expand_more</span>
            </div>
            @if (faq.open) {
              <p style="color: #64748b; font-size: 0.8rem; line-height: 1.6; margin-top: 0.75rem;">{{ faq.a }}</p>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    @keyframes daSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes daResultPop {
      from { opacity: 0; transform: scale(0.95) translateY(-4px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 640px) {
      div[style*="grid-template-columns: repeat(3"] {
        grid-template-columns: 1fr !important;
      }
    }
  `],
})
export class DeliveryAreasComponent {
  private browseApi = inject(CustomerBrowseApiService);
  pincode = '';
  checking = signal(false);
  result = signal<PincodeCheckResponse | null>(null);

  deliverySteps = [
    { icon: 'pin_drop', title: 'Enter Pincode', description: 'Type your 6-digit area pincode in the checker above.' },
    { icon: 'check_circle', title: 'Get Instant Result', description: 'See if we deliver to your area with estimated delivery time.' },
    { icon: 'restaurant_menu', title: 'Order Fresh Meals', description: 'Browse our menu and place your order for homestyle delivery.' },
  ];

  deliveryFaqs = [
    { q: 'What are your delivery hours?', a: 'We deliver meals between 7:00 AM and 10:00 PM, seven days a week. Subscription deliveries follow your selected delivery slots.', open: false },
    { q: 'Is there a minimum order amount?', a: 'Minimum order amounts may apply depending on your delivery zone. The pincode checker above will show you the minimum order for your area.', open: false },
    { q: 'Do you charge for delivery?', a: 'Delivery charges vary by zone. Many areas offer free delivery on orders above a certain amount. Check your pincode for specific delivery charges.', open: false },
    { q: 'Can I change my delivery address after ordering?', a: 'You can update your delivery address for upcoming subscription deliveries from your account. For one-time orders, please contact support immediately.', open: false },
  ];

  checkDelivery(): void {
    const pc = this.pincode.trim();
    if (pc.length !== 6 || !/^\d{6}$/.test(pc)) {
      this.result.set({ deliverable: false, pincode: pc, message: 'Please enter a valid 6-digit pincode.' });
      return;
    }
    this.checking.set(true);
    this.result.set(null);
    this.browseApi.checkPincode(pc).subscribe({
      next: (res) => {
        this.checking.set(false);
        if (res.success && res.data) this.result.set(res.data);
      },
      error: () => {
        this.checking.set(false);
        this.result.set({ deliverable: false, pincode: pc, message: 'Unable to check availability. Please try again.' });
      },
    });
  }

  toggleFaq(faq: { open: boolean }): void {
    faq.open = !faq.open;
  }
}
