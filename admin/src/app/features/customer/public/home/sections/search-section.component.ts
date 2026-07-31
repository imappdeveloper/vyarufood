import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="relative z-20 -mt-1" aria-label="Search meals">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style="background: #fff; border-radius: 1rem; box-shadow: 0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e5e7eb; padding: 1rem 1.25rem; position: relative; margin-top: -1.5rem;" class="sm:-mt-8">
          <form (ngSubmit)="onSearch()" class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style="font-size: 22px;">search</span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="search"
                placeholder="What would you like to eat today?"
                aria-label="Search meals"
                class="w-full outline-none transition-all duration-300 text-sm sm:text-base"
                style="padding: 0.875rem 1rem 0.875rem 3rem; border-radius: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; color: #1e293b; font-size: 0.95rem;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.12)'; this.style.background='#fff';"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'; this.style.background='#f8fafc';" />
            </div>
            <button
              type="submit"
              class="flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300"
              style="padding: 0.875rem 2rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-weight: 600; font-size: 0.875rem; border-radius: 0.75rem; box-shadow: 0 4px 14px rgba(5,150,105,0.35); cursor: pointer; border: none;"
              onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)';"
              onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none';"
              onmousedown="this.style.transform='none';"
              onmouseup="this.style.transform='translateY(-1px)';">
              <span class="material-icons" style="font-size: 20px;">search</span>
              Search
            </button>
          </form>

          <div class="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            @for (chip of quickChips; track chip.label) {
              <button (click)="onQuickSearch(chip.query)"
                      class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200"
                      style="border-radius: 9999px; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; cursor: pointer;"
                      onmouseover="this.style.background='#ecfdf5'; this.style.color='#059669'; this.style.borderColor='#a7f3d0';"
                      onmouseout="this.style.background='#f1f5f9'; this.style.color='#475569'; this.style.borderColor='#e2e8f0';">
                <span class="material-icons" style="font-size: 14px;">{{ chip.icon }}</span>
                {{ chip.label }}
              </button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `],
})
export class SearchSectionComponent {
  searchQuery = '';
  quickChips = [
    { icon: 'local_fire_department', label: 'Bestsellers', query: { bestseller: 1 } },
    { icon: 'new_releases', label: 'New Arrivals', query: { new: 1 } },
    { icon: 'star', label: 'Top Rated', query: { sort: 'average_rating', order: 'desc' } },
    { icon: 'eco', label: 'Healthy', query: { recommended: 1 } },
    { icon: 'local_offer', label: 'Deals', query: { featured: 1 } },
  ];

  constructor(private router: Router) {}

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (q) this.router.navigate(['/meals'], { queryParams: { search: q } });
  }

  onQuickSearch(query: Record<string, any>): void {
    this.router.navigate(['/meals'], { queryParams: query });
  }
}
