import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card-modern p-8">
      <div class="text-center mb-7">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: #EEF2FF; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-sm text-gray-500 mt-1.5">Enter your new password below</p>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input formControlName="email" type="email" class="input-modern" placeholder="Your email" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <input formControlName="password" [type]="hidePassword ? 'password' : 'text'" class="input-modern" placeholder="New password" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <input formControlName="password_confirmation" type="password" class="input-modern" placeholder="Confirm password" />
        </div>
        <button type="submit" class="btn-primary w-full"
          [disabled]="form.invalid || isLoading">
          @if (isLoading) {
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          }
          Reset Password
        </button>
      </form>
      <div class="text-center mt-5">
        <a routerLink="/auth/login" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Back to Login</a>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authApi = inject(AuthApiService);
  private notification = inject(NotificationService);

  form = this.fb.group({
    token: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
  });
  hidePassword = true;
  isLoading = false;

  ngOnInit(): void {
    this.form.patchValue({ token: this.route.snapshot.queryParams['token'] || '' });
    if (this.route.snapshot.queryParams['email']) {
      this.form.patchValue({ email: this.route.snapshot.queryParams['email'] });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const v = this.form.value;
    this.authApi.resetPassword(v.token!, v.email!, v.password!, v.password_confirmation!).subscribe({
      next: () => {
        this.isLoading = false;
        this.notification.success('Password reset successfully');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Reset failed');
      },
    });
  }
}
