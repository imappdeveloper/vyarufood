import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationMeta } from '../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-customer-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (meta && meta.last_page > 1) {
      <nav class="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
        <button
          (click)="goToPage(meta.current_page - 1)"
          [disabled]="meta.current_page <= 1"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page">
          <span class="material-icons text-xl">chevron_left</span>
        </button>

        @for (page of visiblePages; track page) {
          @if (page === -1) {
            <span class="px-2 py-1 text-gray-400">...</span>
          } @else {
            <button
              (click)="goToPage(page)"
              [class]="page === meta.current_page
                ? 'w-10 h-10 rounded-lg bg-orange-500 text-white font-semibold text-sm transition-colors'
                : 'w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors'"
              [attr.aria-label]="'Page ' + page"
              [attr.aria-current]="page === meta.current_page ? 'page' : null">
              {{ page }}
            </button>
          }
        }

        <button
          (click)="goToPage(meta.current_page + 1)"
          [disabled]="meta.current_page >= meta.last_page"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page">
          <span class="material-icons text-xl">chevron_right</span>
        </button>
      </nav>
      <p class="text-center text-sm text-gray-500 mt-3">
        Showing {{ (meta.current_page - 1) * meta.per_page + 1 }}–{{ Math.min(meta.current_page * meta.per_page, meta.total) }}
        of {{ meta.total }} meals
      </p>
    }
  `,
})
export class CustomerPaginationComponent {
  @Input() meta!: PaginationMeta;
  @Output() pageChange = new EventEmitter<number>();

  Math = Math;

  get visiblePages(): number[] {
    if (!this.meta) return [];
    const { current_page, last_page } = this.meta;
    const pages: number[] = [];
    const delta = 2;

    const start = Math.max(2, current_page - delta);
    const end = Math.min(last_page - 1, current_page + delta);

    pages.push(1);
    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < last_page - 1) pages.push(-1);
    if (last_page > 1) pages.push(last_page);

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
      this.pageChange.emit(page);
    }
  }
}
