import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PincodeApiService } from '../../../core/services/pincode-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Pincode } from '../../../core/models/master/pincode.model';

@Component({
  selector: 'app-pincode-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading pincode details...</p>
      </div>
    </div>

    <div *ngIf="!loading && pincode" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/pincodes" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Pincodes
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; font-family: monospace; margin: 0;">{{ pincode.pincode }}</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBg(pincode.status)" [style.color]="getStatusColor(pincode.status)">
                <span *ngIf="pincode.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                {{ pincode.status | titlecase }}
              </span>
              <span *ngIf="pincode.is_serviceable" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; color: white;">Serviceable</span>
            </div>
            <p *ngIf="pincode.office_name" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ pincode.office_name }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="toggleStatus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">{{ pincode.status === 'active' ? 'block' : 'check_circle' }}</span>
              {{ pincode.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <a [routerLink]="['/admin/pincodes', pincode.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deletePincode()"
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
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Pincode</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ pincode.pincode }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Office Name</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.office_name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">District</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.district || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">City</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.city?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">State</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.state?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Country</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.country?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Area</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.area?.name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Delivery Zone</p>
                    <span *ngIf="pincode.deliveryZone" style="display: inline-block; padding: 3px 10px; background: #d1fae5; border-radius: 6px; font-size: 12px; font-weight: 700; color: #047857;">{{ pincode.deliveryZone.zone_name }}</span>
                    <span *ngIf="!pincode.deliveryZone" style="font-size: 14px; color: #9ca3af;">-</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #0d9488;">map</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Coordinates</h2>
                </div>
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-size: 13px; color: #6b7280;">Latitude</span>
                    <span style="font-size: 13px; font-weight: 700; font-family: monospace; color: #1f2937;">{{ pincode.latitude || '-' }}</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
                    <span style="font-size: 13px; color: #6b7280;">Longitude</span>
                    <span style="font-size: 13px; font-weight: 700; font-family: monospace; color: #1f2937;">{{ pincode.longitude || '-' }}</span>
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
                      [style.background]="getStatusBg(pincode.status)" [style.color]="getStatusColor(pincode.status)">
                      <span *ngIf="pincode.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      {{ pincode.status | titlecase }}
                    </span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
                    <span style="font-size: 13px; color: #6b7280;">Serviceable</span>
                    <span *ngIf="pincode.is_serviceable" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #d1fae5; color: #047857;">
                      <span class="material-icons" style="font-size: 12px;">local_shipping</span> Yes
                    </span>
                    <span *ngIf="!pincode.is_serviceable" style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">No</span>
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
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.created_at | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                  <div style="padding: 10px 0;">
                    <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ pincode.updated_at | date:'MMM d, y, h:mm a' }}</p>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <a [routerLink]="['/admin/pincodes', pincode.uuid, 'edit']"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Pincode
                  </a>
                  <button (click)="toggleStatus()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;" [style.color]="pincode.status === 'active' ? '#dc2626' : '#059669'">{{ pincode.status === 'active' ? 'block' : 'check_circle' }}</span>
                    {{ pincode.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                  <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                  <button (click)="deletePincode()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;">delete</span> Delete Pincode
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
export class PincodeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pincodeApi = inject(PincodeApiService);
  private notification = inject(NotificationService);

  pincode: Pincode | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadPincode(uuid); } else { this.router.navigate(['/admin/pincodes']); }
  }

  loadPincode(uuid: string): void {
    this.loading = true;
    this.pincodeApi.getById(uuid).subscribe({
      next: (res) => {
        if (res.data) { this.pincode = res.data; } else { this.router.navigate(['/admin/pincodes']); }
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load pincode'); this.router.navigate(['/admin/pincodes']); },
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

  toggleStatus(): void {
    if (!this.pincode) return;
    const newStatus = this.pincode.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} pincode "${this.pincode.pincode}"?`)) {
      this.pincodeApi.setStatus(this.pincode.uuid, newStatus).subscribe({
        next: () => { this.notification.success(`Pincode ${newStatus === 'active' ? 'activated' : 'deactivated'}`); this.loadPincode(this.pincode!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deletePincode(): void {
    if (!this.pincode) return;
    if (window.confirm(`Delete pincode "${this.pincode.pincode}"? This action cannot be undone.`)) {
      this.pincodeApi.delete(this.pincode.uuid).subscribe({
        next: () => { this.notification.success('Pincode deleted'); this.router.navigate(['/admin/pincodes']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
