import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, switchMap, of, catchError, tap } from 'rxjs';

import { CustomerFrontOrderApiService } from '../../../../core/services/customer-front-order-api.service';
import { OrderStatusBadgeComponent } from '../../../../shared/components/order-status-badge/order-status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { CustomerPaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import {
  CustomerOrder,
  OrderStatus,
  ACTIVE_ORDER_STATUSES,
  COMPLETED_ORDER_STATUSES,
  CANCELLED_ORDER_STATUSES,
  ORDER_STATUS_CONFIG,
  OrderTab,
} from '../../../../core/models/order/order.model';
import { PaginationMeta } from '../../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    OrderStatusBadgeComponent,
    EmptyStateComponent,
    SkeletonLoaderComponent,
    CustomerPaginationComponent,
  ],
  template: `
    <div class="orders-page" style="max-width: 56rem; margin: 0 auto; padding: 1.5rem 0;">

      <!-- Hero Banner -->
      <div class="orders-hero" style="background: linear-gradient(135deg, #059669, #10b981, #34d399); border-radius: 1rem; padding: 1.5rem 1.75rem; margin-bottom: 1.5rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -15px; left: 30%; width: 60px; height: 60px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: relative; z-index: 1;">
          <div style="display: flex; align-items: center; gap: 0.625rem; margin-bottom: 0.35rem;">
            <span class="material-icons" style="color: white; font-size: 1.75rem;">receipt_long</span>
            <h1 style="font-size: 1.5rem; font-weight: 800; color: white; margin: 0;">My Orders</h1>
          </div>
          <p style="color: rgba(255,255,255,0.85); font-size: 0.85rem; margin: 0;">Track, manage, and reorder your favorite meals</p>
        </div>
      </div>

      <!-- Tab Bar -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
        @for (tab of tabs; track tab.key) {
          <button (click)="switchTab(tab.key)"
            style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none;"
            [style.background]="activeTab() === tab.key ? '#059669' : '#f1f5f9'"
            [style.color]="activeTab() === tab.key ? 'white' : '#64748b'"
            [style.boxShadow]="activeTab() === tab.key ? '0 2px 8px rgba(5,150,105,0.3)' : 'none'"
            onmouseover="if(!this.classList.contains('active-tab')){this.style.background=this.style.background==='rgb(241, 245, 249)'?'#e2e8f0':'#047857'}"
            onmouseout="if(this.style.background==='rgb(226, 232, 240)'){this.style.background='#f1f5f9'}"
            [class.active-tab]="activeTab() === tab.key">
            {{ tab.label }}
            @if (tabCounts()[tab.key] !== undefined && tabCounts()[tab.key] > 0) {
              <span style="display: inline-flex; align-items: center; justify-content: center; min-width: 1.25rem; height: 1.25rem; padding: 0 0.35rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 700;"
                [style.background]="activeTab() === tab.key ? 'rgba(255,255,255,0.25)' : '#e2e8f0'"
                [style.color]="activeTab() === tab.key ? 'white' : '#64748b'">
                {{ tabCounts()[tab.key] }}
              </span>
            }
          </button>
        }
      </div>

      <!-- Search Bar -->
      <div style="position: relative; margin-bottom: 1.25rem;">
        <span class="material-icons" style="position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 1.25rem;">search</span>
        <input type="text" [value]="searchQuery()" (input)="onSearchInput($event)" placeholder="Search by order number..."
          style="width: 100%; padding: 0.625rem 2.5rem 0.625rem 2.75rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.85rem; outline: none; box-sizing: border-box; transition: all 0.2s; background: white;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'" />
        @if (searchQuery()) {
          <button (click)="clearSearch()"
            style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); border: none; background: #f1f5f9; width: 1.5rem; height: 1.5rem; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;"
            onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
            <span class="material-icons" style="font-size: 0.85rem; color: #64748b;">close</span>
          </button>
        }
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          @for (i of [1, 2, 3]; track i) {
            <div style="background: white; border: 1px solid #f1f5f9; border-radius: 1rem; padding: 1.5rem;">
              <div style="display: flex; flex-direction: column; gap: 0.75rem; animation: pulse 1.5s infinite;">
                <div style="display: flex; justify-content: space-between;">
                  <div style="height: 1rem; background: #e2e8f0; border-radius: 0.5rem; width: 10rem;"></div>
                  <div style="height: 1.5rem; background: #e2e8f0; border-radius: 9999px; width: 5rem;"></div>
                </div>
                <div style="height: 0.75rem; background: #f1f5f9; border-radius: 0.5rem; width: 8rem;"></div>
                <div style="height: 0.75rem; background: #f1f5f9; border-radius: 0.5rem; width: 14rem;"></div>
                <div style="height: 0.75rem; background: #f1f5f9; border-radius: 0.5rem; width: 10rem;"></div>
                <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; margin-top: 0.25rem;">
                  <div style="height: 1.25rem; background: #e2e8f0; border-radius: 0.5rem; width: 6rem;"></div>
                  <div style="display: flex; gap: 0.5rem;">
                    <div style="height: 2rem; background: #f1f5f9; border-radius: 0.5rem; width: 4rem;"></div>
                    <div style="height: 2rem; background: #f1f5f9; border-radius: 0.5rem; width: 5rem;"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

      <!-- Error State -->
      } @else if (error()) {
        <div style="background: white; border: 1px solid #f1f5f9; border-radius: 1rem; padding: 3rem 2rem; text-align: center;">
          <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: linear-gradient(135deg, #fef2f2, #fee2e2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: #ef4444; font-size: 1.75rem;">error_outline</span>
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.35rem;">Failed to load orders</h3>
          <p style="color: #64748b; font-size: 0.85rem; margin: 0 0 1.5rem; max-width: 24rem; margin-left: auto; margin-right: auto;">{{ error() }}</p>
          <button (click)="loadOrders()"
            style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.625rem 1.25rem; background: #059669; color: white; font-weight: 600; font-size: 0.85rem; border-radius: 0.625rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(5,150,105,0.25);"
            onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
            <span class="material-icons" style="font-size: 1.1rem;">refresh</span> Try Again
          </button>
        </div>

      <!-- Empty State -->
      } @else if (orders().length === 0) {
        <div style="background: white; border: 1px solid #f1f5f9; border-radius: 1rem; padding: 3rem 2rem; text-align: center;">
          <div style="width: 72px; height: 72px; margin: 0 auto 1.25rem; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: #059669; font-size: 2rem;">{{ searchQuery() ? 'search_off' : 'receipt_long' }}</span>
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.35rem;">{{ searchQuery() ? 'No orders found' : 'No orders yet' }}</h3>
          <p style="color: #64748b; font-size: 0.85rem; margin: 0 0 1.5rem;">{{ searchQuery() ? 'No orders match your search. Try a different order number.' : 'Start ordering delicious meals!' }}</p>
          @if (!searchQuery()) {
            <a routerLink="/meals"
              style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.625rem 1.5rem; background: #059669; color: white; font-weight: 600; font-size: 0.85rem; border-radius: 0.625rem; text-decoration: none; transition: all 0.2s; box-shadow: 0 2px 8px rgba(5,150,105,0.25);"
              onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
              <span class="material-icons" style="font-size: 1.1rem;">restaurant_menu</span> Browse Meals
            </a>
          }
        </div>

      <!-- Order List -->
      } @else {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          @for (order of orders(); track order.uuid; let i = $index) {
            <div style="background: white; border: 1px solid #f1f5f9; border-radius: 1rem; overflow: hidden; transition: all 0.25s;"
              onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'; this.style.borderColor='#e2e8f0'"
              onmouseout="this.style.boxShadow='none'; this.style.borderColor='#f1f5f9'">

              <!-- Order Header Bar -->
              <div style="padding: 0.875rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9;"
                [style.background]="isActiveStatus(order.order_status) ? 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' : '#fafbfc'">
                <div style="display: flex; align-items: center; gap: 0.625rem;">
                  <span class="material-icons" style="font-size: 1.1rem;"
                    [style.color]="getStatusColor(order.order_status)">{{ getStatusIcon(order.order_status) }}</span>
                  <div>
                    <h3 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0;">#{{ order.order_number_display }}</h3>
                    <p style="font-size: 0.7rem; color: #94a3b8; margin: 0.1rem 0 0;">{{ order.order_date | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <app-order-status-badge [status]="order.order_status"></app-order-status-badge>
                </div>
              </div>

              <!-- Order Body -->
              <div style="padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.625rem;">
                <!-- Items -->
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span class="material-icons" style="color: #94a3b8; font-size: 1rem; margin-top: 0.1rem;">restaurant</span>
                  <p style="font-size: 0.82rem; color: #475569; margin: 0; line-height: 1.4;">{{ getItemsPreview(order) }}</p>
                </div>

                <!-- Delivery Info -->
                @if (order.delivery_date) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="color: #94a3b8; font-size: 1rem;">event</span>
                    <span style="font-size: 0.8rem; color: #64748b;">{{ order.delivery_date | date:'MMM d, y' }}{{ order.delivery_slot ? ' · ' + order.delivery_slot : '' }}</span>
                  </div>
                }

                <!-- Address -->
                @if (order.address) {
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-icons" style="color: #94a3b8; font-size: 1rem;">location_on</span>
                    <span style="font-size: 0.8rem; color: #64748b;">{{ order.address.city }}{{ order.address.state ? ', ' + order.address.state : '' }}</span>
                  </div>
                }
              </div>

              <!-- Order Footer -->
              <div style="padding: 0.75rem 1.25rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #fafbfc;">
                <div style="display: flex; align-items: center; gap: 0.625rem;">
                  <span style="font-size: 1.1rem; font-weight: 800; color: #059669;">&#8377;{{ order.total_amount }}</span>
                  <app-order-status-badge [status]="order.payment_status"></app-order-status-badge>
                </div>

                <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; justify-content: flex-end;">
                  @if (isActiveStatus(order.order_status)) {
                    <a [routerLink]="['/customer/orders', order.uuid, 'track']"
                      style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.4rem 0.75rem; background: #059669; color: white; font-weight: 600; font-size: 0.72rem; border-radius: 0.5rem; text-decoration: none; transition: all 0.2s; box-shadow: 0 1px 4px rgba(5,150,105,0.25);"
                      onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
                      <span class="material-icons" style="font-size: 0.85rem;">local_shipping</span> Track
                    </a>
                  }

                  <a [routerLink]="['/customer/orders', order.uuid]"
                    style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.4rem 0.75rem; background: white; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.72rem; border-radius: 0.5rem; text-decoration: none; transition: all 0.2s;"
                    onmouseover="this.style.borderColor='#cbd5e1'; this.style.background='#f8fafc'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white'">
                    <span class="material-icons" style="font-size: 0.85rem;">visibility</span> Details
                  </a>

                  @if (isCancellableStatus(order.order_status)) {
                    <button (click)="cancelOrder(order)" [disabled]="cancellingId() === order.uuid"
                      style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.4rem 0.75rem; background: white; border: 1px solid #fecaca; color: #dc2626; font-weight: 600; font-size: 0.72rem; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s;"
                      onmouseover="if(!this.disabled){this.style.background='#fef2f2'; this.style.borderColor='#fca5a5'}" onmouseout="this.style.background='white'; this.style.borderColor='#fecaca'">
                      @if (cancellingId() === order.uuid) {
                        <span class="material-icons" style="font-size: 0.85rem; animation: spin 1s linear infinite;">autorenew</span>
                      } @else {
                        <span class="material-icons" style="font-size: 0.85rem;">close</span>
                      }
                      Cancel
                    </button>
                  }

                  @if (isReorderableStatus(order.order_status)) {
                    <button (click)="reorder(order)" [disabled]="reorderingId() === order.uuid"
                      style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.4rem 0.75rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 600; font-size: 0.72rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 4px rgba(5,150,105,0.25);"
                      onmouseover="if(!this.disabled){this.style.boxShadow='0 2px 8px rgba(5,150,105,0.35)'}" onmouseout="this.style.boxShadow='0 1px 4px rgba(5,150,105,0.25)'">
                      @if (reorderingId() === order.uuid) {
                        <span class="material-icons" style="font-size: 0.85rem; animation: spin 1s linear infinite;">autorenew</span>
                      } @else {
                        <span class="material-icons" style="font-size: 0.85rem;">replay</span>
                      }
                      Reorder
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (meta()) {
          <div style="margin-top: 1.5rem;">
            <app-customer-pagination [meta]="meta()!" (pageChange)="onPageChange($event)"></app-customer-pagination>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    @media (max-width: 1023px) {
      .orders-page { padding: 0.75rem 0 1.5rem !important; }
      .orders-hero { border-radius: 0 !important; padding: 0.875rem 1rem !important; }
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
export class OrdersComponent implements OnInit, OnDestroy {
  private orderApi = inject(CustomerFrontOrderApiService);
  private router = inject(Router);

  tabs: { key: OrderTab; label: string; statuses?: OrderStatus[] }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'active', label: 'Active', statuses: ACTIVE_ORDER_STATUSES },
    { key: 'completed', label: 'Completed', statuses: COMPLETED_ORDER_STATUSES },
    { key: 'cancelled', label: 'Cancelled', statuses: CANCELLED_ORDER_STATUSES },
  ];

  orders = signal<CustomerOrder[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<OrderTab>('all');
  searchQuery = signal('');
  currentPage = signal(1);
  meta = signal<PaginationMeta | null>(null);
  cancellingId = signal<string | null>(null);
  reorderingId = signal<string | null>(null);

  tabCounts = signal<Record<OrderTab, number>>({
    all: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  });

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((query) => {
          this.searchQuery.set(query);
          this.currentPage.set(1);
        }),
        switchMap(() => this.fetchOrders()),
      )
      .subscribe();

    this.loadOrders();
    this.loadTabCounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.fetchOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private fetchOrders() {
    this.loading.set(true);
    this.error.set(null);

    const params: Record<string, string | number> = {
      page: this.currentPage(),
      per_page: 10,
    };

    const tab = this.tabs.find((t) => t.key === this.activeTab());
    if (tab?.statuses?.length) {
      params['statuses'] = tab.statuses.join(',');
    }

    if (this.searchQuery()) {
      params['search'] = this.searchQuery();
    }

    return this.orderApi.getOrders(params).pipe(
      tap((res: any) => {
        if (res.success && res.data) {
          this.orders.set(res.data);
          if (res.meta) {
            this.meta.set(res.meta);
          }
        } else {
          this.orders.set([]);
          this.meta.set(null);
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Something went wrong while loading orders. Please try again.');
        this.orders.set([]);
        this.meta.set(null);
        this.loading.set(false);
        return of(null);
      }),
    );
  }

  private loadTabCounts(): void {
    for (const tab of this.tabs) {
      const params: Record<string, string | number> = { per_page: 1 };
      if (tab.statuses?.length) {
        params['statuses'] = tab.statuses.join(',');
      }
      this.orderApi
        .getOrders(params)
        .pipe(
          takeUntil(this.destroy$),
          catchError(() => of(null)),
        )
        .subscribe((res: any) => {
          if (res?.meta) {
            this.tabCounts.update((counts) => ({
              ...counts,
              [tab.key]: res.meta.total || 0,
            }));
          }
        });
    }
  }

  switchTab(tab: OrderTab): void {
    if (this.activeTab() === tab) return;
    this.activeTab.set(tab);
    this.currentPage.set(1);
    this.fetchOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.search$.next('');
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.fetchOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getItemsPreview(order: CustomerOrder): string {
    if (!order.order_items?.length) {
      return order.quantity > 0 ? `${order.quantity} item(s)` : 'Order placed';
    }
    const items = order.order_items;
    const names = items.slice(0, 3).map((i) => i.meal_name);
    const preview = names.join(', ');
    const remaining = items.length - 3;
    return remaining > 0 ? `${preview} +${remaining} more` : preview;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'preparing': return '#8b5cf6';
      case 'ready': return '#06b6d4';
      case 'out_for_delivery': return '#059669';
      case 'delivered': case 'completed': return '#059669';
      case 'cancelled': case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'confirmed': return 'check_circle';
      case 'preparing': return 'skillet';
      case 'ready': return 'done_all';
      case 'out_for_delivery': return 'local_shipping';
      case 'delivered': case 'completed': return 'verified';
      case 'cancelled': case 'failed': return 'cancel';
      default: return 'receipt';
    }
  }

  isActiveStatus(status: string): boolean {
    return ACTIVE_ORDER_STATUSES.includes(status as OrderStatus);
  }

  isCancellableStatus(status: string): boolean {
    return status === 'pending';
  }

  isReorderableStatus(status: string): boolean {
    return status === 'delivered' || status === 'completed';
  }

  cancelOrder(order: CustomerOrder): void {
    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order.order_number_display}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    this.cancellingId.set(order.uuid);
    this.orderApi
      .cancelOrder(order.uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cancellingId.set(null);
          this.loadOrders();
          this.loadTabCounts();
        },
        error: (err) => {
          this.cancellingId.set(null);
          alert(err?.error?.message || 'Failed to cancel order. Please try again.');
        },
      });
  }

  reorder(order: CustomerOrder): void {
    this.reorderingId.set(order.uuid);
    this.orderApi
      .reorder(order.uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.reorderingId.set(null);
          if (res.success) {
            this.router.navigate(['/cart']);
          } else {
            alert(res.message || 'Failed to add items to cart.');
          }
        },
        error: (err) => {
          this.reorderingId.set(null);
          alert(err?.error?.message || 'Failed to reorder. Please try again.');
        },
      });
  }
}
