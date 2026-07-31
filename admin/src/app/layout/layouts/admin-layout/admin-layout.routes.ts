import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const ADMIN_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('../../../features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('../../../features/auth/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'change-password',
        loadComponent: () => import('../../../features/auth/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'countries',
        loadChildren: () => import('../../../features/countries/countries.routes').then((m) => m.COUNTRIES_ROUTES),
      },
      {
        path: 'states',
        loadChildren: () => import('../../../features/states/states.routes').then((m) => m.STATES_ROUTES),
      },
      {
        path: 'cities',
        loadChildren: () => import('../../../features/cities/cities.routes').then((m) => m.CITIES_ROUTES),
      },
      {
        path: 'areas',
        loadChildren: () => import('../../../features/areas/areas.routes').then((m) => m.AREAS_ROUTES),
      },
      {
        path: 'delivery-zones',
        loadChildren: () => import('../../../features/delivery-zones/delivery-zones.routes').then((m) => m.DELIVERY_ZONES_ROUTES),
      },
      {
        path: 'pincodes',
        loadChildren: () => import('../../../features/pincodes/pincodes.routes').then((m) => m.PINCODES_ROUTES),
      },
      {
        path: 'customers',
        loadChildren: () => import('../../../features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES),
      },
      {
        path: 'customer-addresses',
        loadChildren: () => import('../../../features/customer-addresses/customer-addresses.routes').then((m) => m.CUSTOMER_ADDRESSES_ROUTES),
      },
      {
        path: 'kitchens',
        loadChildren: () => import('../../../features/kitchens/kitchens.routes').then((m) => m.KITCHENS_ROUTES),
      },
      {
        path: 'meals',
        loadChildren: () => import('../../../features/meals/meals.routes').then((m) => m.MEALS_ROUTES),
      },
      {
        path: 'meal-categories',
        loadChildren: () => import('../../../features/meal-categories/meal-categories.routes').then((m) => m.MEAL_CATEGORIES_ROUTES),
      },
      {
        path: 'meal-types',
        loadChildren: () => import('../../../features/meal-types/meal-types.routes').then((m) => m.MEAL_TYPES_ROUTES),
      },
      {
        path: 'weekly-menus',
        loadChildren: () => import('../../../features/weekly-menus/weekly-menus.routes').then((m) => m.WEEKLY_MENUS_ROUTES),
      },
      {
        path: 'monthly-menus',
        loadChildren: () => import('../../../features/monthly-menus/monthly-menus.routes').then((m) => m.MONTHLY_MENUS_ROUTES),
      },
      {
        path: 'menu-templates',
        loadChildren: () => import('../../../features/menu-templates/menu-templates.routes').then((m) => m.MENU_TEMPLATES_ROUTES),
      },
      {
        path: 'subscription-plans',
        loadChildren: () => import('../../../features/subscription-plans/subscription-plans.routes').then((m) => m.SUBSCRIPTION_PLAN_ROUTES),
      },
      {
        path: 'customer-subscriptions',
        loadChildren: () => import('../../../features/customer-subscriptions/customer-subscriptions.routes').then((m) => m.CUSTOMER_SUBSCRIPTION_ROUTES),
      },
      {
        path: 'orders',
        loadChildren: () => import('../../../features/orders/orders.routes').then((m) => m.ORDERS_ROUTES),
      },
      {
        path: 'production-batches',
        loadChildren: () => import('../../../features/production-batches/production-batches.routes').then((m) => m.PRODUCTION_BATCH_ROUTES),
      },
      {
        path: 'recipes',
        loadChildren: () => import('../../../features/recipes/recipes.routes').then((m) => m.RECIPES_ROUTES),
      },
      {
        path: 'purchases',
        loadChildren: () => import('../../../features/purchases/purchases.routes').then((m) => m.PURCHASES_ROUTES),
      },
      {
        path: 'suppliers',
        loadChildren: () => import('../../../features/suppliers/suppliers.routes').then((m) => m.SUPPLIER_ROUTES),
      },
      {
        path: 'inventory',
        loadChildren: () => import('../../../features/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
      },
      {
        path: 'expenses',
        loadChildren: () => import('../../../features/expense/expense.routes').then((m) => m.EXPENSE_ROUTES),
      },
      {
        path: 'finance',
        loadChildren: () => import('../../../features/finance/finance.routes').then((m) => m.FINANCE_ROUTES),
      },
      {
        path: 'payment',
        loadChildren: () => import('../../../features/payment/payment.routes').then((m) => m.PAYMENT_ROUTES),
      },
      {
        path: 'notifications',
        loadChildren: () => import('../../../features/notification/notification.routes').then((m) => m.NOTIFICATION_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () => import('../../../features/reports/report.routes').then((m) => m.REPORT_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () => import('../../../features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
      },
    ],
  },
];
