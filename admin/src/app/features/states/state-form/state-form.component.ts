import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StateApiService } from '../../../core/services/state-api.service';
import { CountryApiService } from '../../../core/services/country-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Country } from '../../../core/models/master/country.model';

@Component({
  selector: 'app-state-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/states" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to States
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit State</span>
          <span *ngIf="!isEditing">Create New State</span>
        </h1>
        <p *ngIf="isEditing && stateName" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing <strong style="color: white;">{{ stateName }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to add a new state</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">location_city</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">State identifiers and codes</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Country <span style="color: #dc2626;">*</span></label>
              <select formControlName="country_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('country_id')?.invalid && form.get('country_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor=this.value ? '#e5e7eb' : '#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>Select a country</option>
                <option *ngFor="let c of countries" [ngValue]="c.id">{{ c.name }}</option>
              </select>
              <p *ngIf="form.get('country_id')?.invalid && form.get('country_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Country is required</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">State Name <span style="color: #dc2626;">*</span></label>
                <input formControlName="name" placeholder="e.g. Maharashtra"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  [style.borderColor]="form.get('name')?.invalid && form.get('name')?.touched ? '#dc2626' : '#e5e7eb'"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <p *ngIf="form.get('name')?.invalid && form.get('name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Name is required</p>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">State Code</label>
                <input formControlName="state_code" placeholder="MH"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; text-transform: uppercase; letter-spacing: 1px; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Short code (e.g. MH, KA)</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Abbreviation</label>
                <input formControlName="abbreviation" placeholder="MH"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; text-transform: uppercase; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">GST Code</label>
                <input formControlName="gst_code" placeholder="27"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">GST state code</p>
              </div>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #a7f3d0; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">location_on</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Location</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Geographic coordinates</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Latitude</label>
              <input type="number" formControlName="latitude" placeholder="19.7515"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Longitude</label>
              <input type="number" formControlName="longitude" placeholder="75.7139"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">tune</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Settings</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Status, ordering, and additional notes</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status</label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Sort Order</label>
              <input type="number" formControlName="sort_order" placeholder="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Lower numbers appear first</p>
            </div>
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #374151;">
              <input type="checkbox" formControlName="is_default"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; cursor: pointer;" />
              Set as Default State
            </label>
            <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 24px;">Default state is pre-selected in other modules</p>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
            <textarea formControlName="remarks" rows="3" placeholder="Any additional notes..."
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; font-family: inherit; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <span style="font-size: 12px; color: #9ca3af;">
            <span *ngIf="isEditing">Changes will be saved immediately</span>
            <span *ngIf="!isEditing">Fields marked with * are required</span>
          </span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <a routerLink="/admin/states"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; text-decoration: none; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">Cancel</a>
            <button type="submit" [disabled]="form.invalid || isLoading"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              [style.opacity]="form.invalid || isLoading ? '0.6' : '1'"
              [style.cursor]="form.invalid || isLoading ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="isLoading" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEditing">Update State</span>
              <span *ngIf="!isEditing">Create State</span>
            </button>
          </div>
        </div>
      </form>
    </section>

    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class StateFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stateApi = inject(StateApiService);
  private countryApi = inject(CountryApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  stateUuid: string | null = null;
  stateName = '';
  isLoading = false;
  countries: Country[] = [];

  form = this.fb.group({
    country_id: [null, Validators.required],
    name: ['', Validators.required],
    state_code: [''],
    abbreviation: [''],
    gst_code: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    sort_order: [0],
    status: ['active'],
    is_default: [false],
    remarks: [''],
  });

  ngOnInit(): void {
    this.loadCountries();
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.isEditing = true;
      this.stateUuid = uuid;
      this.loadState(uuid);
    }
  }

  loadCountries(): void {
    this.countryApi.getAll().subscribe({
      next: (res) => { this.countries = res.data || []; },
      error: () => {},
    });
  }

  loadState(uuid: string): void {
    this.isLoading = true;
    this.stateApi.getById(uuid).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.stateName = res.data.name;
          this.form.patchValue({
            country_id: res.data.country_id,
            name: res.data.name,
            state_code: res.data.state_code || '',
            abbreviation: res.data.abbreviation || '',
            gst_code: res.data.gst_code || '',
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            sort_order: res.data.sort_order || 0,
            status: res.data.status || 'active',
            is_default: res.data.is_default || false,
            remarks: res.data.remarks || '',
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.notification.error('Failed to load state');
        this.router.navigate(['/admin/states']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const v = this.form.value;

    const payload: any = {
      country_id: v.country_id!,
      name: v.name!,
      state_code: v.state_code || undefined,
      abbreviation: v.abbreviation || undefined,
      gst_code: v.gst_code || undefined,
      latitude: v.latitude || undefined,
      longitude: v.longitude || undefined,
      sort_order: v.sort_order || 0,
      status: v.status || 'active',
      is_default: v.is_default || false,
      remarks: v.remarks || undefined,
    };

    const req = this.isEditing
      ? this.stateApi.update(this.stateUuid!, payload)
      : this.stateApi.create(payload);

    req.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(res.message || (this.isEditing ? 'State updated' : 'State created'));
        this.router.navigate(['/admin/states']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
