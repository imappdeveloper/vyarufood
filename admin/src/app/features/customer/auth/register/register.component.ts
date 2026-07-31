import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';
import { Subscription, interval } from 'rxjs';

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
            <span class="text-2xl font-bold text-gray-900">Vyaru Tiffin</span>
          </a>
          <h1 class="text-2xl font-bold text-gray-900">
            @switch (step()) {
              @case ('phone') { Create Account }
              @case ('otp') { Verify Phone }
              @case ('profile') { Complete Profile }
            }
          </h1>
          <p class="text-gray-500 mt-1">
            @switch (step()) {
              @case ('phone') { Join us and enjoy fresh meals daily }
              @case ('otp') { Verification code sent to {{ phone() }} }
              @case ('profile') { Tell us a bit about yourself }
            }
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <!-- Step 1: Phone -->
          @if (step() === 'phone') {
            <form [formGroup]="phoneForm" (ngSubmit)="onSendOtp()">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <div class="flex gap-2">
                  <div class="w-20 flex-shrink-0">
                    <input
                      formControlName="country_code"
                      type="text"
                      class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center"
                      placeholder="+91" />
                  </div>
                  <div class="flex-1">
                    <input
                      formControlName="phone"
                      type="tel"
                      class="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                      [class.border-red-300]="isPhoneInvalid"
                      [class.border-gray-200]="!isPhoneInvalid"
                      placeholder="Enter 10-digit mobile number"
                      maxlength="10" />
                  </div>
                </div>
                @if (isPhoneInvalid) {
                  <p class="mt-1 text-xs text-red-500">Please enter a valid 10-digit mobile number.</p>
                }
              </div>

              <div class="mb-6">
                <label class="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" formControlName="accept_terms" class="w-4 h-4 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <span class="text-sm text-gray-600">
                    I agree to the <a routerLink="/terms-and-conditions" target="_blank" class="text-emerald-600 hover:underline">Terms &amp; Conditions</a>
                    and <a routerLink="/privacy-policy" target="_blank" class="text-emerald-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                @if (phoneForm.get('accept_terms')?.invalid && phoneForm.get('accept_terms')?.touched) {
                  <p class="mt-1 text-xs text-red-500">You must accept the terms and conditions.</p>
                }
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
                  Sending OTP...
                } @else {
                  <span class="material-icons text-lg">send</span>
                  Send OTP
                }
              </button>
            </form>
          }

          <!-- Step 2: OTP -->
          @if (step() === 'otp') {
            <div class="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
              <span class="material-icons text-lg">info_outline</span>
              Testing mode: OTP auto-filled — {{ autoOtp() }}
            </div>

            <form [formGroup]="otpForm" (ngSubmit)="onVerifyOtp()">
              <div class="flex gap-3 justify-center mb-6">
                @for (digit of otpDigits; track digit; let i = $index) {
                  <input
                    #otpInput
                    [id]="'otp-' + i"
                    maxlength="1"
                    [formControlName]="digit"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    (input)="onDigitInput(i, $event)"
                    (keydown)="onKeyDown(i, $event)"
                    (paste)="onPaste($event)"
                    class="w-12 h-14 text-center text-xl font-bold border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    [class.border-red-300]="otpForm.get(digit)?.invalid && otpForm.get(digit)?.touched"
                    [class.border-gray-200]="!otpForm.get(digit)?.invalid || !otpForm.get(digit)?.touched" />
                }
              </div>

              @if (error()) {
                <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                  <span class="material-icons text-lg">error_outline</span>
                  {{ error() }}
                </div>
              }

              <button
                type="submit"
                [disabled]="loading() || fullOtp.length !== 6"
                class="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                @if (loading()) {
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Verifying...
                } @else {
                  <span class="material-icons text-lg">verified</span>
                  Verify OTP
                }
              </button>

              <div class="mt-6 flex items-center justify-between">
                <button type="button" (click)="goBack()" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <span class="material-icons text-base">arrow_back</span> Change number
                </button>
                @if (resendCountdown() > 0) {
                  <p class="text-sm text-gray-500">Resend in <span class="font-semibold text-emerald-600">{{ resendCountdown() }}s</span></p>
                } @else {
                  <button type="button" (click)="onResend()" [disabled]="resendLoading()" class="text-sm text-emerald-600 font-medium hover:text-emerald-700 disabled:opacity-50">
                    {{ resendLoading() ? 'Sending...' : 'Resend OTP' }}
                  </button>
                }
              </div>
            </form>
          }

          <!-- Step 3: Profile Completion -->
          @if (step() === 'profile') {
            <div class="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
              <span class="material-icons text-lg">check_circle</span>
              Phone verified! Now complete your profile.
            </div>

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
                <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-gray-400">(optional)</span></label>
                <input
                  formControlName="email"
                  type="email"
                  class="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  [class.border-red-300]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched"
                  [class.border-gray-200]="!profileForm.get('email')?.invalid || !profileForm.get('email')?.touched"
                  placeholder="your&#64;email.com" />
                @if (profileForm.get('email')?.errors?.['email'] && profileForm.get('email')?.touched) {
                  <p class="mt-1 text-xs text-red-500">Please enter a valid email.</p>
                }
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
                  Creating account...
                } @else {
                  <span class="material-icons text-lg">person_add</span>
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
export class RegisterComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(CustomerAuthService);
  private router = inject(Router);

  phoneForm = this.fb.group({
    country_code: ['+91'],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    accept_terms: [false, [Validators.requiredTrue]],
  });

  otpDigits = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];
  otpForm = this.fb.group({
    d1: ['', [Validators.required]],
    d2: ['', [Validators.required]],
    d3: ['', [Validators.required]],
    d4: ['', [Validators.required]],
    d5: ['', [Validators.required]],
    d6: ['', [Validators.required]],
  });

  profileForm = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: [''],
    email: ['', [Validators.email]],
  });

  step = signal<'phone' | 'otp' | 'profile'>('phone');
  phone = signal('');
  loading = signal(false);
  error = signal('');
  resendLoading = signal(false);
  resendCountdown = signal(0);
  autoOtp = signal('');
  private countdownSub?: Subscription;

  get isPhoneInvalid(): boolean {
    const control = this.phoneForm.get('phone');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get fullOtp(): string {
    return this.otpDigits.map(d => this.otpForm.get(d)?.value || '').join('');
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }

  onSendOtp(): void {
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const phone = this.phoneForm.get('phone')!.value!;
    this.authService.registerSendOtp(phone).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.phone.set(phone);
          this.autoOtp.set(res.data.otp || '');
          this.step.set('otp');
          this.startCountdown();
          setTimeout(() => {
            this.autoFillOtp(res.data?.otp || '');
          }, 300);
        }
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to send OTP. Please try again.');
      },
    });
  }

  autoFillOtp(otp: string): void {
    if (!otp || otp.length !== 6) return;
    this.otpDigits.forEach((d, i) => this.otpForm.get(d)?.setValue(otp[i]));
    setTimeout(() => this.onVerifyOtp(), 500);
  }

  onVerifyOtp(): void {
    if (this.fullOtp.length !== 6) return;
    this.loading.set(true);
    this.error.set('');

    this.authService.registerVerifyOtp({
      phone: this.phone(),
      otp: this.fullOtp,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set('profile');
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Invalid or expired OTP. Please try again.');
        this.otpDigits.forEach(d => this.otpForm.get(d)?.setValue(''));
        document.getElementById('otp-0')?.focus();
      },
    });
  }

  onCompleteProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const { first_name, last_name, email } = this.profileForm.getRawValue();
    const data: Record<string, string | undefined> = {};
    if (first_name) data['first_name'] = first_name;
    if (last_name) data['last_name'] = last_name;
    if (email) data['email'] = email;

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to update profile.');
      },
    });
  }

  onSkipProfile(): void {
    this.router.navigate(['/']);
  }

  onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    this.otpForm.get(this.otpDigits[index])?.setValue(value.slice(0, 1));
    if (value && index < 5) {
      const next = document.getElementById('otp-' + (index + 1));
      next?.focus();
    }
    this.error.set('');
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpForm.get(this.otpDigits[index])?.value && index > 0) {
      const prev = document.getElementById('otp-' + (index - 1));
      prev?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '') || '';
    if (pasted.length >= 6) {
      this.otpDigits.forEach((d, i) => this.otpForm.get(d)?.setValue(pasted[i]));
      document.getElementById('otp-5')?.focus();
    }
  }

  goBack(): void {
    this.step.set('phone');
    this.error.set('');
    this.countdownSub?.unsubscribe();
  }

  onResend(): void {
    this.resendLoading.set(true);
    this.error.set('');

    this.authService.registerSendOtp(this.phone()).subscribe({
      next: (res) => {
        this.resendLoading.set(false);
        if (res.success && res.data) {
          this.autoOtp.set(res.data.otp || '');
          this.startCountdown();
          this.autoFillOtp(res.data?.otp || '');
        }
      },
      error: (err: any) => {
        this.resendLoading.set(false);
        this.error.set(err.error?.message || 'Failed to resend OTP.');
      },
    });
  }

  private startCountdown(): void {
    this.resendCountdown.set(45);
    this.countdownSub?.unsubscribe();
    this.countdownSub = interval(1000).subscribe(() => {
      if (this.resendCountdown() > 0) {
        this.resendCountdown.set(this.resendCountdown() - 1);
      } else {
        this.countdownSub?.unsubscribe();
      }
    });
  }
}
