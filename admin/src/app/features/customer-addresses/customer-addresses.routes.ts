import { Routes } from '@angular/router';

export const CUSTOMER_ADDRESSES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./customer-addresses.component').then((m) => m.CustomerAddressesComponent) },
  { path: 'create', loadComponent: () => import('./customer-address-form/customer-address-form.component').then((m) => m.CustomerAddressFormComponent) },
  { path: ':uuid', loadComponent: () => import('./customer-address-detail/customer-address-detail.component').then((m) => m.CustomerAddressDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./customer-address-form/customer-address-form.component').then((m) => m.CustomerAddressFormComponent) },
];
