import { Routes } from '@angular/router';

export const GOODS_RECEIPT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./goods-receipts.component').then(m => m.GoodsReceiptsComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./goods-receipt-form/goods-receipt-form.component').then(m => m.GoodsReceiptFormComponent),
  },
  {
    path: ':uuid',
    loadComponent: () => import('./goods-receipt-detail/goods-receipt-detail.component').then(m => m.GoodsReceiptDetailComponent),
  },
];
