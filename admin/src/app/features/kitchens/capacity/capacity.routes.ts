import { Routes } from '@angular/router';

export const CAPACITY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./capacity.component').then((m) => m.CapacityComponent) },
  { path: 'create', loadComponent: () => import('./capacity-form/capacity-form.component').then((m) => m.CapacityFormComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./capacity-form/capacity-form.component').then((m) => m.CapacityFormComponent) },
];
