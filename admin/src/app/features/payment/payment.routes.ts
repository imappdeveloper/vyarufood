import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/payment-dashboard/payment-dashboard.component').then(m => m.PaymentDashboardComponent) },
  { path: 'transactions', loadComponent: () => import('./components/payment-transaction-list/payment-transaction-list.component').then(m => m.PaymentTransactionListComponent) },
  { path: 'transactions/:uuid', loadComponent: () => import('./components/payment-transaction-detail/payment-transaction-detail.component').then(m => m.PaymentTransactionDetailComponent) },
  { path: 'refunds', loadComponent: () => import('./components/payment-refund-list/payment-refund-list.component').then(m => m.PaymentRefundListComponent) },
  { path: 'refunds/create', loadComponent: () => import('./components/payment-refund-form/payment-refund-form.component').then(m => m.PaymentRefundFormComponent) },
  { path: 'wallets', loadComponent: () => import('./components/wallet-list/wallet-list.component').then(m => m.WalletListComponent) },
  { path: 'wallets/:uuid', loadComponent: () => import('./components/wallet-detail/wallet-detail.component').then(m => m.WalletDetailComponent) },
  { path: 'webhook-logs', loadComponent: () => import('./components/webhook-log-list/webhook-log-list.component').then(m => m.WebhookLogListComponent) },
];
