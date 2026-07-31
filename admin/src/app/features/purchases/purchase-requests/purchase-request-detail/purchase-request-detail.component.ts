import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PurchaseApiService } from '../../../../core/services/purchase-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PurchaseRequest } from '../../../../core/models/purchase/purchase.model';

@Component({
  selector: 'app-purchase-request-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading purchase request details...</p>
      </div>
    </div>

    <div *ngIf="!loading && request" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/purchases/requests" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Purchase Requests
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0; font-family: monospace;">{{ request.request_number }}</h1>
              <span style="display: inline-flex; align-items: center; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusClass(request.status).bg"
                [style.color]="getStatusClass(request.status).fg">
                {{ request.status | titlecase }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ request.request_type | titlecase }} &bull; {{ request.requested_by }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <a *ngIf="request.status === 'draft'" [routerLink]="['/admin/purchases/requests', request.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button *ngIf="request.status === 'pending_approval'" (click)="approveRequest()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">check_circle</span> Approve
            </button>
            <button *ngIf="request.status === 'pending_approval'" (click)="rejectRequest()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">cancel</span> Reject
            </button>
            <button *ngIf="request.status !== 'cancelled'" (click)="cancelRequest()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">block</span> Cancel
            </button>
            <button (click)="deleteRequest()"
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
              <span class="material-icons" style="font-size: 22px; color: #059669;">calendar_today</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Request Date</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ request.request_date | date:'mediumDate' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #7c3aed;">format_list_numbered</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Items</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ request.items_count || (request.items?.length || 0) }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">priority_high</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Priority</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ request.priority | titlecase }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #1d4ed8;">business</span>
            </div>
            <div style="min-width: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Department</p>
              <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ request.department || '-' }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Request Info</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Request Number</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ request.request_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Request Type</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.request_type | titlecase }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Requested By</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.requested_by }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Department</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.department || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Priority</p>
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getPriorityClass(request.priority).bg"
                    [style.color]="getPriorityClass(request.priority).fg">
                    {{ request.priority | titlecase }}
                  </span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Expected Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.expected_date ? (request.expected_date | date:'mediumDate') : '-' }}</p>
                </div>
                <div *ngIf="request.approved_by_name">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Approved By</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.approved_by_name }}</p>
                </div>
                <div *ngIf="request.approved_at">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Approved At</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.approved_at | date:'medium' }}</p>
                </div>
                <div *ngIf="request.remarks" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Remarks</p>
                  <p style="font-size: 13px; color: #374151; margin: 0;">{{ request.remarks }}</p>
                </div>
              </div>
            </div>

            <div *ngIf="request.items && request.items.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">format_list_numbered</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Items</h2>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Requested</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Approved</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit</th>
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of request.items; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                      <td style="padding: 12px;">
                        <span style="font-weight: 700; color: #1f2937;">{{ item.inventory_item_name }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span style="font-weight: 700; color: #1f2937;">{{ item.requested_quantity }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span style="color: #374151;">{{ item.approved_quantity ?? '-' }}</span>
                      </td>
                      <td style="padding: 12px; text-align: center;">
                        <span style="color: #374151;">{{ item.unit_name }}</span>
                      </td>
                      <td style="padding: 12px;">
                        <span style="color: #9ca3af;">{{ item.remarks || '-' }}</span>
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
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.created_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ request.updated_at | date:'medium' }}</p>
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
export class PurchaseRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApiService);
  private notification = inject(NotificationService);

  request: PurchaseRequest | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadRequest(uuid); }
  }

  loadRequest(uuid: string): void {
    this.purchaseApi.getPurchaseRequest(uuid).subscribe({
      next: (res) => {
        this.request = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.notification.error('Failed to load purchase request'); this.router.navigate(['/admin/purchases/requests']); },
    });
  }

  getStatusClass(status: string): { bg: string; fg: string } {
    switch (status) {
      case 'draft': return { bg: '#f3f4f6', fg: '#374151' };
      case 'pending_approval': return { bg: '#fef3c7', fg: '#b45309' };
      case 'approved': return { bg: '#d1fae5', fg: '#047857' };
      case 'rejected': return { bg: '#fee2e2', fg: '#b91c1c' };
      case 'converted_to_po': return { bg: '#f3e8ff', fg: '#7e22ce' };
      case 'cancelled': return { bg: '#f3f4f6', fg: '#6b7280' };
      default: return { bg: '#f3f4f6', fg: '#374151' };
    }
  }

  getPriorityClass(priority: string): { bg: string; fg: string } {
    switch (priority) {
      case 'low': return { bg: '#f3f4f6', fg: '#4b5563' };
      case 'medium': return { bg: '#dbeafe', fg: '#1d4ed8' };
      case 'high': return { bg: '#fef3c7', fg: '#b45309' };
      case 'urgent': return { bg: '#fee2e2', fg: '#b91c1c' };
      default: return { bg: '#f3f4f6', fg: '#4b5563' };
    }
  }

  editRequest(): void {
    if (this.request) { this.router.navigate(['/admin/purchases/requests', this.request.uuid, 'edit']); }
  }

  approveRequest(): void {
    if (!this.request) return;
    if (window.confirm('Approve this purchase request?')) {
      this.purchaseApi.approvePurchaseRequest(this.request.uuid).subscribe({
        next: () => { this.notification.success('Purchase request approved'); this.loadRequest(this.request!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  rejectRequest(): void {
    if (!this.request) return;
    const reason = window.prompt('Reason for rejection:');
    if (reason !== null) {
      this.purchaseApi.rejectPurchaseRequest(this.request.uuid, { reason }).subscribe({
        next: () => { this.notification.success('Purchase request rejected'); this.loadRequest(this.request!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelRequest(): void {
    if (!this.request) return;
    if (window.confirm('Cancel this purchase request?')) {
      this.purchaseApi.cancelPurchaseRequest(this.request.uuid).subscribe({
        next: () => { this.notification.success('Purchase request cancelled'); this.loadRequest(this.request!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteRequest(): void {
    if (!this.request) return;
    if (window.confirm('Delete this purchase request? This cannot be undone.')) {
      this.purchaseApi.deletePurchaseRequest(this.request.uuid).subscribe({
        next: () => { this.notification.success('Purchase request deleted'); this.router.navigate(['/admin/purchases/requests']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
