import { Routes } from '@angular/router';

export const MEAL_TYPES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./meal-types.component').then((m) => m.MealTypesComponent) },
  { path: 'create', loadComponent: () => import('./meal-type-form/meal-type-form.component').then((m) => m.MealTypeFormComponent) },
  { path: ':uuid', loadComponent: () => import('./meal-type-detail/meal-type-detail.component').then((m) => m.MealTypeDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./meal-type-form/meal-type-form.component').then((m) => m.MealTypeFormComponent) },
];
