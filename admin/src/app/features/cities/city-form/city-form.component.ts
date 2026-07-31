import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CityApiService } from '../../../core/services/city-api.service';
import { CountryApiService } from '../../../core/services/country-api.service';
import { StateApiService } from '../../../core/services/state-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Country } from '../../../core/models/master/country.model';
import { State } from '../../../core/models/master/state.model';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/cities" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Cities
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit City</span>
          <span *ngIf="!isEditing">Create New City</span>
        </h1>
        <p *ngIf="isEditing && cityName" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing <strong style="color: white;">{{ cityName }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to add a new city</p>
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
              <span class="material-icons" style="font-size: 20px; color: #047857;">public</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Location Hierarchy</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Select country and state for this city</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Country <span style="color: #dc2626;">*</span></label>
              <select formControlName="country_id" (change)="onCountryChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('country_id')?.invalid && form.get('country_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor=this.value ? '#e5e7eb' : '#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>Select a country</option>
                <option *ngFor="let c of countries" [ngValue]="c.id">{{ c.name }}</option>
              </select>
              <p *ngIf="form.get('country_id')?.invalid && form.get('country_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Country is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">State <span style="color: #dc2626;">*</span></label>
              <select formControlName="state_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('state_id')?.invalid && form.get('state_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>{{ states.length ? 'Select a state' : 'Select a country first' }}</option>
                <option *ngFor="let s of states" [ngValue]="s.id">{{ s.name }}</option>
              </select>
              <p *ngIf="form.get('state_id')?.invalid && form.get('state_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">State is required</p>
              <p *ngIf="states.length > 0 && !form.get('state_id')?.invalid" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ states.length }} states available</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #a7f3d0; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">location_city</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">City name and identifiers</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">City Name <span style="color: #dc2626;">*</span></label>
              <input formControlName="name" placeholder="e.g. Mumbai"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('name')?.invalid && form.get('name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('name')?.invalid && form.get('name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Name is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">City Code</label>
              <input formControlName="city_code" placeholder="MUM"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; text-transform: uppercase; letter-spacing: 1px; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Short code (e.g. MUM, BLR)</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Pincode</label>
              <input formControlName="pincode" placeholder="400001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Timezone</label>
              <input formControlName="timezone" placeholder="Asia/Kolkata"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #a7f3d0; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">map</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Geography</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Coordinates and population data</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Latitude</label>
              <input type="number" formControlName="latitude" placeholder="19.0760"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Longitude</label>
              <input type="number" formControlName="longitude" placeholder="72.8777"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Population</label>
              <input type="number" formControlName="population" placeholder="12478447"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Area (km&sup2;)</label>
              <input type="number" formControlName="area" placeholder="603.4"
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
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Status, classification, and ordering</p>
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
          <div style="display: flex; gap: 24px; margin-bottom: 16px;">
            <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #374151;">
              <input type="checkbox" formControlName="is_metro"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; cursor: pointer;" />
              Metro City
            </label>
            <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #374151;">
              <input type="checkbox" formControlName="is_default"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; cursor: pointer;" />
              Set as Default City
            </label>
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
            <a routerLink="/admin/cities"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; text-decoration: none; transition: all 0.2s ease;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">Cancel</a>
            <button type="submit" [disabled]="form.invalid || isLoading"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              [style.opacity]="form.invalid || isLoading ? '0.6' : '1'"
              [style.cursor]="form.invalid || isLoading ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="isLoading" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEditing">Update City</span>
              <span *ngIf="!isEditing">Create City</span>
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
export class CityFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cityApi = inject(CityApiService);
  private countryApi = inject(CountryApiService);
  private stateApi = inject(StateApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  cityUuid: string | null = null;
  cityName = '';
  isLoading = false;
  countries: Country[] = [];
  states: State[] = [];

  form = this.fb.group({
    country_id: [null, Validators.required],
    state_id: [null, Validators.required],
    name: ['', Validators.required],
    city_code: [''],
    pincode: [''],
    timezone: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    population: [null as number | null],
    area: [null as number | null],
    sort_order: [0],
    status: ['active'],
    is_metro: [false],
    is_default: [false],
    remarks: [''],
  });

  ngOnInit(): void {
    this.loadCountries();
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.isEditing = true;
      this.cityUuid = uuid;
      this.loadCity(uuid);
    }
  }

  loadCountries(): void {
    this.countryApi.getAll().subscribe({
      next: (res) => { this.countries = res.data || []; },
      error: () => {},
    });
  }

  onCountryChange(): void {
    this.states = [];
    this.form.patchValue({ state_id: null });
    const countryId = this.form.get('country_id')?.value;
    if (countryId) {
      const country = this.countries.find(c => c.id === countryId);
      if (country) {
        this.stateApi.getByCountry(country.uuid).subscribe({
          next: (res) => { this.states = res.data || []; },
          error: () => { this.states = []; },
        });
      }
    }
  }

  loadCity(uuid: string): void {
    this.isLoading = true;
    this.cityApi.getById(uuid).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.cityName = res.data.name;
          const countryId = res.data.country?.id || res.data.country_id;
          this.form.patchValue({
            country_id: countryId,
            name: res.data.name,
            city_code: res.data.city_code || '',
            pincode: res.data.pincode || '',
            timezone: res.data.timezone || '',
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            population: res.data.population,
            area: res.data.area,
            sort_order: res.data.sort_order || 0,
            status: res.data.status || 'active',
            is_metro: res.data.is_metro || false,
            is_default: res.data.is_default || false,
            remarks: res.data.remarks || '',
          });
          if (countryId) {
            const country = this.countries.find(c => c.id === countryId);
            if (country) {
              this.stateApi.getByCountry(country.uuid).subscribe({
                next: (sr) => {
                  this.states = sr.data || [];
                  if (res.data) {
                    this.form.patchValue({ state_id: res.data.state_id });
                  }
                },
              });
            }
          }
        }
      },
      error: () => {
        this.isLoading = false;
        this.notification.error('Failed to load city');
        this.router.navigate(['/admin/cities']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const v = this.form.value;

    const payload: any = {
      country_id: v.country_id!,
      state_id: v.state_id!,
      name: v.name!,
      city_code: v.city_code || undefined,
      pincode: v.pincode || undefined,
      timezone: v.timezone || undefined,
      latitude: v.latitude || undefined,
      longitude: v.longitude || undefined,
      population: v.population || undefined,
      area: v.area || undefined,
      sort_order: v.sort_order || 0,
      status: v.status || 'active',
      is_metro: v.is_metro || false,
      is_default: v.is_default || false,
      remarks: v.remarks || undefined,
    };

    const req = this.isEditing
      ? this.cityApi.update(this.cityUuid!, payload)
      : this.cityApi.create(payload);

    req.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(res.message || (this.isEditing ? 'City updated' : 'City created'));
        this.router.navigate(['/admin/cities']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
