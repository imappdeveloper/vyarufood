import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { PurchaseRequest, PurchaseOrder, GoodsReceipt, Supplier } from '../models/purchase/purchase.model';

@Injectable({ providedIn: 'root' })
export class PurchaseApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/admin`;
  private purchaseRequestsUrl = `${this.baseUrl}/purchase-requests`;
  private purchaseOrdersUrl = `${this.baseUrl}/purchase-orders`;
  private goodsReceiptsUrl = `${this.baseUrl}/goods-receipts`;

  private buildParams(params?: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return httpParams;
  }

  getPurchaseRequests(params?: Record<string, string>): Observable<PaginatedResponse<PurchaseRequest>> {
    return this.http.get<PaginatedResponse<PurchaseRequest>>(this.purchaseRequestsUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getPurchaseRequestStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.purchaseRequestsUrl}/stats`, { withCredentials: true });
  }

  getPurchaseRequest(uuid: string): Observable<ApiResponse<PurchaseRequest>> {
    return this.http.get<ApiResponse<PurchaseRequest>>(`${this.purchaseRequestsUrl}/${uuid}`, { withCredentials: true });
  }

  createPurchaseRequest(data: any): Observable<ApiResponse<PurchaseRequest>> {
    return this.http.post<ApiResponse<PurchaseRequest>>(this.purchaseRequestsUrl, data, { withCredentials: true });
  }

  updatePurchaseRequest(uuid: string, data: any): Observable<ApiResponse<PurchaseRequest>> {
    return this.http.put<ApiResponse<PurchaseRequest>>(`${this.purchaseRequestsUrl}/${uuid}`, data, { withCredentials: true });
  }

  deletePurchaseRequest(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.purchaseRequestsUrl}/${uuid}`, { withCredentials: true });
  }

  approvePurchaseRequest(uuid: string, data?: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.purchaseRequestsUrl}/${uuid}/approve`, data || {}, { withCredentials: true });
  }

  rejectPurchaseRequest(uuid: string, data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.purchaseRequestsUrl}/${uuid}/reject`, data, { withCredentials: true });
  }

  cancelPurchaseRequest(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.purchaseRequestsUrl}/${uuid}/cancel`, {}, { withCredentials: true });
  }

  getPurchaseOrders(params?: Record<string, string>): Observable<PaginatedResponse<PurchaseOrder>> {
    return this.http.get<PaginatedResponse<PurchaseOrder>>(this.purchaseOrdersUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getPurchaseOrderStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.purchaseOrdersUrl}/stats`, { withCredentials: true });
  }

  getPurchaseOrder(uuid: string): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.get<ApiResponse<PurchaseOrder>>(`${this.purchaseOrdersUrl}/${uuid}`, { withCredentials: true });
  }

  createPurchaseOrder(data: any): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.post<ApiResponse<PurchaseOrder>>(this.purchaseOrdersUrl, data, { withCredentials: true });
  }

  updatePurchaseOrder(uuid: string, data: any): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.put<ApiResponse<PurchaseOrder>>(`${this.purchaseOrdersUrl}/${uuid}`, data, { withCredentials: true });
  }

  deletePurchaseOrder(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.purchaseOrdersUrl}/${uuid}`, { withCredentials: true });
  }

  approvePurchaseOrder(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.purchaseOrdersUrl}/${uuid}/approve`, {}, { withCredentials: true });
  }

  closePurchaseOrder(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.purchaseOrdersUrl}/${uuid}/close`, {}, { withCredentials: true });
  }

  cancelPurchaseOrder(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.purchaseOrdersUrl}/${uuid}/cancel`, {}, { withCredentials: true });
  }

  convertFromRequest(requestUuid: string, data: any): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.post<ApiResponse<PurchaseOrder>>(`${this.purchaseRequestsUrl}/${requestUuid}/convert-to-po`, data, { withCredentials: true });
  }

  getGoodsReceipts(params?: Record<string, string>): Observable<PaginatedResponse<GoodsReceipt>> {
    return this.http.get<PaginatedResponse<GoodsReceipt>>(this.goodsReceiptsUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getGoodsReceiptStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.goodsReceiptsUrl}/stats`, { withCredentials: true });
  }

  getGoodsReceipt(uuid: string): Observable<ApiResponse<GoodsReceipt>> {
    return this.http.get<ApiResponse<GoodsReceipt>>(`${this.goodsReceiptsUrl}/${uuid}`, { withCredentials: true });
  }

  createGoodsReceipt(data: any): Observable<ApiResponse<GoodsReceipt>> {
    return this.http.post<ApiResponse<GoodsReceipt>>(this.goodsReceiptsUrl, data, { withCredentials: true });
  }

  getSuppliers(params?: Record<string, string>): Observable<ApiResponse<Supplier[]>> {
    return this.http.get<ApiResponse<Supplier[]>>(`${this.baseUrl}/suppliers`, { params: this.buildParams(params), withCredentials: true });
  }
}
