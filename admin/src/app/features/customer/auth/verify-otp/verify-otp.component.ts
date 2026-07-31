import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md text-center">
        <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-emerald-600 text-3xl">check_circle</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Already Verified</h1>
        <p class="text-gray-500 mb-8">Your phone is already verified. Please sign in.</p>
        <a routerLink="/login"
           class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
          <span class="material-icons mr-2">login</span> Go to Login
        </a>
      </div>
    </div>
  `,
})
export class VerifyOtpComponent implements OnInit {
  private authService = inject(CustomerAuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
}
