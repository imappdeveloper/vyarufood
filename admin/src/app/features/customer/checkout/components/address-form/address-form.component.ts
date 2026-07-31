import { Component, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerFrontAddressApiService } from '../../../../../core/services/customer-front-address-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <h3 style="font-size: 0.9rem; font-weight: 700; color: #1e293b; margin: 0;">Add New Address</h3>
        <button (click)="cancelled.emit()"
          style="display: flex; align-items: center; gap: 0.2rem; padding: 0.3rem 0.6rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white; color: #6b7280; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s;"
          onmouseover="this.style.borderColor='#d1d5db'; this.style.color='#374151'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#6b7280'">
          Cancel
        </button>
      </div>

      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem;">Address Type</label>
        <div style="display: flex; gap: 0.5rem;">
          @for (type of addressTypes; track type.value) {
            <button (click)="form.address_type = type.value"
              style="padding: 0.45rem 0.875rem; border-radius: 0.5rem; border: 1.5px solid #e5e7eb; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s; background: white;"
              [style.border-color]="form.address_type === type.value ? '#059669' : '#e5e7eb'"
              [style.background]="form.address_type === type.value ? '#f0fdf4' : 'white'"
              [style.color]="form.address_type === type.value ? '#059669' : '#4b5563'"
              [style.font-weight]="form.address_type === type.value ? '600' : '500'">
              {{ type.label }}
            </button>
          }
        </div>
      </div>

      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Address Line 1 *</label>
        <input type="text" [(ngModel)]="form.address_line_1" placeholder="House/Flat No., Street, Area"
          style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
      </div>
      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Address Line 2</label>
        <input type="text" [(ngModel)]="form.address_line_2" placeholder="Landmark, Colony, etc."
          style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem;">
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Country *</label>
          <select [(ngModel)]="form.country_id" (ngModelChange)="onCountryChange()"
            style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; background: white;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
            <option [ngValue]="null">Select</option>
            @for (c of countries; track c.id) {
              <option [ngValue]="c.id">{{ c.name }}</option>
            }
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">State *</label>
          <select [(ngModel)]="form.state_id" (ngModelChange)="onStateChange()"
            style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; background: white;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
            <option [ngValue]="null">Select</option>
            @for (s of states; track s.id) {
              <option [ngValue]="s.id">{{ s.name }}</option>
            }
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem;">
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">City *</label>
          <select [(ngModel)]="form.city_id" (ngModelChange)="onCityChange()"
            style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; background: white;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
            <option [ngValue]="null">Select</option>
            @for (c of cities; track c.id) {
              <option [ngValue]="c.id">{{ c.name }}</option>
            }
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Pincode *</label>
          <select [(ngModel)]="form.pincode_id" (ngModelChange)="onPincodeChange()"
            [disabled]="!form.city_id || loadingPincodes"
            style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; background: white;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
            @if (loadingPincodes) {
              <option [ngValue]="null">Loading...</option>
            } @else if (!form.city_id) {
              <option [ngValue]="null">Select city first</option>
            } @else if (pincodes.length === 0) {
              <option [ngValue]="null">No pincodes found</option>
            } @else {
              <option [ngValue]="null">Select</option>
              @for (p of pincodes; track p.id) {
                <option [ngValue]="p.id">{{ p.pincode }}{{ p.office_name ? ' - ' + p.office_name : '' }}</option>
              }
            }
          </select>
        </div>
      </div>

      @if (selectedPincode) {
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 0.625rem 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
          <span class="material-icons" style="color: #059669; font-size: 1rem;">check_circle</span>
          <div style="flex: 1;">
            <span style="font-size: 0.8rem; color: #065f46; font-weight: 500;">Delivery available</span>
            @if (selectedPincode.office_name) {
              <span style="font-size: 0.75rem; color: #059669; margin-left: 0.35rem;">{{ selectedPincode.office_name }}</span>
            }
          </div>
          @if (selectedPincode.delivery_zone_id) {
            <span style="font-size: 0.72rem; color: #059669; background: #dcfce7; padding: 0.15rem 0.5rem; border-radius: 9999px; font-weight: 600;">Zone ID: {{ selectedPincode.delivery_zone_id }}</span>
          }
        </div>
      }

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem;">
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Contact Person</label>
          <input type="text" [(ngModel)]="form.contact_person" placeholder="Name"
            style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
        </div>
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Contact Mobile</label>
          <input type="tel" [(ngModel)]="form.contact_mobile" placeholder="Phone"
            style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
        </div>
      </div>

      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Landmark</label>
        <input type="text" [(ngModel)]="form.landmark" placeholder="Nearby landmark"
          style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
      </div>
      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;">Delivery Instructions</label>
        <textarea [(ngModel)]="form.delivery_instruction" rows="2" placeholder="Ring the bell, etc."
          style="width: 100%; padding: 0.6rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.625rem; font-size: 0.8rem; outline: none; transition: border-color 0.2s; resize: none; box-sizing: border-box;"
          onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"></textarea>
      </div>

      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" [(ngModel)]="form.is_default"
          style="width: 1rem; height: 1rem; accent-color: #059669; border-radius: 0.25rem;" />
        <span style="font-size: 0.8rem; color: #374151;">Set as default address</span>
      </label>

      @if (error) {
        <p style="font-size: 0.8rem; color: #dc2626; margin: 0;">{{ error }}</p>
      }

      <button (click)="save()" [disabled]="!canSave"
        style="width: 100%; padding: 0.7rem; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 600; font-size: 0.875rem; border-radius: 0.625rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s; box-shadow: 0 2px 8px rgba(5,150,105,0.25);"
        onmouseover="if(!this.disabled){this.style.boxShadow='0 4px 12px rgba(5,150,105,0.35)'}" onmouseout="this.style.boxShadow='0 2px 8px rgba(5,150,105,0.25)'"
        [style.opacity]="canSave ? '1' : '0.5'"
        [style.cursor]="canSave ? 'pointer' : 'not-allowed'">
        @if (saving) {
          <span class="material-icons" style="font-size: 1rem; animation: spin 1s linear infinite;">refresh</span>
        }
        {{ saving ? 'Saving...' : 'Save Address' }}
      </button>
    </div>
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class AddressFormComponent implements OnInit, OnDestroy {
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  private addressApi = inject(CustomerFrontAddressApiService);
  private destroy$ = new Subject<void>();

  form: any = {
    address_type: 'home',
    address_line_1: '',
    address_line_2: '',
    country_id: 0,
    state_id: 0,
    city_id: 0,
    pincode_id: null,
    is_default: false,
  };

  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  pincodes: any[] = [];
  selectedPincode: any = null;
  loadingPincodes = false;
  saving = false;
  error = '';

  get canSave(): boolean {
    return !!(
      !this.saving &&
      this.form.address_line_1 &&
      this.form.country_id &&
      this.form.state_id &&
      this.form.city_id &&
      this.form.pincode_id
    );
  }

  addressTypes = [
    { value: 'home', label: 'Home' },
    { value: 'office', label: 'Office' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'other', label: 'Other' },
  ];

  ngOnInit(): void {
    this.addressApi.getCountries().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.countries = res.data;
          if (this.countries.length === 1) {
            this.form.country_id = this.countries[0].id;
            this.onCountryChange();
          }
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCountryChange(): void {
    this.states = [];
    this.cities = [];
    this.pincodes = [];
    this.selectedPincode = null;
    this.form.state_id = 0;
    this.form.city_id = 0;
    this.form.pincode_id = null;
    if (this.form.country_id) {
      const country = this.countries.find(c => c.id === this.form.country_id);
      if (country?.uuid) {
        this.addressApi.getStates(country.uuid).subscribe({
          next: (res) => { if (res.success && res.data) this.states = res.data; },
        });
      }
    }
  }

  onStateChange(): void {
    this.cities = [];
    this.pincodes = [];
    this.selectedPincode = null;
    this.form.city_id = 0;
    this.form.pincode_id = null;
    if (this.form.state_id) {
      const state = this.states.find(s => s.id === this.form.state_id);
      if (state?.uuid) {
        this.addressApi.getCities(state.uuid).subscribe({
          next: (res) => { if (res.success && res.data) this.cities = res.data; },
        });
      }
    }
  }

  onCityChange(): void {
    this.pincodes = [];
    this.selectedPincode = null;
    this.form.pincode_id = null;
    if (this.form.city_id) {
      const city = this.cities.find(c => c.id === this.form.city_id);
      if (city?.uuid) {
        this.loadingPincodes = true;
        this.addressApi.getPincodes(city.uuid).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => {
            this.loadingPincodes = false;
            if (res.success && res.data) this.pincodes = res.data;
          },
          error: () => { this.loadingPincodes = false; },
        });
      }
    }
  }

  onPincodeChange(): void {
    this.selectedPincode = this.pincodes.find(p => p.id === this.form.pincode_id) || null;
  }

  save(): void {
    if (!this.canSave) return;
    this.saving = true;
    this.error = '';

    this.addressApi.createAddress(this.form).subscribe({
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
        this.error = err.error?.message || 'Failed to save address.';
      },
    });
  }
}
