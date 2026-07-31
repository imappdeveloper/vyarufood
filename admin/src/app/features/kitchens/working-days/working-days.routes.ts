import { Routes } from '@angular/router';

export const WORKING_DAYS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./working-days.component').then((m) => m.WorkingDaysComponent) },
  { path: 'create', loadComponent: () => import('./working-day-form/working-day-form.component').then((m) => m.WorkingDayFormComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./working-day-form/working-day-form.component').then((m) => m.WorkingDayFormComponent) },
];
