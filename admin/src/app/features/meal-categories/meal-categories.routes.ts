import { Routes } from '@angular/router';

export const MEAL_CATEGORIES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./meal-categories.component').then((m) => m.MealCategoriesComponent) },
  { path: 'create', loadComponent: () => import('./meal-category-form/meal-category-form.component').then((m) => m.MealCategoryFormComponent) },
  { path: ':uuid', loadComponent: () => import('./meal-category-detail/meal-category-detail.component').then((m) => m.MealCategoryDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./meal-category-form/meal-category-form.component').then((m) => m.MealCategoryFormComponent) },
];
