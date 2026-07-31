import { Routes } from '@angular/router';

export const DELIVERY_ZONES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./delivery-zones.component').then((m) => m.DeliveryZonesComponent) },
  { path: 'create', loadComponent: () => import('./delivery-zone-form/delivery-zone-form.component').then((m) => m.DeliveryZoneFormComponent) },
  { path: ':uuid', loadComponent: () => import('./delivery-zone-detail/delivery-zone-detail.component').then((m) => m.DeliveryZoneDetailComponent) },
  { path: ':uuid/edit', loadComponent: () => import('./delivery-zone-form/delivery-zone-form.component').then((m) => m.DeliveryZoneFormComponent) },
  { path: ':zoneUuid/slots', loadChildren: () => import('../delivery-slots/delivery-slots.routes').then((m) => m.DELIVERY_SLOTS_ROUTES) },
];
