import { Routes } from '@angular/router';

export const MONTHLY_MENUS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./monthly-menus.component').then((m) => m.MonthlyMenusComponent) },
  { path: 'create', loadComponent: () => import('./monthly-menu-form/monthly-menu-form.component').then((m) => m.MonthlyMenuFormComponent) },
  { path: ':uuid', loadComponent: () => import('./monthly-menu-detail/monthly-menu-detail.component').then((m) => m.MonthlyMenuDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./monthly-menu-form/monthly-menu-form.component').then((m) => m.MonthlyMenuFormComponent) },
];
