import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

interface Breadcrumb { label: string; url: string; }

@Component({
  selector: 'app-breadcrumb-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      @for (crumb of breadcrumbs; track crumb.url; let last = $last) {
        @if (!last) {
          <a [routerLink]="crumb.url" class="hover:text-primary-600">{{ crumb.label }}</a>
          <mat-icon class="text-gray-400" style="width:16px;height:16px;font-size:16px">chevron_right</mat-icon>
        } @else {
          <span class="text-gray-800 font-medium">{{ crumb.label }}</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbBarComponent {
  breadcrumbs: Breadcrumb[] = [];
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.buildBreadcrumbs();
    });
  }

  private buildBreadcrumbs(): void {
    this.breadcrumbs = [{ label: 'Home', url: '/dashboard' }];
    const segments = this.router.url.split('/').filter(Boolean);
    let path = '';
    segments.forEach((segment) => {
      path += `/${segment}`;
      this.breadcrumbs.push({ label: segment.charAt(0).toUpperCase() + segment.slice(1), url: path });
    });
  }
}
