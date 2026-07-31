import { Routes } from '@angular/router';

export const WEEKLY_MENUS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./weekly-menus.component').then((m) => m.WeeklyMenusComponent) },
  { path: 'create', loadComponent: () => import('./weekly-menu-form/weekly-menu-form.component').then((m) => m.WeeklyMenuFormComponent) },
  { path: 'selections', loadComponent: () => import('./customer-selection-report/customer-selection-report.component').then((m) => m.CustomerSelectionReportComponent) },
  { path: ':uuid', loadComponent: () => import('./weekly-menu-detail/weekly-menu-detail.component').then((m) => m.WeeklyMenuDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./weekly-menu-form/weekly-menu-form.component').then((m) => m.WeeklyMenuFormComponent) },
];
