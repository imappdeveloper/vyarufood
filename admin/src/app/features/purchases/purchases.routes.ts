import { Routes } from '@angular/router';

export const PURCHASES_ROUTES: Routes = [
  {
    path: 'requests',
    loadChildren: () => import('./purchase-requests/purchase-requests.routes').then(m => m.PURCHASE_REQUEST_ROUTES),
  },
  {
    path: 'orders',
    loadChildren: () => import('./purchase-orders/purchase-orders.routes').then(m => m.PURCHASE_ORDER_ROUTES),
  },
  {
    path: 'goods-receipts',
    loadChildren: () => import('./goods-receipts/goods-receipts.routes').then(m => m.GOODS_RECEIPT_ROUTES),
  },
];
