import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AreaApiService } from '../../../core/services/area-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Area } from '../../../core/models/master/area.model';

@Component({
  selector: 'app-area-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading area details...</p>
      </div>
    </div>

    <div *ngIf="!loading && area" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/areas" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Areas
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ area.name }}</h1>
              <span *ngIf="area.area_code" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; font-family: monospace; color: white; letter-spacing: 1px; text-transform: uppercase;">{{ area.area_code }}</span>
              <span *ngIf="area.is_serviceable" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; color: white;">Serviceable</span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
              {{ area.city?.name || '' }}{{ area.city && area.state ? ' \u2014 ' : '' }}{{ area.state?.name || '' }}{{ area.state && area.country ? ', ' : '' }}{{ area.country?.name || '' }}
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="setService()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              [style.background]="area.is_serviceable ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)'"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="if(area.is_serviceable)this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">local_shipping</span>
              {{ area.is_serviceable ? 'Disable Service' : 'Enable Service' }}
            </button>
            <button (click)="setDefault()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              [style.background]="area.is_default ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="if(!area.is_default)this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;" [style.color]="area.is_default ? '#fbbf24' : ''">{{ area.is_default ? 'star' : 'star_outline' }}</span>
              {{ area.is_default ? 'Default' : 'Set Default' }}
            </button>
            <button (click)="toggleStatus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">{{ area.status === 'active' ? 'block' : 'check_circle' }}</span>
              {{ area.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <a [routerLink]="['/admin/areas', area.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteArea()"
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
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Area Name</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ area.name }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Area Code</p>
                    <span *ngIf="area.area_code" style="display: inline-block; padding: 3px 10px; background: #d1fae5; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: monospace; color: #047857;">{{ area.area_code }}</span>
                    <span *ngIf="!area.area_code" style="font-size: 14px; color: #9ca3af;">-</span>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Postal Zone</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ area.postal_zone || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">City</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ area.city?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">State</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ area.state?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Country</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ area.country?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Latitude</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ area.latitude || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Longitude</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ area.longitude || '-' }}</p>
                  </div>
                </div>
              </div>

              <div *ngIf="area.remarks" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                  <span class="material-icons" style="font-size: 18px; color: #9ca3af;">notes</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Remarks</h2>
                </div>
                <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0;">{{ area.remarks }}</p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #0d9488;">local_shipping</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Delivery Settings</h2>
                </div>
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Delivery Radius</span>
                    <span *ngIf="area.delivery_radius" style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ area.delivery_radius }} km</span>
                    <span *ngIf="!area.delivery_radius" style="font-size: 13px; color: #9ca3af;">-</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Minimum Order</span>
                    <span *ngIf="area.minimum_order_amount" style="font-size: 13px; font-weight: 700; color: #1f2937;">\u20B9{{ area.minimum_order_amount | number:'1.0-0' }}</span>
                    <span *ngIf="!area.minimum_order_amount" style="font-size: 13px; color: #9ca3af;">-</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Delivery Charge</span>
                    <span *ngIf="area.delivery_charge" style="font-size: 13px; font-weight: 700; color: #1f2937;">\u20B9{{ area.delivery_charge | number:'1.0-0' }}</span>
                    <span *ngIf="!area.delivery_charge" style="font-size: 13px; color: #9ca3af;">Free</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
                    <span style="font-size: 13px; color: #6b7280;">Est. Delivery Time</span>
                    <span *ngIf="area.estimated_delivery_time" style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ area.estimated_delivery_time }} min</span>
                    <span *ngIf="!area.estimated_delivery_time" style="font-size: 13px; color: #9ca3af;">-</span>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #d97706;">verified</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Service Status</h2>
                </div>
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Status</span>
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getStatusBg(area.status)" [style.color]="getStatusColor(area.status)">
                      <span *ngIf="area.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      {{ area.status | titlecase }}
                    </span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Serviceable</span>
                    <span *ngIf="area.is_serviceable" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #d1fae5; color: #047857;">
                      <span class="material-icons" style="font-size: 12px;">local_shipping</span> Yes
                    </span>
                    <span *ngIf="!area.is_serviceable" style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">No</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Default</span>
                    <span *ngIf="area.is_default" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #fef3c7; color: #d97706;">
                      <span class="material-icons" style="font-size: 12px;">star</span> Yes
                    </span>
                    <span *ngIf="!area.is_default" style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">No</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
                    <span style="font-size: 13px; color: #6b7280;">Sort Order</span>
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ area.sort_order }}</span>
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
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ area.created_at | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                  <div style="padding: 10px 0;">
                    <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ area.updated_at | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <a [routerLink]="['/admin/areas', area.uuid, 'edit']"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Area
                  </a>
                  <button (click)="setService()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;" [style.color]="area.is_serviceable ? '#dc2626' : '#059669'">local_shipping</span>
                    {{ area.is_serviceable ? 'Disable Service' : 'Enable Service' }}
                  </button>
                  <button *ngIf="!area.is_default" (click)="setDefault()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #f59e0b;">star</span> Set as Default
                  </button>
                  <button (click)="toggleStatus()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;" [style.color]="area.status === 'active' ? '#dc2626' : '#059669'">{{ area.status === 'active' ? 'block' : 'check_circle' }}</span>
                    {{ area.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                  <div *ngIf="!area.is_default" style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                  <button *ngIf="!area.is_default" (click)="deleteArea()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;">delete</span> Delete Area
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
export class AreaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private areaApi = inject(AreaApiService);
  private notification = inject(NotificationService);

  area: Area | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadArea(uuid); } else { this.router.navigate(['/admin/areas']); }
  }

  loadArea(uuid: string): void {
    this.loading = true;
    this.areaApi.getById(uuid).subscribe({
      next: (res) => {
        if (res.data) { this.area = res.data; } else { this.router.navigate(['/admin/areas']); }
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load area'); this.router.navigate(['/admin/areas']); },
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
    if (!this.area) return;
    if (window.confirm(`Set "${this.area.name}" as the default area?`)) {
      this.areaApi.setDefault(this.area.uuid).subscribe({
        next: () => { this.notification.success('Default area updated'); this.loadArea(this.area!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  setService(): void {
    if (!this.area) return;
    const newService = !this.area.is_serviceable;
    const label = newService ? 'Enable' : 'Disable';
    if (window.confirm(`${label} service for "${this.area.name}"?`)) {
      this.areaApi.setService(this.area.uuid, newService).subscribe({
        next: () => { this.notification.success(`Service ${newService ? 'enabled' : 'disabled'}`); this.loadArea(this.area!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  toggleStatus(): void {
    if (!this.area) return;
    const newStatus = this.area.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${this.area.name}"?`)) {
      this.areaApi.setStatus(this.area.uuid, newStatus).subscribe({
        next: () => { this.notification.success(`Area ${newStatus === 'active' ? 'activated' : 'deactivated'}`); this.loadArea(this.area!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteArea(): void {
    if (!this.area) return;
    if (window.confirm(`Delete "${this.area.name}"? This action cannot be undone.`)) {
      this.areaApi.delete(this.area.uuid).subscribe({
        next: () => { this.notification.success('Area deleted'); this.router.navigate(['/admin/areas']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
