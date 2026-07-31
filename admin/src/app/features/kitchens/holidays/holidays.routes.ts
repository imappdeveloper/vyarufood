import { Routes } from '@angular/router';

export const HOLIDAYS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./holidays.component').then((m) => m.HolidaysComponent) },
  { path: 'create', loadComponent: () => import('./holiday-form/holiday-form.component').then((m) => m.HolidayFormComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./holiday-form/holiday-form.component').then((m) => m.HolidayFormComponent) },
];
