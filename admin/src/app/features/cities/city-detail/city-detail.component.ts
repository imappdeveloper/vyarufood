import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CityApiService } from '../../../core/services/city-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { City } from '../../../core/models/master/city.model';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading city details...</p>
      </div>
    </div>

    <div *ngIf="!loading && city" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/cities" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Cities
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ city.name }}</h1>
              <span *ngIf="city.city_code" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; font-family: monospace; color: white; letter-spacing: 1px; text-transform: uppercase;">{{ city.city_code }}</span>
              <span *ngIf="city.is_metro" style="padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.2); color: white; text-transform: uppercase;">Metro</span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ city.state?.name || '' }}{{ city.state && city.country ? ', ' : '' }}{{ city.country?.name || '' }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="setDefault()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              [style.background]="city.is_default ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="if(!city.is_default)this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;" [style.color]="city.is_default ? '#fbbf24' : ''">{{ city.is_default ? 'star' : 'star_outline' }}</span>
              {{ city.is_default ? 'Default' : 'Set Default' }}
            </button>
            <button (click)="toggleStatus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">{{ city.status === 'active' ? 'block' : 'check_circle' }}</span>
              {{ city.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <a [routerLink]="['/admin/cities', city.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteCity()"
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
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">City Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">State</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.state?.name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Country</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.country?.name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">City Code</p>
                  <span *ngIf="city.city_code" style="display: inline-block; padding: 3px 10px; background: #d1fae5; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: monospace; color: #047857;">{{ city.city_code }}</span>
                  <span *ngIf="!city.city_code" style="font-size: 14px; color: #9ca3af;">-</span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Pincode</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ city.pincode || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Timezone</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.timezone || '-' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">map</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Geography</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Latitude</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ city.latitude || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Longitude</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ city.longitude || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Population</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.population ? (city.population | number) : '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Area</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.area ? (city.area | number:'1.1-1') + ' km\u00B2' : '-' }}</p>
                </div>
              </div>
            </div>

            <div *ngIf="city.remarks" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">notes</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Remarks</h2>
              </div>
              <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0;">{{ city.remarks }}</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #d97706;">verified</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Status</h2>
              </div>
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; color: #6b7280;">Status</span>
                  <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(city.status)" [style.color]="getStatusColor(city.status)">
                    <span *ngIf="city.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ city.status | titlecase }}
                  </span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; color: #6b7280;">Metro</span>
                  <span *ngIf="city.is_metro" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #fef3c7; color: #d97706;">
                    <span class="material-icons" style="font-size: 12px;">train</span> Yes
                  </span>
                  <span *ngIf="!city.is_metro" style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">No</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; color: #6b7280;">Default</span>
                  <span *ngIf="city.is_default" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #fef3c7; color: #d97706;">
                    <span class="material-icons" style="font-size: 12px;">star</span> Yes
                  </span>
                  <span *ngIf="!city.is_default" style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280;">No</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
                  <span style="font-size: 13px; color: #6b7280;">Sort Order</span>
                  <span style="font-size: 13px; font-weight: 700; color: #166534;">{{ city.sort_order }}</span>
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
                  <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.created_at | date:'MMM d, y, h:mm a' }}</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ city.updated_at | date:'MMM d, y, h:mm a' }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a [routerLink]="['/admin/cities', city.uuid, 'edit']"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; background: none; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; cursor: pointer; text-decoration: none; transition: all 0.15s ease; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#059669'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit City
                </a>
                <button *ngIf="!city.is_default" (click)="setDefault()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; background: none; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; cursor: pointer; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#f59e0b'; this.style.background='#fffbeb'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #d97706;">star</span> Set as Default
                </button>
                <button (click)="toggleStatus()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; background: none; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; cursor: pointer; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#059669'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;" [style.color]="city.status === 'active' ? '#dc2626' : '#059669'">{{ city.status === 'active' ? 'block' : 'check_circle' }}</span>
                  {{ city.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
                <div *ngIf="!city.is_default" style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button *ngIf="!city.is_default" (click)="deleteCity()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; background: none; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #dc2626; cursor: pointer; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#dc2626'; this.style.background='#fef2f2'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete City
                </button>
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
export class CityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cityApi = inject(CityApiService);
  private notification = inject(NotificationService);

  city: City | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadCity(uuid); } else { this.router.navigate(['/admin/cities']); }
  }

  loadCity(uuid: string): void {
    this.loading = true;
    this.cityApi.getById(uuid).subscribe({
      next: (res) => {
        if (res.data) { this.city = res.data; } else { this.router.navigate(['/admin/cities']); }
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load city'); this.router.navigate(['/admin/cities']); },
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
    if (!this.city) return;
    if (window.confirm(`Set "${this.city.name}" as the default city?`)) {
      this.cityApi.setDefault(this.city.uuid).subscribe({
        next: () => { this.notification.success('Default city updated'); this.loadCity(this.city!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  toggleStatus(): void {
    if (!this.city) return;
    const newStatus = this.city.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${this.city.name}"?`)) {
      this.cityApi.setStatus(this.city.uuid, newStatus).subscribe({
        next: () => { this.notification.success(`City ${newStatus === 'active' ? 'activated' : 'deactivated'}`); this.loadCity(this.city!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteCity(): void {
    if (!this.city) return;
    if (window.confirm(`Delete "${this.city.name}"? This action cannot be undone.`)) {
      this.cityApi.delete(this.city.uuid).subscribe({
        next: () => { this.notification.success('City deleted'); this.router.navigate(['/admin/cities']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
