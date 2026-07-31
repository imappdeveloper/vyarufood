import { Routes } from '@angular/router';

export const CITIES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./cities.component').then((m) => m.CitiesComponent) },
  { path: 'create', loadComponent: () => import('./city-form/city-form.component').then((m) => m.CityFormComponent) },
  { path: ':uuid', loadComponent: () => import('./city-detail/city-detail.component').then((m) => m.CityDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./city-form/city-form.component').then((m) => m.CityFormComponent) },
];
