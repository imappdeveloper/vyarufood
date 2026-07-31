import { Routes } from '@angular/router';

export const SUBSCRIPTION_PLAN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./subscription-plans.component').then(m => m.SubscriptionPlansComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./subscription-plan-form/subscription-plan-form.component').then(m => m.SubscriptionPlanFormComponent),
  },
  {
    path: ':uuid/edit',
    loadComponent: () => import('./subscription-plan-form/subscription-plan-form.component').then(m => m.SubscriptionPlanFormComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./subscription-plan-detail/subscription-plan-detail.component').then(m => m.SubscriptionPlanDetailComponent),
  },
];
