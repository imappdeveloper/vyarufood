import { Routes } from '@angular/router';

export const PRODUCTION_SCHEDULES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./production-schedules.component').then((m) => m.ProductionSchedulesComponent) },
  { path: 'create', loadComponent: () => import('./production-schedule-form/production-schedule-form.component').then((m) => m.ProductionScheduleFormComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./production-schedule-form/production-schedule-form.component').then((m) => m.ProductionScheduleFormComponent) },
];
