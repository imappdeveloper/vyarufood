import { Routes } from '@angular/router';

export const PURCHASE_ORDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./purchase-orders.component').then(m => m.PurchaseOrdersComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./purchase-order-form/purchase-order-form.component').then(m => m.PurchaseOrderFormComponent),
  },
  {
    path: ':uuid/edit',
    loadComponent: () => import('./purchase-order-form/purchase-order-form.component').then(m => m.PurchaseOrderFormComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./purchase-order-detail/purchase-order-detail.component').then(m => m.PurchaseOrderDetailComponent),
  },
];
