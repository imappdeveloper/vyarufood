import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md text-center">
        <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-orange-600 text-3xl">lock_reset</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p class="text-gray-500 mb-8">Enter your email to receive a password reset link</p>

        @if (!submitted) {
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                formControlName="email"
                type="email"
                class="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                [class.border-red-300]="isFieldInvalid('email')"
                [class.border-gray-200]="!isFieldInvalid('email')"
                placeholder="your&#64;email.com" />
              @if (isFieldInvalid('email')) {
                <p class="mt-1 text-xs text-red-500">
                  @if (form.get('email')?.errors?.['required']) { Email is required. }
                  @else if (form.get('email')?.errors?.['email']) { Please enter a valid email. }
                </p>
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
                Sending...
              } @else {
                Send Reset Link
              }
            </button>
            <div class="mt-4 text-center text-sm">
              <a routerLink="/login" class="text-orange-600 hover:text-orange-700 font-medium">← Back to Login</a>
            </div>
          </form>
        } @else {
          <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-green-600 text-3xl">mark_email_read</span>
            </div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h2>
            <p class="text-gray-500 text-sm mb-6">We've sent a password reset link to <strong>{{ submittedEmail }}</strong>. Please check your inbox and follow the instructions.</p>
            <a routerLink="/login" class="inline-block w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-center">Back to Login</a>
          </div>
        }
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(CustomerAuthService);

  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  loading = false;
  error = '';
  submitted = false;
  submittedEmail = '';

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const email = this.form.get('email')!.value!;
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
        this.submittedEmail = email;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to send reset link. Please try again.';
      },
    });
  }
}
