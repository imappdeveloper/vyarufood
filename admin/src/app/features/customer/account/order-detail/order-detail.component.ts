import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CustomerFrontOrderApiService } from '../../../../core/services/customer-front-order-api.service';
import { CustomerReviewApiService } from '../../../../core/services/customer-review-api.service';
import { CustomerOrder, ORDER_STATUS_CONFIG } from '../../../../core/models/order/order.model';
import { ReviewEligibilityOrderItem } from '../../../../core/models/review/review.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  template: `
    <div style="max-width: 52rem; margin: 0 auto; padding: 1.5rem 0;">

      <!-- Loading -->
      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          @for (i of [1,2,3]; track i) {
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1.5rem;">
              <div style="animation: pulse 1.5s infinite;">
                <div style="height: 1.25rem; background: #e2e8f0; border-radius: 0.5rem; width: 14rem; margin-bottom: 0.75rem;"></div>
                <div style="height: 0.75rem; background: #f1f5f9; border-radius: 0.5rem; width: 20rem; margin-bottom: 0.5rem;"></div>
                <div style="height: 0.75rem; background: #f1f5f9; border-radius: 0.5rem; width: 16rem;"></div>
              </div>
            </div>
          }
        </div>

      <!-- Error -->
      } @else if (error()) {
        <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 3rem 2rem; text-align: center;">
          <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: linear-gradient(135deg, #fef2f2, #fee2e2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: #ef4444; font-size: 1.75rem;">error_outline</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #1e293b; margin: 0 0 0.35rem;">Something went wrong</h3>
          <p style="color: #64748b; font-size: 0.85rem; margin: 0 0 1.5rem;">{{ error() }}</p>
          <button (click)="loadOrder(uuid())"
            style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.25rem; background: #059669; color: white; font-weight: 600; font-size: 0.85rem; border-radius: 0.625rem; border: none; cursor: pointer; box-shadow: 0 2px 8px rgba(5,150,105,0.25);"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 1.1rem;">refresh</span> Try Again
          </button>
        </div>

      <!-- Order Content -->
      } @else if (order()) {

        <!-- Back -->
        <a routerLink="/customer/orders"
          style="display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: #64748b; text-decoration: none; margin-bottom: 0.75rem; transition: color 0.2s;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#64748b'">
          <span class="material-icons" style="font-size: 1rem;">arrow_back</span> My Orders
        </a>

        <!-- Status Banner -->
        <div [style.background]="getBannerGradient()" style="border-radius: 1rem; padding: 1.25rem 1.5rem; margin-bottom: 0.75rem; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -30px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -20px; left: 40%; width: 70px; height: 70px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
          <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: white; font-size: 1.5rem;">{{ getStatusIcon() }}</span>
              </div>
              <div>
                <h1 style="font-size: 1.1rem; font-weight: 800; color: white; margin: 0;">{{ getStatusLabel() }}</h1>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.75rem; margin: 0.15rem 0 0;">Order {{ order()!.order_number_display || '#' + order()!.order_number }} · {{ order()!.created_at | date:'MMM d, h:mm a' }}</p>
              </div>
            </div>
            <span style="background: rgba(255,255,255,0.2); padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em;">{{ getStatusLabel() }}</span>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">

          <!-- Left Column -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">

            <!-- Items + Price Breakdown -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span class="material-icons" style="color: #059669; font-size: 1.15rem;">restaurant_menu</span>
                <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">Items ({{ getUniqueItemCount() }})</h3>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                @for (item of getUniqueItems(); track item.meal_name) {
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.75rem; background: #f8fafc; border-radius: 0.625rem; transition: background 0.2s;"
                    onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='#f8fafc'">
                    <div style="display: flex; align-items: center; gap: 0.625rem; min-width: 0;">
                      <div style="width: 32px; height: 32px; border-radius: 0.5rem; background: linear-gradient(135deg, #ecfdf5, #d1fae5); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <span class="material-icons" style="color: #059669; font-size: 0.9rem;">restaurant</span>
                      </div>
                      <div style="min-width: 0;">
                        <p style="font-size: 0.8rem; color: #1e293b; font-weight: 600; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.meal_name }}</p>
                        <p style="font-size: 0.68rem; color: #94a3b8; margin: 0.1rem 0 0;">{{ item.quantity }} × ₹{{ item.unit_price }}{{ item.tax && +item.tax > 0 ? ' (incl. ₹' + item.tax + ' tax)' : '' }}</p>
                      </div>
                    </div>
                    <p style="font-size: 0.8rem; color: #1e293b; font-weight: 700; white-space: nowrap; margin-left: 0.5rem;">₹{{ item.total }}</p>
                  </div>
                } @empty {
                  <p style="font-size: 0.82rem; color: #94a3b8; padding: 1rem 0; text-align: center;">No items found</p>
                }
              </div>

              <!-- Price Breakdown -->
              <div style="margin-top: 0.75rem; padding-top: 0.625rem; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                  <span style="color: #64748b;">Subtotal</span>
                  <span style="color: #1e293b; font-weight: 500;">₹{{ order()!.subtotal }}</span>
                </div>
                @if (+order()!.discount_amount > 0) {
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                    <span style="color: #64748b;">Meal Discount</span>
                    <span style="color: #059669; font-weight: 500;">-₹{{ order()!.discount_amount }}</span>
                  </div>
                }
                @if (+order()!.coupon_amount > 0) {
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                    <span style="color: #64748b;">Coupon Discount</span>
                    <span style="color: #059669; font-weight: 500;">-₹{{ order()!.coupon_amount }}</span>
                  </div>
                }
                @if (+order()!.wallet_amount > 0) {
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                    <span style="color: #64748b;">Wallet Used</span>
                    <span style="color: #059669; font-weight: 500;">-₹{{ order()!.wallet_amount }}</span>
                  </div>
                }
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                  <span style="color: #64748b;">Tax (GST)</span>
                  <span style="color: #1e293b; font-weight: 500;">₹{{ order()!.tax_amount }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                  <span style="color: #64748b;">Delivery</span>
                  <span style="font-weight: 500;" [style.color]="+order()!.delivery_charge === 0 ? '#059669' : '#1e293b'">{{ +order()!.delivery_charge === 0 ? 'FREE' : '₹' + order()!.delivery_charge }}</span>
                </div>
                <div style="margin-top: 0.25rem; padding-top: 0.5rem; border-top: 1px dashed #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">Total</span>
                  <span style="font-size: 1.1rem; font-weight: 800; color: #059669;">₹{{ order()!.total_amount }}</span>
                </div>
              </div>
            </div>

            <!-- Delivery Address -->
            @if (order()!.address) {
              <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.625rem;">
                  <span class="material-icons" style="color: #059669; font-size: 1.15rem;">location_on</span>
                  <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">Delivery Address</h3>
                </div>
                <div style="display: flex; gap: 0.625rem;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.1rem;">
                    <span class="material-icons" style="color: #059669; font-size: 1rem;">home</span>
                  </div>
                  <div>
                    <p style="font-size: 0.82rem; color: #1e293b; font-weight: 600; margin: 0;">{{ order()!.address!.address_line1 }}</p>
                    @if (order()!.address!.address_line2) {
                      <p style="font-size: 0.75rem; color: #64748b; margin: 0.1rem 0 0;">{{ order()!.address!.address_line2 }}</p>
                    }
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.1rem 0 0;">{{ order()!.address!.city }}, {{ order()!.address!.state }} - {{ order()!.address!.pincode }}</p>
                    @if (order()!.address!.landmark) {
                      <p style="font-size: 0.7rem; color: #94a3b8; margin: 0.15rem 0 0;">📍 {{ order()!.address!.landmark }}</p>
                    }
                  </div>
                </div>
                @if (order()!.delivery_date) {
                  <div style="margin-top: 0.625rem; padding-top: 0.625rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="color: #94a3b8; font-size: 1rem;">event</span>
                    <span style="font-size: 0.78rem; color: #64748b;">{{ order()!.delivery_date | date:'MMM d, y' }}{{ order()!.delivery_slot ? ' · ' + order()!.delivery_slot : '' }}</span>
                  </div>
                }
              </div>
            }

            <!-- Payment -->
            <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.625rem;">
                <span class="material-icons" style="color: #059669; font-size: 1.15rem;">payments</span>
                <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">Payment</h3>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.625rem;">
                  <span class="material-icons" style="color: {{ order()!.payment_status === 'paid' ? '#059669' : '#f59e0b' }}; font-size: 1.1rem;">{{ order()!.payment_status === 'paid' ? 'verified' : 'pending' }}</span>
                  <div>
                    <p style="font-size: 0.82rem; font-weight: 600; color: #1e293b; margin: 0;">{{ order()!.payment_status === 'paid' ? 'Paid' : 'Payment Pending' }}</p>
                    <p style="font-size: 0.68rem; color: #94a3b8; margin: 0.1rem 0 0;">{{ order()!.payment_method ? (order()!.payment_method | titlecase) : 'N/A' }}</p>
                  </div>
                </div>
                <span style="font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.625rem; border-radius: 9999px;"
                  [style.background]="order()!.payment_status === 'paid' ? '#ecfdf5' : '#fef3c7'"
                  [style.color]="order()!.payment_status === 'paid' ? '#059669' : '#d97706'">
                  {{ order()!.payment_status | titlecase }}
                </span>
              </div>
            </div>

            <!-- Status Timeline -->
            @if (order()!.status_history && order()!.status_history!.length > 0) {
              <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                  <span class="material-icons" style="color: #059669; font-size: 1.15rem;">history</span>
                  <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">Order Timeline</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0;">
                  @for (event of order()!.status_history!; track event.id; let i = $index; let last = $last) {
                    <div style="display: flex; gap: 0.75rem;">
                      <div style="display: flex; flex-direction: column; align-items: center; min-width: 16px;">
                        <div style="width: 10px; height: 10px; border-radius: 50%; margin-top: 0.4rem; flex-shrink: 0;"
                          [style.background]="i === 0 ? '#059669' : '#d1fae5'"
                          [style.box-shadow]="i === 0 ? '0 0 0 3px rgba(5,150,105,0.15)' : 'none'"></div>
                        @if (!last) {
                          <div style="width: 2px; flex: 1; background: #e2e8f0; margin: 0.2rem 0; min-height: 1.5rem;"></div>
                        }
                      </div>
                      <div style="padding-bottom: {{ last ? '0' : '0.75rem' }}; padding-top: 0.15rem;">
                        <p style="font-size: 0.8rem; font-weight: 600; color: {{ i === 0 ? '#059669' : '#1e293b' }}; margin: 0; text-transform: capitalize;">{{ event.to_status.replace('_', ' ') }}</p>
                        <p style="font-size: 0.68rem; color: #94a3b8; margin: 0.1rem 0 0;">{{ event.created_at | date:'MMM d, h:mm a' }}</p>
                        @if (event.reason) {
                          <p style="font-size: 0.68rem; color: #64748b; margin: 0.15rem 0 0; font-style: italic;">{{ event.reason }}</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Actions -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              @if (canCancel()) {
                <button (click)="cancelOrder()" [disabled]="cancelling()"
                  style="flex: 0 0 auto; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.65rem 1rem; background: white; border: 1px solid #fecaca; color: #dc2626; font-weight: 600; font-size: 0.8rem; border-radius: 0.625rem; cursor: pointer; transition: all 0.2s;"
                  onmouseover="if(!this.disabled){this.style.background='#fef2f2'; this.style.borderColor='#fca5a5'}" onmouseout="this.style.background='white'; this.style.borderColor='#fecaca'">
                  @if (cancelling()) {
                    <span style="width: 14px; height: 14px; border: 2px solid #fecaca; border-top-color: #dc2626; border-radius: 50%; animation: spin 0.6s linear infinite;"></span>
                  } @else {
                    <span class="material-icons" style="font-size: 0.9rem;">close</span>
                  }
                  Cancel Order
                </button>
              }
              <button (click)="reorder()" [disabled]="reordering()"
                style="flex: 1; min-width: 120px; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.65rem 1rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 600; font-size: 0.8rem; border-radius: 0.625rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(5,150,105,0.25);"
                onmouseover="if(!this.disabled){this.style.boxShadow='0 4px 12px rgba(5,150,105,0.35)'}" onmouseout="this.style.boxShadow='0 2px 8px rgba(5,150,105,0.25)'">
                @if (reordering()) {
                  <span style="width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;"></span>
                } @else {
                  <span class="material-icons" style="font-size: 0.9rem;">replay</span>
                }
                Reorder
              </button>
              <a [routerLink]="['/customer/orders', order()!.uuid, 'track']"
                style="flex: 1; min-width: 120px; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.65rem 1rem; background: white; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.8rem; border-radius: 0.625rem; text-decoration: none; transition: all 0.2s;"
                onmouseover="this.style.borderColor='#cbd5e1'; this.style.background='#f8fafc'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white'">
                <span class="material-icons" style="font-size: 0.9rem;">local_shipping</span> Track
              </a>
              <button (click)="downloadInvoice()"
                [disabled]="downloadingInvoice()"
                style="flex: 0 0 auto; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.65rem 1rem; background: white; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.8rem; border-radius: 0.625rem; cursor: pointer; transition: all 0.2s;"
                onmouseover="if(!this.disabled){this.style.borderColor='#cbd5e1'; this.style.background='#f8fafc'}" onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white'">
                @if (downloadingInvoice()) {
                  <span style="width: 14px; height: 14px; border: 2px solid #e2e8f0; border-top-color: #475569; border-radius: 50%; animation: spin 0.6s linear infinite;"></span>
                } @else {
                  <span class="material-icons" style="font-size: 0.9rem;">download</span>
                }
                Invoice
              </button>
            </div>

            <!-- Reviews Section (delivered orders) -->
            @if (isDelivered() && getUniqueItems().length > 0) {
              <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                  <span class="material-icons" style="color: #f59e0b; font-size: 1.15rem;">rate_review</span>
                  <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">Rate Your Meals</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  @for (item of getUniqueItems(); track item.meal_name) {
                    @if (item.meal_id) {
                      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.75rem; background: #f8fafc; border-radius: 0.5rem;">
                        <p style="font-size: 0.8rem; color: #1e293b; font-weight: 500; margin: 0;">{{ item.meal_name }}</p>
                        @if (getReviewItem(item.meal_id)) {
                          @if (getReviewItem(item.meal_id)!.can_review) {
                            <button (click)="openReviewModal(item.meal_id!, item.meal_name)"
                              style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.3rem 0.625rem; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; font-size: 0.7rem; font-weight: 600; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s; white-space: nowrap;"
                              onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#fffbeb'">
                              <span class="material-icons" style="font-size: 0.75rem;">star</span> Rate
                            </button>
                          } @else if (getReviewItem(item.meal_id)!.existing_review) {
                            <div style="display: flex; align-items: center; gap: 0.3rem;">
                              @for (s of [1,2,3,4,5]; track s) {
                                <span class="material-icons" style="font-size: 0.8rem;" [style.color]="s <= getReviewItem(item.meal_id)!.existing_review!.rating ? '#f59e0b' : '#e5e7eb'">star</span>
                              }
                              <span style="font-size: 0.65rem; color: #94a3b8; margin-left: 0.25rem;">Reviewed</span>
                            </div>
                          }
                        } @else if (!reviewEligibility()) {
                          <button (click)="openReviewModal(item.meal_id!, item.meal_name)"
                            style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.3rem 0.625rem; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; font-size: 0.7rem; font-weight: 600; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s; white-space: nowrap;"
                            onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#fffbeb'">
                            <span class="material-icons" style="font-size: 0.75rem;">star</span> Rate
                          </button>
                        }
                      </div>
                    }
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- Review Modal -->
    @if (showReviewModal()) {
      <div style="position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease;" (click)="closeReviewModal()">
        <div style="background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 28rem; width: 100%; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease;" (click)="$event.stopPropagation()">
          <div style="padding: 1.5rem;">
            <!-- Modal Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 32px; height: 32px; background: #fffbeb; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: #f59e0b; font-size: 1rem;">rate_review</span>
                </div>
                <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0;">Review: {{ reviewMealName() }}</h3>
              </div>
              <button (click)="closeReviewModal()"
                style="width: 28px; height: 28px; border-radius: 50%; border: none; background: #f1f5f9; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;"
                onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                <span class="material-icons" style="font-size: 0.9rem; color: #64748b;">close</span>
              </button>
            </div>

            @if (reviewSubmitting()) {
              <div style="display: flex; flex-direction: column; align-items: center; padding: 2rem 0;">
                <div style="width: 36px; height: 36px; border: 3px solid #d1fae5; border-top-color: #059669; border-radius: 50%; animation: spin 0.6s linear infinite; margin-bottom: 0.75rem;"></div>
                <p style="font-size: 0.85rem; color: #64748b;">Submitting your review...</p>
              </div>
            } @else if (reviewSubmitted()) {
              <div style="display: flex; flex-direction: column; align-items: center; padding: 2rem 0;">
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
                  <span class="material-icons" style="color: #059669; font-size: 1.75rem;">check</span>
                </div>
                <p style="font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.25rem;">Review Submitted!</p>
                <p style="font-size: 0.82rem; color: #64748b; margin: 0;">Thank you for your feedback.</p>
                <button (click)="closeReviewModal()"
                  style="margin-top: 1.25rem; padding: 0.5rem 1.5rem; background: #059669; color: white; font-weight: 600; font-size: 0.82rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background 0.2s;"
                  onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
                  Done
                </button>
              </div>
            } @else {
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Stars -->
                <div>
                  <label style="display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Rating <span style="color: #dc2626;">*</span></label>
                  <div style="display: flex; gap: 0.25rem;">
                    @for (star of [1,2,3,4,5]; track star) {
                      <button type="button" (click)="reviewRating.set(star)" style="background: none; border: none; cursor: pointer; padding: 0.15rem; border-radius: 0.25rem; transition: transform 0.15s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
                        <span class="material-icons" style="font-size: 1.75rem; color: {{ star <= reviewRating() ? '#f59e0b' : '#d1d5db' }};">{{ star <= reviewRating() ? 'star' : 'star_border' }}</span>
                      </button>
                    }
                  </div>
                </div>

                <!-- Title -->
                <div>
                  <label style="display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Title</label>
                  <input type="text" [value]="reviewTitle()" (input)="reviewTitle.set($any($event.target).value)"
                    placeholder="Summarize your experience" maxlength="200"
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
                </div>

                <!-- Comment -->
                <div>
                  <label style="display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Your Review</label>
                  <textarea [value]="reviewComment()" (input)="reviewComment.set($any($event.target).value)"
                    rows="3" maxlength="2000" placeholder="Tell others about your experience..."
                    style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; resize: none; transition: border-color 0.2s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"></textarea>
                </div>

                @if (reviewError()) {
                  <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 0.5rem 0.75rem; display: flex; align-items: flex-start; gap: 0.35rem;">
                    <span class="material-icons" style="color: #dc2626; font-size: 0.85rem; margin-top: 0.05rem;">error</span>
                    <p style="font-size: 0.75rem; color: #991b1b; margin: 0;">{{ reviewError() }}</p>
                  </div>
                }

                <!-- Buttons -->
                <div style="display: flex; gap: 0.5rem; padding-top: 0.25rem;">
                  <button (click)="submitReview()" [disabled]="reviewRating() === 0"
                    style="flex: 1; padding: 0.6rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-weight: 700; font-size: 0.82rem; border-radius: 0.625rem; border: none; cursor: pointer; transition: all 0.2s;"
                    [style.opacity]="reviewRating() === 0 ? '0.5' : '1'"
                    [style.cursor]="reviewRating() === 0 ? 'not-allowed' : 'pointer'">
                    Submit Review
                  </button>
                  <button (click)="closeReviewModal()"
                    style="padding: 0.6rem 1rem; background: white; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.82rem; border-radius: 0.625rem; cursor: pointer; transition: all 0.2s;"
                    onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                    Cancel
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class OrderDetailComponent implements OnDestroy {
  order = signal<CustomerOrder | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  cancelling = signal(false);
  reordering = signal(false);
  downloadingInvoice = signal(false);
  private destroy$ = new Subject<void>();

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderApi = inject(CustomerFrontOrderApiService);
  private reviewApi = inject(CustomerReviewApiService);

  uuid = signal<string>('');
  reviewEligibility = signal<ReviewEligibilityOrderItem[] | null>(null);

  showReviewModal = signal(false);
  reviewMealId = signal<number | null>(null);
  reviewMealName = signal('');
  reviewRating = signal(0);
  reviewTitle = signal('');
  reviewComment = signal('');
  reviewSubmitting = signal(false);
  reviewSubmitted = signal(false);
  reviewError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.uuid.set(id);
        this.loadOrder(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrder(uuid: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.orderApi.getOrder(uuid).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.order.set(res.data);
          this.checkEligibility(res.data.uuid);
        } else {
          this.error.set('Order not found.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set('Order not found.');
        } else if (err.status === 403) {
          this.error.set('You do not have permission to view this order.');
        } else {
          this.error.set('Unable to load order details. Please try again.');
        }
        this.loading.set(false);
      }
    });
  }

  checkEligibility(orderUuid: string): void {
    this.reviewApi.getReviewEligibility(orderUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data && res.data.items) {
            this.reviewEligibility.set(res.data.items);
          }
        },
      });
  }

  isDelivered(): boolean {
    const o = this.order();
    return !!o && ['delivered', 'completed'].includes(o.order_status);
  }

  getReviewItem(mealId: number): ReviewEligibilityOrderItem | undefined {
    return this.reviewEligibility()?.find(item => item.meal_id === mealId);
  }

  openReviewModal(mealId: number, mealName: string): void {
    this.reviewMealId.set(mealId);
    this.reviewMealName.set(mealName);
    this.reviewRating.set(0);
    this.reviewTitle.set('');
    this.reviewComment.set('');
    this.reviewError.set(null);
    this.reviewSubmitted.set(false);
    this.showReviewModal.set(true);
  }

  closeReviewModal(): void {
    this.showReviewModal.set(false);
  }

  submitReview(): void {
    if (this.reviewRating() === 0) return;
    this.reviewSubmitting.set(true);
    this.reviewError.set(null);

    const formData = new FormData();
    formData.append('meal_id', String(this.reviewMealId()));
    const orderId = this.order()?.id;
    if (orderId) {
      formData.append('order_id', String(orderId));
    }
    formData.append('rating', String(this.reviewRating()));
    if (this.reviewTitle().trim()) {
      formData.append('title', this.reviewTitle().trim());
    }
    if (this.reviewComment().trim()) {
      formData.append('comment', this.reviewComment().trim());
    }

    this.reviewApi.createReview(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.reviewSubmitting.set(false);
          this.reviewSubmitted.set(true);
          const order = this.order();
          if (order) {
            this.checkEligibility(order.uuid);
          }
        },
        error: (err) => {
          this.reviewSubmitting.set(false);
          if (err.status === 409) {
            this.reviewError.set('You have already reviewed this meal for this order.');
          } else if (err.status === 422) {
            const errors = err.error?.errors;
            if (errors) {
              const first = Object.values(errors)[0];
              this.reviewError.set(Array.isArray(first) ? String(first[0]) : 'Validation failed.');
            } else {
              this.reviewError.set(err.error?.message || 'Validation failed.');
            }
          } else if (err.status === 429) {
            this.reviewError.set('Too many requests. Please try again later.');
          } else {
            this.reviewError.set(err.error?.message || 'Failed to submit review.');
          }
        },
      });
  }

  canCancel(): boolean {
    const o = this.order();
    if (!o) return false;
    return o.order_status === 'pending';
  }

  cancelOrder(): void {
    const o = this.order();
    if (!o) return;
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;
    this.cancelling.set(true);
    this.orderApi.cancelOrder(o.uuid).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadOrder(o.uuid);
        } else {
          alert(res.message || 'Failed to cancel order. Please try again.');
        }
        this.cancelling.set(false);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('This order can no longer be cancelled. The status has changed.');
          this.loadOrder(o.uuid);
        } else {
          alert(err.error?.message || 'Failed to cancel order. Please try again.');
        }
        this.cancelling.set(false);
      }
    });
  }

  reorder(): void {
    const o = this.order();
    if (!o) return;
    this.reordering.set(true);
    this.orderApi.reorder(o.uuid).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/cart']);
        } else {
          alert(res.message || 'Failed to reorder. Please try again.');
        }
        this.reordering.set(false);
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to reorder. Please try again.');
        this.reordering.set(false);
      }
    });
  }

  downloadInvoice(): void {
    const o = this.order();
    if (!o) return;
    this.downloadingInvoice.set(true);
    this.orderApi.downloadInvoice(o.uuid);
    setTimeout(() => this.downloadingInvoice.set(false), 2000);
  }

  getStatusLabel(): string {
    const o = this.order();
    if (!o) return '';
    return ORDER_STATUS_CONFIG[o.order_status as keyof typeof ORDER_STATUS_CONFIG]?.label || o.order_status;
  }

  getStatusIcon(): string {
    const o = this.order();
    if (!o) return 'info';
    return ORDER_STATUS_CONFIG[o.order_status as keyof typeof ORDER_STATUS_CONFIG]?.icon || 'info';
  }

  getBannerGradient(): string {
    const o = this.order();
    if (!o) return 'linear-gradient(135deg, #6b7280, #9ca3af)';
    const map: Record<string, string> = {
      pending: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      confirmed: 'linear-gradient(135deg, #059669, #10b981)',
      preparing: 'linear-gradient(135deg, #d97706, #f59e0b)',
      ready: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
      out_for_delivery: 'linear-gradient(135deg, #059669, #34d399)',
      delivered: 'linear-gradient(135deg, #059669, #10b981)',
      completed: 'linear-gradient(135deg, #059669, #10b981)',
      cancelled: 'linear-gradient(135deg, #dc2626, #f87171)',
      refunded: 'linear-gradient(135deg, #6b7280, #9ca3af)',
    };
    return map[o.order_status] || 'linear-gradient(135deg, #6b7280, #9ca3af)';
  }

  getUniqueItems(): any[] {
    const o = this.order();
    if (!o?.order_items?.length) return [];
    const merged = new Map<string, any>();
    for (const item of o.order_items) {
      const key = item.meal_name;
      if (merged.has(key)) {
        const existing = merged.get(key);
        existing.quantity += item.quantity;
        existing.total = (parseFloat(existing.total) + parseFloat(item.total)).toFixed(2);
      } else {
        merged.set(key, { ...item });
      }
    }
    return Array.from(merged.values());
  }

  getUniqueItemCount(): number {
    return this.getUniqueItems().length;
  }

  parseAmount(val: string): number {
    return parseFloat(val) || 0;
  }
}
