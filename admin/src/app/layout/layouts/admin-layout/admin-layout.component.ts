import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent],
  template: `
    <div class="h-screen flex overflow-hidden" style="background: #F8FAFC;">
      <app-sidebar [collapsed]="sidebarCollapsed" (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed" />
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <app-header (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed" />
        <main class="flex-1 overflow-auto p-6">
          <router-outlet />
        </main>
        <app-footer />
      </div>
      @if (loadingService.isLoading) {
        <div class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(2,44,34,0.25); backdrop-filter: blur(2px);">
          <div class="w-10 h-10 rounded-full border-[3px] border-emerald-200 border-t-emerald-500 animate-spin"></div>
        </div>
      }
    </div>
  `,
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;
  loadingService = inject(LoadingService);
}
