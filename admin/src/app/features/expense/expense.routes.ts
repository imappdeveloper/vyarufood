import { Routes } from '@angular/router';

export const EXPENSE_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./expense.component').then(m => m.ExpenseComponent) },
  { path: 'create', loadComponent: () => import('./expense-form/expense-form.component').then(m => m.ExpenseFormComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./expense-form/expense-form.component').then(m => m.ExpenseFormComponent) },
  { path: ':uuid', loadComponent: () => import('./expense-detail/expense-detail.component').then(m => m.ExpenseDetailComponent) },
  { path: 'categories/create', loadComponent: () => import('./expense-category-form/expense-category-form.component').then(m => m.ExpenseCategoryFormComponent) },
  { path: 'categories/:uuid/edit', loadComponent: () => import('./expense-category-form/expense-category-form.component').then(m => m.ExpenseCategoryFormComponent) },
];
