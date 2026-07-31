import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PurchaseApiService } from '../../../../core/services/purchase-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { GoodsReceipt } from '../../../../core/models/purchase/purchase.model';

@Component({
  selector: 'app-goods-receipt-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading goods receipt details...</p>
      </div>
    </div>

    <div *ngIf="!loading && receipt" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/purchases/goods-receipts" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Goods Receipts
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0; font-family: monospace;">{{ receipt.grn_number }}</h1>
              <span style="display: inline-flex; align-items: center; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusClass(receipt.status).bg"
                [style.color]="getStatusClass(receipt.status).fg">
                {{ receipt.status | titlecase }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ receipt.supplier_name || 'No Supplier' }} &bull; {{ receipt.received_date | date:'mediumDate' }}</p>
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
              <span class="material-icons" style="font-size: 22px; color: #059669;">local_shipping</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">GRN Number</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace;">{{ receipt.grn_number }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #7c3aed;">receipt_long</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">PO Number</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace;">{{ receipt.po_number || '-' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">business</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Supplier</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ receipt.supplier_name || '-' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">person</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Received By</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ receipt.received_by || '-' }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Receipt Info</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">GRN Number</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ receipt.grn_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Supplier</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ receipt.supplier_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Received Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ receipt.received_date | date:'mediumDate' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Status</p>
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusClass(receipt.status).bg"
                    [style.color]="getStatusClass(receipt.status).fg">
                    {{ receipt.status | titlecase }}
                  </span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Received By</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ receipt.received_by }}</p>
                </div>
                <div *ngIf="receipt.remarks" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Remarks</p>
                  <p style="font-size: 13px; color: #374151; margin: 0;">{{ receipt.remarks }}</p>
                </div>
              </div>
            </div>

            <div *ngIf="receipt.items && receipt.items.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">format_list_numbered</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Received Items</h2>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Received</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Accepted</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Rejected</th>
                      <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of receipt.items; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                      <td style="padding: 12px;">
                        <span style="font-weight: 700; color: #1f2937;">{{ item.inventory_item_name }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span style="font-weight: 700; color: #1f2937;">{{ item.received_quantity }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span style="font-weight: 700; color: #047857;">{{ item.accepted_quantity }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span [style.color]="item.rejected_quantity > 0 ? '#dc2626' : '#374151'" [style.fontWeight]="item.rejected_quantity > 0 ? '700' : '400'">{{ item.rejected_quantity }}</span>
                      </td>
                      <td style="padding: 12px; text-align: right;">
                        <span style="color: #374151;">{{ item.unit_cost | number:'1.2-2' }}</span>
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
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">history</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ receipt.created_at | date:'medium' }}</p>
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
export class GoodsReceiptDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApiService);
  private notification = inject(NotificationService);

  receipt: GoodsReceipt | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadReceipt(uuid); }
  }

  loadReceipt(uuid: string): void {
    this.purchaseApi.getGoodsReceipt(uuid).subscribe({
      next: (res) => {
        this.receipt = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.notification.error('Failed to load goods receipt'); this.router.navigate(['/admin/purchases/goods-receipts']); },
    });
  }

  getStatusClass(status: string): { bg: string; fg: string } {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', fg: '#b45309' };
      case 'accepted': return { bg: '#d1fae5', fg: '#047857' };
      case 'rejected': return { bg: '#fee2e2', fg: '#b91c1c' };
      case 'partial': return { bg: '#ffedd5', fg: '#c2410c' };
      default: return { bg: '#f3f4f6', fg: '#374151' };
    }
  }
}
