import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';
import { FirebaseOtpService } from '../../../../core/services/firebase-otp.service';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 mb-6">
            <span class="material-icons text-emerald-600 text-3xl">restaurant_menu</span>
            <span class="text-2xl font-bold text-gray-900">Vyaru Tiffin</span>
          </a>
          <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p class="text-gray-500 mt-1">Sign in to continue your order</p>
        </div>

        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
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
              Continue with Google
            }
          </button>

          @if (error()) {
            <div class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
              <span class="material-icons text-lg">error_outline</span>
              {{ error() }}
            </div>
          }
        </div>

        <div class="mt-6 text-center text-sm text-gray-500">
          New to Vyaru Tiffin? <a routerLink="/register" class="text-emerald-600 font-medium hover:text-emerald-700">Create an account</a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(CustomerAuthService);
  private firebaseOtp = inject(FirebaseOtpService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal('');

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
              this.authService.setPendingGoogleProfile({
                name: result.name,
                email: result.email,
                photo: result.photo,
              });
              this.router.navigate(['/register']);
            } else {
              const returnUrl = this.route.snapshot.queryParams['returnUrl'];
              if (returnUrl && returnUrl.startsWith('/')) {
                this.router.navigateByUrl(returnUrl);
              } else {
                this.router.navigate(['/']);
              }
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
}
