import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CustomerFrontOrderApiService } from '../../../../core/services/customer-front-order-api.service';
import { CustomerOrder, ORDER_STATUS_CONFIG, ACTIVE_ORDER_STATUSES } from '../../../../core/models/order/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div style="max-width: 48rem; margin: 0 auto; padding: 1.5rem 0;">

      <!-- Loading -->
      @if (loading()) {
        <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; gap: 1rem; overflow: hidden; padding: 1rem 0;">
            @for (i of [1,2,3,4,5]; track i) {
              <div style="flex: 1; min-width: 60px; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: #e2e8f0; animation: pulse 1.5s infinite;"></div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 4px; width: 100%; animation: pulse 1.5s infinite;"></div>
              </div>
            }
          </div>
          <div style="height: 200px; background: #f8fafc; border-radius: 0.75rem; animation: pulse 1.5s infinite; margin-top: 1rem;"></div>
        </div>

      <!-- Error -->
      } @else if (error()) {
        <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 3rem 2rem; text-align: center;">
          <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: linear-gradient(135deg, #fef2f2, #fee2e2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: #ef4444; font-size: 1.75rem;">error_outline</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #1e293b; margin: 0 0 0.35rem;">Unable to load tracking</h3>
          <p style="color: #64748b; font-size: 0.85rem; margin: 0 0 1.5rem;">{{ error() }}</p>
          <button (click)="loadOrder()"
            style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.25rem; background: #059669; color: white; font-weight: 600; font-size: 0.85rem; border-radius: 0.625rem; border: none; cursor: pointer; box-shadow: 0 2px 8px rgba(5,150,105,0.25);"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 1.1rem;">refresh</span> Try Again
          </button>
        </div>

      <!-- Order Content -->
      } @else if (order()) {

        <!-- Back + Order Header -->
        <div style="margin-bottom: 1rem;">
          <a routerLink="/customer/orders"
            style="display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: #64748b; text-decoration: none; margin-bottom: 0.75rem; transition: color 0.2s;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#64748b'">
            <span class="material-icons" style="font-size: 1rem;">arrow_back</span> My Orders
          </a>

          <!-- Status Banner -->
          <div [style.background]="getBannerGradient()" style="border-radius: 1rem; padding: 1.25rem 1.5rem; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -30px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -20px; left: 40%; width: 70px; height: 70px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: white; font-size: 1.5rem;">{{ getStatusIcon() }}</span>
                </div>
                <div>
                  <h1 style="font-size: 1.1rem; font-weight: 800; color: white; margin: 0;">{{ getStatusLabel() }}</h1>
                  <p style="color: rgba(255,255,255,0.8); font-size: 0.75rem; margin: 0.15rem 0 0;">Order {{ order()!.order_number_display || '#' + order()!.order_number }}</p>
                </div>
              </div>
              <div style="background: rgba(255,255,255,0.2); padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em;">
                {{ getStatusLabel() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Horizontal Tracking Stepper -->
        <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1.25rem 1rem; margin-bottom: 0.75rem; overflow-x: auto; -webkit-overflow-scrolling: touch;">
          <div style="display: flex; align-items: flex-start; min-width: max-content; position: relative; padding: 0.5rem 0;">
            @for (step of trackingSteps(); track step.status; let i = $index; let last = $last) {
              <div style="display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 80px; position: relative; z-index: 1;"
                [style.animation-delay]="(i * 80) + 'ms'">
                <!-- Connector line (before this step) -->
                @if (i > 0) {
                  <div style="position: absolute; top: 20px; right: 50%; width: 100%; height: 3px; z-index: 0;"
                    [style.background]="step.completed || step.current ? '#059669' : '#e2e8f0'"
                    [style.transition]="'background 0.4s ease ' + (i * 100) + 'ms'"></div>
                }

                <!-- Step circle -->
                <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.4s ease; position: relative; z-index: 2;"
                  [style.background]="step.completed ? '#059669' : step.current ? 'linear-gradient(135deg, #059669, #10b981)' : '#f1f5f9'"
                  [style.box-shadow]="step.current ? '0 0 0 5px rgba(5,150,105,0.15), 0 4px 12px rgba(5,150,105,0.25)' : step.completed ? '0 2px 8px rgba(5,150,105,0.2)' : 'none'"
                  [style.transform]="step.current ? 'scale(1.1)' : 'scale(1)'">
                  @if (step.completed && !step.current) {
                    <span class="material-icons" style="color: white; font-size: 1.15rem;">check</span>
                  } @else {
                    <span class="material-icons" [style.color]="step.current ? 'white' : (step.completed ? 'white' : '#94a3b8')" style="font-size: 1.15rem;">{{ step.icon }}</span>
                  }
                  @if (step.current) {
                    <div style="position: absolute; inset: -3px; border-radius: 50%; border: 2px solid rgba(5,150,105,0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  }
                </div>

                <!-- Label -->
                <p style="font-size: 0.65rem; font-weight: 600; margin-top: 0.5rem; text-align: center; line-height: 1.2; transition: color 0.3s; white-space: nowrap;"
                  [style.color]="step.current ? '#059669' : step.completed ? '#059669' : '#94a3b8'">
                  {{ step.label }}
                </p>

                <!-- Timestamp -->
                @if (step.timestamp) {
                  <p style="font-size: 0.55rem; color: #94a3b8; margin-top: 0.15rem; text-align: center; white-space: nowrap;">
                    {{ step.timestamp | date:'h:mm a' }}
                  </p>
                }
              </div>
            }
          </div>
        </div>

        <!-- Order Description Card -->
        <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem; margin-bottom: 0.75rem;">
          <p style="font-size: 0.8rem; color: #64748b; margin: 0; line-height: 1.5;">{{ getStatusDescription() }}</p>
        </div>

        <!-- Delivery Details + Items -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
          <!-- Delivery Info -->
          <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span class="material-icons" style="color: #059669; font-size: 1.15rem;">local_shipping</span>
              <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">Delivery Details</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.625rem;">
              @if (order()!.delivery_date) {
                <div style="display: flex; align-items: center; gap: 0.625rem;">
                  <span class="material-icons" style="color: #94a3b8; font-size: 1rem;">event</span>
                  <div>
                    <p style="font-size: 0.65rem; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Date</p>
                    <p style="font-size: 0.82rem; color: #1e293b; font-weight: 600; margin: 0.1rem 0 0;">{{ order()!.delivery_date | date:'MMM d, y' }}</p>
                  </div>
                </div>
              }
              @if (order()!.delivery_slot) {
                <div style="display: flex; align-items: center; gap: 0.625rem;">
                  <span class="material-icons" style="color: #94a3b8; font-size: 1rem;">schedule</span>
                  <div>
                    <p style="font-size: 0.65rem; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Time Slot</p>
                    <p style="font-size: 0.82rem; color: #1e293b; font-weight: 600; margin: 0.1rem 0 0;">{{ order()!.delivery_slot }}</p>
                  </div>
                </div>
              }
              @if (order()!.address) {
                <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                  <span class="material-icons" style="color: #94a3b8; font-size: 1rem; margin-top: 0.1rem;">location_on</span>
                  <div>
                    <p style="font-size: 0.65rem; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Address</p>
                    <p style="font-size: 0.82rem; color: #1e293b; font-weight: 600; margin: 0.1rem 0 0;">{{ order()!.address!.address_line1 }}</p>
                    <p style="font-size: 0.72rem; color: #64748b; margin: 0.1rem 0 0;">{{ order()!.address!.city }}, {{ order()!.address!.state }} - {{ order()!.address!.pincode }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Items + Price Breakdown -->
          <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 1rem 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span class="material-icons" style="color: #059669; font-size: 1.15rem;">restaurant_menu</span>
              <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">Items ({{ getUniqueItemCount() }})</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              @for (item of getUniqueItems(); track item.meal_name) {
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.625rem; background: #f8fafc; border-radius: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
                    <div style="width: 28px; height: 28px; border-radius: 0.375rem; background: linear-gradient(135deg, #ecfdf5, #d1fae5); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span class="material-icons" style="color: #059669; font-size: 0.85rem;">restaurant</span>
                    </div>
                    <div style="min-width: 0;">
                      <p style="font-size: 0.78rem; color: #1e293b; font-weight: 600; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.meal_name }}</p>
                      <p style="font-size: 0.65rem; color: #94a3b8; margin: 0.05rem 0 0;">{{ item.quantity }} × ₹{{ item.unit_price }}</p>
                    </div>
                  </div>
                  <p style="font-size: 0.78rem; color: #1e293b; font-weight: 700; white-space: nowrap; margin-left: 0.5rem;">₹{{ item.total }}</p>
                </div>
              }
            </div>

            <!-- Price Breakdown -->
            <div style="margin-top: 0.75rem; padding-top: 0.625rem; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.4rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                <span style="color: #64748b;">Subtotal</span>
                <span style="color: #1e293b; font-weight: 500;">₹{{ order()!.subtotal }}</span>
              </div>
              @if (order()!.discount_amount && +order()!.discount_amount > 0) {
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                  <span style="color: #64748b;">Meal Discount</span>
                  <span style="color: #059669; font-weight: 500;">-₹{{ order()!.discount_amount }}</span>
                </div>
              }
              @if (order()!.coupon_amount && +order()!.coupon_amount > 0) {
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                  <span style="color: #64748b;">Coupon Discount</span>
                  <span style="color: #059669; font-weight: 500;">-₹{{ order()!.coupon_amount }}</span>
                </div>
              }
              @if (order()!.wallet_amount && +order()!.wallet_amount > 0) {
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
                <span style="font-weight: 500;" [style.color]="order()!.delivery_charge === '0' ? '#059669' : '#1e293b'">{{ +order()!.delivery_charge === 0 ? 'FREE' : '₹' + order()!.delivery_charge }}</span>
              </div>
              <!-- Total -->
              <div style="margin-top: 0.25rem; padding-top: 0.5rem; border-top: 1px dashed #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">Total</span>
                <span style="font-size: 1.1rem; font-weight: 800; color: #059669;">₹{{ order()!.total_amount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment + Actions Row -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
          <!-- Payment Info -->
          <div style="background: white; border-radius: 1rem; border: 1px solid #f1f5f9; padding: 0.875rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.625rem;">
              <span class="material-icons" [style.color]="order()!.payment_status === 'paid' ? '#059669' : '#f59e0b'" style="font-size: 1.1rem;">{{ order()!.payment_status === 'paid' ? 'verified' : 'pending' }}</span>
              <div>
                <p style="font-size: 0.75rem; font-weight: 600; color: #1e293b; margin: 0;">Payment {{ order()!.payment_status === 'paid' ? 'Completed' : 'Pending' }}</p>
                <p style="font-size: 0.65rem; color: #94a3b8; margin: 0.1rem 0 0;">{{ order()!.payment_method || 'N/A' }}</p>
              </div>
            </div>
            <span style="font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.625rem; border-radius: 9999px;"
              [style.background]="order()!.payment_status === 'paid' ? '#ecfdf5' : '#fef3c7'"
              [style.color]="order()!.payment_status === 'paid' ? '#059669' : '#d97706'">
              {{ order()!.payment_status | titlecase }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
          <a [routerLink]="['/customer/orders', order()!.uuid]"
            style="flex: 1; min-width: 120px; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.7rem 1rem; background: white; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.8rem; border-radius: 0.75rem; text-decoration: none; transition: all 0.2s;"
            onmouseover="this.style.borderColor='#cbd5e1'; this.style.background='#f8fafc'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white'">
            <span class="material-icons" style="font-size: 1rem;">receipt_long</span> View Details
          </a>
          @if (canReorder()) {
            <button (click)="reorder()" [disabled]="reordering()"
              style="flex: 1; min-width: 120px; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.7rem 1rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 600; font-size: 0.8rem; border-radius: 0.75rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(5,150,105,0.25);"
              onmouseover="if(!this.disabled){this.style.boxShadow='0 4px 12px rgba(5,150,105,0.35)'}" onmouseout="this.style.boxShadow='0 2px 8px rgba(5,150,105,0.25)'">
              @if (reordering()) {
                <span style="width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;"></span>
              } @else {
                <span class="material-icons" style="font-size: 1rem;">replay</span>
              }
              Reorder
            </button>
          }
        </div>

        <!-- Live tracking notice -->
        @if (isActive()) {
          <div style="margin-top: 0.75rem; background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #d1fae5; border-radius: 0.75rem; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.625rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #059669; display: flex; align-items: center; justify-content: center; flex-shrink: 0; animation: pulse-dot 2s ease-in-out infinite;">
              <span class="material-icons" style="color: white; font-size: 0.9rem;">refresh</span>
            </div>
            <div>
              <p style="font-size: 0.75rem; font-weight: 600; color: #065f46; margin: 0;">Auto-refreshing every 30s</p>
              <p style="font-size: 0.65rem; color: #059669; margin: 0.1rem 0 0;">Tracking updates automatically. Pull down to refresh.</p>
            </div>
          </div>
        }
      }
    </div>
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
    @keyframes ping {
      75%, 100% { transform: scale(1.4); opacity: 0; }
    }
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.8; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderApi = inject(CustomerFrontOrderApiService);

  order = signal<CustomerOrder | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  reordering = signal(false);
  private refreshInterval: any = null;

  private trackingStepDefs = [
    { status: 'pending', label: 'Placed', icon: 'receipt_long', description: 'Your order has been placed successfully.' },
    { status: 'confirmed', label: 'Confirmed', icon: 'check_circle', description: 'Kitchen has confirmed your order.' },
    { status: 'preparing', label: 'Preparing', icon: 'cooking', description: 'Your meal is being freshly prepared.' },
    { status: 'ready', label: 'Ready', icon: 'restaurant', description: 'Your meal is ready for pickup.' },
    { status: 'out_for_delivery', label: 'On the Way', icon: 'local_shipping', description: 'Your meal is on its way!' },
    { status: 'delivered', label: 'Delivered', icon: 'check_circle_outline', description: 'Your meal has been delivered. Enjoy!' },
  ];

  trackingSteps = signal<{ status: string; label: string; icon: string; description: string; timestamp: string | null; completed: boolean; current: boolean }[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  loadOrder(uuid?: string): void {
    const id = uuid || this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.orderApi.getOrder(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.order.set(res.data);
          this.buildTimeline(res.data);
          if (this.isActive()) {
            this.startPolling();
          }
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
          this.error.set('Unable to load tracking information. Please try again.');
        }
        this.loading.set(false);
      }
    });
  }

  private buildTimeline(order: CustomerOrder): void {
    const history = order.status_history || [];
    const statusMap = new Map<string, string>();
    history.forEach(h => statusMap.set(h.to_status, h.created_at));

    const currentStatus = order.order_status;

    const steps = this.trackingStepDefs.map(def => {
      const completed = this.isStatusBeforeOrEqual(def.status, currentStatus);
      const current = def.status === currentStatus;

      return {
        status: def.status,
        label: def.label,
        icon: def.icon,
        description: def.description,
        timestamp: statusMap.get(def.status) || null,
        completed,
        current,
      };
    });

    this.trackingSteps.set(steps);
  }

  private isStatusBeforeOrEqual(stepStatus: string, currentStatus: string): boolean {
    const order = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const stepIdx = order.indexOf(stepStatus);
    const currentIdx = order.indexOf(currentStatus);
    if (currentStatus === 'completed') return stepIdx <= order.length - 1;
    if (currentStatus === 'cancelled' || currentStatus === 'refunded') {
      const o = this.order();
      if (o && o.status_history && o.status_history.length > 0) {
        const lastDelivered = o.status_history.some(h => h.to_status === 'delivered');
        if (lastDelivered) return stepIdx <= order.length - 1;
      }
      return stepIdx <= 0;
    }
    return stepIdx <= currentIdx;
  }

  isActive(): boolean {
    const o = this.order();
    if (!o) return false;
    return ACTIVE_ORDER_STATUSES.includes(o.order_status as any);
  }

  canReorder(): boolean {
    const o = this.order();
    if (!o) return false;
    return ['delivered', 'completed', 'cancelled'].includes(o.order_status);
  }

  getStatusLabel(): string {
    const o = this.order();
    if (!o) return '';
    return ORDER_STATUS_CONFIG[o.order_status as keyof typeof ORDER_STATUS_CONFIG]?.label || o.order_status;
  }

  getStatusDescription(): string {
    const o = this.order();
    if (!o) return '';
    return ORDER_STATUS_CONFIG[o.order_status as keyof typeof ORDER_STATUS_CONFIG]?.description || '';
  }

  getStatusIcon(): string {
    const o = this.order();
    if (!o) return 'info';
    return ORDER_STATUS_CONFIG[o.order_status as keyof typeof ORDER_STATUS_CONFIG]?.icon || 'info';
  }

  getGradientFrom(): string {
    const o = this.order();
    if (!o) return '#6b7280';
    const map: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#059669',
      preparing: '#d97706',
      ready: '#7c3aed',
      out_for_delivery: '#059669',
      delivered: '#059669',
      completed: '#059669',
      cancelled: '#dc2626',
      refunded: '#6b7280',
    };
    return map[o.order_status] || '#6b7280';
  }

  getGradientTo(): string {
    const o = this.order();
    if (!o) return '#9ca3af';
    const map: Record<string, string> = {
      pending: '#fbbf24',
      confirmed: '#10b981',
      preparing: '#f59e0b',
      ready: '#8b5cf6',
      out_for_delivery: '#34d399',
      delivered: '#10b981',
      completed: '#10b981',
      cancelled: '#f87171',
      refunded: '#9ca3af',
    };
    return map[o.order_status] || '#9ca3af';
  }

  getBannerGradient(): string {
    return `linear-gradient(135deg, ${this.getGradientFrom()}, ${this.getGradientTo()})`;
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

  private startPolling(): void {
    this.stopPolling();
    this.refreshInterval = setInterval(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && this.isActive()) {
        this.orderApi.getOrder(id).subscribe({
          next: (res) => {
            if (res.success && res.data) {
              this.order.set(res.data);
              this.buildTimeline(res.data);
              if (!this.isActive()) {
                this.stopPolling();
              }
            }
          },
          error: () => {}
        });
      }
    }, 30000);
  }

  private stopPolling(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
