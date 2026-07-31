import { Routes } from '@angular/router';

export const PRODUCTION_BATCH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./production-batches.component').then(m => m.ProductionBatchesComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./production-batch-form/production-batch-form.component').then(m => m.ProductionBatchFormComponent),
  },
  {
    path: ':uuid/edit',
    loadComponent: () => import('./production-batch-form/production-batch-form.component').then(m => m.ProductionBatchFormComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./production-batch-detail/production-batch-detail.component').then(m => m.ProductionBatchDetailComponent),
  },
];
