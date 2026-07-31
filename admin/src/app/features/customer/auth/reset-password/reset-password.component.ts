import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md text-center">
        @if (!success) {
          <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-orange-600 text-3xl">enhanced_encryption</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p class="text-gray-500 mb-8">Enter your new password below</p>

          @if (!token) {
            <div class="bg-red-50 rounded-2xl p-8 border border-red-100">
              <span class="material-icons text-red-500 text-4xl mb-2">error</span>
              <p class="text-red-600 font-medium">Invalid reset link</p>
              <p class="text-red-500 text-sm mt-1">The password reset link is invalid or has expired.</p>
              <a routerLink="/forgot-password" class="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">Request New Link</a>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div class="relative">
                  <input
                    formControlName="password"
                    [type]="showPassword ? 'text' : 'password'"
                    class="w-full px-4 py-2.5 pr-10 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    [class.border-red-300]="isFieldInvalid('password')"
                    [class.border-gray-200]="!isFieldInvalid('password')" />
                  <button type="button" (click)="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <span class="material-icons text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
                @if (isFieldInvalid('password')) {
                  <p class="mt-1 text-xs text-red-500">
                    @if (form.get('password')?.errors?.['required']) { Password is required. }
                    @else if (form.get('password')?.errors?.['minlength']) { Password must be at least 8 characters. }
                  </p>
                }
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  formControlName="password_confirmation"
                  type="password"
                  class="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  [class.border-red-300]="isFieldInvalid('password_confirmation')"
                  [class.border-gray-200]="!isFieldInvalid('password_confirmation')" />
                @if (isFieldInvalid('password_confirmation')) {
                  <p class="mt-1 text-xs text-red-500">Please confirm your password.</p>
                }
              </div>
              @if (error) {
                <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                  <span class="material-icons text-lg">error_outline</span>
                  {{ error }}
                </div>
              }
              <button type="submit" [disabled]="loading" class="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                @if (loading) {
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Resetting...
                } @else {
                  Reset Password
                }
              </button>
            </form>
          }
        } @else {
          <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-green-600 text-3xl">check_circle</span>
            </div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Password Reset Successfully</h2>
            <p class="text-gray-500 text-sm mb-6">Your password has been updated. You can now sign in with your new password.</p>
            <a routerLink="/login" class="inline-block w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-center">Go to Login</a>
          </div>
        }
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(CustomerAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required]],
  });

  token = '';
  email = '';
  loading = false;
  error = '';
  success = false;
  showPassword = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    this.email = this.route.snapshot.queryParams['email'] || '';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token || !this.email) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    const { password, password_confirmation } = this.form.getRawValue();
    this.authService.resetPassword({
      token: this.token,
      email: this.email,
      password: password!,
      password_confirmation: password_confirmation!,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Password reset failed. The link may have expired.';
      },
    });
  }
}
