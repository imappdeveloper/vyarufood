import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../features/customer/account/components/sidebar/sidebar.component';
import { CustomerAuthService } from '../../../core/services/customer-auth.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-customer-sidebar [isOpen]="sidebarOpen()" (closeSidebar)="sidebarOpen.set(false)" />
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-black/40 z-30 lg:hidden" (click)="sidebarOpen.set(false)"></div>
      }
      <div class="flex-1 flex flex-col min-h-screen lg:ml-[260px]">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <button (click)="sidebarOpen.set(true)" class="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
            <span class="material-icons text-gray-600">menu</span>
          </button>
          <div class="flex-1"></div>
          <div class="flex items-center gap-3">
            <button class="p-2 rounded-lg hover:bg-gray-100 relative">
              <span class="material-icons text-gray-600">notifications</span>
            </button>
            <div class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
              {{ userInitial }}
            </div>
          </div>
        </header>
        <main class="flex-1 p-4 lg:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class CustomerLayoutComponent implements OnInit {
  sidebarOpen = signal(false);
  userInitial = 'C';

  private authService = inject(CustomerAuthService);

  ngOnInit(): void {
    this.authService.getProfile().subscribe();
    const user = this.authService.currentUser;
    if (user) {
      this.userInitial = (user.first_name?.charAt(0) || 'C').toUpperCase();
    }
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userInitial = (user.first_name?.charAt(0) || 'C').toUpperCase();
      }
    });
  }
}
