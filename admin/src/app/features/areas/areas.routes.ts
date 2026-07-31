import { Routes } from '@angular/router';

export const AREAS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./areas.component').then((m) => m.AreasComponent) },
  { path: 'create', loadComponent: () => import('./area-form/area-form.component').then((m) => m.AreaFormComponent) },
  { path: ':uuid', loadComponent: () => import('./area-detail/area-detail.component').then((m) => m.AreaDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./area-form/area-form.component').then((m) => m.AreaFormComponent) },
];
