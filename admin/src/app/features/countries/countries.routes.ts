import { Routes } from '@angular/router';

export const COUNTRIES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./countries.component').then((m) => m.CountriesComponent) },
  { path: 'create', loadComponent: () => import('./country-form/country-form.component').then((m) => m.CountryFormComponent) },
  { path: ':uuid', loadComponent: () => import('./country-detail/country-detail.component').then((m) => m.CountryDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./country-form/country-form.component').then((m) => m.CountryFormComponent) },
];
