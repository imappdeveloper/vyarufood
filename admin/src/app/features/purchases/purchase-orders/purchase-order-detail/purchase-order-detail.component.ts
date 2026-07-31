import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PurchaseApiService } from '../../../../core/services/purchase-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PurchaseOrder } from '../../../../core/models/purchase/purchase.model';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading purchase order details...</p>
      </div>
    </div>

    <div *ngIf="!loading && order" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/purchases/orders" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Purchase Orders
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0; font-family: monospace;">{{ order.po_number }}</h1>
              <span style="display: inline-flex; align-items: center; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getOrderStatusClass(order.order_status).bg"
                [style.color]="getOrderStatusClass(order.order_status).fg">
                {{ order.order_status | titlecase }}
              </span>
              <span style="display: inline-flex; align-items: center; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getPaymentStatusClass(order.payment_status).bg"
                [style.color]="getPaymentStatusClass(order.payment_status).fg">
                {{ order.payment_status | titlecase }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ order.supplier_name || 'No Supplier' }} &bull; {{ order.order_date | date:'mediumDate' }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <a *ngIf="order.order_status === 'draft'" [routerLink]="['/admin/purchases/orders', order.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button *ngIf="order.order_status === 'draft'" (click)="approveOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">check_circle</span> Approve
            </button>
            <button *ngIf="order.order_status !== 'cancelled' && order.order_status !== 'closed'" (click)="cancelOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">block</span> Cancel
            </button>
            <button (click)="deleteOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">delete</span> Delete
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">business</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Supplier</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ order.supplier_name || '-' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">attach_money</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Grand Total</p>
              <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ order.grand_total | number:'1.2-2' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #7c3aed;">format_list_numbered</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Items</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ order.items_count || (order.items?.length || 0) }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">calendar_today</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Expected Delivery</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ order.expected_delivery_date ? (order.expected_delivery_date | date:'mediumDate') : '-' }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Order Info</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">PO Number</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ order.po_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Supplier</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.supplier_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Order Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.order_date | date:'mediumDate' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Expected Delivery</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.expected_delivery_date ? (order.expected_delivery_date | date:'mediumDate') : '-' }}</p>
                </div>
                <div *ngIf="order.purchase_request_number">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Purchase Request</p>
                  <p style="font-size: 13px; font-weight: 600; color: #047857; margin: 0;">{{ order.purchase_request_number }}</p>
                </div>
                <div *ngIf="order.payment_terms">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Payment Terms</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.payment_terms | titlecase }}</p>
                </div>
                <div *ngIf="order.approved_by_name">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Approved By</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.approved_by_name }}</p>
                </div>
                <div *ngIf="order.remarks" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Remarks</p>
                  <p style="font-size: 13px; color: #374151; margin: 0;">{{ order.remarks }}</p>
                </div>
              </div>
            </div>

            <div *ngIf="order.items && order.items.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">format_list_numbered</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Line Items</h2>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Ordered</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Received</th>
                      <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Price</th>
                      <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of order.items; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                      <td style="padding: 12px;">
                        <span style="font-weight: 700; color: #1f2937;">{{ item.inventory_item_name }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span style="font-weight: 700; color: #1f2937;">{{ item.ordered_quantity }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span style="color: #374151;">{{ item.received_quantity }}</span>
                      </td>
                      <td style="padding: 12px; text-align: right;">
                        <span style="color: #374151;">{{ item.unit_price | number:'1.2-2' }}</span>
                      </td>
                      <td style="padding: 12px; text-align: right;">
                        <span style="font-weight: 700; color: #1f2937;">{{ item.line_total | number:'1.2-2' }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">calculate</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Financial Summary</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 13px; color: #6b7280;">Subtotal</span>
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ order.subtotal | number:'1.2-2' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 13px; color: #6b7280;">Discount</span>
                  <span style="font-size: 13px; font-weight: 700; color: #dc2626;">-{{ order.discount_amount | number:'1.2-2' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 13px; color: #6b7280;">Tax</span>
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">+{{ order.tax_amount | number:'1.2-2' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 13px; color: #6b7280;">Shipping</span>
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">+{{ order.shipping_charge | number:'1.2-2' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 13px; color: #6b7280;">Other Charges</span>
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">+{{ order.other_charges | number:'1.2-2' }}</span>
                </div>
                <div style="height: 1px; background: #f3f4f6;"></div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 15px; font-weight: 700; color: #1f2937;">Grand Total</span>
                  <span style="font-size: 20px; font-weight: 800; color: #047857;">{{ order.grand_total | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">history</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.created_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.updated_at | date:'medium' }}</p>
                </div>
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
export class PurchaseOrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApiService);
  private notification = inject(NotificationService);

  order: PurchaseOrder | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadOrder(uuid); }
  }

  loadOrder(uuid: string): void {
    this.purchaseApi.getPurchaseOrder(uuid).subscribe({
      next: (res) => {
        this.order = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.notification.error('Failed to load purchase order'); this.router.navigate(['/admin/purchases/orders']); },
    });
  }

  getOrderStatusClass(status: string): { bg: string; fg: string } {
    switch (status) {
      case 'draft': return { bg: '#f3f4f6', fg: '#374151' };
      case 'approved': return { bg: '#d1fae5', fg: '#047857' };
      case 'sent': return { bg: '#dbeafe', fg: '#1d4ed8' };
      case 'partially_received': return { bg: '#fef3c7', fg: '#b45309' };
      case 'received': return { bg: '#dcfce7', fg: '#15803d' };
      case 'closed': return { bg: '#f3e8ff', fg: '#7e22ce' };
      case 'cancelled': return { bg: '#f3f4f6', fg: '#6b7280' };
      default: return { bg: '#f3f4f6', fg: '#374151' };
    }
  }

  getPaymentStatusClass(status: string): { bg: string; fg: string } {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', fg: '#b45309' };
      case 'partial': return { bg: '#ffedd5', fg: '#c2410c' };
      case 'paid': return { bg: '#d1fae5', fg: '#047857' };
      case 'overdue': return { bg: '#fee2e2', fg: '#b91c1c' };
      case 'cancelled': return { bg: '#f3f4f6', fg: '#6b7280' };
      default: return { bg: '#f3f4f6', fg: '#374151' };
    }
  }

  editOrder(): void {
    if (this.order) { this.router.navigate(['/admin/purchases/orders', this.order.uuid, 'edit']); }
  }

  approveOrder(): void {
    if (!this.order) return;
    if (window.confirm('Approve this purchase order?')) {
      this.purchaseApi.approvePurchaseOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Purchase order approved'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelOrder(): void {
    if (!this.order) return;
    if (window.confirm('Cancel this purchase order?')) {
      this.purchaseApi.cancelPurchaseOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Purchase order cancelled'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteOrder(): void {
    if (!this.order) return;
    if (window.confirm('Delete this purchase order? This cannot be undone.')) {
      this.purchaseApi.deletePurchaseOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Purchase order deleted'); this.router.navigate(['/admin/purchases/orders']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
