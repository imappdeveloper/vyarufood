import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.border]="'1px solid #f0f0f0'"
         [style.boxShadow]="'0 1px 3px rgba(0,0,0,0.04)'" [style.padding]="'16px 20px'">
      <h3 [style.fontSize]="'14px'" [style.fontWeight]="'600'" [style.color]="'#111827'"
          [style.margin]="'0 0 14px 0'">Quick Actions</h3>
      <div [style.display]="'grid'" [style.gridTemplateColumns]="'1fr 1fr'" [style.gap]="'8px'">
        @for (action of actions; track action.label) {
          <a [routerLink]="action.route"
             [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'10px'"
             [style.padding]="'10px 12px'" [style.borderRadius]="'10px'"
             [style.textDecoration]="'none'" [style.transition]="'all 0.2s ease'"
             [style.cursor]="'pointer'"
             [style.background]="'#F9FAFB'"
             [style.border]="'1px solid #F3F4F6'"
             (mouseenter)="action.hovered = true" (mouseleave)="action.hovered = false"
             [style.background]="action.hovered ? action.bgHover : '#F9FAFB'"
             [style.borderColor]="action.hovered ? action.borderHover : '#F3F4F6'"
             [style.transform]="action.hovered ? 'translateY(-1px)' : 'translateY(0)'">
            <div [style.width]="'32px'" [style.height]="'32px'" [style.borderRadius]="'8px'"
                 [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'"
                 [style.flexShrink]="'0'" [style.background]="action.bgColor">
              <mat-icon [style.color]="action.iconColor" [style.fontSize]="'16px'"
                        [style.width]="'16px'" [style.height]="'16px'">{{ action.icon }}</mat-icon>
            </div>
            <span [style.fontSize]="'12px'" [style.fontWeight]="'500'" [style.color]="'#374151'"
                  [style.transition]="'color 0.2s'"
                  [style.color]="action.hovered ? '#111827' : '#374151'">{{ action.label }}</span>
          </a>
        }
      </div>
    </div>
  `,
})
export class QuickActionsComponent {
  actions = [
    { label: 'Create Meal', icon: 'restaurant', route: '/admin/meals/create', bgColor: '#EEF2FF', iconColor: '#6366F1', bgHover: '#E0E7FF', borderHover: '#A5B4FC', hovered: false },
    { label: 'Add Category', icon: 'category', route: '/admin/categories/create', bgColor: '#F0FDF4', iconColor: '#22C55E', bgHover: '#D1FAE5', borderHover: '#6EE7B7', hovered: false },
    { label: 'New Plan', icon: 'card_membership', route: '/admin/subscriptions/create', bgColor: '#FEF3C7', iconColor: '#F59E0B', bgHover: '#FDE68A', borderHover: '#FBBF24', hovered: false },
    { label: 'Add Customer', icon: 'person_add', route: '/admin/customers/create', bgColor: '#EDE9FE', iconColor: '#8B5CF6', bgHover: '#DDD6FE', borderHover: '#A78BFA', hovered: false },
    { label: 'New Order', icon: 'shopping_cart', route: '/admin/orders/create', bgColor: '#FEF2F2', iconColor: '#EF4444', bgHover: '#FEE2E2', borderHover: '#FCA5A5', hovered: false },
    { label: 'Inventory', icon: 'inventory_2', route: '/admin/inventory/create', bgColor: '#ECFDF5', iconColor: '#14B8A6', bgHover: '#CCFBF1', borderHover: '#5EEAD4', hovered: false },
    { label: 'Add Expense', icon: 'receipt_long', route: '/admin/expenses/create', bgColor: '#FFF7ED', iconColor: '#F97316', bgHover: '#FFEDD5', borderHover: '#FDBA74', hovered: false },
    { label: 'Notification', icon: 'notifications_active', route: '/admin/notifications/create', bgColor: '#EFF6FF', iconColor: '#3B82F6', bgHover: '#DBEAFE', borderHover: '#93C5FD', hovered: false },
  ];
}
