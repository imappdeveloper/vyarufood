import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/settings-dashboard/settings-dashboard.component').then((m) => m.SettingsDashboardComponent),
  },
  {
    path: 'general',
    loadComponent: () => import('./components/system-settings/system-settings.component').then((m) => m.SystemSettingsComponent),
  },
  {
    path: 'company',
    loadComponent: () => import('./components/company-profile/company-profile.component').then((m) => m.CompanyProfileComponent),
  },
  {
    path: 'branding',
    loadComponent: () => import('./components/branding-manager/branding-manager.component').then((m) => m.BrandingManagerComponent),
  },
  {
    path: 'seo',
    loadComponent: () => import('./components/seo-manager/seo-manager.component').then((m) => m.SeoManagerComponent),
  },
  {
    path: 'payments',
    loadComponent: () => import('./components/payment-settings/payment-settings.component').then((m) => m.PaymentSettingsComponent),
  },
  {
    path: 'notifications-config',
    loadComponent: () => import('./components/notification-config/notification-config.component').then((m) => m.NotificationConfigComponent),
  },
  {
    path: 'cms',
    loadComponent: () => import('./components/cms-page-list/cms-page-list.component').then((m) => m.CmsPageListComponent),
  },
  {
    path: 'cms/:uuid/edit',
    loadComponent: () => import('./components/cms-page-form/cms-page-form.component').then((m) => m.CmsPageFormComponent),
  },
  {
    path: 'versions',
    loadComponent: () => import('./components/app-version-list/app-version-list.component').then((m) => m.AppVersionListComponent),
  },
  {
    path: 'versions/create',
    loadComponent: () => import('./components/app-version-form/app-version-form.component').then((m) => m.AppVersionFormComponent),
  },
  {
    path: 'versions/edit/:uuid',
    loadComponent: () => import('./components/app-version-form/app-version-form.component').then((m) => m.AppVersionFormComponent),
  },
  {
    path: 'backups',
    loadComponent: () => import('./components/backup-manager/backup-manager.component').then((m) => m.BackupManagerComponent),
  },
  {
    path: 'maintenance',
    loadComponent: () => import('./components/maintenance-dashboard/maintenance-dashboard.component').then((m) => m.MaintenanceDashboardComponent),
  },
];
