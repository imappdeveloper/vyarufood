import { Routes } from '@angular/router';

export const LOGIN_HISTORY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./login-history.component').then((m) => m.LoginHistoryComponent) },
];
