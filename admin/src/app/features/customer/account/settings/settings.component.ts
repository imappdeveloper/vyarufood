import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { SeoService } from '../../../../core/services/seo.service';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';
import { CustomerNotificationApiService } from '../../../../core/services/customer-notification-api.service';
import { NotificationPreference } from '../../../../core/models/customer/notification-summary.model';
import { CustomerProfile } from '../../../../core/models/customer/customer-profile.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customer-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 700px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Toast -->
      @if (toast) {
        <div style="position: fixed; top: 24px; right: 24px; z-index: 50; animation: slideIn 0.3s ease-out;">
          <div [style]="getToastStyle(toast.type)">
            <span class="material-icons" style="font-size: 20px;">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
            {{ toast.message }}
            <button (click)="toast = null" style="background: none; border: none; cursor: pointer; opacity: 0.6; padding: 2px;">
              <span class="material-icons" style="font-size: 16px;">close</span>
            </button>
          </div>
        </div>
      }

      <!-- Hero Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 28px 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="position: relative; z-index: 1;">
          <p style="color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 2px 0;">SETTINGS</p>
          <h1 style="color: #fff; font-size: 26px; font-weight: 700; margin: 0;">Settings</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 4px 0 0;">Manage your profile, password, and preferences</p>
        </div>
      </div>

      <!-- Loading -->
      @if (loading) {
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 32px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background: #e5e7eb;"></div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="height: 16px; background: #e5e7eb; border-radius: 4px; width: 160px;"></div>
                <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 220px;"></div>
              </div>
            </div>
            @for (i of [1,2,3]; track i) {
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 120px;"></div>
                <div style="width: 44px; height: 24px; background: #e5e7eb; border-radius: 20px;"></div>
              </div>
            }
          </div>
        </div>
      }

      @if (!loading && profile) {
        <!-- Profile Photo -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">photo_camera</span>
              Profile Photo
            </h2>
          </div>
          <div style="padding: 20px;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="position: relative;" onmouseover="this.querySelector('.photo-overlay').style.opacity='1'" onmouseout="this.querySelector('.photo-overlay').style.opacity='0'">
                @if (profile.profile_photo) {
                  <div style="width: 96px; height: 96px; border-radius: 50%; overflow: hidden; border: 2px solid #e5e7eb;">
                    <img [src]="getPhotoUrl(profile.profile_photo)" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                } @else {
                  <div style="width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px; font-weight: 700; border: 2px solid #e5e7eb;">
                    {{ getInitials() }}
                  </div>
                }
                <label class="photo-overlay" style="position: absolute; bottom: 0; right: 0; width: 32px; height: 32px; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); opacity: 0; transition: opacity 0.2s;">
                  <span class="material-icons" style="color: #fff; font-size: 14px;">edit</span>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" (change)="onPhotoSelected($event)" style="display: none;" />
                </label>
              </div>
              <div>
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 12px 0;">JPG, PNG or WebP. Max 2MB.</p>
                <div style="display: flex; gap: 8px;">
                  <label style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #f0fdf4; color: #059669; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='#f0fdf4'">
                    <span class="material-icons" style="font-size: 14px;">upload</span>
                    Upload Photo
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" (change)="onPhotoSelected($event)" style="display: none;" />
                  </label>
                  @if (profile.profile_photo) {
                    <button (click)="removePhoto()" [disabled]="photoSaving" [style]="'display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #fef2f2; color: #dc2626; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.15s;' + (photoSaving ? ' opacity: 0.5;' : '')" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fef2f2'">
                      <span class="material-icons" style="font-size: 14px;">delete</span> Remove
                    </button>
                  }
                </div>
                @if (photoSaving) {
                  <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #059669;">
                    <span class="material-icons" style="font-size: 16px; animation: spin 1s linear infinite;">refresh</span>
                    Uploading...
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Info -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">person</span>
              Personal Information
            </h2>
          </div>
          <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">First Name</label>
                <input type="text" [(ngModel)]="profileForm.first_name" style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Last Name</label>
                <input type="text" [(ngModel)]="profileForm.last_name" style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
              </div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Email</label>
              <div style="position: relative;">
                <input type="email" [(ngModel)]="profileForm.email" placeholder="your@email.com" style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                @if (profile.email_verified) {
                  <span class="material-icons" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #059669; font-size: 16px;" title="Verified">verified</span>
                }
              </div>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0;">Used for order confirmations and updates</p>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Phone Number</label>
              <div style="display: flex; gap: 8px;">
                <select [(ngModel)]="profileForm.country_code" style="width: 100px; padding: 10px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; background: #fff;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                  <option value="+65">+65 (SG)</option>
                </select>
                <input type="tel" [(ngModel)]="profileForm.phone" style="flex: 1; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
              </div>
              @if (!profile.phone_verified) {
                <p style="font-size: 11px; color: #d97706; margin: 4px 0 0; display: flex; align-items: center; gap: 4px;">
                  <span class="material-icons" style="font-size: 12px;">warning</span>
                  Phone not verified
                </p>
              }
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Gender</label>
                <select [(ngModel)]="profileForm.gender" style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; background: #fff; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
                  <option [ngValue]="null">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Date of Birth</label>
                <input type="date" [(ngModel)]="profileForm.date_of_birth" style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding-top: 4px;">
              <button (click)="saveProfile()" [disabled]="profileSaving || !hasProfileChanges()" [style]="'display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #059669; color: #fff; border-radius: 10px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s; box-shadow: 0 2px 8px rgba(5,150,105,0.2);' + ((profileSaving || !hasProfileChanges()) ? ' opacity: 0.5; cursor: not-allowed;' : '')" onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
                @if (profileSaving) {
                  <span class="material-icons" style="font-size: 14px; animation: spin 1s linear infinite;">refresh</span>
                } @else {
                  <span class="material-icons" style="font-size: 14px;">save</span>
                }
                {{ profileSaving ? 'Saving...' : 'Save Changes' }}
              </button>
              @if (hasProfileChanges()) {
                <button (click)="resetProfileForm()" style="padding: 10px 20px; background: #f3f4f6; color: #374151; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">Cancel</button>
              }
            </div>
          </div>
        </div>

        <!-- Change Password -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">lock</span>
              Change Password
            </h2>
          </div>
          <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Current Password</label>
              <div style="position: relative;">
                <input [type]="showCurrentPassword ? 'text' : 'password'" [(ngModel)]="passwordForm.current_password" style="width: 100%; padding: 10px 14px; padding-right: 40px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                <button type="button" (click)="showCurrentPassword = !showCurrentPassword" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0;">
                  <span class="material-icons" style="font-size: 18px;">{{ showCurrentPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">New Password</label>
              <div style="position: relative;">
                <input [type]="showNewPassword ? 'text' : 'password'" [(ngModel)]="passwordForm.password" style="width: 100%; padding: 10px 14px; padding-right: 40px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
                <button type="button" (click)="showNewPassword = !showNewPassword" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0;">
                  <span class="material-icons" style="font-size: 18px;">{{ showNewPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0;">Minimum 8 characters</p>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">Confirm New Password</label>
              <input type="password" [(ngModel)]="passwordForm.password_confirmation" style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
            </div>
            <div>
              <button (click)="changePassword()" [disabled]="passwordSaving || !isPasswordFormValid()" [style]="'display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #059669; color: #fff; border-radius: 10px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s; box-shadow: 0 2px 8px rgba(5,150,105,0.2);' + ((passwordSaving || !isPasswordFormValid()) ? ' opacity: 0.5; cursor: not-allowed;' : '')" onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
                @if (passwordSaving) {
                  <span class="material-icons" style="font-size: 14px; animation: spin 1s linear infinite;">refresh</span>
                } @else {
                  <span class="material-icons" style="font-size: 14px;">lock</span>
                }
                {{ passwordSaving ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Notification Channels -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">notifications_active</span>
              Notification Channels
            </h2>
            <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">Choose how you want to receive notifications</p>
          </div>
          <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            @for (channel of channelToggles; track channel.key) {
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <p style="font-size: 13px; font-weight: 500; color: #111827; margin: 0;">{{ channel.label }}</p>
                  <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0;">{{ channel.description }}</p>
                </div>
                <button (click)="togglePreference(channel.key)" role="switch" [attr.aria-checked]="preferences![channel.key]" [style]="'position: relative; display: inline-flex; height: 24px; width: 44px; align-items: center; border-radius: 20px; transition: all 0.2s; border: none; cursor: pointer; padding: 0; outline: none;' + (preferences![channel.key] ? ' background: #059669;' : ' background: #d1d5db;')">
                  <span [style]="'display: inline-block; width: 18px; height: 18px; transform: translateX(' + (preferences![channel.key] ? '24px' : '3px') + '); border-radius: 50%; background: #fff; transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15);'"></span>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Notification Categories -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #059669;">category</span>
              Notification Categories
            </h2>
            <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">Choose which notifications you want to receive</p>
          </div>
          <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            @for (cat of categoryToggles; track cat.key) {
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="material-icons" [style]="'font-size: 18px; ' + cat.iconColor">{{ cat.icon }}</span>
                  <div>
                    <p style="font-size: 13px; font-weight: 500; color: #111827; margin: 0;">{{ cat.label }}</p>
                    <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0;">{{ cat.description }}</p>
                  </div>
                </div>
                <button (click)="togglePreference(cat.key)" role="switch" [attr.aria-checked]="preferences![cat.key]" [style]="'position: relative; display: inline-flex; height: 24px; width: 44px; align-items: center; border-radius: 20px; transition: all 0.2s; border: none; cursor: pointer; padding: 0; outline: none;' + (preferences![cat.key] ? ' background: #059669;' : ' background: #d1d5db;')">
                  <span [style]="'display: inline-block; width: 18px; height: 18px; transform: translateX(' + (preferences![cat.key] ? '24px' : '3px') + '); border-radius: 50%; background: #fff; transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15);'"></span>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Account Management -->
        <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
            <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 18px; color: #dc2626;">manage_accounts</span>
              Account Management
            </h2>
          </div>
          <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <!-- Account Info -->
            <div style="background: #f9fafb; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280;">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">calendar_today</span>
                Member since {{ profile.created_at | date:'MMMM yyyy' }}
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280;">
                <span class="material-icons" style="font-size: 16px; color: #9ca3af;">badge</span>
                Referral code: {{ profile.referral_code || 'N/A' }}
              </div>
            </div>

            <!-- Logout All Devices -->
            <div style="display: flex; align-items: center; justify-content: space-between; background: #f9fafb; border-radius: 10px; padding: 16px;">
              <div>
                <p style="font-size: 13px; font-weight: 500; color: #111827; margin: 0;">Log out from all devices</p>
                <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0;">This will sign you out from all active sessions</p>
              </div>
              <button (click)="logoutAllDevices()" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #fff7ed; color: #c2410c; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#ffedd5'" onmouseout="this.style.background='#fff7ed'">
                <span class="material-icons" style="font-size: 14px;">logout</span>
                Log Out All
              </button>
            </div>

            <!-- Delete Account -->
            <div style="border: 1px solid #fecaca; border-radius: 10px; padding: 16px; background: #fef2f2;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <span class="material-icons" style="color: #dc2626; font-size: 18px; margin-top: 1px;">warning</span>
                <div style="flex: 1;">
                  <p style="font-size: 13px; font-weight: 600; color: #991b1b; margin: 0;">Delete Account</p>
                  <p style="font-size: 12px; color: #dc2626; margin: 4px 0 0;">Once you delete your account, all your data including orders, subscriptions, wallet balance, and reviews will be permanently removed. This action cannot be undone.</p>
                  @if (!showDeleteConfirm) {
                    <button (click)="showDeleteConfirm = true" style="margin-top: 12px; display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #dc2626; color: #fff; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
                      <span class="material-icons" style="font-size: 14px;">delete_forever</span>
                      Delete My Account
                    </button>
                  }
                  @if (showDeleteConfirm) {
                    <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
                      <div>
                        <label style="display: block; font-size: 13px; font-weight: 500; color: #991b1b; margin-bottom: 4px;">Enter your password to confirm</label>
                        <input type="password" [(ngModel)]="deleteForm.password" placeholder="Your password" style="width: 100%; padding: 10px 14px; border: 1px solid #fca5a5; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box;" onfocus="this.style.borderColor='#dc2626';this.style.boxShadow='0 0 0 2px rgba(220,38,38,0.15)'" onblur="this.style.borderColor='#fca5a5';this.style.boxShadow='none'" />
                      </div>
                      <div>
                        <label style="display: block; font-size: 13px; font-weight: 500; color: #991b1b; margin-bottom: 4px;">Reason (optional)</label>
                        <textarea [(ngModel)]="deleteForm.reason" rows="2" placeholder="Help us improve..." style="width: 100%; padding: 10px 14px; border: 1px solid #fca5a5; border-radius: 10px; font-size: 13px; color: #111827; outline: none; transition: all 0.2s; box-sizing: border-box; resize: none;" onfocus="this.style.borderColor='#dc2626';this.style.boxShadow='0 0 0 2px rgba(220,38,38,0.15)'" onblur="this.style.borderColor='#fca5a5';this.style.boxShadow='none'"></textarea>
                      </div>
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <button (click)="deleteAccount()" [disabled]="deleteSaving || !deleteForm.password" [style]="'display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: #dc2626; color: #fff; border-radius: 10px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s;' + ((deleteSaving || !deleteForm.password) ? ' opacity: 0.5; cursor: not-allowed;' : '')" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
                          @if (deleteSaving) {
                            <span class="material-icons" style="font-size: 14px; animation: spin 1s linear infinite;">refresh</span>
                          } @else {
                            <span class="material-icons" style="font-size: 14px;">delete_forever</span>
                          }
                          {{ deleteSaving ? 'Deleting...' : 'Yes, Delete My Account' }}
                        </button>
                        <button (click)="showDeleteConfirm = false; deleteForm = { password: '', reason: '' }" style="padding: 10px 20px; background: #f3f4f6; color: #374151; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">Cancel</button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private authService = inject(CustomerAuthService);
  private notifApi = inject(CustomerNotificationApiService);
  private seo = inject(SeoService);
  private destroy$ = new Subject<void>();

  profile: CustomerProfile | null = null;
  preferences: NotificationPreference | null = null;
  loading = true;

  toast: { message: string; type: 'success' | 'error' } | null = null;

  profileForm: { first_name: string; last_name: string; email: string; phone: string; country_code: string; gender: string | null; date_of_birth: string | null } = { first_name: '', last_name: '', email: '', phone: '', country_code: '+91', gender: null, date_of_birth: null };
  profileOriginal: typeof this.profileForm = { first_name: '', last_name: '', email: '', phone: '', country_code: '+91', gender: null, date_of_birth: null };
  profileSaving = false;

  passwordForm = { current_password: '', password: '', password_confirmation: '' };
  passwordSaving = false;
  showCurrentPassword = false;
  showNewPassword = false;

  photoSaving = false;

  showDeleteConfirm = false;
  deleteForm = { password: '', reason: '' };
  deleteSaving = false;

  channelToggles = [
    { key: 'push_enabled' as keyof NotificationPreference, label: 'Push Notifications', description: 'Receive notifications in your browser' },
    { key: 'email_enabled' as keyof NotificationPreference, label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'sms_enabled' as keyof NotificationPreference, label: 'SMS Notifications', description: 'Receive notifications via SMS' },
  ];

  categoryToggles = [
    { key: 'order_enabled' as keyof NotificationPreference, label: 'Order Updates', description: 'Order placed, confirmed, delivered, etc.', icon: 'receipt_long', iconColor: 'color: #2563eb;' },
    { key: 'payment_enabled' as keyof NotificationPreference, label: 'Payment Updates', description: 'Payment confirmations and failures', icon: 'payment', iconColor: 'color: #059669;' },
    { key: 'subscription_enabled' as keyof NotificationPreference, label: 'Subscription Updates', description: 'Subscription activation, renewal, expiry', icon: 'card_membership', iconColor: 'color: #9333ea;' },
    { key: 'marketing_enabled' as keyof NotificationPreference, label: 'Promotional Offers', description: 'Deals, coupons, and special offers', icon: 'local_offer', iconColor: 'color: #db2777;' },
    { key: 'system_enabled' as keyof NotificationPreference, label: 'System Notifications', description: 'Maintenance, updates, and announcements', icon: 'info', iconColor: 'color: #6b7280;' },
  ];

  ngOnInit(): void {
    this.seo.setPageTitle('Settings');
    this.seo.setNoIndex();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.seo.clearNoIndex();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.authService.getProfile().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile = res.data;
          this.populateProfileForm();
        }
        this.loadPreferences();
      },
      error: () => {
        this.loadPreferences();
      },
    });
  }

  loadPreferences(): void {
    this.notifApi.getPreferences().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.preferences = res.data;
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  populateProfileForm(): void {
    if (!this.profile) return;
    this.profileForm = {
      first_name: this.profile.first_name || '',
      last_name: this.profile.last_name || '',
      email: this.profile.email || '',
      phone: this.profile.phone || '',
      country_code: this.profile.country_code || '+91',
      gender: this.profile.gender || null,
      date_of_birth: this.profile.date_of_birth || null,
    };
    this.profileOriginal = { ...this.profileForm };
  }

  hasProfileChanges(): boolean {
    return JSON.stringify(this.profileForm) !== JSON.stringify(this.profileOriginal);
  }

  resetProfileForm(): void {
    this.profileForm = { ...this.profileOriginal };
  }

  saveProfile(): void {
    if (this.profileSaving || !this.hasProfileChanges()) return;
    this.profileSaving = true;
    this.authService.updateProfile(this.profileForm).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.profileSaving = false),
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile = res.data;
          this.populateProfileForm();
          this.showToast('Profile updated successfully.', 'success');
        }
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to update profile.', 'error');
      },
    });
  }

  changePassword(): void {
    if (this.passwordSaving || !this.isPasswordFormValid()) return;
    this.passwordSaving = true;
    this.authService.changePassword(this.passwordForm).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.passwordSaving = false),
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.passwordForm = { current_password: '', password: '', password_confirmation: '' };
          this.showToast('Password changed successfully.', 'success');
        }
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to change password.', 'error');
      },
    });
  }

  isPasswordFormValid(): boolean {
    return !!this.passwordForm.current_password
      && this.passwordForm.password.length >= 8
      && this.passwordForm.password === this.passwordForm.password_confirmation;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Image must not exceed 2MB.', 'error');
      input.value = '';
      return;
    }
    this.photoSaving = true;
    this.authService.uploadProfilePhoto(file).pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.photoSaving = false; input.value = ''; }),
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile = res.data;
          this.showToast('Profile photo updated.', 'success');
        }
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to upload photo.', 'error');
      },
    });
  }

  removePhoto(): void {
    this.photoSaving = true;
    this.authService.deleteProfilePhoto().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.photoSaving = false),
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile = res.data;
          this.showToast('Profile photo removed.', 'success');
        }
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to remove photo.', 'error');
      },
    });
  }

  deleteAccount(): void {
    if (this.deleteSaving || !this.deleteForm.password) return;
    this.deleteSaving = true;
    this.authService.deleteAccount(this.deleteForm).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.deleteSaving = false),
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('Account deleted. Redirecting...', 'success');
          setTimeout(() => {
            this.authService.clearSession();
            window.location.href = '/';
          }, 1500);
        }
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to delete account.', 'error');
      },
    });
  }

  logoutAllDevices(): void {
    this.authService.logout().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        window.location.href = '/login';
      },
      error: () => {
        window.location.href = '/login';
      },
    });
  }

  togglePreference(key: keyof NotificationPreference): void {
    if (!this.preferences) return;
    const newValue = !this.preferences[key];
    this.preferences = { ...this.preferences, [key]: newValue };
    this.notifApi.updatePreferences(this.preferences).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.preferences = res.data;
        }
      },
      error: () => {
        this.preferences = { ...this.preferences!, [key]: !newValue };
        this.showToast('Failed to save preference.', 'error');
      },
    });
  }

  getPhotoUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl.replace('/api', '')}/storage/${path}`;
  }

  getInitials(): string {
    const first = this.profile?.first_name?.charAt(0) || '';
    const last = this.profile?.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  }

  getToastStyle(type: string): string {
    const base = 'display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); font-size: 13px; font-weight: 500;';
    if (type === 'success') {
      return base + ' background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;';
    }
    return base + ' background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;';
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 3000);
  }
}
