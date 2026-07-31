import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  template: `
    <aside [style.width]="collapsed ? '72px' : '260px'"
           [style.transition]="'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'"
           [style.display]="'flex'" [style.flexDirection]="'column'"
           [style.background]="'linear-gradient(180deg, #022c22 0%, #064e3b 30%, #065f46 60%, #022c22 100%)'"
           [style.boxShadow]="'4px 0 20px rgba(0,0,0,0.15)'"
           [style.position]="'relative'" [style.height]="'100%'">
      <!-- Decorative circles -->
      <div [style.position]="'absolute'" [style.top]="'-80px'" [style.right]="'-60px'"
           [style.width]="'200px'" [style.height]="'200px'" [style.borderRadius]="'50%'"
           [style.background]="'rgba(16, 185, 129, 0.08)'"></div>
      <div [style.position]="'absolute'" [style.bottom]="'-40px'" [style.left]="'-80px'"
           [style.width]="'160px'" [style.height]="'160px'" [style.borderRadius]="'50%'"
           [style.background]="'rgba(16, 185, 129, 0.05)'"></div>

      <!-- Logo -->
      <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'"
           [style.padding]="collapsed ? '16px 14px' : '16px 20px'"
           [style.borderBottom]="'1px solid rgba(255,255,255,0.06)'"
           [style.position]="'relative'" [style.zIndex]="'1'">
        <div [style.width]="'38px'" [style.height]="'38px'" [style.borderRadius]="'12px'"
             [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'"
             [style.fontWeight]="'700'" [style.fontSize]="'17px'" [style.flexShrink]="'0'"
             [style.background]="'linear-gradient(135deg, #34d399, #10b981)'"
             [style.boxShadow]="'0 4px 12px rgba(16, 185, 129, 0.35)'">
          <span [style.color]="'#fff'">V</span>
        </div>
        @if (!collapsed) {
          <div [style.overflow]="'hidden'">
            <p [style.color]="'#fff'" [style.fontSize]="'15px'" [style.fontWeight]="'700'"
               [style.margin]="'0'" [style.letterSpacing]="'-0.3px'">Vyaru Food</p>
            <p [style.color]="'rgba(255,255,255,0.5)'" [style.fontSize]="'10px'"
               [style.fontWeight]="'500'" [style.margin]="'1px 0 0 0'"
               [style.letterSpacing]="'0.5px'" [style.textTransform]="'uppercase'">Admin Panel</p>
          </div>
        }
      </div>

      <!-- Nav items -->
      <nav [style.flex]="'1'" [style.padding]="'12px 10px'" [style.overflowY]="'auto'"
           [style.overflowX]="'hidden'" [style.position]="'relative'" [style.zIndex]="'1'"
           [style.minHeight]="'0'" [style.overscrollBehavior]="'contain'">
        @for (item of menuItems; track item.label; let i = $index) {
          @if (item.label === 'divider') {
            @if (!collapsed) {
              <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'"
                   [style.margin]="'16px 8px 8px 8px'" [style.opacity]="'0.5'">
                <span [style.flex]="'1'" [style.height]="'1px'" [style.background]="'rgba(255,255,255,0.1)'"></span>
              </div>
            }
          } @else {
            @if (item.children) {
              <div [style.marginBottom]="'2px'">
                <button (click)="toggleSubmenu(item.label)"
                  [style.width]="'100%'" [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'10px'"
                  [style.padding]="'9px 12px'" [style.border]="'none'" [style.borderRadius]="'10px'"
                  [style.background]="'transparent'" [style.cursor]="'pointer'"
                  [style.transition]="'all 0.2s ease'" [style.textAlign]="'left'"
                  [matTooltip]="collapsed ? item.label : ''" matTooltipPosition="right"
                  (mouseenter)="onHover($event, true)" (mouseleave)="onHover($event, false)">
                  <div [style.width]="'32px'" [style.height]="'32px'" [style.borderRadius]="'9px'"
                       [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'"
                       [style.flexShrink]="'0'"
                       [style.background]="expandedMenus.has(item.label) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)'"
                       [style.transition]="'all 0.2s ease'">
                    <mat-icon [style.fontSize]="'18px'" [style.width]="'18px'" [style.height]="'18px'"
                              [style.color]="expandedMenus.has(item.label) ? '#34d399' : 'rgba(255,255,255,0.55)'"
                              [style.transition]="'color 0.2s ease'">{{ item.icon }}</mat-icon>
                  </div>
                  @if (!collapsed) {
                    <span [style.flex]="'1'" [style.fontSize]="'13px'" [style.fontWeight]="'500'"
                          [style.color]="expandedMenus.has(item.label) ? '#fff' : 'rgba(255,255,255,0.6)'"
                          [style.transition]="'color 0.2s ease'">{{ item.label }}</span>
                    <mat-icon [style.fontSize]="'16px'" [style.width]="'16px'" [style.height]="'16px'"
                              [style.color]="'rgba(255,255,255,0.35)'"
                              [style.transition]="'transform 0.3s ease'"
                              [style.transform]="expandedMenus.has(item.label) ? 'rotate(180deg)' : 'rotate(0deg)'">expand_more</mat-icon>
                  }
                </button>
                @if (!collapsed && expandedMenus.has(item.label)) {
                  <div [style.marginLeft]="'12px'" [style.marginTop]="'4px'" [style.marginBottom]="'4px'"
                       [style.borderLeft]="'1.5px solid rgba(16, 185, 129, 0.2)'" [style.paddingLeft]="'8px'">
                    @for (child of item.children; track child.route) {
                      <a [routerLink]="child.route" routerLinkActive="active-child"
                         [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'"
                         [style.padding]="'7px 10px'" [style.borderRadius]="'8px'"
                         [style.textDecoration]="'none'" [style.transition]="'all 0.2s ease'"
                         [style.marginBottom]="'1px'"
                         (mouseenter)="onChildHover($event, true)" (mouseleave)="onChildHover($event, false)">
                        <div [style.width]="'5px'" [style.height]="'5px'" [style.borderRadius]="'50%'"
                             [style.background]="'rgba(16, 185, 129, 0.4)'"
                             [style.flexShrink]="'0'"></div>
                        <span [style.fontSize]="'12.5px'" [style.fontWeight]="'500'"
                              [style.color]="'rgba(255,255,255,0.5)'"
                              [style.transition]="'color 0.2s ease'">{{ child.label }}</span>
                      </a>
                    }
                  </div>
                }
              </div>
            } @else {
              <a [routerLink]="item.route" routerLinkActive="active-item"
                 [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'10px'"
                 [style.padding]="'9px 12px'" [style.borderRadius]="'10px'"
                 [style.textDecoration]="'none'" [style.transition]="'all 0.2s ease'"
                 [style.marginBottom]="'2px'"
                 [matTooltip]="collapsed ? item.label : ''" matTooltipPosition="right"
                 (mouseenter)="onHover($event)" (mouseleave)="onHover($event, false)">
                <div [style.width]="'32px'" [style.height]="'32px'" [style.borderRadius]="'9px'"
                     [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'"
                     [style.flexShrink]="'0'"
                     [style.background]="'rgba(255,255,255,0.06)'"
                     [style.transition]="'all 0.2s ease'">
                  <mat-icon [style.fontSize]="'18px'" [style.width]="'18px'" [style.height]="'18px'"
                            [style.color]="'rgba(255,255,255,0.55)'" [style.transition]="'color 0.2s ease'">{{ item.icon }}</mat-icon>
                </div>
                @if (!collapsed) {
                  <span [style.fontSize]="'13px'" [style.fontWeight]="'500'"
                        [style.color]="'rgba(255,255,255,0.6)'"
                        [style.transition]="'color 0.2s ease'">{{ item.label }}</span>
                }
              </a>
            }
          }
        }
      </nav>

      <!-- Collapse toggle -->
      <div [style.padding]="'12px 10px'" [style.borderTop]="'1px solid rgba(255,255,255,0.06)'"
           [style.position]="'relative'" [style.zIndex]="'1'">
        <button (click)="toggleSidebar.emit()"
          [style.width]="'100%'" [style.display]="'flex'" [style.alignItems]="'center'"
          [style.justifyContent]="collapsed ? 'center' : 'flex-start'" [style.gap]="'10px'"
          [style.padding]="'9px 12px'" [style.border]="'none'" [style.borderRadius]="'10px'"
          [style.background]="'rgba(255,255,255,0.04)'" [style.cursor]="'pointer'"
          [style.transition]="'all 0.2s ease'"
          (mouseenter)="toggleHover = true" (mouseleave)="toggleHover = false"
          [style.background]="toggleHover ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'">
          <mat-icon [style.fontSize]="'18px'" [style.width]="'18px'" [style.height]="'18px'"
                    [style.color]="'rgba(255,255,255,0.4)'">{{ collapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          @if (!collapsed) {
            <span [style.fontSize]="'12px'" [style.fontWeight]="'500'"
                  [style.color]="'rgba(255,255,255,0.4)'">Collapse</span>
          }
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host ::ng-deep .active-item {
      background: rgba(16, 185, 129, 0.15) !important;
    }
    :host ::ng-deep .active-item > div:first-child {
      background: linear-gradient(135deg, #10b981, #059669) !important;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }
    :host ::ng-deep .active-item > div:first-child mat-icon {
      color: white !important;
    }
    :host ::ng-deep .active-item > span {
      color: white !important;
    }
    :host ::ng-deep .active-child {
      background: rgba(16, 185, 129, 0.1) !important;
    }
    :host ::ng-deep .active-child > span {
      color: #34d399 !important;
    }
    :host ::ng-deep .active-child > div {
      background: #34d399 !important;
    }
    nav { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
    nav::-webkit-scrollbar { width: 3px; }
    nav::-webkit-scrollbar-track { background: transparent; }
    nav::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 10px; }
    nav::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.4); }
  `],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  private router = inject(Router);
  expandedMenus = new Set<string>();
  toggleHover = false;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'divider', icon: '' },
    {
      label: 'System Settings',
      icon: 'settings',
      children: [
        { label: 'Settings Dashboard', route: '/admin/settings', icon: 'dashboard' },
        { label: 'General Settings', route: '/admin/settings/general', icon: 'settings' },
        { label: 'Company Profile', route: '/admin/settings/company', icon: 'business' },
        { label: 'Branding', route: '/admin/settings/branding', icon: 'palette' },
        { label: 'CMS Pages', route: '/admin/settings/cms', icon: 'description' },
        { label: 'SEO Manager', route: '/admin/settings/seo', icon: 'search' },
        { label: 'App Versions', route: '/admin/settings/versions', icon: 'system_update' },
        { label: 'Backup Manager', route: '/admin/settings/backups', icon: 'backup' },
        { label: 'Maintenance', route: '/admin/settings/maintenance', icon: 'build' },
        { label: 'Payment Gateway', route: '/admin/settings/payments', icon: 'payment' },
        { label: 'Notification Config', route: '/admin/settings/notifications-config', icon: 'notifications' },
      ],
    },
    {
      label: 'Location Management',
      icon: 'location_on',
      children: [
        { label: 'Countries', icon: 'public', route: '/admin/countries' },
        { label: 'States', icon: 'location_city', route: '/admin/states' },
        { label: 'Cities', icon: 'location_on', route: '/admin/cities' },
        { label: 'Areas', icon: 'explore', route: '/admin/areas' },
        { label: 'Delivery Zones', icon: 'local_shipping', route: '/admin/delivery-zones' },
        { label: 'Pincodes', icon: 'markunread_mailbox', route: '/admin/pincodes' },
      ],
    },
    {
      label: 'Customer Management',
      icon: 'people',
      children: [
        { label: 'Customers', icon: 'people', route: '/admin/customers' },
        { label: 'Customer Addresses', icon: 'home', route: '/admin/customer-addresses' },
      ],
    },
    {
      label: 'Kitchen Management',
      icon: 'restaurant',
      children: [
        { label: 'Kitchens', icon: 'restaurant', route: '/admin/kitchens' },
        { label: 'Working Days', icon: 'schedule', route: '/admin/kitchens/working-days' },
        { label: 'Holidays', icon: 'event_busy', route: '/admin/kitchens/holidays' },
        { label: 'Capacity', icon: 'speed', route: '/admin/kitchens/capacity' },
        { label: 'Production Schedules', icon: 'production_quantity_limits', route: '/admin/kitchens/production-schedules' },
      ],
    },
    {
      label: 'Meal Management',
      icon: 'restaurant_menu',
      children: [
        { label: 'Meals', icon: 'restaurant_menu', route: '/admin/meals' },
        { label: 'Meal Categories', icon: 'category', route: '/admin/meal-categories' },
        { label: 'Meal Types', icon: 'view_list', route: '/admin/meal-types' },
      ],
    },
    {
      label: 'Weekly Menu',
      icon: 'calendar_today',
      children: [
        { label: 'Menu Planner', route: '/admin/weekly-menus', icon: 'view_module' },
        { label: 'Customer Selections', route: '/admin/weekly-menus/selections', icon: 'fact_check' },
      ],
    },
    {
      label: 'Monthly Menu',
      icon: 'calendar_month',
      children: [
        { label: 'Monthly Menus', route: '/admin/monthly-menus', icon: 'calendar_month' },
        { label: 'Menu Templates', route: '/admin/menu-templates', icon: 'description' },
      ],
    },
    {
      label: 'Subscription Plans',
      icon: 'card_membership',
      children: [
        { label: 'Plans', route: '/admin/subscription-plans', icon: 'card_membership' },
      ],
    },
    {
      label: 'Subscriptions',
      icon: 'subscriptions',
      children: [
        { label: 'All Subscriptions', route: '/admin/customer-subscriptions', icon: 'list' },
      ],
    },
    {
      label: 'Orders',
      icon: 'receipt_long',
      children: [
        { label: 'All Orders', route: '/admin/orders', icon: 'receipt_long' },
      ],
    },
    {
      label: 'Production',
      icon: 'kitchen',
      children: [
        { label: 'Production Batches', route: '/admin/production-batches', icon: 'kitchen' },
      ],
    },
    {
      label: 'Recipe Management',
      icon: 'menu_book',
      children: [
        { label: 'Recipes', route: '/admin/recipes', icon: 'menu_book' },
      ],
    },
    {
      label: 'Supplier Management',
      icon: 'local_shipping',
      children: [
        { label: 'Suppliers', route: '/admin/suppliers', icon: 'local_shipping' },
      ],
    },
    {
      label: 'Purchases',
      icon: 'shopping_cart',
      children: [
        { label: 'Purchase Requests', route: '/admin/purchases/requests', icon: 'request_quote' },
        { label: 'Purchase Orders', route: '/admin/purchases/orders', icon: 'receipt_long' },
        { label: 'Goods Receipts', route: '/admin/purchases/goods-receipts', icon: 'local_shipping' },
      ],
    },
    {
      label: 'Inventory Management',
      icon: 'inventory_2',
      children: [
        { label: 'Inventory Items', route: '/admin/inventory', icon: 'inventory_2' },
      ],
    },
    {
      label: 'Expense Management',
      icon: 'receipt_long',
      children: [
        { label: 'Expenses', route: '/admin/expenses', icon: 'receipt_long' },
      ],
    },
    {
      label: 'Payment & Wallet',
      icon: 'payments',
      children: [
        { label: 'Dashboard', route: '/admin/payment', icon: 'dashboard' },
        { label: 'Transactions', route: '/admin/payment/transactions', icon: 'receipt_long' },
        { label: 'Refunds', route: '/admin/payment/refunds', icon: 'replay' },
        { label: 'Wallets', route: '/admin/payment/wallets', icon: 'account_balance_wallet' },
        { label: 'Webhook Logs', route: '/admin/payment/webhook-logs', icon: 'web' },
      ],
    },
    {
      label: 'Finance & Accounting',
      icon: 'account_balance',
      children: [
        { label: 'Dashboard', route: '/admin/finance', icon: 'dashboard' },
        { label: 'Chart of Accounts', route: '/admin/finance/accounts', icon: 'account_tree' },
        { label: 'Journal Entries', route: '/admin/finance/journals', icon: 'menu_book' },
        { label: 'Financial Years', route: '/admin/finance/financial-years', icon: 'date_range' },
        { label: 'Bank Accounts', route: '/admin/finance/bank-accounts', icon: 'account_balance' },
        { label: 'Trial Balance', route: '/admin/finance/reports/trial-balance', icon: 'balance' },
        { label: 'Profit & Loss', route: '/admin/finance/reports/profit-loss', icon: 'trending_up' },
        { label: 'Balance Sheet', route: '/admin/finance/reports/balance-sheet', icon: 'assess' },
        { label: 'Cash Flow', route: '/admin/finance/reports/cash-flow', icon: 'swap_horiz' },
      ],
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      children: [
        { label: 'Dashboard', route: '/admin/notifications', icon: 'dashboard' },
        { label: 'All Notifications', route: '/admin/notifications/list', icon: 'notifications' },
        { label: 'Templates', route: '/admin/notifications/templates', icon: 'description' },
        { label: 'Broadcast', route: '/admin/notifications/broadcast', icon: 'campaign' },
        { label: 'Delivery Logs', route: '/admin/notifications/logs', icon: 'receipt_long' },
      ],
    },
    {
      label: 'Reports & Analytics',
      icon: 'analytics',
      children: [
        { label: 'Executive Dashboard', route: '/admin/reports', icon: 'dashboard' },
        { label: 'Sales Report', route: '/admin/reports/sales', icon: 'point_of_sale' },
        { label: 'Order Report', route: '/admin/reports/orders', icon: 'shopping_cart' },
        { label: 'Customer Report', route: '/admin/reports/customers', icon: 'people' },
        { label: 'Subscription Report', route: '/admin/reports/subscriptions', icon: 'subscriptions' },
        { label: 'Kitchen Report', route: '/admin/reports/kitchen', icon: 'restaurant' },
        { label: 'Inventory Report', route: '/admin/reports/inventory', icon: 'inventory_2' },
        { label: 'Purchase Report', route: '/admin/reports/purchases', icon: 'local_shipping' },
        { label: 'Finance Report', route: '/admin/reports/finance', icon: 'account_balance' },
        { label: 'Payment Report', route: '/admin/reports/payments', icon: 'payment' },
        { label: 'GST Report', route: '/admin/reports/gst', icon: 'receipt' },
        { label: 'Expense Report', route: '/admin/reports/expenses', icon: 'money_off' },
        { label: 'Supplier Report', route: '/admin/reports/suppliers', icon: 'store' },
        { label: 'Notification Report', route: '/admin/reports/notifications', icon: 'notifications_active' },
        { label: 'Saved Reports', route: '/admin/reports/saved', icon: 'bookmark' },
        { label: 'Scheduled Reports', route: '/admin/reports/scheduled', icon: 'schedule' },
      ],
    },
  ];

  ngOnInit(): void {
    this.checkAndExpand(this.router.url);
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.checkAndExpand(e.urlAfterRedirects || e.url);
    });
  }

  private checkAndExpand(url: string): void {
    const p = '/admin/';
    const locationRoutes = [p+'countries', p+'states', p+'cities', p+'areas', p+'delivery-zones', p+'pincodes'];
    if (locationRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Location Management');
    const customerRoutes = [p+'customers', p+'customer-addresses'];
    if (customerRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Customer Management');
    const kitchenRoutes = [p+'kitchens', p+'kitchens/working-days', p+'kitchens/holidays', p+'kitchens/capacity', p+'kitchens/production-schedules'];
    if (kitchenRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Kitchen Management');
    const mealRoutes = [p+'meals', p+'meal-categories', p+'meal-types'];
    if (mealRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Meal Management');
    const weeklyMenuRoutes = [p+'weekly-menus'];
    if (weeklyMenuRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Weekly Menu');
    const monthlyMenuRoutes = [p+'monthly-menus', p+'menu-templates'];
    if (monthlyMenuRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Monthly Menu');
    const subscriptionPlanRoutes = [p+'subscription-plans'];
    if (subscriptionPlanRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Subscription Plans');
    const subscriptionRoutes = [p+'customer-subscriptions'];
    if (subscriptionRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Subscriptions');
    const orderRoutes = [p+'orders'];
    if (orderRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Orders');
    const productionRoutes = [p+'production-batches'];
    if (productionRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Production');
    const recipeRoutes = [p+'recipes'];
    if (recipeRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Recipe Management');
    const supplierRoutes = [p+'suppliers'];
    if (supplierRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Supplier Management');
    const purchaseRoutes = [p+'purchases'];
    if (purchaseRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Purchases');
    const inventoryRoutes = [p+'inventory'];
    if (inventoryRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Inventory Management');
    const expenseRoutes = [p+'expenses'];
    if (expenseRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Expense Management');
    const paymentRoutes = [p+'payment'];
    if (paymentRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Payment & Wallet');
    const financeRoutes = [p+'finance'];
    if (financeRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Finance & Accounting');
    const notificationRoutes = [p+'notifications'];
    if (notificationRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Notifications');
    const reportRoutes = [p+'reports'];
    if (reportRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('Reports & Analytics');
    const settingsRoutes = [p+'settings'];
    if (settingsRoutes.some((r) => url.startsWith(r))) this.expandedMenus.add('System Settings');
  }

  toggleSubmenu(label: string): void {
    if (this.expandedMenus.has(label)) {
      this.expandedMenus.delete(label);
    } else {
      this.expandedMenus.add(label);
    }
  }

  onHover(event: MouseEvent, enter = true): void {
    const el = event.currentTarget as HTMLElement;
    if (!el) return;
    const bg = el.querySelector('div') as HTMLElement;
    const icon = el.querySelector('mat-icon') as HTMLElement;
    const span = el.querySelector('span:not(mat-icon)') as HTMLElement;
    if (enter) {
      if (!el.classList.contains('active-item')) {
        el.style.background = 'rgba(255,255,255,0.06)';
        if (bg) bg.style.background = 'rgba(255,255,255,0.1)';
        if (icon) icon.style.color = 'rgba(255,255,255,0.8)';
        if (span) span.style.color = '#fff';
      }
    } else {
      if (!el.classList.contains('active-item')) {
        el.style.background = 'transparent';
        if (bg) bg.style.background = 'rgba(255,255,255,0.06)';
        if (icon) icon.style.color = 'rgba(255,255,255,0.55)';
        if (span) span.style.color = 'rgba(255,255,255,0.6)';
      }
    }
  }

  onChildHover(event: MouseEvent, enter = true): void {
    const el = event.currentTarget as HTMLElement;
    if (!el) return;
    const dot = el.querySelector('div') as HTMLElement;
    const span = el.querySelector('span') as HTMLElement;
    if (enter) {
      if (!el.classList.contains('active-child')) {
        el.style.background = 'rgba(255,255,255,0.04)';
        if (span) span.style.color = 'rgba(255,255,255,0.8)';
      }
    } else {
      if (!el.classList.contains('active-child')) {
        el.style.background = 'transparent';
        if (span) span.style.color = 'rgba(255,255,255,0.5)';
      }
    }
  }
}
