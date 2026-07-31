import { Routes } from '@angular/router';

export const PINCODES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pincodes.component').then((m) => m.PincodesComponent) },
  { path: 'create', loadComponent: () => import('./pincode-form/pincode-form.component').then((m) => m.PincodeFormComponent) },
  { path: ':uuid', loadComponent: () => import('./pincode-detail/pincode-detail.component').then((m) => m.PincodeDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./pincode-form/pincode-form.component').then((m) => m.PincodeFormComponent) },
];
