import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountryApiService } from '../../../core/services/country-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Country } from '../../../core/models/master/country.model';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
    </div>

    <div *ngIf="!loading && country" style="animation: fadeSlideUp 0.3s ease-out;">

      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 48px 32px 80px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px;">
            <a routerLink="/admin/countries" style="color: rgba(255,255,255,0.75); text-decoration: none;">Countries</a>
            <span style="font-size: 10px;">&#9654;</span>
            <span style="color: white; font-weight: 500;">{{ country.name }}</span>
          </div>
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div *ngIf="country.emoji"
                style="width: 72px; height: 72px; background: rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 36px; border: 2px solid rgba(255,255,255,0.2);">
                {{ country.emoji }}
              </div>
              <div *ngIf="!country.emoji"
                style="width: 72px; height: 72px; background: rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255,255,255,0.2);">
                <span style="font-size: 22px; font-weight: 800; color: white;">{{ country.iso2 }}</span>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ country.name }}</h1>
                  <span style="padding: 3px 10px; background: rgba(255,255,255,0.15); border-radius: 8px; font-size: 12px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; font-weight: 700; color: white; letter-spacing: 0.5px;">{{ country.iso2 }}</span>
                </div>
                <p *ngIf="country.native_name" style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 4px 0 0 0;">{{ country.native_name }}</p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
              <button (click)="setDefault()" *ngIf="!country.is_default"
                style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
                onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                <span class="material-icons" style="font-size: 18px;">star</span>
                Set Default
              </button>
              <span *ngIf="country.is_default"
                style="padding: 8px 16px; background: rgba(245,158,11,0.2); color: #fbbf24; font-weight: 600; border-radius: 10px; border: 1px solid rgba(245,158,11,0.3); font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
                <span class="material-icons" style="font-size: 18px;">star</span>
                Default
              </span>
              <button (click)="toggleStatus()"
                [style]="'padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;'"
                onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                <span class="material-icons" style="font-size: 18px;">{{ country.status === 'active' ? 'block' : 'check_circle' }}</span>
                {{ country.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
              <a [routerLink]="['/admin/countries', country.uuid, 'edit']"
                style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
                onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
                <span class="material-icons" style="font-size: 18px;">edit</span>
                Edit
              </a>
              <button (click)="deleteCountry()" *ngIf="!country.is_default"
                style="padding: 8px 16px; background: rgba(239,68,68,0.2); color: #fca5a5; font-weight: 600; border-radius: 10px; border: 1px solid rgba(239,68,68,0.3); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
                onmouseover="this.style.background='rgba(239,68,68,0.35)'" onmouseout="this.style.background='rgba(239,68,68,0.2)'">
                <span class="material-icons" style="font-size: 18px;">delete</span>
                Delete
              </button>
            </div>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: 24px auto 60px; padding: 0 24px;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">

          <!-- Left column -->
          <div style="display: flex; flex-direction: column; gap: 24px;">

            <!-- Basic Information -->
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span class="material-icons" style="color: #059669; font-size: 20px;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Full Name</div><div style="font-size: 14px; font-weight: 600; color: #166534;">{{ country.name }}</div></div>
                <div *ngIf="country.native_name"><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Native Name</div><div style="font-size: 14px; font-weight: 600; color: #166534;">{{ country.native_name }}</div></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">ISO2 Code</div><span style="padding: 3px 10px; background: #ecfdf5; border-radius: 6px; font-size: 13px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; font-weight: 700; color: #059669;">{{ country.iso2 }}</span></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">ISO3 Code</div><span style="padding: 3px 10px; background: #ecfdf5; border-radius: 6px; font-size: 13px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; font-weight: 700; color: #059669;">{{ country.iso3 }}</span></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Phone Code</div><div style="font-size: 14px; font-weight: 600; color: #166534;">{{ country.phone_code ? '+' + country.phone_code : '-' }}</div></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Numeric Code</div><div style="font-size: 14px; font-weight: 600; color: #166534;">{{ country.numeric_code || '-' }}</div></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Capital</div><div style="font-size: 14px; font-weight: 600; color: #166534;">{{ country.capital || '-' }}</div></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Nationality</div><div style="font-size: 14px; font-weight: 600; color: #166534;">{{ country.nationality || '-' }}</div></div>
              </div>
            </div>

            <!-- Currency -->
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span class="material-icons" style="color: #f59e0b; font-size: 20px;">payments</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Currency</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Code</div><span *ngIf="country.currency_code" style="padding: 4px 12px; background: #fef3c7; border-radius: 8px; font-size: 16px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; font-weight: 700; color: #d97706;">{{ country.currency_code }}</span><span *ngIf="!country.currency_code" style="font-size: 14px; font-weight: 600; color: #166534;">-</span></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Symbol</div><span *ngIf="country.currency_symbol" style="font-size: 24px; font-weight: 800; color: #166534;">{{ country.currency_symbol }}</span><span *ngIf="!country.currency_symbol" style="font-size: 14px; font-weight: 600; color: #166534;">-</span></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Name</div><div style="font-size: 14px; font-weight: 600; color: #166534;">{{ country.currency_name || '-' }}</div></div>
              </div>
            </div>

            <!-- Geography -->
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span class="material-icons" style="color: #3b82f6; font-size: 20px;">public</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Geography</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Region</div><div style="font-size: 14px; color: #166534;">{{ country.region || '-' }}</div></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Subregion</div><div style="font-size: 14px; color: #166534;">{{ country.subregion || '-' }}</div></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Latitude</div><div style="font-size: 14px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; color: #166534;">{{ country.latitude || '-' }}</div></div>
                <div><div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Longitude</div><div style="font-size: 14px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace; color: #166534;">{{ country.longitude || '-' }}</div></div>
              </div>
              <div *ngIf="country.latitude && country.longitude"
                style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 12px; height: 120px; display: flex; align-items: center; justify-content: center; border: 1px solid #93c5fd;">
                <div style="text-align: center;">
                  <span class="material-icons" style="font-size: 28px; color: #3b82f6;">map</span>
                  <p style="font-size: 11px; color: #2563eb; font-weight: 600; margin: 4px 0 0 0;">{{ country.latitude }}, {{ country.longitude }}</p>
                </div>
              </div>
            </div>

            <!-- Remarks -->
            <div *ngIf="country.remarks" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                <span class="material-icons" style="color: #9ca3af; font-size: 20px;">notes</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Remarks</h2>
              </div>
              <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0;">{{ country.remarks }}</p>
            </div>
          </div>

          <!-- Right column -->
          <div style="display: flex; flex-direction: column; gap: 24px;">

            <!-- Status -->
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span class="material-icons" style="color: #7c3aed; font-size: 20px;">verified</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Status</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; color: #9ca3af;">Status</span>
                  <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;" [style]="getStatusBadge(country.status)">
                    <span *ngIf="country.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ country.status | titlecase }}
                  </span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; color: #9ca3af;">Default</span>
                  <span *ngIf="country.is_default" style="padding: 3px 10px; background: #fef3c7; border-radius: 20px; font-size: 11px; font-weight: 700; color: #d97706; display: inline-flex; align-items: center; gap: 4px;">
                    <span class="material-icons" style="font-size: 14px;">star</span> Yes
                  </span>
                  <span *ngIf="!country.is_default" style="padding: 3px 10px; background: #f3f4f6; border-radius: 20px; font-size: 11px; font-weight: 600; color: #6b7280;">No</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
                  <span style="font-size: 13px; color: #9ca3af;">Sort Order</span>
                  <span style="font-size: 14px; font-weight: 700; color: #166534;">{{ country.sort_order }}</span>
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span class="material-icons" style="color: #9ca3af; font-size: 20px;">schedule</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Metadata</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <div style="font-size: 11px; font-weight: 600; color: #9ca3af; margin-bottom: 2px;">Created At</div>
                  <div style="font-size: 13px; font-weight: 600; color: #166534;">{{ country.created_at | date:'MMM d, y, h:mm a' }}</div>
                </div>
                <div style="padding: 8px 0;">
                  <div style="font-size: 11px; font-weight: 600; color: #9ca3af; margin-bottom: 2px;">Updated At</div>
                  <div style="font-size: 13px; font-weight: 600; color: #166534;">{{ country.updated_at | date:'MMM d, y, h:mm a' }}</div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span class="material-icons" style="color: #059669; font-size: 20px;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a [routerLink]="['/admin/countries', country.uuid, 'edit']"
                  style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 10px; color: #374151; text-decoration: none; font-size: 13px; font-weight: 600; transition: all 0.2s ease;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdfa'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="color: #059669; font-size: 18px;">edit</span>
                  Edit Country
                </a>
                <button (click)="setDefault()" *ngIf="!country.is_default"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 10px; color: #374151; font-size: 13px; font-weight: 600; background: white; cursor: pointer; transition: all 0.2s ease; text-align: left;"
                  onmouseover="this.style.borderColor='#fde68a'; this.style.background='#fffbeb'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="color: #f59e0b; font-size: 18px;">star</span>
                  Set as Default
                </button>
                <button (click)="toggleStatus()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 10px; color: #374151; font-size: 13px; font-weight: 600; background: white; cursor: pointer; transition: all 0.2s ease; text-align: left;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdfa'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" [style]="'font-size: 18px; color: ' + (country.status === 'active' ? '#ef4444' : '#059669') + ';'">{{ country.status === 'active' ? 'block' : 'check_circle' }}</span>
                  {{ country.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
                <button (click)="deleteCountry()" *ngIf="!country.is_default"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; border-radius: 10px; color: #ef4444; font-size: 13px; font-weight: 600; background: white; cursor: pointer; transition: all 0.2s ease; text-align: left;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span>
                  Delete Country
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class CountryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private countryApi = inject(CountryApiService);
  private notification = inject(NotificationService);

  country: Country | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadCountry(uuid);
    } else {
      this.router.navigate(['/admin/countries']);
    }
  }

  loadCountry(uuid: string): void {
    this.loading = true;
    this.countryApi.getById(uuid).subscribe({
      next: (res) => {
        if (res.data) {
          this.country = res.data;
        } else {
          this.router.navigate(['/admin/countries']);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load country');
        this.router.navigate(['/admin/countries']);
      },
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'active': return 'background: #d1fae5; color: #047857;';
      case 'inactive': return 'background: #fee2e2; color: #dc2626;';
      case 'pending': return 'background: #fef3c7; color: #d97706;';
      default: return 'background: #f3f4f6; color: #6b7280;';
    }
  }

  setDefault(): void {
    if (!this.country) return;
    if (window.confirm(`Set "${this.country.name}" as the default country?`)) {
      this.countryApi.setDefault(this.country.uuid).subscribe({
        next: () => {
          this.notification.success('Default country updated');
          this.loadCountry(this.country!.uuid);
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  toggleStatus(): void {
    if (!this.country) return;
    const newStatus = this.country.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${this.country.name}"?`)) {
      this.countryApi.setStatus(this.country.uuid, newStatus).subscribe({
        next: () => {
          this.notification.success(`Country ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
          this.loadCountry(this.country!.uuid);
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteCountry(): void {
    if (!this.country) return;
    if (window.confirm(`Delete "${this.country.name}"? This action cannot be undone.`)) {
      this.countryApi.delete(this.country.uuid).subscribe({
        next: () => {
          this.notification.success('Country deleted');
          this.router.navigate(['/admin/countries']);
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
