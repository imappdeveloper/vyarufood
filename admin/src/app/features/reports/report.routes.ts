import { Routes } from '@angular/router';

export const REPORT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/executive-dashboard/executive-dashboard.component').then(m => m.ExecutiveDashboardComponent) },
  { path: 'sales', loadComponent: () => import('./components/sales-report/sales-report.component').then(m => m.SalesReportComponent) },
  { path: 'orders', loadComponent: () => import('./components/order-report/order-report.component').then(m => m.OrderReportComponent) },
  { path: 'customers', loadComponent: () => import('./components/customer-report/customer-report.component').then(m => m.CustomerReportComponent) },
  { path: 'subscriptions', loadComponent: () => import('./components/subscription-report/subscription-report.component').then(m => m.SubscriptionReportComponent) },
  { path: 'kitchen', loadComponent: () => import('./components/kitchen-report/kitchen-report.component').then(m => m.KitchenReportComponent) },
  { path: 'inventory', loadComponent: () => import('./components/inventory-report/inventory-report.component').then(m => m.InventoryReportComponent) },
  { path: 'purchases', loadComponent: () => import('./components/purchase-report/purchase-report.component').then(m => m.PurchaseReportComponent) },
  { path: 'finance', loadComponent: () => import('./components/finance-report/finance-report.component').then(m => m.FinanceReportComponent) },
  { path: 'payments', loadComponent: () => import('./components/payment-report/payment-report.component').then(m => m.PaymentReportComponent) },
  { path: 'gst', loadComponent: () => import('./components/gst-report/gst-report.component').then(m => m.GstReportComponent) },
  { path: 'expenses', loadComponent: () => import('./components/expense-report/expense-report.component').then(m => m.ExpenseReportComponent) },
  { path: 'suppliers', loadComponent: () => import('./components/supplier-report/supplier-report.component').then(m => m.SupplierReportComponent) },
  { path: 'notifications', loadComponent: () => import('./components/notification-report/notification-report.component').then(m => m.NotificationReportComponent) },
  { path: 'saved', loadComponent: () => import('./components/saved-reports/saved-reports.component').then(m => m.SavedReportsComponent) },
  { path: 'scheduled', loadComponent: () => import('./components/scheduled-reports/scheduled-reports.component').then(m => m.ScheduledReportsComponent) },
];
