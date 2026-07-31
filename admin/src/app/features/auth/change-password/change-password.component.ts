import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-lg mx-auto slide-up">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Change Password</h1>
        <p class="text-sm text-gray-500 mt-1">Ensure your account stays secure</p>
      </div>

      <div class="card-modern p-6">
        <div class="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: #FEF3C7;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Security Settings</h3>
            <p class="text-xs text-gray-400">Update your password regularly</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <input formControlName="current_password" type="password" class="input-modern" placeholder="Enter current password" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input formControlName="password" type="password" class="input-modern" placeholder="Enter new password" />
              <p class="mt-1 text-xs text-gray-400">Must be at least 8 characters</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input formControlName="password_confirmation" type="password" class="input-modern" placeholder="Confirm new password" />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button type="submit" class="btn-primary"
              [disabled]="form.invalid || isSaving">
              @if (isSaving) {
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              }
              Update Password
            </button>
            <a routerLink="/profile" class="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  isSaving = false;

  form = this.fb.group({
    current_password: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    const v = this.form.value;
    this.authApi.changePassword(v.current_password!, v.password!, v.password_confirmation!).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.notification.success(res.message || 'Password changed');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isSaving = false;
        this.notification.error(err.error?.message || 'Failed');
      },
    });
  }
}
