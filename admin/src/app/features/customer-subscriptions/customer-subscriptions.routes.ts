import { Routes } from '@angular/router';

export const CUSTOMER_SUBSCRIPTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./customer-subscriptions.component').then(m => m.CustomerSubscriptionsComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./customer-subscription-detail/customer-subscription-detail.component').then(m => m.CustomerSubscriptionDetailComponent),
  },
  {
    path: ':uuid/edit',
    loadComponent: () => import('./customer-subscription-edit/customer-subscription-edit.component').then(m => m.CustomerSubscriptionEditComponent),
  },
];
