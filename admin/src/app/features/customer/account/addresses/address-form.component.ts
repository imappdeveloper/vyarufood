import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CustomerFrontAddressApiService } from '../../../../core/services/customer-front-address-api.service';
import { CustomerAddress } from '../../../../core/models/customer/customer-address.model';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Address Type -->
      <div>
        <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 8px;">Address Type *</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          @for (type of addressTypes; track type.value) {
            <button (click)="form.address_type = type.value"
              [style]="form.address_type === type.value
                ? 'padding: 8px 16px; border-radius: 12px; border: 1px solid #059669; font-size: 13px; font-weight: 500; background: #ecfdf5; color: #065f46; cursor: pointer; transition: all 0.15s;'
                : 'padding: 8px 16px; border-radius: 12px; border: 1px solid #e5e7eb; font-size: 13px; font-weight: 500; background: #fff; color: #6b7280; cursor: pointer; transition: all 0.15s;'"
              onmouseover="this.style.borderColor='#059669';this.style.color='#059669'"
              onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#6b7280'">
              <span class="material-icons" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">{{ type.icon }}</span>
              {{ type.label }}
            </button>
          }
        </div>
      </div>

      <!-- Contact Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Full Name *</label>
          <input type="text" [(ngModel)]="form.contact_person" placeholder="John Doe"
            style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Phone *</label>
          <input type="tel" [(ngModel)]="form.contact_mobile" placeholder="+91 XXXXX XXXXX"
            style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
        </div>
      </div>

      <!-- Address Fields -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">House/Flat No.</label>
          <input type="text" [(ngModel)]="form.house_no" placeholder="Flat 101"
            style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Building/Apartment</label>
          <input type="text" [(ngModel)]="form.building_name" placeholder="ABC Apartments"
            style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Floor</label>
          <input type="text" [(ngModel)]="form.floor" placeholder="3rd Floor"
            style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
        </div>
      </div>

      <div>
        <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Street/Road *</label>
        <input type="text" [(ngModel)]="form.street" placeholder="MG Road, near City Mall"
          style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
      </div>
      <div>
        <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Address Line 1 *</label>
        <input type="text" [(ngModel)]="form.address_line_1" placeholder="Complete address"
          style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
      </div>
      <div>
        <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Address Line 2</label>
        <input type="text" [(ngModel)]="form.address_line_2" placeholder="Additional address details"
          style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
      </div>
      <div>
        <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Landmark</label>
        <input type="text" [(ngModel)]="form.landmark" placeholder="Near XYZ Hospital"
          style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
      </div>

      <!-- Location Cascading Dropdowns -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <h4 style="font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons" style="font-size: 18px; color: #059669;">location_on</span>
          Location
        </h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Country *</label>
            <select [(ngModel)]="form.country_id" (ngModelChange)="onCountryChange()"
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box; background: #fff;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
              <option [ngValue]="null">Select Country</option>
              @for (c of countries; track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">State *</label>
            <select [(ngModel)]="form.state_id" (ngModelChange)="onStateChange()" [disabled]="!form.country_id || loadingStates"
              [style]="'width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box; background: #fff;' + ((!form.country_id || loadingStates) ? ' opacity: 0.6; cursor: not-allowed;' : '')" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
              <option [ngValue]="null">{{ loadingStates ? 'Loading...' : 'Select State' }}</option>
              @for (s of states; track s.id) {
                <option [ngValue]="s.id">{{ s.name }}</option>
              }
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">City *</label>
            <select [(ngModel)]="form.city_id" (ngModelChange)="onCityChange()" [disabled]="!form.state_id || loadingCities"
              [style]="'width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box; background: #fff;' + ((!form.state_id || loadingCities) ? ' opacity: 0.6; cursor: not-allowed;' : '')" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
              <option [ngValue]="null">{{ loadingCities ? 'Loading...' : 'Select City' }}</option>
              @for (c of cities; track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Area</label>
            <select [(ngModel)]="form.area_id" [disabled]="!form.city_id || loadingAreas"
              [style]="'width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box; background: #fff;' + ((!form.city_id || loadingAreas) ? ' opacity: 0.6; cursor: not-allowed;' : '')" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
              <option [ngValue]="null">{{ loadingAreas ? 'Loading...' : 'Select Area' }}</option>
              @for (a of areas; track a.id) {
                <option [ngValue]="a.id">{{ a.name }}</option>
              }
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Pincode</label>
            <select [(ngModel)]="form.pincode_id" [disabled]="!form.city_id || loadingPincodes"
              [style]="'width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box; background: #fff;' + ((!form.city_id || loadingPincodes) ? ' opacity: 0.6; cursor: not-allowed;' : '')" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
              <option [ngValue]="null">{{ loadingPincodes ? 'Loading...' : 'Select Pincode' }}</option>
              @for (p of pincodes; track p.id) {
                <option [ngValue]="p.id">{{ p.pincode }}{{ p.office_name ? ' - ' + p.office_name : '' }}</option>
              }
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Delivery Instructions</label>
            <input type="text" [(ngModel)]="form.delivery_instruction" placeholder="Ring the bell, leave at security..."
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
          </div>
        </div>

        <!-- Delivery Check Button -->
        @if (form.city_id) {
          <div style="margin-top: 16px;">
            <button (click)="checkDelivery()" [disabled]="checkingDelivery || !form.city_id" [style]="'display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f3f4f6; color: #374151; font-size: 13px; font-weight: 500; border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;' + ((checkingDelivery || !form.city_id) ? ' opacity: 0.5; cursor: not-allowed;' : '')" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
              @if (checkingDelivery) {
                <span class="material-icons" style="font-size: 16px; animation: spin 1s linear infinite;">refresh</span>
              } @else {
                <span class="material-icons" style="font-size: 16px;">local_shipping</span>
              }
              {{ checkingDelivery ? 'Checking...' : 'Check Delivery Availability' }}
            </button>
            @if (deliveryResult) {
              <div [style]="'margin-top: 8px; display: flex; align-items: center; gap: 8px; font-size: 13px;' + (deliveryResult.available ? ' color: #166534;' : ' color: #dc2626;')">
                <span class="material-icons" style="font-size: 18px;">{{ deliveryResult.available ? 'check_circle' : 'cancel' }}</span>
                {{ deliveryResult.message }}
              </div>
            }
          </div>
        }
      </div>

      <!-- Lat/Lng (optional) -->
      <details style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <summary style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; user-select: none; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons" style="font-size: 18px; color: #9ca3af;">map</span>
          Map Location (Optional)
        </summary>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Latitude</label>
            <input type="number" step="any" [(ngModel)]="form.latitude" placeholder="26.2183"
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px;">Longitude</label>
            <input type="number" step="any" [(ngModel)]="form.longitude" placeholder="78.1828"
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
          </div>
        </div>
      </details>

      <!-- Default -->
      <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding-top: 4px;">
        <input type="checkbox" [(ngModel)]="form.is_default"
          style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; border: 1px solid #d1d5db;" />
        <span style="font-size: 13px; color: #374151;">Set as default delivery address</span>
      </label>

      <!-- Error -->
      @if (error) {
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons" style="color: #dc2626; font-size: 18px;">error</span>
          <p style="font-size: 13px; color: #991b1b; margin: 0;">{{ error }}</p>
        </div>
      }

      <!-- Actions -->
      <div style="display: flex; align-items: center; gap: 12px; padding-top: 4px;">
        <button (click)="save()" [disabled]="saving || !isValid()" [style]="'display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #059669; color: #fff; font-size: 14px; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; transition: all 0.15s;' + ((saving || !isValid()) ? ' opacity: 0.5; cursor: not-allowed;' : '')" onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
          @if (saving) {
            <span class="material-icons" style="font-size: 16px; animation: spin 1s linear infinite;">refresh</span>
          }
          {{ saving ? 'Saving...' : (editMode ? 'Update Address' : 'Save Address') }}
        </button>
        <button (click)="cancelled.emit()" style="padding: 12px 24px; color: #374151; font-size: 14px; font-weight: 500; border-radius: 12px; background: transparent; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='transparent'">Cancel</button>
      </div>
    </div>
  `,
})
export class AddressFormComponent implements OnInit, OnChanges {
  @Input() address: CustomerAddress | null = null;
  @Output() saved = new EventEmitter<CustomerAddress>();
  @Output() cancelled = new EventEmitter<void>();

  private addressApi = inject(CustomerFrontAddressApiService);
  private destroy$ = new Subject<void>();

  get editMode(): boolean {
    return !!this.address;
  }

  form: any = {
    address_type: 'home',
    contact_person: '',
    contact_mobile: '',
    house_no: '',
    building_name: '',
    floor: '',
    street: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    country_id: null,
    state_id: null,
    city_id: null,
    area_id: null,
    pincode_id: null,
    delivery_instruction: '',
    latitude: null,
    longitude: null,
    is_default: false,
  };

  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  areas: any[] = [];
  pincodes: any[] = [];

  loadingStates = false;
  loadingCities = false;
  loadingAreas = false;
  loadingPincodes = false;
  checkingDelivery = false;
  deliveryResult: { available: boolean; message: string } | null = null;
  saving = false;
  error = '';

  addressTypes = [
    { value: 'home', label: 'Home', icon: 'home' },
    { value: 'office', label: 'Office', icon: 'business' },
    { value: 'apartment', label: 'Apartment', icon: 'apartment' },
    { value: 'hostel', label: 'Hostel', icon: 'other_houses' },
    { value: 'pg', label: 'PG', icon: 'hotel' },
    { value: 'other', label: 'Other', icon: 'location_on' },
  ];

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address) {
      this.populateForm();
    }
  }

  loadCountries(): void {
    this.addressApi.getCountries().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.countries = res.data;
          if (this.address) {
            this.populateForm();
          } else if (this.countries.length === 1) {
            this.form.country_id = this.countries[0].id;
            this.onCountryChange();
          }
        }
      },
    });
  }

  populateForm(): void {
    if (!this.address) return;
    const a = this.address;
    this.form = {
      address_type: a.address_type || 'home',
      contact_person: a.contact_person || '',
      contact_mobile: a.contact_mobile || '',
      house_no: a.house_no || '',
      building_name: a.building_name || '',
      floor: a.floor || '',
      street: a.street || '',
      address_line_1: a.address_line_1 || '',
      address_line_2: a.address_line_2 || '',
      landmark: a.landmark || '',
      country_id: a.country_id || null,
      state_id: a.state_id || null,
      city_id: a.city_id || null,
      area_id: a.area_id || null,
      pincode_id: (a.pincode && typeof a.pincode === 'object') ? a.pincode.id : null,
      delivery_instruction: a.delivery_instruction || '',
      latitude: a.latitude || null,
      longitude: a.longitude || null,
      is_default: a.is_default || false,
    };

    if (this.form.country_id) {
      this.loadStatesForCountry(this.form.country_id, () => {
        if (this.form.state_id) {
          this.loadCitiesForState(this.form.state_id, () => {
            if (this.form.city_id) {
              this.loadAreasForCity(this.form.city_id);
              this.loadPincodesForCity(this.form.city_id);
            }
          });
        }
      });
    }
  }

  onCountryChange(): void {
    this.states = [];
    this.cities = [];
    this.areas = [];
    this.pincodes = [];
    this.form.state_id = null;
    this.form.city_id = null;
    this.form.area_id = null;
    this.form.pincode_id = null;
    this.deliveryResult = null;

    if (this.form.country_id) {
      this.loadStatesForCountry(this.form.country_id);
    }
  }

  onStateChange(): void {
    this.cities = [];
    this.areas = [];
    this.pincodes = [];
    this.form.city_id = null;
    this.form.area_id = null;
    this.form.pincode_id = null;
    this.deliveryResult = null;

    if (this.form.state_id) {
      this.loadCitiesForState(this.form.state_id);
    }
  }

  onCityChange(): void {
    this.areas = [];
    this.pincodes = [];
    this.form.area_id = null;
    this.form.pincode_id = null;
    this.deliveryResult = null;

    if (this.form.city_id) {
      const city = this.cities.find((c: any) => c.id === this.form.city_id);
      if (city?.uuid) {
        this.loadAreasForCity(this.form.city_id);
        this.loadPincodesForCity(this.form.city_id);
      }
    }
  }

  private loadStatesForCountry(countryId: number, callback?: () => void): void {
    const country = this.countries.find((c: any) => c.id === countryId);
    if (!country?.uuid) return;
    this.loadingStates = true;
    this.addressApi.getStates(country.uuid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loadingStates = false;
        if (res.success && res.data) this.states = res.data;
        callback?.();
      },
      error: () => { this.loadingStates = false; callback?.(); },
    });
  }

  private loadCitiesForState(stateId: number, callback?: () => void): void {
    const state = this.states.find((s: any) => s.id === stateId);
    if (!state?.uuid) return;
    this.loadingCities = true;
    this.addressApi.getCities(state.uuid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loadingCities = false;
        if (res.success && res.data) this.cities = res.data;
        callback?.();
      },
      error: () => { this.loadingCities = false; callback?.(); },
    });
  }

  private loadAreasForCity(cityId: number): void {
    const city = this.cities.find((c: any) => c.id === cityId);
    if (!city?.uuid) return;
    this.loadingAreas = true;
    this.addressApi.getAreas(city.uuid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loadingAreas = false;
        if (res.success && res.data) this.areas = res.data;
      },
      error: () => { this.loadingAreas = false; },
    });
  }

  private loadPincodesForCity(cityId: number): void {
    const city = this.cities.find((c: any) => c.id === cityId);
    if (!city?.uuid) return;
    this.loadingPincodes = true;
    this.addressApi.getPincodes(city.uuid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loadingPincodes = false;
        if (res.success && res.data) this.pincodes = res.data;
      },
      error: () => { this.loadingPincodes = false; },
    });
  }

  checkDelivery(): void {
    this.checkingDelivery = true;
    this.deliveryResult = null;

    const payload: Record<string, any> = {};
    if (this.form.area_id) payload['area_id'] = this.form.area_id;
    if (this.form.pincode_id) payload['pincode_id'] = this.form.pincode_id;

    this.addressApi.checkDelivery(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.checkingDelivery = false;
        if (res.success && res.data) {
          this.deliveryResult = {
            available: res.data.available ?? res.data.service_available ?? false,
            message: res.data.message || (res.data.available ? 'Delivery available in your area.' : 'We currently don\'t deliver to this area.'),
          };
        } else {
          this.deliveryResult = { available: false, message: res.message || 'Unable to check delivery availability.' };
        }
      },
      error: (err) => {
        this.checkingDelivery = false;
        this.deliveryResult = { available: false, message: err.error?.message || 'Unable to check delivery availability.' };
      },
    });
  }

  isValid(): boolean {
    return !!(
      this.form.address_type &&
      this.form.contact_person?.trim() &&
      this.form.contact_mobile?.trim() &&
      this.form.address_line_1?.trim() &&
      this.form.country_id &&
      this.form.state_id &&
      this.form.city_id
    );
  }

  save(): void {
    if (!this.isValid()) return;
    this.saving = true;
    this.error = '';

    const payload: Record<string, any> = {
      address_type: this.form.address_type,
      contact_person: this.form.contact_person?.trim(),
      contact_mobile: this.form.contact_mobile?.trim(),
      house_no: this.form.house_no?.trim() || undefined,
      building_name: this.form.building_name?.trim() || undefined,
      floor: this.form.floor?.trim() || undefined,
      street: this.form.street?.trim() || undefined,
      address_line_1: this.form.address_line_1?.trim(),
      address_line_2: this.form.address_line_2?.trim() || undefined,
      landmark: this.form.landmark?.trim() || undefined,
      country_id: this.form.country_id,
      state_id: this.form.state_id,
      city_id: this.form.city_id,
      area_id: this.form.area_id || undefined,
      pincode_id: this.form.pincode_id || undefined,
      delivery_instruction: this.form.delivery_instruction?.trim() || undefined,
      latitude: this.form.latitude || undefined,
      longitude: this.form.longitude || undefined,
      is_default: this.form.is_default,
    };

    const request$ = this.editMode
      ? this.addressApi.updateAddress(this.address!.uuid, payload as any)
      : this.addressApi.createAddress(payload as any);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success && res.data) {
          this.saved.emit(res.data);
        } else {
          this.error = res.message || 'Failed to save address.';
        }
      },
      error: (err) => {
        this.saving = false;
        if (err.status === 422) {
          const errors = err.error?.errors;
          if (errors) {
            const firstKey = Object.keys(errors)[0];
            this.error = errors[firstKey]?.[0] || 'Please check the entered details.';
          } else {
            this.error = 'Please check the entered address details.';
          }
        } else {
          this.error = err.error?.message || 'Unable to save address. Please try again.';
        }
      },
    });
  }
}
