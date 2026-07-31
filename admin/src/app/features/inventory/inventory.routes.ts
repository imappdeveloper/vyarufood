import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./inventory.component').then(m => m.InventoryComponent) },
  { path: 'create', loadComponent: () => import('./inventory-form/inventory-form.component').then(m => m.InventoryFormComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./inventory-form/inventory-form.component').then(m => m.InventoryFormComponent) },
  { path: ':uuid', loadComponent: () => import('./inventory-detail/inventory-detail.component').then(m => m.InventoryDetailComponent) },
];
