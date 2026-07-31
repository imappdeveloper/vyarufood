import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CountryApiService } from '../../../core/services/country-api.service';
import { StateApiService } from '../../../core/services/state-api.service';
import { CityApiService } from '../../../core/services/city-api.service';
import { AreaApiService } from '../../../core/services/area-api.service';
import { DeliveryZoneApiService } from '../../../core/services/delivery-zone-api.service';
import { Country } from '../../../core/models/master/country.model';
import { State } from '../../../core/models/master/state.model';
import { City } from '../../../core/models/master/city.model';
import { Area } from '../../../core/models/master/area.model';
import { DeliveryZone } from '../../../core/models/master/delivery-zone.model';

@Component({
  selector: 'app-kitchen-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/kitchens" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Kitchens
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit Kitchen</span>
          <span *ngIf="!isEditing">Create New Kitchen</span>
        </h1>
        <p *ngIf="isEditing && kitchenName" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing <strong style="color: white;">{{ kitchenName }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to add a new kitchen</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">restaurant</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Kitchen name, code, type and description</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen Code <span style="color: #dc2626;">*</span></label>
              <input formControlName="kitchen_code" placeholder="e.g. KTH-001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('kitchen_code')?.invalid && form.get('kitchen_code')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('kitchen_code')?.invalid && form.get('kitchen_code')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Kitchen code is required and must be unique</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen Name <span style="color: #dc2626;">*</span></label>
              <input formControlName="name"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('name')?.invalid && form.get('name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('name')?.invalid && form.get('name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Kitchen name is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="kitchen_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="main_kitchen">Main Kitchen</option>
                <option value="central_kitchen">Central Kitchen</option>
                <option value="cloud_kitchen">Cloud Kitchen</option>
                <option value="branch_kitchen">Branch Kitchen</option>
                <option value="future_kitchen">Future Kitchen</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status <span style="color: #dc2626;">*</span></label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Description</label>
              <textarea formControlName="description" rows="3"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="2"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
            <div style="grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; padding-top: 4px;">
              <input type="checkbox" formControlName="is_default" id="is_default"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="is_default" style="font-size: 13px; color: #374151;">Set as default kitchen</label>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">person</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Manager Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Kitchen manager contact details</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Manager Name</label>
              <input formControlName="manager_name"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Manager Mobile</label>
              <input formControlName="manager_mobile"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Manager Email</label>
              <input formControlName="manager_email" type="email"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('manager_email')?.invalid && form.get('manager_email')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('manager_email')?.invalid && form.get('manager_email')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Enter a valid email</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Emergency Contact</label>
              <input formControlName="emergency_contact"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">location_on</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Address &amp; Location</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Kitchen address and GPS coordinates</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Address Line 1</label>
              <input formControlName="address_line_1"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Address Line 2</label>
              <input formControlName="address_line_2"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Landmark</label>
              <input formControlName="landmark"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Country</label>
              <select formControlName="country_id" (change)="onCountryChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Country</option>
                <option *ngFor="let c of countries" [ngValue]="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">State</label>
              <select formControlName="state_id" (change)="onStateChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">{{ states.length ? 'Select State' : 'Select a country first' }}</option>
                <option *ngFor="let s of states" [ngValue]="s.id">{{ s.name }}</option>
              </select>
              <p *ngIf="states.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ states.length }} states available</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">City</label>
              <select formControlName="city_id" (change)="onCityChange()"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">{{ cities.length ? 'Select City' : 'Select a state first' }}</option>
                <option *ngFor="let city of cities" [ngValue]="city.id">{{ city.name }}</option>
              </select>
              <p *ngIf="cities.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ cities.length }} cities available</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Area</label>
              <select formControlName="area_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">{{ areas.length ? 'Select Area' : 'Select a city first' }}</option>
                <option *ngFor="let area of areas" [ngValue]="area.id">{{ area.name }}</option>
              </select>
              <p *ngIf="areas.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ areas.length }} areas available</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Zone</label>
              <select formControlName="delivery_zone_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Delivery Zone</option>
                <option *ngFor="let zone of deliveryZones" [ngValue]="zone.id">{{ zone.zone_name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Latitude</label>
              <input formControlName="latitude" type="number" step="0.0000001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Longitude</label>
              <input formControlName="longitude" type="number" step="0.0000001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">schedule</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Operating Hours</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Kitchen timing and order acceptance window</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Opening Time</label>
              <input formControlName="opening_time" type="time"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Closing Time</label>
              <input formControlName="closing_time" type="time"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Preparation Start</label>
              <input formControlName="preparation_start_time" type="time"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Accept Order Start</label>
              <input formControlName="accept_order_start_time" type="time"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Accept Order End</label>
              <input formControlName="accept_order_end_time" type="time"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Daily Capacity</label>
              <input formControlName="daily_capacity" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Maximum Orders</label>
              <input formControlName="maximum_orders" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fee2e2; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #dc2626;">verified</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Licenses &amp; Compliance</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Legal and compliance information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">License Number</label>
              <input formControlName="license_number"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">FSSAI Number</label>
              <input formControlName="fssai_number"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">GST Number</label>
              <input formControlName="gst_number"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditing">Changes will be saved immediately</span>
            <span *ngIf="!isEditing">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/kitchens"
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
              <span *ngIf="isEditing">Update Kitchen</span>
              <span *ngIf="!isEditing">Create Kitchen</span>
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
export class KitchenFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);
  private countryApi = inject(CountryApiService);
  private stateApi = inject(StateApiService);
  private cityApi = inject(CityApiService);
  private areaApi = inject(AreaApiService);
  private deliveryZoneApi = inject(DeliveryZoneApiService);

  isEditing = false;
  saving = false;
  kitchenUuid = '';
  kitchenName = '';
  hoverBack = false;
  hoverCancel = false;
  hoverSec1 = false;
  hoverSec2 = false;
  hoverSec3 = false;
  hoverSec4 = false;
  hoverSec5 = false;

  fcFocus: {
    kitchen_code?: boolean; name?: boolean; kitchen_type?: boolean; status?: boolean;
    description?: boolean; remarks?: boolean;
    manager_name?: boolean; manager_mobile?: boolean; manager_email?: boolean; emergency_contact?: boolean;
    address_line_1?: boolean; address_line_2?: boolean; landmark?: boolean;
    country_id?: boolean; state_id?: boolean; city_id?: boolean; area_id?: boolean; delivery_zone_id?: boolean;
    latitude?: boolean; longitude?: boolean;
    opening_time?: boolean; closing_time?: boolean; preparation_start_time?: boolean;
    accept_order_start_time?: boolean; accept_order_end_time?: boolean;
    daily_capacity?: boolean; maximum_orders?: boolean;
    license_number?: boolean; fssai_number?: boolean; gst_number?: boolean;
  } = {};

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  areas: Area[] = [];
  deliveryZones: DeliveryZone[] = [];

  form = this.fb.group({
    kitchen_code: ['', Validators.required],
    name: ['', Validators.required],
    description: [null as string | null],
    kitchen_type: ['main_kitchen', Validators.required],
    manager_name: [null as string | null],
    manager_mobile: [null as string | null],
    manager_email: [null as string | null],
    country_id: [null as number | null],
    state_id: [null as number | null],
    city_id: [null as number | null],
    area_id: [null as number | null],
    delivery_zone_id: [null as number | null],
    address_line_1: [null as string | null],
    address_line_2: [null as string | null],
    landmark: [null as string | null],
    latitude: [null as number | null],
    longitude: [null as number | null],
    opening_time: [null as string | null],
    closing_time: [null as string | null],
    preparation_start_time: [null as string | null],
    accept_order_start_time: [null as string | null],
    accept_order_end_time: [null as string | null],
    daily_capacity: [null as number | null],
    maximum_orders: [null as number | null],
    emergency_contact: [null as string | null],
    license_number: [null as string | null],
    fssai_number: [null as string | null],
    gst_number: [null as string | null],
    status: ['active', Validators.required],
    is_default: [false],
    remarks: [null as string | null],
  });

  ngOnInit(): void {
    this.kitchenUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditing = !!this.kitchenUuid;

    this.loadDropdowns();

    if (this.isEditing) {
      this.loadKitchen();
    }
  }

  loadDropdowns(): void {
    this.countryApi.getAll().subscribe({
      next: (res) => { this.countries = res.data || []; },
    });
    this.deliveryZoneApi.getAll().subscribe({
      next: (res) => { this.deliveryZones = res.data || []; },
    });
  }

  onCountryChange(): void {
    const countryId = this.form.get('country_id')?.value;
    this.states = [];
    this.cities = [];
    this.areas = [];
    this.form.patchValue({ state_id: null, city_id: null, area_id: null });
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
    this.cities = [];
    this.areas = [];
    this.form.patchValue({ city_id: null, area_id: null });
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
    this.areas = [];
    this.form.patchValue({ area_id: null });
    if (cityId) {
      const city = this.cities.find(c => c.id === cityId);
      if (city) {
        this.areaApi.getByCity(city.uuid).subscribe({
          next: (res) => { this.areas = res.data || []; },
        });
      }
    }
  }

  loadKitchen(): void {
    this.kitchenApi.getById(this.kitchenUuid).subscribe({
      next: (res) => {
        const k = res.data!;
        this.kitchenName = k.name;

        const countryId = k.country?.id ?? null;
        const stateId = k.state?.id ?? null;
        const cityId = k.city?.id ?? null;
        const areaId = k.area?.id ?? null;

        this.form.patchValue({
          kitchen_code: k.kitchen_code,
          name: k.name,
          description: k.description,
          kitchen_type: k.kitchen_type,
          manager_name: k.manager_name,
          manager_mobile: k.manager_mobile,
          manager_email: k.manager_email,
          country_id: countryId,
          state_id: stateId,
          city_id: cityId,
          area_id: areaId,
          delivery_zone_id: k.delivery_zone?.id ?? null,
          address_line_1: k.address_line_1,
          address_line_2: k.address_line_2,
          landmark: k.landmark,
          latitude: k.latitude,
          longitude: k.longitude,
          opening_time: k.opening_time,
          closing_time: k.closing_time,
          preparation_start_time: k.preparation_start_time,
          accept_order_start_time: k.accept_order_start_time,
          accept_order_end_time: k.accept_order_end_time,
          daily_capacity: k.daily_capacity,
          maximum_orders: k.maximum_orders,
          emergency_contact: k.emergency_contact,
          license_number: k.license_number,
          fssai_number: k.fssai_number,
          gst_number: k.gst_number,
          status: k.status,
          is_default: k.is_default,
          remarks: k.remarks,
        });

        if (!countryId) return;

        const afterCountries = () => {
          const country = this.countries.find(co => co.id === countryId);
          if (!country) return;

          this.stateApi.getByCountry(country.uuid).subscribe({
            next: (sr) => {
              this.states = sr.data || [];
              if (!stateId) return;
              this.form.patchValue({ state_id: stateId });
              const state = this.states.find(s => s.id === stateId);
              if (!state) return;

              this.cityApi.getByState(state.uuid).subscribe({
                next: (cr) => {
                  this.cities = cr.data || [];
                  if (!cityId) return;
                  this.form.patchValue({ city_id: cityId });
                  const city = this.cities.find(ci => ci.id === cityId);
                  if (!city) return;

                  this.areaApi.getByCity(city.uuid).subscribe({
                    next: (ar) => {
                      this.areas = ar.data || [];
                      if (areaId) this.form.patchValue({ area_id: areaId });
                    },
                  });
                },
              });
            },
          });
        };

        if (this.countries.length) {
          afterCountries();
        } else {
          this.countryApi.getAll().subscribe({
            next: (cr) => { this.countries = cr.data || []; afterCountries(); },
          });
        }
      },
      error: () => { this.notification.error('Failed to load kitchen'); this.router.navigate(['/admin/kitchens']); },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const data = { ...this.form.value };

    const obs = this.isEditing
      ? this.kitchenApi.update(this.kitchenUuid, data)
      : this.kitchenApi.create(data);

    obs.subscribe({
      next: () => {
        this.notification.success(this.isEditing ? 'Kitchen updated' : 'Kitchen created');
        this.router.navigate(['/admin/kitchens']);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
