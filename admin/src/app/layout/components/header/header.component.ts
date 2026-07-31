import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatMenuModule, MatButtonModule, MatTooltipModule],
  template: `
    <header class="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <button (click)="toggleSidebar.emit()"
          class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <mat-icon class="text-gray-500" style="font-size:20px;width:20px;height:20px;">menu</mat-icon>
        </button>
      </div>

      <div class="flex items-center gap-1.5">
        <button (click)="themeService.toggleTheme()"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          [matTooltip]="(themeService.theme$ | async) === 'dark' ? 'Light mode' : 'Dark mode'">
          <mat-icon class="text-gray-500" style="font-size:19px;width:19px;height:19px;">
            {{ (themeService.theme$ | async) === 'dark' ? 'light_mode' : 'dark_mode' }}
          </mat-icon>
        </button>

        <!-- User dropdown -->
        <button [matMenuTriggerFor]="userMenu"
          class="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-transparent hover:border-gray-200">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
               style="background: linear-gradient(135deg, #6366F1, #4F46E5); box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);">
            {{ (authService.currentUser$ | async)?.full_name?.charAt(0) || 'A' }}
          </div>
          <div class="hidden sm:flex items-center gap-1.5">
            <span class="text-sm font-medium text-gray-700">{{ (authService.currentUser$ | async)?.full_name }}</span>
            <mat-icon class="text-gray-400" style="font-size:16px;width:16px;height:16px;">expand_more</mat-icon>
          </div>
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before" class="mt-2">
          <div class="px-4 py-3 min-w-[220px]" style="border-bottom: 1px solid #F1F5F9;">
            <p class="text-sm font-semibold text-gray-900">{{ (authService.currentUser$ | async)?.full_name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ (authService.currentUser$ | async)?.email }}</p>
          </div>
          <button mat-menu-item (click)="navigateTo('/profile')">
            <mat-icon style="color:#64748B;">person_outline</mat-icon>
            <span style="color:#374151;">My Profile</span>
          </button>
          <button mat-menu-item (click)="navigateTo('/change-password')">
            <mat-icon style="color:#64748B;">lock_outline</mat-icon>
            <span style="color:#374151;">Change Password</span>
          </button>
          <div style="border-top: 1px solid #F1F5F9; margin: 4px 0;"></div>
          <button mat-menu-item (click)="logout()" class="logout-item">
            <mat-icon style="color:#EF4444;">logout</mat-icon>
            <span style="color:#EF4444; font-weight:500;">Logout</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    :host ::ng-deep .logout-item .mdc-list-item__content {
      padding-top: 2px !important;
      padding-bottom: 2px !important;
    }
  `],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate(['/admin' + path]);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/admin/auth/login']);
      },
      error: () => {
        this.router.navigate(['/admin/auth/login']);
      },
    });
  }
}
