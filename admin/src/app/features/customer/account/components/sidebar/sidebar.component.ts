import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CustomerAuthService } from '../../../../../core/services/customer-auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <!-- Mobile Backdrop -->
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      (click)="closeSidebar.emit()"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 h-full bg-white z-50 shadow-lg flex flex-col transition-transform duration-300 lg:translate-x-0 lg:shadow-md"
      [class.w-64]="true"
      [class.-translate-x-full]="!isOpen"
      [class.translate-x-0]="isOpen"
    >
      <!-- User Info -->
      <div class="p-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <mat-icon class="text-indigo-600">person</mat-icon>
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 overflow-y-auto py-2 px-3">
        <a
          *ngFor="let item of menuItems"
          [routerLink]="item.route"
          routerLinkActive="bg-indigo-600 text-white"
          [routerLinkActiveOptions]="{ exact: item.route === '/customer/dashboard' }"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5"
          [ngClass]="{
            'hover:bg-gray-100 text-gray-600': true
          }"
          (click)="onMenuItemClick()"
        >
          <mat-icon class="text-xl">{{ item.icon }}</mat-icon>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-gray-100">
        <button
          (click)="onLogout()"
          class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <mat-icon class="text-xl">exit_to_app</mat-icon>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  userName = '';
  userEmail = '';

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: 'receipt_long', label: 'My Orders', route: '/customer/orders' },
    { icon: 'card_membership', label: 'My Subscriptions', route: '/customer/subscriptions' },

    { icon: 'account_balance_wallet', label: 'Wallet', route: '/customer/wallet' },
    { icon: 'location_on', label: 'Addresses', route: '/customer/addresses' },
    { icon: 'notifications', label: 'Notifications', route: '/customer/notifications' },
    { icon: 'star', label: 'Reviews', route: '/customer/reviews' },
    { icon: 'support_agent', label: 'Support', route: '/customer/support' },
    { icon: 'person', label: 'Profile', route: '/customer/profile' },
    { icon: 'settings', label: 'Settings', route: '/customer/settings' },
  ];

  constructor(
    private authService: CustomerAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.full_name || 'Customer';
      this.userEmail = user.email || '';
    }
  }

  onMenuItemClick(): void {
    if (window.innerWidth < 1024) {
      this.closeSidebar.emit();
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/']),
    });
  }
}
