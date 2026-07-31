import { Routes } from '@angular/router';

export const NOTIFICATION_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/notification-dashboard/notification-dashboard.component').then(m => m.NotificationDashboardComponent) },
  { path: 'list', loadComponent: () => import('./components/notification-list/notification-list.component').then(m => m.NotificationListComponent) },
  { path: 'list/:uuid', loadComponent: () => import('./components/notification-detail/notification-detail.component').then(m => m.NotificationDetailComponent) },
  { path: 'templates', loadComponent: () => import('./components/notification-template-list/notification-template-list.component').then(m => m.NotificationTemplateListComponent) },
  { path: 'templates/create', loadComponent: () => import('./components/notification-template-form/notification-template-form.component').then(m => m.NotificationTemplateFormComponent) },
  { path: 'templates/:id/edit', loadComponent: () => import('./components/notification-template-form/notification-template-form.component').then(m => m.NotificationTemplateFormComponent) },
  { path: 'broadcast', loadComponent: () => import('./components/broadcast-form/broadcast-form.component').then(m => m.BroadcastFormComponent) },
  { path: 'logs', loadComponent: () => import('./components/notification-log-list/notification-log-list.component').then(m => m.NotificationLogListComponent) },
];
