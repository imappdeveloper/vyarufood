import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex relative overflow-hidden" style="background: linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #047857 100%);">

      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="orb absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style="background: radial-gradient(circle, rgba(52,211,153,0.4), transparent 70%); animation: float 12s ease-in-out infinite;"></div>
        <div class="orb absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full opacity-15"
          style="background: radial-gradient(circle, rgba(16,185,129,0.35), transparent 70%); animation: floatReverse 14s ease-in-out infinite;"></div>
        <div class="orb absolute bottom-16 left-1/3 w-[350px] h-[350px] rounded-full opacity-10"
          style="background: radial-gradient(circle, rgba(110,231,183,0.3), transparent 70%); animation: float 16s ease-in-out infinite 3s;"></div>
        <div class="orb absolute -bottom-24 right-1/4 w-[450px] h-[450px] rounded-full opacity-12"
          style="background: radial-gradient(circle, rgba(52,211,153,0.3), transparent 70%); animation: floatReverse 11s ease-in-out infinite 1s;"></div>
        <div class="absolute inset-0 opacity-[0.04]"
          style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <div class="hidden lg:flex lg:w-[480px] xl:w-[520px] relative z-10 flex-col justify-between p-12 text-white">
        <div>
          <div class="flex items-center gap-3 mb-4" style="animation: fadeSlideUp 0.8s ease-out;">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background: rgba(255,255,255,0.12); backdrop-filter: blur(12px);">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#6ee7b7;">restaurant_menu</span>
            </div>
            <div>
              <span class="text-lg font-semibold tracking-tight">Vyaru Tiffin</span>
              <div class="text-xs text-emerald-200/70 font-medium tracking-wide">ADMIN PORTAL</div>
            </div>
          </div>
        </div>

        <div style="animation: fadeSlideUp 0.8s ease-out 0.2s both;">
          <div class="mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full" style="background: rgba(255,255,255,0.08); backdrop-filter: blur(8px); color: #a7f3d0;">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Tiffin Management System v1.0
            </span>
          </div>
          <h1 class="text-[2.5rem] font-bold leading-[1.15] mb-5" style="text-shadow: 0 2px 20px rgba(0,0,0,0.15);">
            Welcome to<br/>
            <span style="background: linear-gradient(135deg, #6ee7b7, #34d399, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              Vyaru Tiffin
            </span>
          </h1>
          <p class="text-base text-emerald-100/80 max-w-sm leading-relaxed">
            Manage orders, track deliveries, oversee subscriptions, and grow your tiffin business from one powerful dashboard.
          </p>
        </div>

        <div class="space-y-4" style="animation: fadeSlideUp 0.8s ease-out 0.4s both;">
          <div class="flex items-center gap-3 text-sm">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style="background: rgba(255,255,255,0.08);">
              <span class="material-icons" style="font-size:16px;line-height:1;color:#6ee7b7;">verified</span>
            </div>
            <span class="text-emerald-100/80">End-to-end order management</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style="background: rgba(255,255,255,0.08);">
              <span class="material-icons" style="font-size:16px;line-height:1;color:#6ee7b7;">verified</span>
            </div>
            <span class="text-emerald-100/80">Real-time analytics & reporting</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style="background: rgba(255,255,255,0.08);">
              <span class="material-icons" style="font-size:16px;line-height:1;color:#6ee7b7;">verified</span>
            </div>
            <span class="text-emerald-100/80">Subscription & inventory tracking</span>
          </div>
        </div>

        <div style="animation: fadeSlideUp 0.8s ease-out 0.6s both;">
          <p class="text-xs text-emerald-200/50">&copy; {{ currentYear }} Vyaru Tiffin. All rights reserved.</p>
        </div>
      </div>

      <div class="flex-1 flex items-center justify-center relative z-10 p-6 sm:p-8 lg:p-12">
        <div class="w-full max-w-md" style="animation: scaleIn 0.6s ease-out 0.3s both;">
          <div class="lg:hidden text-center mb-8">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style="background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05)); backdrop-filter: blur(12px);">
              <span class="material-icons" style="font-size:28px;line-height:1;color:#6ee7b7;">restaurant_menu</span>
            </div>
            <h2 class="text-white text-2xl font-bold">Vyaru Tiffin</h2>
            <p class="text-emerald-200/60 text-sm mt-1">Admin Portal</p>
          </div>

          <div class="rounded-2xl p-8 sm:p-10" style="background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); box-shadow: 0 25px 60px -12px rgba(0,0,0,0.3);">

            <div class="text-center mb-8">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-emerald-50" style="box-shadow: 0 4px 12px rgba(5,150,105,0.15);">
                <span class="material-icons" style="font-size:24px;line-height:1;color:#059669;">admin_panel_settings</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p class="text-gray-500 mt-1.5 text-sm">Sign in to access your dashboard</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div class="relative">
                  <span [style.color]="emailFocused ? '#059669' : '#9ca3af'"
                    class="material-icons" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:20px;line-height:1;transition:color 0.2s;">email</span>
                  <input formControlName="email" type="email" placeholder="admin@example.com"
                    (focus)="emailFocused = true" (blur)="emailFocused = false"
                    class="w-full pl-11 pr-4 py-3 text-sm transition-all duration-200 rounded-xl"
                    [style]="{
                      background: emailFocused ? '#ffffff' : '#f9fafb',
                      border: '2px solid ' + (emailFocused ? '#34d399' : '#e5e7eb'),
                      outline: 'none',
                      boxShadow: emailFocused ? '0 0 0 4px rgba(16,185,129,0.1)' : 'none',
                      color: '#111827',
                    }"
                    placeholder="admin@example.com" />
                </div>
                @if (loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)) {
                  <p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" style="color:#ef4444;">
                    <span class="material-icons" style="font-size:14px;line-height:1;">error_outline</span>
                    Please enter a valid email address
                  </p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div class="relative">
                  <span [style.color]="passFocused ? '#059669' : '#9ca3af'"
                    class="material-icons" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:20px;line-height:1;transition:color 0.2s;">lock</span>
                  <input [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Enter your password"
                    (focus)="passFocused = true" (blur)="passFocused = false"
                    class="w-full pl-11 pr-12 py-3 text-sm transition-all duration-200 rounded-xl"
                    [style]="{
                      background: passFocused ? '#ffffff' : '#f9fafb',
                      border: '2px solid ' + (passFocused ? '#34d399' : '#e5e7eb'),
                      outline: 'none',
                      boxShadow: passFocused ? '0 0 0 4px rgba(16,185,129,0.1)' : 'none',
                      color: '#111827',
                    }"
                    placeholder="Enter your password" />
                  <button type="button" (click)="hidePassword = !hidePassword"
                    style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:4px;color:#9ca3af;transition:color 0.2s;">
                    <span class="material-icons" style="font-size:20px;line-height:1;">{{ hidePassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
                @if (loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)) {
                  <p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" style="color:#ef4444;">
                    <span class="material-icons" style="font-size:14px;line-height:1;">error_outline</span>
                    Password must be at least 6 characters
                  </p>
                }
              </div>

              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" formControlName="remember_me"
                    class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <span class="text-sm text-gray-600">Remember me</span>
                </label>
                <a routerLink="/auth/forgot-password" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>

              <button type="submit"
                class="relative w-full py-3 px-4 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style="background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 4px 16px rgba(5,150,105,0.3);"
                [disabled]="loginForm.invalid || isLoading"
                (mouseenter)="btnHover = true" (mouseleave)="btnHover = false">
                <span class="absolute inset-0 transition-opacity duration-300" 
                  [style.opacity]="btnHover ? '1' : '0'"
                  style="background: linear-gradient(135deg, #047857, #059669);"></span>
                @if (isLoading) {
                  <svg class="relative z-10 animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span class="relative z-10">Signing in...</span>
                } @else {
                  <span class="material-icons" style="font-size:18px;line-height:1;">login</span>
                  <span class="relative z-10">Sign In</span>
                }
              </button>
            </form>

            <div class="mt-8 pt-6 border-t border-gray-100">
              <div class="flex items-center justify-center gap-2 text-xs text-gray-400">
                <span class="material-icons" style="font-size:14px;line-height:1;">security</span>
                Secured with SSL encryption
                <span class="material-icons" style="font-size:14px;line-height:1;">verified_user</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(40px, -60px) scale(1.05); }
        50% { transform: translate(-20px, -100px) scale(0.95); }
        75% { transform: translate(-60px, -40px) scale(1.02); }
      }
      @keyframes floatReverse {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-50px, 40px) scale(0.95); }
        50% { transform: translate(30px, 80px) scale(1.05); }
        75% { transform: translate(60px, 30px) scale(0.98); }
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.92); }
        to { opacity: 1; transform: scale(1); }
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  currentYear = new Date().getFullYear();
  btnHover = false;
  emailFocused = false;
  passFocused = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember_me: [false],
  });

  hidePassword = true;
  isLoading = false;

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.authService.login(this.loginForm.value as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.notification.success('Login successful!');
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error(error.error?.message || 'Login failed. Please try again.');
      },
    });
  }
}
