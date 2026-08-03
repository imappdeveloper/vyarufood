import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';
import { FirebaseOtpService } from '../../../../core/services/firebase-otp.service';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 mb-6">
            <span class="material-icons text-emerald-600 text-3xl">restaurant_menu</span>
            <span class="text-2xl font-bold text-gray-900">VyaruFood &amp; Tiffin Service</span>
          </a>
          @if (step() === 'google') {
            <h1 class="text-2xl font-bold text-gray-900">Create Account</h1>
            <p class="text-gray-500 mt-1">Sign up and enjoy fresh meals daily</p>
          } @else {
            <h1 class="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <p class="text-gray-500 mt-1">We've filled in your details from Google</p>
          }
        </div>

        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <!-- Step 1: Google Sign In -->
          @if (step() === 'google') {
            <button
              type="button"
              (click)="loginWithGoogle()"
              [disabled]="loading()"
              class="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) {
                <svg class="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Signing in...
              } @else {
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Sign up with Google
              }
            </button>

            @if (error()) {
              <div class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <span class="material-icons text-lg">error_outline</span>
                {{ error() }}
              </div>
            }
          }

          <!-- Step 2: Profile Completion -->
          @if (step() === 'profile') {
            <form [formGroup]="profileForm" (ngSubmit)="onCompleteProfile()">
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    formControlName="first_name"
                    type="text"
                    class="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    [class.border-red-300]="profileForm.get('first_name')?.invalid && profileForm.get('first_name')?.touched"
                    [class.border-gray-200]="!profileForm.get('first_name')?.invalid || !profileForm.get('first_name')?.touched"
                    placeholder="John" />
                  @if (profileForm.get('first_name')?.invalid && profileForm.get('first_name')?.touched) {
                    <p class="mt-1 text-xs text-red-500">First name is required.</p>
                  }
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    formControlName="last_name"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Doe" />
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  formControlName="email"
                  type="email"
                  readonly
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed" />
              </div>

              @if (error()) {
                <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                  <span class="material-icons text-lg">error_outline</span>
                  {{ error() }}
                </div>
              }

              <button
                type="submit"
                [disabled]="loading()"
                class="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                @if (loading()) {
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Saving...
                } @else {
                  <span class="material-icons text-lg">check_circle</span>
                  Create Account
                }
              </button>

              <button type="button" (click)="onSkipProfile()" class="w-full mt-3 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors">
                Skip for now
              </button>
            </form>
          }
        </div>

        <div class="mt-6 text-center text-sm text-gray-500">
          Already have an account? <a routerLink="/login" class="text-emerald-600 font-medium hover:text-emerald-700">Sign In</a>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(CustomerAuthService);
  private firebaseOtp = inject(FirebaseOtpService);
  private router = inject(Router);

  profileForm = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: [''],
    email: ['', [Validators.email]],
  });

  step = signal<'google' | 'profile'>('google');
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    const pending = this.authService.getPendingGoogleProfile();
    if (pending) {
      this.applyGoogleProfile(pending);
      this.step.set('profile');
    }
  }

  async loginWithGoogle(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');

    try {
      const result = await this.firebaseOtp.signInWithGoogle();

      this.authService.googleLogin(result.idToken).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success && res.data) {
            if (res.data.is_new) {
              const profile = {
                name: result.name,
                email: result.email,
                photo: result.photo,
              };
              this.authService.setPendingGoogleProfile(profile);
              this.applyGoogleProfile(profile);
              this.step.set('profile');
            } else {
              this.authService.setPendingGoogleProfile(null);
              this.router.navigate(['/']);
            }
          }
        },
        error: (err: any) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Something went wrong. Please try again.');
        },
      });
    } catch (err) {
      this.loading.set(false);
      const code = (err as { code?: string })?.code;
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        this.error.set(this.firebaseOtp.friendlyError(err));
      }
    }
  }

  onCompleteProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const { first_name, last_name } = this.profileForm.getRawValue();
    const data: Record<string, string> = {};
    if (first_name) data['first_name'] = first_name;
    if (last_name) data['last_name'] = last_name;

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.loading.set(false);
        this.authService.setPendingGoogleProfile(null);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to update profile.');
      },
    });
  }

  onSkipProfile(): void {
    this.authService.setPendingGoogleProfile(null);
    this.router.navigate(['/']);
  }

  private applyGoogleProfile(profile: { name: string; email: string; photo: string | null }): void {
    const nameParts = profile.name ? profile.name.split(' ') : [];
    this.profileForm.patchValue({
      first_name: nameParts[0] ?? '',
      last_name: nameParts.slice(1).join(' '),
      email: profile.email || '',
    });
  }
}
