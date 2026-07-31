import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PincodeApiService } from '../../../core/services/pincode-api.service';
import { CountryApiService } from '../../../core/services/country-api.service';
import { StateApiService } from '../../../core/services/state-api.service';
import { CityApiService } from '../../../core/services/city-api.service';
import { AreaApiService } from '../../../core/services/area-api.service';
import { DeliveryZoneApiService } from '../../../core/services/delivery-zone-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Country } from '../../../core/models/master/country.model';
import { State } from '../../../core/models/master/state.model';
import { City } from '../../../core/models/master/city.model';
import { Area } from '../../../core/models/master/area.model';
import { DeliveryZone } from '../../../core/models/master/delivery-zone.model';

@Component({
  selector: 'app-pincode-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/pincodes" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Pincodes
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit Pincode</span>
          <span *ngIf="!isEditing">Create New Pincode</span>
        </h1>
        <p *ngIf="isEditing && pincodeValue" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing <strong style="color: white;">{{ pincodeValue }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to add a new pincode</p>
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
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Location</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Select country, state, city, area and delivery zone</p>
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
              <select formControlName="state_id" (change)="onStateChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('state_id')?.invalid && form.get('state_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>{{ states.length ? 'Select a state' : 'Select a country first' }}</option>
                <option *ngFor="let s of states" [ngValue]="s.id">{{ s.name }}</option>
              </select>
              <p *ngIf="form.get('state_id')?.invalid && form.get('state_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">State is required</p>
              <p *ngIf="states.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ states.length }} states available</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">City <span style="color: #dc2626;">*</span></label>
              <select formControlName="city_id" (change)="onCityChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('city_id')?.invalid && form.get('city_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>{{ cities.length ? 'Select a city' : 'Select a state first' }}</option>
                <option *ngFor="let city of cities" [ngValue]="city.id">{{ city.name }}</option>
              </select>
              <p *ngIf="form.get('city_id')?.invalid && form.get('city_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">City is required</p>
              <p *ngIf="cities.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ cities.length }} cities available</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Area</label>
              <select formControlName="area_id" (change)="onAreaChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">None</option>
                <option *ngFor="let area of areas" [ngValue]="area.id">{{ area.name }}</option>
              </select>
              <p *ngIf="areas.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ areas.length }} areas available</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Zone <span style="color: #dc2626;">*</span></label>
              <select formControlName="delivery_zone_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('delivery_zone_id')?.invalid && form.get('delivery_zone_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>{{ filteredDeliveryZones.length ? 'Select a zone' : 'Select a city first' }}</option>
                <option *ngFor="let z of filteredDeliveryZones" [ngValue]="z.id">{{ z.zone_name }} ({{ z.zone_code }})</option>
              </select>
              <p *ngIf="form.get('delivery_zone_id')?.invalid && form.get('delivery_zone_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Delivery zone is required</p>
              <p *ngIf="filteredDeliveryZones.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ filteredDeliveryZones.length }} zones available</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #a7f3d0; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">pin_drop</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Pincode Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Pincode number, office name and district</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Pincode <span style="color: #dc2626;">*</span></label>
              <input formControlName="pincode" placeholder="e.g. 400053"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; font-family: monospace; box-sizing: border-box;"
                [style.borderColor]="form.get('pincode')?.invalid && form.get('pincode')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('pincode')?.invalid && form.get('pincode')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Pincode is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Office Name</label>
              <input formControlName="office_name" placeholder="e.g. Andheri West SO"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">District</label>
              <input formControlName="district" placeholder="e.g. Mumbai Suburban"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #ccfbf1; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #0d9488;">map</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Coordinates</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Geographic coordinates for this pincode</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Latitude</label>
              <input type="number" formControlName="latitude" placeholder="19.1364"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Longitude</label>
              <input type="number" formControlName="longitude" placeholder="72.8296"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">tune</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Status</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Set the pincode status and serviceability</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
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
            <div style="display: flex; align-items: center; padding-top: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" formControlName="is_serviceable" id="is_serviceable"
                  style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                <label for="is_serviceable" style="font-size: 13px; color: #374151; cursor: pointer; font-weight: 500;">Serviceable Pincode</label>
              </div>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditing">Changes will be saved immediately</span>
            <span *ngIf="!isEditing">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/pincodes"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || isLoading"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="form.invalid || isLoading ? '0.5' : '1'"
              [style.cursor]="form.invalid || isLoading ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="isLoading" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEditing">Update Pincode</span>
              <span *ngIf="!isEditing">Create Pincode</span>
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
export class PincodeFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pincodeApi = inject(PincodeApiService);
  private countryApi = inject(CountryApiService);
  private stateApi = inject(StateApiService);
  private cityApi = inject(CityApiService);
  private areaApi = inject(AreaApiService);
  private deliveryZoneApi = inject(DeliveryZoneApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  pincodeUuid: string | null = null;
  pincodeValue = '';
  isLoading = false;
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  areas: Area[] = [];
  deliveryZones: DeliveryZone[] = [];
  filteredDeliveryZones: DeliveryZone[] = [];

  form = this.fb.group({
    country_id: [null, Validators.required],
    state_id: [null, Validators.required],
    city_id: [null, Validators.required],
    area_id: [null as number | null],
    delivery_zone_id: [null, Validators.required],
    pincode: ['', Validators.required],
    office_name: [''],
    district: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    status: ['active'],
    is_serviceable: [true],
  });

  ngOnInit(): void {
    this.loadCountries();
    this.loadAllDeliveryZones();
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.isEditing = true;
      this.pincodeUuid = uuid;
      this.loadPincode(uuid);
    }
  }

  loadCountries(): void {
    this.countryApi.getAll().subscribe({
      next: (res) => { this.countries = res.data || []; },
      error: () => {},
    });
  }

  loadAllDeliveryZones(): void {
    this.deliveryZoneApi.getAll({ per_page: '100' }).subscribe({
      next: (res) => {
        this.deliveryZones = res.data || [];
        this.filterDeliveryZones();
      },
      error: () => {
        this.deliveryZones = [];
        this.filteredDeliveryZones = [];
      },
    });
  }

  filterDeliveryZones(): void {
    const cityId = this.form.get('city_id')?.value;
    const areaId = this.form.get('area_id')?.value;
    if (cityId) {
      const numCityId = Number(cityId);
      this.filteredDeliveryZones = this.deliveryZones.filter(z => {
        if (Number(z.city_id) !== numCityId) return false;
        if (areaId) {
          const numAreaId = Number(areaId);
          return z.area_id === null || Number(z.area_id) === numAreaId;
        }
        return true;
      });
    } else {
      this.filteredDeliveryZones = [...this.deliveryZones];
    }
  }

  onCountryChange(): void {
    this.states = [];
    this.cities = [];
    this.areas = [];
    this.form.patchValue({ state_id: null, city_id: null, area_id: null, delivery_zone_id: null });
    this.filterDeliveryZones();
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

  onStateChange(): void {
    this.cities = [];
    this.areas = [];
    this.form.patchValue({ city_id: null, area_id: null, delivery_zone_id: null });
    this.filterDeliveryZones();
    const stateId = this.form.get('state_id')?.value;
    if (stateId) {
      const state = this.states.find(s => s.id === stateId);
      if (state) {
        this.cityApi.getByState(state.uuid).subscribe({
          next: (res) => { this.cities = res.data || []; },
          error: () => { this.cities = []; },
        });
      }
    }
  }

  onCityChange(): void {
    this.areas = [];
    this.form.patchValue({ area_id: null, delivery_zone_id: null });
    const cityId = this.form.get('city_id')?.value;
    if (cityId) {
      const city = this.cities.find(c => c.id === cityId);
      if (city) {
        this.areaApi.getByCity(city.uuid).subscribe({
          next: (res) => { this.areas = res.data || []; },
          error: () => { this.areas = []; },
        });
      }
    }
    this.filterDeliveryZones();
  }

  onAreaChange(): void {
    this.filterDeliveryZones();
  }

  loadPincode(uuid: string): void {
    this.isLoading = true;
    this.pincodeApi.getById(uuid).subscribe({
      next: (res) => {
        if (!res.data) {
          this.isLoading = false;
          this.notification.error('Pincode not found');
          this.router.navigate(['/admin/pincodes']);
          return;
        }
        this.pincodeValue = res.data.pincode;
        const countryId = res.data.country?.id ?? res.data.country_id ?? null;
        const stateId = res.data.state?.id ?? res.data.state_id ?? null;
        const cityId = res.data.city?.id ?? res.data.city_id ?? null;
        const areaId = res.data.area?.id ?? res.data.area_id ?? null;
        const deliveryZoneId = res.data.deliveryZone?.id ?? res.data.delivery_zone_id ?? null;

        this.form.patchValue({
          pincode: res.data.pincode,
          office_name: res.data.office_name || '',
          district: res.data.district || '',
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          status: res.data.status || 'active',
          is_serviceable: res.data.is_serviceable ?? true,
        });

        if (!countryId) { this.isLoading = false; return; }

        const afterCountries = () => {
          this.form.patchValue({ country_id: countryId });
          const country = this.countries.find(c => c.id === countryId);
          if (!country) { this.isLoading = false; return; }

          this.stateApi.getByCountry(country.uuid).subscribe({
            next: (sr) => {
              this.states = sr.data || [];
              if (!stateId) { this.isLoading = false; return; }
              this.form.patchValue({ state_id: stateId });
              const state = this.states.find(s => s.id === stateId);
              if (!state) { this.isLoading = false; return; }

              this.cityApi.getByState(state.uuid).subscribe({
                next: (cr) => {
                  this.cities = cr.data || [];
                  if (!cityId) { this.isLoading = false; this.filterDeliveryZones(); return; }
                  this.form.patchValue({ city_id: cityId });
                  const city = this.cities.find(c => c.id === cityId);
                  if (!city) { this.isLoading = false; this.filterDeliveryZones(); return; }

                  this.areaApi.getByCity(city.uuid).subscribe({
                    next: (ar) => {
                      this.areas = ar.data || [];
                      if (areaId) { this.form.patchValue({ area_id: areaId }); }
                      this.form.patchValue({ delivery_zone_id: deliveryZoneId });
                      this.filterDeliveryZones();
                      this.isLoading = false;
                    },
                    error: () => {
                      if (areaId) { this.form.patchValue({ area_id: areaId }); }
                      this.form.patchValue({ delivery_zone_id: deliveryZoneId });
                      this.filterDeliveryZones();
                      this.isLoading = false;
                    },
                  });
                },
                error: () => { this.isLoading = false; this.filterDeliveryZones(); },
              });
            },
            error: () => { this.isLoading = false; },
          });
        };

        if (this.countries.length) {
          afterCountries();
        } else {
          this.countryApi.getAll().subscribe({
            next: (cr) => { this.countries = cr.data || []; afterCountries(); },
            error: () => { this.isLoading = false; },
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.notification.error('Failed to load pincode');
        this.router.navigate(['/admin/pincodes']);
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
      city_id: v.city_id!,
      delivery_zone_id: v.delivery_zone_id!,
      pincode: v.pincode!,
      office_name: v.office_name || undefined,
      district: v.district || undefined,
      latitude: v.latitude || undefined,
      longitude: v.longitude || undefined,
      status: v.status || 'active',
      is_serviceable: v.is_serviceable ?? true,
    };
    if (v.area_id) payload.area_id = v.area_id;

    const req = this.isEditing
      ? this.pincodeApi.update(this.pincodeUuid!, payload)
      : this.pincodeApi.create(payload);

    req.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(res.message || (this.isEditing ? 'Pincode updated' : 'Pincode created'));
        this.router.navigate(['/admin/pincodes']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
