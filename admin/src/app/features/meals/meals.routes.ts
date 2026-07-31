import { Routes } from '@angular/router';

export const MEALS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./meals.component').then((m) => m.MealsComponent) },
  { path: 'create', loadComponent: () => import('./meal-form/meal-form.component').then((m) => m.MealFormComponent) },
  { path: ':uuid', loadComponent: () => import('./meal-detail/meal-detail.component').then((m) => m.MealDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./meal-form/meal-form.component').then((m) => m.MealFormComponent) },
];
