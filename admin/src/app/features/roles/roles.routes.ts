import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./roles.component').then((m) => m.RolesComponent) },
  { path: 'create', loadComponent: () => import('./role-form/role-form.component').then(m => m.RoleFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./role-form/role-form.component').then(m => m.RoleFormComponent) },
];
