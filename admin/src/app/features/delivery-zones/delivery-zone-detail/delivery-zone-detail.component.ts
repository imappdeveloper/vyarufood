import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeliveryZoneApiService } from '../../../core/services/delivery-zone-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DeliveryZone } from '../../../core/models/master/delivery-zone.model';

@Component({
  selector: 'app-delivery-zone-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading delivery zone details...</p>
      </div>
    </div>

    <div *ngIf="!loading && zone" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/delivery-zones" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Delivery Zones
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ zone.zone_name }}</h1>
              <span *ngIf="zone.zone_code" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; font-family: monospace; color: white; letter-spacing: 1px; text-transform: uppercase;">{{ zone.zone_code }}</span>
              <span *ngIf="zone.is_default" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; color: white;">Default</span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
              {{ zone.city?.name || '' }}{{ zone.city && zone.state ? ' \u2014 ' : '' }}{{ zone.state?.name || '' }}{{ zone.state && zone.country ? ', ' : '' }}{{ zone.country?.name || '' }}
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="setDefault()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              [style.background]="zone.is_default ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="if(!zone.is_default)this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;" [style.color]="zone.is_default ? '#fbbf24' : ''">{{ zone.is_default ? 'star' : 'star_outline' }}</span>
              {{ zone.is_default ? 'Default' : 'Set Default' }}
            </button>
            <button (click)="toggleStatus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">{{ zone.status === 'active' ? 'block' : 'check_circle' }}</span>
              {{ zone.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <a [routerLink]="['/admin/delivery-zones', zone.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteZone()"
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
        <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Zone Name</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.zone_name }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Zone Code</p>
                    <span *ngIf="zone.zone_code" style="display: inline-block; padding: 3px 10px; background: #d1fae5; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: monospace; color: #047857;">{{ zone.zone_code }}</span>
                    <span *ngIf="!zone.zone_code" style="font-size: 14px; color: #9ca3af;">-</span>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Description</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.description || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">City</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.city?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">State</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.state?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Country</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.country?.name || '-' }}</p>
                  </div>
                  <div *ngIf="zone.area">
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Area</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.area?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Priority</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ zone.priority }}</p>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                  <span class="material-icons" style="font-size: 18px; color: #0d9488;">local_shipping</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Delivery Settings</h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Delivery Radius</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ zone.delivery_radius ? (zone.delivery_radius + ' km') : '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Minimum Order</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ zone.minimum_order_amount ? ('\u20B9' + zone.minimum_order_amount) : '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Delivery Charge</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ zone.delivery_charge ? ('\u20B9' + zone.delivery_charge) : 'Free' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Free Delivery Above</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ zone.free_delivery_above ? ('\u20B9' + zone.free_delivery_above) : '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Est. Delivery Time</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ zone.estimated_delivery_time ? (zone.estimated_delivery_time + ' min') : '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Max Orders/Slot</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ zone.maximum_orders_per_slot || '-' }}</p>
                  </div>
                </div>
              </div>

              <div *ngIf="zone.remarks" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                  <span class="material-icons" style="font-size: 18px; color: #9ca3af;">notes</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Remarks</h2>
                </div>
                <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0;">{{ zone.remarks }}</p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #d97706;">verified</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Service Status</h2>
                </div>
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Status</span>
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getStatusBg(zone.status)" [style.color]="getStatusColor(zone.status)">
                      <span *ngIf="zone.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      {{ zone.status | titlecase }}
                    </span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Default</span>
                    <span *ngIf="zone.is_default" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #fef3c7; color: #d97706;">
                      <span class="material-icons" style="font-size: 12px;">star</span> Yes
                    </span>
                    <span *ngIf="!zone.is_default" style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">No</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Pincodes</span>
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ zone.pincodesCount || 0 }}</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
                    <span style="font-size: 13px; color: #6b7280;">Delivery Slots</span>
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ zone.deliverySlotsCount || 0 }}</span>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #9ca3af;">schedule</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Metadata</h2>
                </div>
                <div>
                  <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created At</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.created_at | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                  <div style="padding: 10px 0;">
                    <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ zone.updated_at | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <a [routerLink]="['/admin/delivery-zones', zone.uuid, 'edit']"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Zone
                  </a>
                  <a [routerLink]="['/admin/delivery-zones', zone.uuid, 'slots']"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #0d9488;">schedule</span> Manage Slots
                  </a>
                  <button *ngIf="!zone.is_default" (click)="setDefault()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #f59e0b;">star</span> Set as Default
                  </button>
                  <button (click)="toggleStatus()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;" [style.color]="zone.status === 'active' ? '#dc2626' : '#059669'">{{ zone.status === 'active' ? 'block' : 'check_circle' }}</span>
                    {{ zone.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                  <div *ngIf="!zone.is_default" style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                  <button *ngIf="!zone.is_default" (click)="deleteZone()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;">delete</span> Delete Zone
                  </button>
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
export class DeliveryZoneDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private zoneApi = inject(DeliveryZoneApiService);
  private notification = inject(NotificationService);

  zone: DeliveryZone | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadZone(uuid); } else { this.router.navigate(['/admin/delivery-zones']); }
  }

  loadZone(uuid: string): void {
    this.loading = true;
    this.zoneApi.getById(uuid).subscribe({
      next: (res) => {
        if (res.data) { this.zone = res.data; } else { this.router.navigate(['/admin/delivery-zones']); }
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load delivery zone'); this.router.navigate(['/admin/delivery-zones']); },
    });
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#fee2e2';
      case 'pending': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'inactive': return '#dc2626';
      case 'pending': return '#d97706';
      default: return '#6b7280';
    }
  }

  setDefault(): void {
    if (!this.zone) return;
    if (window.confirm(`Set "${this.zone.zone_name}" as the default delivery zone?`)) {
      this.zoneApi.setDefault(this.zone.uuid).subscribe({
        next: () => { this.notification.success('Default delivery zone updated'); this.loadZone(this.zone!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  toggleStatus(): void {
    if (!this.zone) return;
    const newStatus = this.zone.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${this.zone.zone_name}"?`)) {
      this.zoneApi.setStatus(this.zone.uuid, newStatus).subscribe({
        next: () => { this.notification.success(`Zone ${newStatus === 'active' ? 'activated' : 'deactivated'}`); this.loadZone(this.zone!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteZone(): void {
    if (!this.zone) return;
    if (window.confirm(`Delete "${this.zone.zone_name}"? This action cannot be undone.`)) {
      this.zoneApi.delete(this.zone.uuid).subscribe({
        next: () => { this.notification.success('Delivery zone deleted'); this.router.navigate(['/admin/delivery-zones']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
