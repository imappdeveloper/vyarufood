import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountryApiService } from '../../../core/services/country-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 48px 32px 80px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px;">
          <a routerLink="/admin/settings" style="color: rgba(255,255,255,0.75); text-decoration: none;">Settings</a>
          <span style="font-size: 10px;">&#9654;</span>
          <a routerLink="/admin/countries" style="color: rgba(255,255,255,0.75); text-decoration: none;">Countries</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white; font-weight: 500;">{{ isEditing ? 'Edit' : 'Create' }}</span>
        </div>
        <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
          <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">flag</span>
          {{ isEditing ? 'Edit Country' : 'Create New Country' }}
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
          <ng-container *ngIf="isEditing && countryName">Editing <strong>{{ countryName }}</strong></ng-container>
          <ng-container *ngIf="!isEditing">Fill in the details below to add a new country</ng-container>
        </p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: 24px auto 60px; padding: 0 24px;">
      <div *ngIf="isLoading && isEditing" style="display: flex; align-items: center; justify-content: center; padding: 80px 0;">
        <div style="width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
      </div>

      <form *ngIf="!isLoading || !isEditing" [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 900px;">

        <!-- Basic Information -->
        <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #059669; font-size: 20px;">flag</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Basic Information</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">Essential country identifiers and codes</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Country Name *</label>
              <input formControlName="name" placeholder="e.g. India"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div *ngIf="form.get('name')?.invalid && form.get('name')?.touched" style="font-size: 11px; color: #ef4444; margin-top: 4px;">Name is required</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Native Name</label>
              <input formControlName="native_name" placeholder="e.g. \u092D\u093E\u0930\u0924"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Local language name</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">ISO2 Code *</label>
              <input formControlName="iso2" maxlength="2" placeholder="IN"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; text-transform: uppercase; letter-spacing: 1px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">2-letter country code</div>
              <div *ngIf="form.get('iso2')?.invalid && form.get('iso2')?.touched" style="font-size: 11px; color: #ef4444; margin-top: 4px;">Required (2 characters)</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">ISO3 Code *</label>
              <input formControlName="iso3" maxlength="3" placeholder="IND"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; text-transform: uppercase; letter-spacing: 1px; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">3-letter country code</div>
              <div *ngIf="form.get('iso3')?.invalid && form.get('iso3')?.touched" style="font-size: 11px; color: #ef4444; margin-top: 4px;">Required (3 characters)</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Phone Code</label>
              <input formControlName="phone_code" placeholder="91"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Dialing code without +</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Numeric Code</label>
              <input formControlName="numeric_code" placeholder="356"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">ISO 3166-1 numeric</div>
            </div>
          </div>
        </div>

        <!-- Location & Geography -->
        <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #2563eb; font-size: 20px;">location_on</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Location & Geography</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">Geographic location and regional classification</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Capital</label>
              <input formControlName="capital" placeholder="New Delhi"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Nationality</label>
              <input formControlName="nationality" placeholder="Indian"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Region</label>
              <input formControlName="region" placeholder="Asia"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Subregion</label>
              <input formControlName="subregion" placeholder="Southern Asia"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Latitude</label>
              <input formControlName="latitude" type="number" placeholder="20.5937"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Longitude</label>
              <input formControlName="longitude" type="number" placeholder="78.9629"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <!-- Currency -->
        <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #f59e0b; font-size: 20px;">payments</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Currency</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">National currency details</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Currency Code</label>
              <input formControlName="currency_code" placeholder="INR"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; text-transform: uppercase; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">e.g. USD, EUR, INR</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Currency Symbol</label>
              <input formControlName="currency_symbol" placeholder="\u20B9"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Currency Name</label>
              <input formControlName="currency_name" placeholder="Indian Rupee"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 32px; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f3e8ff, #e9d5ff); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #7c3aed; font-size: 20px;">tune</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Settings</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">Status, ordering, and additional notes</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status</label>
              <select formControlName="status"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Sort Order</label>
              <input formControlName="sort_order" type="number" placeholder="0"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Lower numbers appear first</div>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <label style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 0;">
              <input type="checkbox" formControlName="is_default"
                style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; border-radius: 4px;" />
              <span style="font-size: 14px; font-weight: 600; color: #374151;">Set as Default Country</span>
            </label>
            <div style="font-size: 11px; color: #9ca3af; margin-top: 2px; margin-left: 26px;">Default country is pre-selected in other modules</div>
          </div>
          <div style="margin-top: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
            <textarea formControlName="remarks" rows="3" placeholder="Any additional notes about this country..."
              style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; box-sizing: border-box; font-family: inherit;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <div>
            <span style="font-size: 13px; color: #9ca3af;">
              <ng-container *ngIf="isEditing; else createMsg">Changes will be saved immediately</ng-container>
              <ng-template #createMsg>Fields marked with * are required</ng-template>
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <a routerLink="/admin/countries"
               style="padding: 10px 24px; border: 1.5px solid #e5e7eb; border-radius: 10px; color: #374151; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
               onmouseover="this.style.borderColor='#d1d5db'; this.style.background='#f9fafb';"
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='';">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || isLoading"
              style="padding: 10px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.35)';"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.25)';">
              <span *ngIf="isLoading" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
              <span *ngIf="!isLoading" class="material-icons" style="font-size: 18px;">save</span>
              {{ isLoading ? 'Saving...' : (isEditing ? 'Update Country' : 'Create Country') }}
            </button>
          </div>
        </div>
      </form>
    </section>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class CountryFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private countryApi = inject(CountryApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  countryUuid: string | null = null;
  countryName = '';
  isLoading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    native_name: [''],
    iso2: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    iso3: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    phone_code: [''],
    numeric_code: [''],
    capital: [''],
    currency_code: [''],
    currency_name: [''],
    currency_symbol: [''],
    nationality: [''],
    region: [''],
    subregion: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    sort_order: [0],
    status: ['active'],
    is_default: [false],
    remarks: [''],
  });

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.isEditing = true;
      this.countryUuid = uuid;
      this.loadCountry(uuid);
    }
  }

  loadCountry(uuid: string): void {
    this.isLoading = true;
    this.countryApi.getById(uuid).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.countryName = res.data.name;
          this.form.patchValue({
            name: res.data.name,
            native_name: res.data.native_name || '',
            iso2: res.data.iso2,
            iso3: res.data.iso3,
            phone_code: res.data.phone_code || '',
            numeric_code: res.data.numeric_code || '',
            capital: res.data.capital || '',
            currency_code: res.data.currency_code || '',
            currency_name: res.data.currency_name || '',
            currency_symbol: res.data.currency_symbol || '',
            nationality: res.data.nationality || '',
            region: res.data.region || '',
            subregion: res.data.subregion || '',
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
        this.notification.error('Failed to load country');
        this.router.navigate(['/admin/countries']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const v = this.form.value;

    const payload = {
      name: v.name!,
      native_name: v.native_name || undefined,
      iso2: v.iso2!.toUpperCase(),
      iso3: v.iso3!.toUpperCase(),
      phone_code: v.phone_code || undefined,
      numeric_code: v.numeric_code || undefined,
      capital: v.capital || undefined,
      currency_code: v.currency_code || undefined,
      currency_name: v.currency_name || undefined,
      currency_symbol: v.currency_symbol || undefined,
      nationality: v.nationality || undefined,
      region: v.region || undefined,
      subregion: v.subregion || undefined,
      latitude: v.latitude || undefined,
      longitude: v.longitude || undefined,
      sort_order: v.sort_order || 0,
      status: v.status || 'active',
      is_default: v.is_default || false,
      remarks: v.remarks || undefined,
    };

    const req = this.isEditing
      ? this.countryApi.update(this.countryUuid!, payload)
      : this.countryApi.create(payload);

    req.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(res.message || (this.isEditing ? 'Country updated successfully' : 'Country created successfully'));
        this.router.navigate(['/admin/countries']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
