import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../../../../core/models/customer/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="display: flex; gap: 1rem; padding: 1rem; background: white; border-radius: 0.75rem; border: 1px solid #f1f5f9; margin-bottom: 0.75rem; opacity: 1; transition: opacity 0.2s;"
      [style.opacity]="item.is_available ? '1' : '0.6'">
      <!-- Image -->
      <a [routerLink]="['/meals', item.meal_slug]"
        style="flex-shrink: 0; width: 5rem; height: 5rem; border-radius: 0.5rem; overflow: hidden; background: linear-gradient(135deg, #fff7ed, #fef3c7); display: block;">
        @if (item.meal_image) {
          <img [src]="item.meal_image" [alt]="item.meal_name"
            style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
        } @else {
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 1.75rem;">&#x1f371;</span>
          </div>
        }
      </a>

      <!-- Details -->
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
          <div style="min-width: 0; flex: 1;">
            <a [routerLink]="['/meals', item.meal_slug]"
              style="font-weight: 600; color: #111827; text-decoration: none; font-size: 0.9rem; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color 0.2s;"
              onmouseover="this.style.color='#ea580c'" onmouseout="this.style.color='#111827'">
              {{ item.meal_name }}
            </a>
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; margin-top: 0.25rem;">
              @if (item.category_name) {
                <span style="font-size: 0.7rem; color: #6b7280; background: #f3f4f6; padding: 0.1rem 0.4rem; border-radius: 0.25rem;">{{ item.category_name }}</span>
              }
              @if (item.meal_type) {
                <span style="font-size: 0.7rem; color: #ea580c; background: #fff7ed; padding: 0.1rem 0.4rem; border-radius: 0.25rem;">{{ item.meal_type }}</span>
              }
              @if (item.dietary_type) {
                <span style="font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 0.25rem;"
                  [style.color]="item.dietary_type === 'veg' ? '#15803d' : '#dc2626'"
                  [style.background]="item.dietary_type === 'veg' ? '#f0fdf4' : '#fef2f2'">
                  {{ item.dietary_type === 'veg' ? '\uD83D\uDFE2 Veg' : '\uD83D\uDD34 Non-Veg' }}
                </span>
              }
            </div>
          </div>

          <!-- Remove Button -->
          <button (click)="onRemove.emit(item.id)"
            [attr.aria-label]="'Remove ' + item.meal_name + ' from cart'"
            style="flex-shrink: 0; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; color: #9ca3af; background: transparent; border: none; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; padding: 0;"
            onmouseover="this.style.color='#ef4444'; this.style.background='#fef2f2'"
            onmouseout="this.style.color='#9ca3af'; this.style.background='transparent'">
            <span class="material-icons" style="font-size: 1.15rem;">delete_outline</span>
          </button>
        </div>

        <!-- Unavailable Notice -->
        @if (!item.is_available) {
          <div style="margin-top: 0.5rem; font-size: 0.7rem; color: #dc2626; background: #fef2f2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; display: flex; align-items: center; gap: 0.25rem;">
            <span class="material-icons" style="font-size: 0.85rem;">warning</span>
            This meal is currently unavailable. Please remove it before checkout.
          </div>
        }

        <!-- Price & Quantity -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <!-- Quantity Controls -->
            <div style="display: flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden;">
              <button (click)="onQuantityChange.emit({ itemId: item.id, quantity: item.quantity - 1 })"
                [disabled]="item.quantity <= 1 || updating"
                style="width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; background: white; border: none; color: #4b5563; cursor: pointer; transition: background 0.15s; padding: 0;"
                onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                <span class="material-icons" style="font-size: 1rem;">remove</span>
              </button>
              <span style="width: 2.5rem; height: 2rem; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500; color: #111827; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
                {{ item.quantity }}
              </span>
              <button (click)="onQuantityChange.emit({ itemId: item.id, quantity: item.quantity + 1 })"
                [disabled]="item.quantity >= 50 || updating"
                style="width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; background: white; border: none; color: #4b5563; cursor: pointer; transition: background 0.15s; padding: 0;"
                onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                <span class="material-icons" style="font-size: 1rem;">add</span>
              </button>
            </div>
          </div>

          <!-- Price -->
          <div style="text-align: right;">
            @if (item.discount_amount > 0) {
              <span style="font-size: 0.7rem; color: #9ca3af; text-decoration: line-through; display: block;">&#8377;{{ item.original_price * item.quantity | number:'1.2-2' }}</span>
            }
            <span style="font-weight: 700; color: #111827; font-size: 0.9rem;">&#8377;{{ item.total_price | number:'1.2-2' }}</span>
            @if (item.discount_amount > 0) {
              <span style="font-size: 0.7rem; color: #16a34a; display: block;">Save &#8377;{{ item.discount_amount | number:'1.2-2' }}</span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Input() updating = false;
  @Output() onRemove = new EventEmitter<number>();
  @Output() onQuantityChange = new EventEmitter<{ itemId: number; quantity: number }>();
}
