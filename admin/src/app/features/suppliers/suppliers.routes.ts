import { Routes } from '@angular/router';

export const SUPPLIER_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./suppliers.component').then(m => m.SuppliersComponent) },
  { path: 'create', loadComponent: () => import('./supplier-form/supplier-form.component').then(m => m.SupplierFormComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./supplier-form/supplier-form.component').then(m => m.SupplierFormComponent) },
  { path: ':uuid', loadComponent: () => import('./supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent) },
];
