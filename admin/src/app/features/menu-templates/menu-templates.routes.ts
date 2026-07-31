import { Routes } from '@angular/router';

export const MENU_TEMPLATES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./menu-templates.component').then((m) => m.MenuTemplatesComponent) },
  { path: 'create', loadComponent: () => import('./menu-template-form/menu-template-form.component').then((m) => m.MenuTemplateFormComponent) },
  { path: ':uuid', loadComponent: () => import('./menu-template-detail/menu-template-detail.component').then((m) => m.MenuTemplateDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./menu-template-form/menu-template-form.component').then((m) => m.MenuTemplateFormComponent) },
];
