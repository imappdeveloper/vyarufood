import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders.component').then(m => m.OrdersComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./order-form/order-form.component').then(m => m.OrderFormComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./order-detail/order-detail.component').then(m => m.OrderDetailComponent),
  },
];
