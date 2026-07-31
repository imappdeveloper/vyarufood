import { Routes } from '@angular/router';

export const RECIPES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./recipes.component').then(m => m.RecipesComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./recipe-form/recipe-form.component').then(m => m.RecipeFormComponent),
  },
  {
    path: ':uuid/edit',
    loadComponent: () => import('./recipe-form/recipe-form.component').then(m => m.RecipeFormComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent),
  },
];
