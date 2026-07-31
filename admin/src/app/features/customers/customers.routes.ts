import { Routes } from '@angular/router';

export const CUSTOMERS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./customers.component').then((m) => m.CustomersComponent) },
  { path: 'create', loadComponent: () => import('./customer-form/customer-form.component').then((m) => m.CustomerFormComponent) },
  { path: ':uuid', loadComponent: () => import('./customer-detail/customer-detail.component').then((m) => m.CustomerDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./customer-form/customer-form.component').then((m) => m.CustomerFormComponent) },
];
