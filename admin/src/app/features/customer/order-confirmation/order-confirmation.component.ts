import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerFrontOrderApiService } from '../../../core/services/customer-front-order-api.service';
import { CustomerOrder, CustomerOrderAddress } from '../../../core/models/order/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 40rem; margin: 0 auto; padding: 3rem 1.5rem;">

      <!-- Loading -->
      @if (loading) {
        <div style="text-align: center; padding: 4rem 0;">
          <div style="width: 48px; height: 48px; border: 4px solid #d1fae5; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
          <p style="color: #6b7280; font-size: 0.9rem;">Loading your order details...</p>
        </div>

      <!-- Success -->
      } @else if (order) {

        <!-- Success Icon -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 4px 20px rgba(5,150,105,0.2); animation: popIn 0.5s ease-out;">
            <span class="material-icons" style="color: #059669; font-size: 2.25rem;">check_circle</span>
          </div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin: 0 0 0.5rem;">Order Confirmed!</h1>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0; line-height: 1.6;">Thank you for your order. We'll start preparing your meal soon.</p>
        </div>

        <!-- Order Card -->
        <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">

          <!-- Order Number + Status -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
            <div>
              <p style="font-size: 0.75rem; color: #94a3b8; margin: 0 0 0.15rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Order Number</p>
              <p style="font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 0;">{{ order.order_number_display || order.order_number }}</p>
            </div>
            <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: #fef3c7; color: #b45309;">
              <span class="material-icons" style="font-size: 0.85rem;">schedule</span>
              {{ order.order_status | titlecase }}
            </span>
          </div>

          <!-- Delivery Info -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
            <div>
              <p style="font-size: 0.75rem; color: #94a3b8; margin: 0 0 0.25rem; font-weight: 600;">Delivery Date</p>
              <p style="font-size: 0.85rem; font-weight: 600; color: #1e293b; margin: 0;">{{ order.delivery_date | date:'fullDate' }}</p>
            </div>
            @if (order.delivery_slot) {
              <div>
                <p style="font-size: 0.75rem; color: #94a3b8; margin: 0 0 0.25rem; font-weight: 600;">Time Slot</p>
                <p style="font-size: 0.85rem; font-weight: 600; color: #1e293b; margin: 0;">{{ order.delivery_slot | titlecase }}</p>
              </div>
            }
          </div>

          <!-- Delivery Address -->
          @if (order.address) {
            <div style="margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
              <p style="font-size: 0.75rem; color: #94a3b8; margin: 0 0 0.25rem; font-weight: 600;">Delivery Address</p>
              <p style="font-size: 0.85rem; font-weight: 500; color: #1e293b; margin: 0; line-height: 1.5;">{{ getAddressText(order.address) }}</p>
            </div>
          }

          <!-- Items -->
          <div style="margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
            @for (item of getUniqueItems(); track item.meal_name) {
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0;">
                <div style="display: flex; align-items: center; gap: 0.625rem;">
                  <div style="width: 32px; height: 32px; background: #f0fdf4; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons" style="color: #059669; font-size: 1rem;">restaurant</span>
                  </div>
                  <div>
                    <p style="font-size: 0.85rem; font-weight: 600; color: #1e293b; margin: 0;">{{ item.meal_name }}{{ item.quantity > 1 ? ' ×' + item.quantity : '' }}</p>
                     <p style="font-size: 0.7rem; color: #94a3b8; margin: 0;">₹{{ Number(item.unit_price).toFixed(2) }} each</p>
                  </div>
                </div>
                <p style="font-size: 0.85rem; font-weight: 600; color: #1e293b; margin: 0;">₹{{ Number(item.total).toFixed(2) }}</p>
              </div>
            }
          </div>

          <!-- Price Breakdown -->
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span style="font-size: 0.8rem; color: #64748b;">Subtotal</span>
              <span style="font-size: 0.8rem; color: #334155;">₹{{ Number(order.subtotal).toFixed(2) }}</span>
            </div>
            @if (Number(order.discount_amount) > 0) {
              <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
                <span style="font-size: 0.8rem; color: #64748b;">Meal Discount</span>
                <span style="font-size: 0.8rem; color: #059669; font-weight: 600;">-₹{{ Number(order.discount_amount).toFixed(2) }}</span>
              </div>
            }
            @if (Number(order.coupon_amount) > 0) {
              <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
                <span style="font-size: 0.8rem; color: #64748b;">Coupon Discount</span>
                <span style="font-size: 0.8rem; color: #059669; font-weight: 600;">-₹{{ Number(order.coupon_amount).toFixed(2) }}</span>
              </div>
            }
            @if (Number(order.tax_amount) > 0) {
              <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
                <span style="font-size: 0.8rem; color: #64748b;">Tax (GST)</span>
                <span style="font-size: 0.8rem; color: #334155;">₹{{ Number(order.tax_amount).toFixed(2) }}</span>
              </div>
            }
            @if (Number(order.delivery_charge) > 0) {
              <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
                <span style="font-size: 0.8rem; color: #64748b;">Delivery</span>
                <span style="font-size: 0.8rem; color: #334155;">₹{{ Number(order.delivery_charge).toFixed(2) }}</span>
              </div>
            } @else {
              <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
                <span style="font-size: 0.8rem; color: #64748b;">Delivery</span>
                <span style="font-size: 0.8rem; color: #059669; font-weight: 600;">FREE</span>
              </div>
            }
            @if (Number(order.wallet_amount) > 0) {
              <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
                <span style="font-size: 0.8rem; color: #64748b;">Wallet Used</span>
                <span style="font-size: 0.8rem; color: #059669; font-weight: 600;">-₹{{ Number(order.wallet_amount).toFixed(2) }}</span>
              </div>
            }
          </div>

          <!-- Total -->
          <div style="border-top: 2px solid #059669; padding-top: 0.75rem; margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1rem; font-weight: 800; color: #1e293b;">Order Total</span>
              <span style="font-size: 1.25rem; font-weight: 800; color: #059669;">₹{{ Number(order.total_amount).toFixed(2) }}</span>
            </div>
            @if (Number(order.wallet_amount) > 0) {
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem;">
                <span style="font-size: 0.8rem; color: #64748b;">Amount Paid (via {{ getPaymentLabel() }})</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #334155;">₹{{ Number(getAmountPaid()).toFixed(2) }}</span>
              </div>
            }
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem;">
              <span style="font-size: 0.75rem; color: #94a3b8;">Payment Status</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 700; color: {{ order.payment_status === 'paid' ? '#059669' : '#d97706' }};">
                <span class="material-icons" style="font-size: 0.85rem;">{{ order.payment_status === 'paid' ? 'check_circle' : 'pending' }}</span>
                {{ order.payment_status === 'paid' ? 'Paid' : 'Pending' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <a [routerLink]="['/customer/orders', order.uuid]"
            style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 700; font-size: 0.85rem; border-radius: 0.75rem; text-decoration: none; transition: all 0.2s; box-shadow: 0 2px 10px rgba(5,150,105,0.3);"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.4)'"
            onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 10px rgba(5,150,105,0.3)'">
            <span class="material-icons" style="font-size: 1.1rem;">receipt_long</span> View Order
          </a>
          <a routerLink="/meals"
            style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.75rem 1.5rem; background: white; border: 1.5px solid #e2e8f0; color: #475569; font-weight: 700; font-size: 0.85rem; border-radius: 0.75rem; text-decoration: none; transition: all 0.2s;"
            onmouseover="this.style.borderColor='#cbd5e1'; this.style.background='#f8fafc'"
            onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white'">
            <span class="material-icons" style="font-size: 1.1rem;">restaurant</span> Order More
          </a>
        </div>
      } @else {
        <div style="text-align: center; padding: 4rem 0;">
          <span class="material-icons" style="color: #d1d5db; font-size: 4rem; display: block; margin-bottom: 1rem;">search_off</span>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem;">Order Not Found</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0 0 1.5rem;">We couldn't find the order you're looking for.</p>
          <a routerLink="/"
            style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 700; font-size: 0.85rem; border-radius: 0.75rem; text-decoration: none; box-shadow: 0 2px 10px rgba(5,150,105,0.3);">
            <span class="material-icons" style="font-size: 1.1rem;">home</span> Go Home
          </a>
        </div>
      }
    </div>

    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes popIn {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    </style>
  `,
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderApi = inject(CustomerFrontOrderApiService);

  order: CustomerOrder | null = null;
  loading = true;
  protected Number = Number;

  ngOnInit(): void {
    const orderUuid = this.route.snapshot.queryParams['order'];
    if (!orderUuid) {
      this.loading = false;
      return;
    }

    this.orderApi.getOrder(orderUuid).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.order = res.data;
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getUniqueItems(): any[] {
    if (!this.order?.order_items) return [];
    const map = new Map<string, any>();
    for (const item of this.order.order_items) {
      const key = item.meal_name;
      if (map.has(key)) {
        const existing = map.get(key);
        existing.quantity += item.quantity;
        existing.total += item.total;
      } else {
        map.set(key, { ...item });
      }
    }
    return Array.from(map.values());
  }

  getAmountPaid(): number {
    if (!this.order) return 0;
    return Math.max(0, Number(this.order.total_amount) - Number(this.order.wallet_amount));
  }

  getPaymentLabel(): string {
    if (!this.order) return '';
    const method = this.order.payment_method ?? '';
    if (method === 'wallet') return 'Wallet';
    if (method === 'upi') return 'UPI';
    if (method === 'cod') return 'Cash on Delivery';
    return method;
  }

  getAddressText(address: CustomerOrderAddress): string {
    return address.full_address || [address.address_line1, address.address_line2, address.landmark, address.city, address.state, address.pincode].filter(Boolean).join(', ');
  }
}
