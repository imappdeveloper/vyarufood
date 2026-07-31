import { Routes } from '@angular/router';

export const KITCHENS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./kitchens.component').then((m) => m.KitchensComponent) },
  { path: 'create', loadComponent: () => import('./kitchen-form/kitchen-form.component').then((m) => m.KitchenFormComponent) },
  {
    path: 'working-days',
    loadChildren: () => import('./working-days/working-days.routes').then((m) => m.WORKING_DAYS_ROUTES),
  },
  {
    path: 'holidays',
    loadChildren: () => import('./holidays/holidays.routes').then((m) => m.HOLIDAYS_ROUTES),
  },
  {
    path: 'capacity',
    loadChildren: () => import('./capacity/capacity.routes').then((m) => m.CAPACITY_ROUTES),
  },
  {
    path: 'production-schedules',
    loadChildren: () => import('./production-schedules/production-schedules.routes').then((m) => m.PRODUCTION_SCHEDULES_ROUTES),
  },
  { path: ':uuid', loadComponent: () => import('./kitchen-detail/kitchen-detail.component').then((m) => m.KitchenDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./kitchen-form/kitchen-form.component').then((m) => m.KitchenFormComponent) },
];
