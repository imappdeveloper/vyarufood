import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mb-6 slide-up">
      <nav class="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        @for (crumb of breadcrumbs; track crumb.url; let last = $last) {
          @if (!last) {
            <a [routerLink]="crumb.url" class="hover:text-indigo-600 transition-colors">{{ crumb.label }}</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          } @else {
            <span class="text-gray-700 font-medium">{{ crumb.label }}</span>
          }
        }
      </nav>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">{{ title }}</h1>
          @if (subtitle) { <p class="text-sm text-gray-500 mt-0.5">{{ subtitle }}</p> }
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() breadcrumbs: { label: string; url: string }[] = [];
}
