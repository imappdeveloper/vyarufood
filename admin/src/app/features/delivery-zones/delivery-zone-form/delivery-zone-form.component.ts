import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeliveryZoneApiService } from '../../../core/services/delivery-zone-api.service';
import { CountryApiService } from '../../../core/services/country-api.service';
import { StateApiService } from '../../../core/services/state-api.service';
import { CityApiService } from '../../../core/services/city-api.service';
import { AreaApiService } from '../../../core/services/area-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Country } from '../../../core/models/master/country.model';
import { State } from '../../../core/models/master/state.model';
import { City } from '../../../core/models/master/city.model';
import { Area } from '../../../core/models/master/area.model';

@Component({
  selector: 'app-delivery-zone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/delivery-zones" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Delivery Zones
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit Delivery Zone</span>
          <span *ngIf="!isEditing">Create New Delivery Zone</span>
        </h1>
        <p *ngIf="isEditing && zoneName" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing <strong style="color: white;">{{ zoneName }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to add a new delivery zone</p>
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
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Select country, state, city and area for this zone</p>
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
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Area (Optional)</label>
              <select formControlName="area_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="" disabled selected>{{ areas.length ? 'Select an area' : 'Select a city first' }}</option>
                <option *ngFor="let area of areas" [ngValue]="area.id">{{ area.name }}</option>
              </select>
              <p *ngIf="areas.length > 0" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">{{ areas.length }} areas available</p>
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
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Zone name and identifiers</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Zone Name <span style="color: #dc2626;">*</span></label>
              <input formControlName="zone_name" placeholder="e.g. Central Delivery Zone"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('zone_name')?.invalid && form.get('zone_name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('zone_name')?.invalid && form.get('zone_name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Zone name is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Zone Code <span style="color: #dc2626;">*</span></label>
              <input formControlName="zone_code" placeholder="CDZ-001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; text-transform: uppercase; letter-spacing: 1px; box-sizing: border-box;"
                [style.borderColor]="form.get('zone_code')?.invalid && form.get('zone_code')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('zone_code')?.invalid && form.get('zone_code')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Zone code is required</p>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Short unique code (e.g. CDZ-001)</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Description</label>
              <textarea formControlName="description" rows="3" placeholder="Describe this delivery zone..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: inherit; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #ccfbf1; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #0d9488;">local_shipping</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Delivery Settings</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Pricing, limits, and delivery configuration</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Radius (km)</label>
              <input type="number" formControlName="delivery_radius" placeholder="5.00"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Maximum delivery distance</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Minimum Order Amount</label>
              <input type="number" formControlName="minimum_order_amount" placeholder="150.00"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Delivery Charge</label>
              <input type="number" formControlName="delivery_charge" placeholder="20.00"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Free Delivery Above</label>
              <input type="number" formControlName="free_delivery_above" placeholder="500.00"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Free delivery for orders above this</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Estimated Delivery Time (min)</label>
              <input type="number" formControlName="estimated_delivery_time" placeholder="30"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Max Orders Per Slot</label>
              <input type="number" formControlName="maximum_orders_per_slot" placeholder="50"
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
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Settings</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Priority, status, and notes</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Priority</label>
              <input type="number" formControlName="priority" placeholder="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Higher priority zones are preferred (0 = default)</p>
            </div>
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
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <input type="checkbox" formControlName="is_default" id="is_default"
              style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669; border-radius: 4px;" />
            <label for="is_default" style="font-size: 13px; color: #374151; cursor: pointer; font-weight: 500;">Set as Default Delivery Zone</label>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
            <textarea formControlName="remarks" rows="3" placeholder="Any additional notes..."
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: inherit; resize: vertical;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditing">Changes will be saved immediately</span>
            <span *ngIf="!isEditing">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/delivery-zones"
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
              <span *ngIf="isEditing">Update Zone</span>
              <span *ngIf="!isEditing">Create Zone</span>
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
export class DeliveryZoneFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private zoneApi = inject(DeliveryZoneApiService);
  private countryApi = inject(CountryApiService);
  private stateApi = inject(StateApiService);
  private cityApi = inject(CityApiService);
  private areaApi = inject(AreaApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  zoneUuid: string | null = null;
  zoneName = '';
  isLoading = false;
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  areas: Area[] = [];

  form = this.fb.group({
    country_id: [null, Validators.required],
    state_id: [null, Validators.required],
    city_id: [null, Validators.required],
    area_id: [null as number | null],
    zone_name: ['', Validators.required],
    zone_code: ['', Validators.required],
    description: [''],
    delivery_radius: [null as number | null],
    minimum_order_amount: [0],
    delivery_charge: [0],
    free_delivery_above: [null as number | null],
    estimated_delivery_time: [null as number | null],
    maximum_orders_per_slot: [null as number | null],
    priority: [0],
    status: ['active'],
    is_default: [false],
    remarks: [''],
  });

  ngOnInit(): void {
    this.loadCountries();
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.isEditing = true;
      this.zoneUuid = uuid;
      this.loadZone(uuid);
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
    this.cities = [];
    this.areas = [];
    this.form.patchValue({ state_id: null, city_id: null, area_id: null });
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
    this.form.patchValue({ city_id: null, area_id: null });
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
    this.form.patchValue({ area_id: null });
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
  }

  loadZone(uuid: string): void {
    this.isLoading = true;
    this.zoneApi.getById(uuid).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.zoneName = res.data.zone_name;
          const countryId = res.data.country?.id || res.data.country_id;
          const stateId = res.data.state?.id || res.data.state_id;
          const cityId = res.data.city?.id || res.data.city_id;
          this.form.patchValue({
            country_id: countryId,
            state_id: stateId,
            city_id: cityId,
            area_id: res.data.area?.id || res.data.area_id,
            zone_name: res.data.zone_name,
            zone_code: res.data.zone_code || '',
            description: res.data.description || '',
            delivery_radius: res.data.delivery_radius,
            minimum_order_amount: res.data.minimum_order_amount || 0,
            delivery_charge: res.data.delivery_charge || 0,
            free_delivery_above: res.data.free_delivery_above,
            estimated_delivery_time: res.data.estimated_delivery_time,
            maximum_orders_per_slot: res.data.maximum_orders_per_slot,
            priority: res.data.priority || 0,
            status: res.data.status || 'active',
            is_default: res.data.is_default || false,
            remarks: res.data.remarks || '',
          });
          const countryUuid = res.data.country?.uuid;
          const stateUuid = res.data.state?.uuid;
          const cityUuid = res.data.city?.uuid;
          if (countryUuid) {
            this.stateApi.getByCountry(countryUuid).subscribe({
              next: (sr) => {
                this.states = sr.data || [];
                if (stateUuid) {
                  this.cityApi.getByState(stateUuid).subscribe({
                    next: (cr) => {
                      this.cities = cr.data || [];
                      if (cityUuid) {
                        this.areaApi.getByCity(cityUuid).subscribe({
                          next: (ar) => { this.areas = ar.data || []; },
                        });
                      }
                    },
                  });
                }
              },
            });
          }
        }
      },
      error: () => {
        this.isLoading = false;
        this.notification.error('Failed to load delivery zone');
        this.router.navigate(['/admin/delivery-zones']);
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
      zone_name: v.zone_name!,
      zone_code: v.zone_code!,
      area_id: v.area_id || undefined,
      description: v.description || undefined,
      delivery_radius: v.delivery_radius || undefined,
      minimum_order_amount: v.minimum_order_amount || 0,
      delivery_charge: v.delivery_charge || 0,
      free_delivery_above: v.free_delivery_above || undefined,
      estimated_delivery_time: v.estimated_delivery_time || undefined,
      maximum_orders_per_slot: v.maximum_orders_per_slot || undefined,
      priority: v.priority || 0,
      status: v.status || 'active',
      is_default: v.is_default || false,
      remarks: v.remarks || undefined,
    };

    const req = this.isEditing
      ? this.zoneApi.update(this.zoneUuid!, payload)
      : this.zoneApi.create(payload);

    req.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(res.message || (this.isEditing ? 'Delivery zone updated' : 'Delivery zone created'));
        this.router.navigate(['/admin/delivery-zones']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
