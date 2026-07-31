import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomerAddressApiService } from '../../../core/services/customer-address-api.service';
import { CustomerApiService } from '../../../core/services/customer-api.service';
import { CountryApiService } from '../../../core/services/country-api.service';
import { StateApiService } from '../../../core/services/state-api.service';
import { CityApiService } from '../../../core/services/city-api.service';
import { AreaApiService } from '../../../core/services/area-api.service';
import { DeliveryZoneApiService } from '../../../core/services/delivery-zone-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Customer } from '../../../core/models/customer/customer.model';
import { Country } from '../../../core/models/master/country.model';
import { State } from '../../../core/models/master/state.model';
import { City } from '../../../core/models/master/city.model';
import { Area } from '../../../core/models/master/area.model';

@Component({
  selector: 'app-customer-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/customer-addresses" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Addresses
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit Address</span>
          <span *ngIf="!isEditing">Add New Address</span>
        </h1>
        <p *ngIf="isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing address for <strong style="color: white;">{{ addressLabel }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Add a delivery address for a customer</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; gap: 16px;">

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #1d4ed8;">person</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Customer & Type</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Select the customer and address type</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Customer <span style="color: #dc2626;">*</span></label>
              <select formControlName="customer_id" [compareWith]="compareById"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('customer_id')?.invalid && form.get('customer_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor=this.value ? '#e5e7eb' : '#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>Select a customer</option>
                <option *ngFor="let c of customers" [ngValue]="c.id">{{ c.full_name }} ({{ c.email }})</option>
              </select>
              <p *ngIf="form.get('customer_id')?.invalid && form.get('customer_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Customer is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Address Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="address_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="hostel">Hostel</option>
                <option value="apartment">Apartment</option>
                <option value="pg">PG</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #e9d5ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">location_on</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Address Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">House, building, floor, and street information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">House / Flat No.</label>
              <input formControlName="house_no" placeholder="e.g. 101"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Building / Society</label>
              <input formControlName="building_name" placeholder="e.g. Green Towers"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Floor</label>
              <input formControlName="floor" placeholder="e.g. 3rd"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: span 2;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Street / Road</label>
              <input formControlName="street" placeholder="e.g. MG Road"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Landmark</label>
              <input formControlName="landmark" placeholder="e.g. Near Temple"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Address Line 1</label>
              <input formControlName="address_line_1" placeholder="Full address line 1"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Address Line 2</label>
              <input formControlName="address_line_2" placeholder="Full address line 2"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">map</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Location</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Country, state, city, area, pincode, and delivery zone</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Country</label>
              <select formControlName="country_id" (change)="onCountryChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select a country</option>
                <option *ngFor="let c of countries" [ngValue]="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">State</label>
              <select formControlName="state_id" (change)="onStateChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">{{ states.length ? 'Select a state' : 'Select a country first' }}</option>
                <option *ngFor="let s of states" [ngValue]="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">City</label>
              <select formControlName="city_id" (change)="onCityChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">{{ cities.length ? 'Select a city' : 'Select a state first' }}</option>
                <option *ngFor="let city of cities" [ngValue]="city.id">{{ city.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Area</label>
              <select formControlName="area_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">{{ areas.length ? 'Select an area' : 'Select a city first' }}</option>
                <option *ngFor="let area of areas" [ngValue]="area.id">{{ area.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Pincode</label>
              <input formControlName="pincode" placeholder="e.g. 400001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; font-family: monospace; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Zone</label>
              <select formControlName="delivery_zone_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">{{ deliveryZones.length ? 'Select a zone' : 'Select a city first' }}</option>
                <option *ngFor="let z of deliveryZones" [ngValue]="z.id">{{ z.zone_name }} ({{ z.zone_code }})</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Latitude</label>
              <input type="number" step="any" formControlName="latitude" placeholder="19.1364"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Longitude</label>
              <input type="number" step="any" formControlName="longitude" placeholder="72.8296"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">contact_phone</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Contact & Instructions</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Contact person, mobile, and delivery instructions</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Contact Person</label>
              <input formControlName="contact_person" placeholder="e.g. John Doe"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Contact Mobile</label>
              <input formControlName="contact_mobile" placeholder="e.g. 9876543210"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Instruction</label>
              <textarea formControlName="delivery_instruction" rows="3" placeholder="Gate code, special instructions, etc."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; font-family: inherit; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fce7f3; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #db2777;">settings</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Settings</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Default, verified, and status</p>
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
              </select>
            </div>
            <div style="display: flex; align-items: center; gap: 24px; padding-top: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" formControlName="is_default" id="is_default"
                  style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                <label for="is_default" style="font-size: 13px; color: #374151; cursor: pointer; font-weight: 500;">Set as Default</label>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" formControlName="is_verified" id="is_verified"
                  style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
                <label for="is_verified" style="font-size: 13px; color: #374151; cursor: pointer; font-weight: 500;">Verified</label>
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
            <a routerLink="/admin/customer-addresses"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="form.invalid || saving ? '0.5' : '1'"
              [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEditing">Update Address</span>
              <span *ngIf="!isEditing">Create Address</span>
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
export class CustomerAddressFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private addressApi = inject(CustomerAddressApiService);
  private customerApi = inject(CustomerApiService);
  private countryApi = inject(CountryApiService);
  private stateApi = inject(StateApiService);
  private cityApi = inject(CityApiService);
  private areaApi = inject(AreaApiService);
  private deliveryZoneApi = inject(DeliveryZoneApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  saving = false;
  addressUuid = '';
  addressLabel = '';

  customers: Customer[] = [];
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  areas: Area[] = [];
  deliveryZones: any[] = [];

  form = this.fb.group({
    customer_id: [null as number | null, Validators.required],
    address_type: ['home', Validators.required],
    house_no: [null as string | null],
    building_name: [null as string | null],
    floor: [null as string | null],
    street: [null as string | null],
    landmark: [null as string | null],
    address_line_1: [null as string | null],
    address_line_2: [null as string | null],
    country_id: [null as number | null],
    state_id: [null as number | null],
    city_id: [null as number | null],
    area_id: [null as number | null],
    pincode: [null as string | null],
    delivery_zone_id: [null as number | null],
    latitude: [null as number | null],
    longitude: [null as number | null],
    contact_person: [null as string | null],
    contact_mobile: [null as string | null],
    delivery_instruction: [null as string | null],
    is_default: [false],
    is_verified: [false],
    status: ['active', Validators.required],
  });

  ngOnInit(): void {
    this.addressUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditing = !!this.addressUuid;

    this.customerApi.getAll().pipe(
      catchError(() => of({ data: [] })),
    ).subscribe({
      next: (cRes) => {
        this.customers = (cRes as any).data || [];
        this.countryApi.getAll().pipe(
          catchError(() => of({ data: [] })),
        ).subscribe({
          next: (coRes) => {
            this.countries = (coRes as any).data || [];
            if (this.isEditing) {
              this.loadAddress();
            }
          },
          error: () => {
            if (this.isEditing) this.loadAddress();
          },
        });
      },
    });
  }

  onCountryChange(): void {
    const countryId = this.form.get('country_id')?.value;
    this.states = []; this.cities = []; this.areas = []; this.deliveryZones = [];
    this.form.patchValue({ state_id: null, city_id: null, area_id: null, delivery_zone_id: null });
    if (countryId) {
      const country = this.countries.find(c => c.id === countryId);
      if (country) {
        this.stateApi.getByCountry(country.uuid).subscribe({
          next: (res) => { this.states = res.data || []; },
        });
      }
    }
  }

  onStateChange(): void {
    const stateId = this.form.get('state_id')?.value;
    this.cities = []; this.areas = []; this.deliveryZones = [];
    this.form.patchValue({ city_id: null, area_id: null, delivery_zone_id: null });
    if (stateId) {
      const state = this.states.find(s => s.id === stateId);
      if (state) {
        this.cityApi.getByState(state.uuid).subscribe({
          next: (res) => { this.cities = res.data || []; },
        });
      }
    }
  }

  onCityChange(): void {
    const cityId = this.form.get('city_id')?.value;
    this.areas = []; this.deliveryZones = [];
    this.form.patchValue({ area_id: null, delivery_zone_id: null });
    if (cityId) {
      const city = this.cities.find(c => c.id === cityId);
      if (city) {
        this.areaApi.getByCity(city.uuid).subscribe({
          next: (res) => { this.areas = res.data || []; },
        });
        this.deliveryZoneApi.getAll({ city_id: cityId.toString(), status: 'active' }).subscribe({
          next: (res) => { this.deliveryZones = res.data || []; },
        });
      }
    }
  }

  loadAddress(): void {
    this.addressApi.getById(this.addressUuid).subscribe({
      next: (res) => {
        const a = res.data!;
        this.addressLabel = `${a.address_type} address for ${a.customer?.full_name || 'Customer'}`;
        this.form.patchValue({
          customer_id: a.customer_id,
          address_type: a.address_type,
          house_no: a.house_no,
          building_name: a.building_name,
          floor: a.floor,
          street: a.street,
          landmark: a.landmark,
          address_line_1: a.address_line_1,
          address_line_2: a.address_line_2,
          pincode: a.pincode?.pincode || null,
          latitude: a.latitude,
          longitude: a.longitude,
          contact_person: a.contact_person,
          contact_mobile: a.contact_mobile,
          delivery_instruction: a.delivery_instruction,
          is_default: a.is_default,
          is_verified: a.is_verified,
          status: a.status,
        });
        if (a.country?.id) {
          const country = this.countries.find(co => co.id === a.country!.id);
          if (country) {
            this.form.patchValue({ country_id: a.country!.id });
            this.stateApi.getByCountry(country.uuid).subscribe({
              next: (sr) => {
                this.states = sr.data || [];
                this.form.patchValue({ state_id: a.state?.id || null });
                if (a.state?.id) {
                  const state = this.states.find(s => s.id === a.state!.id);
                  if (state) {
                    this.cityApi.getByState(state.uuid).subscribe({
                      next: (cr) => {
                        this.cities = cr.data || [];
                        this.form.patchValue({ city_id: a.city?.id || null });
                        if (a.city?.id) {
                          const city = this.cities.find(ci => ci.id === a.city!.id);
                          if (city) {
                            this.areaApi.getByCity(city.uuid).subscribe({
                              next: (ar) => {
                                this.areas = ar.data || [];
                                this.form.patchValue({ area_id: a.area?.id || null });
                              },
                            });
                            this.deliveryZoneApi.getAll({ city_id: a.city!.id.toString(), status: 'active' }).subscribe({
                              next: (dzr) => {
                                this.deliveryZones = dzr.data || [];
                                this.form.patchValue({ delivery_zone_id: a.delivery_zone?.id || null });
                              },
                            });
                          }
                        }
                      },
                    });
                  }
                }
              },
            });
          }
        }
      },
      error: () => { this.notification.error('Failed to load address'); this.router.navigate(['/admin/customer-addresses']); },
    });
  }

  compareById(a: any, b: any): boolean {
    return a == b || Number(a) === Number(b);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const data = { ...this.form.value };

    const obs = this.isEditing
      ? this.addressApi.update(this.addressUuid, data)
      : this.addressApi.create(data);

    obs.subscribe({
      next: () => {
        this.notification.success(this.isEditing ? 'Address updated' : 'Address created');
        this.router.navigate(['/admin/customer-addresses']);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
