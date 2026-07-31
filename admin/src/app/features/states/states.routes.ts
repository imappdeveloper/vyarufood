import { Routes } from '@angular/router';

export const STATES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./states.component').then((m) => m.StatesComponent) },
  { path: 'create', loadComponent: () => import('./state-form/state-form.component').then((m) => m.StateFormComponent) },
  { path: ':uuid', loadComponent: () => import('./state-detail/state-detail.component').then((m) => m.StateDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./state-form/state-form.component').then((m) => m.StateFormComponent) },
];
