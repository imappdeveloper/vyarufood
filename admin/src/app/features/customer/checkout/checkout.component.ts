import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckoutStateService } from '../../../core/services/checkout-state.service';
import { AddressSelectorComponent } from './components/address-selector/address-selector.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { PaymentMethodSelectorComponent } from './components/payment-method-selector/payment-method-selector.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AddressSelectorComponent, AddressFormComponent, PaymentMethodSelectorComponent],
  template: `
    <!-- Loading -->
    @if (checkout.loading()) {
      <div style="max-width: 1100px; margin: 0 auto; padding: 3rem 1rem;">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="height: 2rem; background: #f1f5f9; border-radius: 0.75rem; width: 12rem; animation: pulse 1.5s infinite;"></div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
            <div style="height: 20rem; background: #f1f5f9; border-radius: 1rem; animation: pulse 1.5s infinite;"></div>
            <div style="height: 12rem; background: #f1f5f9; border-radius: 1rem; animation: pulse 1.5s infinite;"></div>
          </div>
        </div>
      </div>
    }

    <!-- Error -->
    @if (checkout.error() && !checkout.loading()) {
      <div style="max-width: 1100px; margin: 0 auto; padding: 4rem 1rem;">
        <div style="background: white; border-radius: 1.25rem; border: 1px solid #f1f5f9; padding: 4rem 2rem; text-align: center;">
          <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #fef2f2, #fee2e2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: #ef4444; font-size: 2.25rem;">error_outline</span>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">Checkout Error</h2>
          <p style="color: #64748b; margin-bottom: 2rem; font-size: 0.9rem;">{{ checkout.error() }}</p>
          <a routerLink="/cart"
            style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #059669; color: white; font-weight: 600; border-radius: 0.75rem; text-decoration: none; font-size: 0.9rem; transition: background 0.2s;"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 1.1rem;">arrow_back</span> Back to Cart
          </a>
        </div>
      </div>
    }

    <!-- Empty cart -->
    @if (!checkout.loading() && !checkout.error() && checkout.summary()?.cart?.item_count === 0) {
      <div style="max-width: 1100px; margin: 0 auto; padding: 4rem 1rem;">
        <div style="background: white; border-radius: 1.25rem; border: 1px solid #f1f5f9; padding: 4rem 2rem; text-align: center;">
          <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: #059669; font-size: 2.25rem;">shopping_cart</span>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">Your cart is empty</h2>
          <p style="color: #64748b; margin-bottom: 2rem; font-size: 0.9rem;">Add some meals to your cart before checking out.</p>
          <a routerLink="/meals"
            style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #059669; color: white; font-weight: 600; border-radius: 0.75rem; text-decoration: none; font-size: 0.9rem; transition: background 0.2s;"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 1.1rem;">restaurant</span> Browse Meals
          </a>
        </div>
      </div>
    }

    <!-- Checkout Content -->
    @if (!checkout.loading() && !checkout.error() && checkout.summary()?.cart?.item_count > 0) {
      <!-- Hero Banner -->
      <div style="background: linear-gradient(135deg, #059669, #10b981, #34d399); padding: 2rem 1rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -20px; left: 10%; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
        <div style="max-width: 1100px; margin: 0 auto; position: relative; z-index: 1;">
          <nav style="margin-bottom: 0.75rem;">
            <ol style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; color: rgba(255,255,255,0.7);">
              <li><a routerLink="/cart" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">Cart</a></li>
              <li><span class="material-icons" style="font-size: 0.85rem;">chevron_right</span></li>
              <li style="color: white; font-weight: 600;">Checkout</li>
            </ol>
          </nav>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: white; margin: 0;">Secure Checkout</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 0.35rem 0 0; font-size: 0.875rem;">Complete your order in just a few steps</p>
        </div>
      </div>

      <div style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem;">
        <!-- Progress Steps -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 2rem; padding: 1.25rem; background: white; border-radius: 1rem; border: 1px solid #f1f5f9;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: #059669; color: white;">1</div>
            <span style="font-size: 0.78rem; font-weight: 600; color: #059669;">Address</span>
          </div>
          <div style="width: 40px; height: 2px; background: #d1fae5; margin: 0 0.5rem;"></div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: #059669; color: white;">2</div>
            <span style="font-size: 0.78rem; font-weight: 600; color: #059669;">Details</span>
          </div>
          <div style="width: 40px; height: 2px; background: #d1fae5; margin: 0 0.5rem;"></div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: #059669; color: white;">3</div>
            <span style="font-size: 0.78rem; font-weight: 600; color: #059669;">Delivery</span>
          </div>
          <div style="width: 40px; height: 2px; background: #d1fae5; margin: 0 0.5rem;"></div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: #059669; color: white;">4</div>
            <span style="font-size: 0.78rem; font-weight: 600; color: #059669;">Payment</span>
          </div>
        </div>

        <!-- Unavailable items warning -->
        @if (checkout.summary()?.has_unavailable_items) {
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 0.75rem; padding: 0.875rem 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
            <span class="material-icons" style="color: #d97706; font-size: 1.25rem;">warning</span>
            <p style="color: #92400e; font-size: 0.85rem; margin: 0;">Some items in your cart are no longer available. Please go back and remove them.</p>
          </div>
        }

        <!-- Pincode not serviceable warning -->
        @if (checkout.pincodeChecking()) {
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 0.75rem; padding: 0.875rem 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
            <span class="material-icons" style="color: #0284c7; font-size: 1.25rem; animation: spin 1s linear infinite;">refresh</span>
            <p style="color: #075985; font-size: 0.85rem; margin: 0;">Checking delivery availability for your address...</p>
          </div>
        }
        @if (!checkout.pincodeChecking() && checkout.pincodeDeliverable() === false && checkout.selectedAddress()) {
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.75rem; padding: 0.875rem 1rem; margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.75rem;">
            <span class="material-icons" style="color: #dc2626; font-size: 1.25rem; margin-top: 0.1rem;">cancel</span>
            <div>
              <p style="color: #991b1b; font-size: 0.85rem; margin: 0 0 0.25rem; font-weight: 600;">We don't deliver to this area yet</p>
              <p style="color: #b91c1c; font-size: 0.8rem; margin: 0;">Please select a different address or add a new one in a serviceable area.</p>
            </div>
          </div>
        }

        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;" class="checkout-grid">
          <!-- Left Column -->
          <div class="checkout-left-col" style="display: flex; flex-direction: column; gap: 1.25rem;">

            <!-- Address Selection -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.boxShadow='none'">
              <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons" style="color: #059669; font-size: 1.1rem;">location_on</span>
                  </div>
                  <h2 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">Delivery Address</h2>
                </div>
                <button (click)="showAddressForm = true"
                  style="display: flex; align-items: center; gap: 0.25rem; padding: 0.35rem 0.75rem; background: #f0fdf4; border: 1px solid #bbf7d0; color: #059669; border-radius: 0.5rem; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                  onmouseover="this.style.background='#dcfce7'" onmouseout="this.style.background='#f0fdf4'">
                  <span class="material-icons" style="font-size: 0.9rem;">add</span> New
                </button>
              </div>
              <div style="padding: 1.25rem;">
                @if (showAddressForm) {
                  <app-address-form
                    (saved)="onAddressSaved($event)"
                    (cancelled)="showAddressForm = false"
                  ></app-address-form>
                }
                @if (!showAddressForm) {
                  <app-address-selector
                    [addresses]="checkout.addresses()"
                    [selectedId]="checkout.checkoutData().addressId"
                    (selected)="onAddressSelected($event)"
                    (addNew)="showAddressForm = true"
                  ></app-address-selector>
                }
              </div>
            </div>

            <!-- Contact Details -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.boxShadow='none'">
              <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: #059669; font-size: 1.1rem;">person</span>
                </div>
                <h2 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">Contact Details</h2>
              </div>
              <div style="padding: 1.25rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">First Name</label>
                  <input type="text" [ngModel]="checkout.checkoutData().firstName" (ngModelChange)="checkout.updateData({ firstName: $event })" placeholder="First name"
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Last Name</label>
                  <input type="text" [ngModel]="checkout.checkoutData().lastName" (ngModelChange)="checkout.updateData({ lastName: $event })" placeholder="Last name"
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Email</label>
                  <input type="email" [ngModel]="checkout.checkoutData().email" (ngModelChange)="checkout.updateData({ email: $event })" placeholder="your@email.com"
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Phone Number</label>
                  <input type="tel" [ngModel]="checkout.checkoutData().phone" (ngModelChange)="checkout.updateData({ phone: $event })" placeholder="9876543210" maxlength="10"
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
                </div>
              </div>
            </div>

            <!-- Delivery Details -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.boxShadow='none'">
              <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: #059669; font-size: 1.1rem;">local_shipping</span>
                </div>
                <h2 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">Delivery Details</h2>
              </div>
              <div style="padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Delivery Date</label>
                  <input type="date" [min]="minDeliveryDate"
                    [ngModel]="checkout.checkoutData().deliveryDate"
                    (ngModelChange)="checkout.updateData({ deliveryDate: $event })"
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Delivery Slot (Optional)</label>
                  <select [ngModel]="checkout.checkoutData().deliverySlot"
                    (ngModelChange)="checkout.updateData({ deliverySlot: $event })"
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; background: white;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
                    <option value="">Select a time slot</option>
                    <option value="morning">Morning (7:00 AM - 10:00 AM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 3:00 PM)</option>
                    <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Delivery Instructions (Optional)</label>
                  <textarea [ngModel]="checkout.checkoutData().deliveryInstruction"
                    (ngModelChange)="checkout.updateData({ deliveryInstruction: $event })"
                    rows="2" placeholder="e.g. Ring the bell, leave at door..."
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; resize: none; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"></textarea>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.boxShadow='none'">
              <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: #059669; font-size: 1.1rem;">payment</span>
                </div>
                <h2 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">Payment Method</h2>
              </div>
              <div style="padding: 1.25rem;">
                <app-payment-method-selector
                  [selectedMethod]="checkout.checkoutData().paymentMethod"
                  [walletBalance]="checkout.walletBalance()"
                  [orderTotal]="checkout.summary()?.cart?.total_amount || 0"
                  (methodSelected)="checkout.updateData({ paymentMethod: $event })"
                ></app-payment-method-selector>
              </div>
            </div>

            <!-- Order Notes -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.boxShadow='none'">
              <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: #059669; font-size: 1.1rem;">note</span>
                </div>
                <h2 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">Order Notes (Optional)</h2>
              </div>
              <div style="padding: 1.25rem;">
                <textarea [ngModel]="checkout.checkoutData().notes"
                  (ngModelChange)="checkout.updateData({ notes: $event })"
                  rows="2" placeholder="Any special requests or notes for your order..."
                  style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; resize: none; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"></textarea>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="checkout-right-col">
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; position: sticky; top: 1rem; overflow: hidden;">
              <!-- Summary Header -->
              <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: #059669; font-size: 1.1rem;">receipt_long</span>
                </div>
                <h2 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">Order Summary</h2>
              </div>

              <div style="padding: 1.25rem;">
                <!-- Items -->
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
                  @for (item of checkout.summary()?.cart?.items; track item.meal_id) {
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="width: 3rem; height: 3rem; border-radius: 0.5rem; background: linear-gradient(135deg, #f0fdf4, #dcfce7); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                        @if (item.meal?.image_url) {
                          <img [src]="item.meal.image_url" style="width: 100%; height: 100%; object-fit: cover;" alt="" />
                        } @else {
                          <span class="material-icons" style="color: #059669; font-size: 1.25rem;">restaurant</span>
                        }
                      </div>
                      <div style="flex: 1; min-width: 0;">
                        <p style="font-size: 0.8rem; font-weight: 600; color: #1e293b; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.meal?.name || 'Meal' }}</p>
                        <p style="font-size: 0.7rem; color: #6b7280; margin: 0.1rem 0 0;">Qty: {{ item.quantity }}</p>
                      </div>
                      <p style="font-size: 0.8rem; font-weight: 600; color: #1e293b; white-space: nowrap; margin: 0;">&#8377;{{ (item.total_price || 0).toFixed(2) }}</p>
                    </div>
                  }
                </div>

                <!-- Totals -->
                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.875rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                    <span style="color: #6b7280;">Subtotal</span>
                    <span style="color: #1e293b;">&#8377;{{ (checkout.summary()?.cart?.subtotal || 0).toFixed(2) }}</span>
                  </div>
                  @if ((checkout.summary()?.cart?.discount_amount || 0) > 0) {
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                      <span style="color: #6b7280;">Meal Discount</span>
                      <span style="color: #059669;">-&#8377;{{ (checkout.summary()?.cart?.discount_amount || 0).toFixed(2) }}</span>
                    </div>
                  }
                  @if ((checkout.summary()?.cart?.coupon_amount || 0) > 0) {
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                      <span style="color: #6b7280;">Coupon ({{ checkout.summary()?.cart?.coupon_code }})</span>
                      <span style="color: #059669;">-&#8377;{{ (checkout.summary()?.cart?.coupon_amount || 0).toFixed(2) }}</span>
                    </div>
                  }
                  @if ((checkout.summary()?.cart?.wallet_amount || 0) > 0) {
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                      <span style="color: #6b7280;">Wallet</span>
                      <span style="color: #059669;">-&#8377;{{ (checkout.summary()?.cart?.wallet_amount || 0).toFixed(2) }}</span>
                    </div>
                  }
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                    <span style="color: #6b7280;">Delivery</span>
                    <span style="color: {{ (checkout.summary()?.cart?.delivery_charge || 0) === 0 ? '#059669' : '#1e293b' }}; font-weight: {{ (checkout.summary()?.cart?.delivery_charge || 0) === 0 ? '600' : '400' }};">{{ (checkout.summary()?.cart?.delivery_charge || 0) === 0 ? 'FREE' : '&#8377;' + (checkout.summary()?.cart?.delivery_charge || 0).toFixed(2) }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                    <span style="color: #6b7280;">Tax</span>
                    <span style="color: #1e293b;">&#8377;{{ (checkout.summary()?.cart?.tax_amount || 0).toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Total -->
                <div style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #d1fae5; border-radius: 0.75rem; padding: 0.875rem 1rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.9rem; font-weight: 700; color: #065f46;">Total</span>
                  <span style="font-size: 1.3rem; font-weight: 800; color: #059669;">&#8377;{{ (checkout.summary()?.cart?.total_amount || 0).toFixed(2) }}</span>
                </div>

                <!-- Place Order Button -->
                <button (click)="checkout.placeOrder()" [disabled]="!checkout.canPlaceOrder()"
                  style="width: 100%; margin-top: 1rem; padding: 0.875rem 1.5rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 700; font-size: 0.95rem; border-radius: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; box-shadow: 0 4px 15px rgba(5,150,105,0.3);"
                  onmouseover="if(!this.disabled){this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.4)'}"
                  onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 15px rgba(5,150,105,0.3)'"
                  [style.opacity]="checkout.canPlaceOrder() ? '1' : '0.5'"
                  [style.cursor]="checkout.canPlaceOrder() ? 'pointer' : 'not-allowed'">
                  @if (checkout.processing()) {
                    <span class="material-icons" style="font-size: 1.1rem; animation: spin 1s linear infinite;">refresh</span>
                    <span>Processing...</span>
                  } @else {
                    <span class="material-icons" style="font-size: 1.1rem;">lock</span>
                    <span>Place Order - &#8377;{{ (checkout.summary()?.cart?.total_amount || 0).toFixed(2) }}</span>
                  }
                </button>

                <!-- Error -->
                @if (checkout.error() && !checkout.loading()) {
                  <p style="margin-top: 0.75rem; font-size: 0.8rem; color: #dc2626; text-align: center;">
                    {{ checkout.error() }}
                  </p>
                }

                <!-- Security notice -->
                <div style="margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.35rem; font-size: 0.7rem; color: #9ca3af;">
                  <span class="material-icons" style="font-size: 0.85rem;">verified_user</span>
                  <span>Secure checkout powered by SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    @media (min-width: 1024px) {
      .checkout-grid { grid-template-columns: 1fr 380px !important; }
      .checkout-left-col { min-width: 0; }
      .checkout-right-col { position: sticky; top: 1rem; align-self: start; }
    }
    @media (max-width: 1023px) {
      .checkout-right-col { order: -1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class CheckoutComponent implements OnInit {
  checkout = inject(CheckoutStateService);

  showAddressForm = false;
  minDeliveryDate = '';

  ngOnInit(): void {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    this.minDeliveryDate = d.toISOString().split('T')[0];

    this.checkout.reset();
    this.checkout.loadSummary();
  }

  onAddressSelected(address: any): void {
    this.checkout.selectAddress(address);
  }

  onAddressSaved(address: any): void {
    this.showAddressForm = false;
    this.checkout.loadSummary();
  }
}
