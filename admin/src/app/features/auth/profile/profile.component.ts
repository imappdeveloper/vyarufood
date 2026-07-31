import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="max-w-3xl mx-auto slide-up">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your personal information</p>
      </div>

      <!-- Profile Card -->
      <div class="card-modern p-6 mb-5">
        <div class="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
               style="background: linear-gradient(135deg, #6366F1, #4F46E5); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
            {{ currentUser?.first_name?.charAt(0) || 'A' }}
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ currentUser?.full_name }}</h2>
            <p class="text-sm text-gray-500">{{ currentUser?.email }}</p>
            <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="currentUser?.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" [class]="currentUser?.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'"></span>
              {{ currentUser?.status_label || currentUser?.status }}
            </span>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input formControlName="first_name" class="input-modern" placeholder="First name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input formControlName="last_name" class="input-modern" placeholder="Last name" />
            </div>
          </div>
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input formControlName="email" type="email" class="input-modern" placeholder="Email address" />
          </div>
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Mobile</label>
            <input formControlName="mobile" class="input-modern" placeholder="Phone number" />
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button type="submit" class="btn-primary"
              [disabled]="form.invalid || isSaving">
              @if (isSaving) {
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              }
              Save Changes
            </button>
            <button type="button" class="btn-secondary" (click)="resetForm()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private notification = inject(NotificationService);
  currentUser = this.authApi.currentUser;
  isSaving = false;

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: [''],
  });

  ngOnInit(): void {
    this.authApi.getProfile().subscribe();
    this.authApi.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.form.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          mobile: user.mobile || '',
        });
      }
    });
  }

  resetForm(): void {
    if (this.currentUser) {
      this.form.patchValue({
        first_name: this.currentUser.first_name,
        last_name: this.currentUser.last_name,
        email: this.currentUser.email,
        mobile: this.currentUser.mobile || '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    this.authApi.updateProfile(this.form.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.notification.success(res.message || 'Profile updated');
      },
      error: (err) => {
        this.isSaving = false;
        this.notification.error(err.error?.message || 'Update failed');
      },
    });
  }
}
