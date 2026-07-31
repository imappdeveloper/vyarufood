import { Routes } from '@angular/router';

export const DELIVERY_SLOTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./delivery-slots.component').then((m) => m.DeliverySlotsComponent) },
  { path: 'create', loadComponent: () => import('./delivery-slot-form/delivery-slot-form.component').then((m) => m.DeliverySlotFormComponent) },
  { path: ':slotUuid', loadComponent: () => import('./delivery-slot-detail/delivery-slot-detail.component').then((m) => m.DeliverySlotDetailComponent) },
  { path: ':slotUuid/edit', loadComponent: () => import('./delivery-slot-form/delivery-slot-form.component').then((m) => m.DeliverySlotFormComponent) },
];
