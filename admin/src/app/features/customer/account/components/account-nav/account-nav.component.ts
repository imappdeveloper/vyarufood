import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface AccountLink {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-account-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-1 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <a *ngFor="let link of links"
             [routerLink]="link.route"
             routerLinkActive="bg-orange-500 text-white shadow-sm"
             [routerLinkActiveOptions]="{ exact: link.route === '/customer/dashboard' }"
             class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0
                    text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-100 hover:border-orange-200">
            <mat-icon style="font-size: 18px; width: 18px; height: 18px;">{{ link.icon }}</mat-icon>
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `],
})
export class AccountNavComponent {
  links: AccountLink[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: 'receipt_long', label: 'Orders', route: '/customer/orders' },
    { icon: 'card_membership', label: 'Subscriptions', route: '/customer/subscriptions' },
    { icon: 'account_balance_wallet', label: 'Wallet', route: '/customer/wallet' },
    { icon: 'location_on', label: 'Addresses', route: '/customer/addresses' },
    { icon: 'settings', label: 'Settings', route: '/customer/settings' },
    { icon: 'notifications', label: 'Notifications', route: '/customer/notifications' },
    { icon: 'star', label: 'Reviews', route: '/customer/reviews' },
    { icon: 'support_agent', label: 'Support', route: '/customer/support' },
  ];
}
