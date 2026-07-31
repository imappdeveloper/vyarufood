import { Routes } from '@angular/router';

export const PURCHASE_REQUEST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./purchase-requests.component').then(m => m.PurchaseRequestsComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./purchase-request-form/purchase-request-form.component').then(m => m.PurchaseRequestFormComponent),
  },
  {
    path: ':uuid/edit',
    loadComponent: () => import('./purchase-request-form/purchase-request-form.component').then(m => m.PurchaseRequestFormComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./purchase-request-detail/purchase-request-detail.component').then(m => m.PurchaseRequestDetailComponent),
  },
];
