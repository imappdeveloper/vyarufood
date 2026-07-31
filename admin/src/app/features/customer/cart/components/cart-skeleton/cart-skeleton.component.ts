import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;" class="skeleton-grid">
      <!-- Cart Items Skeleton -->
      <div>
        @for (i of [1, 2, 3]; track i) {
          <div style="display: flex; gap: 1rem; padding: 1rem; background: white; border-radius: 0.75rem; border: 1px solid #f1f5f9; margin-bottom: 0.75rem;">
            <div style="width: 5rem; height: 5rem; background: #f3f4f6; border-radius: 0.5rem; flex-shrink: 0; animation: pulse 1.5s ease-in-out infinite;"></div>
            <div style="flex: 1;">
              <div style="height: 1rem; background: #f3f4f6; border-radius: 0.25rem; width: 50%; margin-bottom: 0.75rem; animation: pulse 1.5s ease-in-out infinite;"></div>
              <div style="height: 0.75rem; background: #f9fafb; border-radius: 0.25rem; width: 33%; margin-bottom: 1rem; animation: pulse 1.5s ease-in-out infinite;"></div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="height: 2rem; background: #f3f4f6; border-radius: 0.5rem; width: 6rem; animation: pulse 1.5s ease-in-out infinite;"></div>
                <div style="height: 1.25rem; background: #f3f4f6; border-radius: 0.25rem; width: 4rem; animation: pulse 1.5s ease-in-out infinite;"></div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Summary Skeleton -->
      <div class="skeleton-summary">
        <div style="background: white; border-radius: 0.75rem; border: 1px solid #f1f5f9; padding: 1.25rem; animation: pulse 1.5s ease-in-out infinite;">
          <div style="height: 1.25rem; background: #f3f4f6; border-radius: 0.25rem; width: 33%; margin-bottom: 1rem; animation: pulse 1.5s ease-in-out infinite;"></div>
          @for (i of [1, 2, 3, 4]; track i) {
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="height: 1rem; background: #f9fafb; border-radius: 0.25rem; width: 33%; animation: pulse 1.5s ease-in-out infinite;"></div>
              <div style="height: 1rem; background: #f9fafb; border-radius: 0.25rem; width: 4rem; animation: pulse 1.5s ease-in-out infinite;"></div>
            </div>
          }
          <div style="border-top: 1px solid #f1f5f9; padding-top: 1rem; margin-top: 0.5rem; display: flex; justify-content: space-between;">
            <div style="height: 1.25rem; background: #f3f4f6; border-radius: 0.25rem; width: 25%; animation: pulse 1.5s ease-in-out infinite;"></div>
            <div style="height: 1.25rem; background: #f3f4f6; border-radius: 0.25rem; width: 5rem; animation: pulse 1.5s ease-in-out infinite;"></div>
          </div>
          <div style="height: 3rem; background: #f3f4f6; border-radius: 0.75rem; width: 100%; margin-top: 1rem; animation: pulse 1.5s ease-in-out infinite;"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @media (min-width: 1024px) {
      .skeleton-grid { grid-template-columns: 1fr 380px !important; }
      .skeleton-summary { position: sticky; top: 1rem; align-self: start; }
    }
  `],
})
export class CartSkeletonComponent {}
