import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  InventoryItem,
  InventoryBatch,
  InventoryTransaction,
  InventoryAdjustment,
  StockAudit,
} from '../models/inventory/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/inventory`;

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

  // Inventory Items
  getItems(params?: Record<string, string>): Observable<PaginatedResponse<InventoryItem>> {
    return this.http.get<PaginatedResponse<InventoryItem>>(this.baseUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats`, { withCredentials: true });
  }

  getDashboardStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard-stats`, { withCredentials: true });
  }

  getLowStockItems(): Observable<ApiResponse<InventoryItem[]>> {
    return this.http.get<ApiResponse<InventoryItem[]>>(`${this.baseUrl}/low-stock`, { withCredentials: true });
  }

  getExpiringItems(days: number = 30): Observable<ApiResponse<InventoryBatch[]>> {
    return this.http.get<ApiResponse<InventoryBatch[]>>(`${this.baseUrl}/expiring`, { params: { days: days.toString() }, withCredentials: true });
  }

  getItem(uuid: string): Observable<ApiResponse<InventoryItem>> {
    return this.http.get<ApiResponse<InventoryItem>>(`${this.baseUrl}/${uuid}`, { withCredentials: true });
  }

  createItem(data: any): Observable<ApiResponse<InventoryItem>> {
    return this.http.post<ApiResponse<InventoryItem>>(this.baseUrl, data, { withCredentials: true });
  }

  updateItem(uuid: string, data: any): Observable<ApiResponse<InventoryItem>> {
    return this.http.put<ApiResponse<InventoryItem>>(`${this.baseUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteItem(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${uuid}`, { withCredentials: true });
  }

  // Batches
  getBatches(params?: Record<string, string>): Observable<PaginatedResponse<InventoryBatch>> {
    return this.http.get<PaginatedResponse<InventoryBatch>>(`${this.baseUrl}/batches/all`, { params: this.buildParams(params), withCredentials: true });
  }

  getBatch(uuid: string): Observable<ApiResponse<InventoryBatch>> {
    return this.http.get<ApiResponse<InventoryBatch>>(`${this.baseUrl}/batches/${uuid}`, { withCredentials: true });
  }

  createBatch(data: any): Observable<ApiResponse<InventoryBatch>> {
    return this.http.post<ApiResponse<InventoryBatch>>(`${this.baseUrl}/batches`, data, { withCredentials: true });
  }

  deleteBatch(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/batches/${uuid}`, { withCredentials: true });
  }

  // Transactions
  getTransactions(params?: Record<string, string>): Observable<PaginatedResponse<InventoryTransaction>> {
    return this.http.get<PaginatedResponse<InventoryTransaction>>(`${this.baseUrl}/transactions`, { params: this.buildParams(params), withCredentials: true });
  }

  getLedger(params: Record<string, string>): Observable<PaginatedResponse<InventoryTransaction>> {
    return this.http.get<PaginatedResponse<InventoryTransaction>>(`${this.baseUrl}/ledger`, { params: this.buildParams(params), withCredentials: true });
  }

  // Adjustments
  getAdjustments(params?: Record<string, string>): Observable<PaginatedResponse<InventoryAdjustment>> {
    return this.http.get<PaginatedResponse<InventoryAdjustment>>(`${this.baseUrl}/adjustments`, { params: this.buildParams(params), withCredentials: true });
  }

  createAdjustment(data: any): Observable<ApiResponse<InventoryAdjustment>> {
    return this.http.post<ApiResponse<InventoryAdjustment>>(`${this.baseUrl}/adjustments`, data, { withCredentials: true });
  }

  approveAdjustment(uuid: string): Observable<ApiResponse<InventoryAdjustment>> {
    return this.http.patch<ApiResponse<InventoryAdjustment>>(`${this.baseUrl}/adjustments/${uuid}/approve`, {}, { withCredentials: true });
  }

  // Audits
  getAudits(params?: Record<string, string>): Observable<PaginatedResponse<StockAudit>> {
    return this.http.get<PaginatedResponse<StockAudit>>(`${this.baseUrl}/audits`, { params: this.buildParams(params), withCredentials: true });
  }

  createAudit(data: any): Observable<ApiResponse<StockAudit>> {
    return this.http.post<ApiResponse<StockAudit>>(`${this.baseUrl}/audits`, data, { withCredentials: true });
  }

  approveAudit(uuid: string, data: any): Observable<ApiResponse<StockAudit>> {
    return this.http.patch<ApiResponse<StockAudit>>(`${this.baseUrl}/audits/${uuid}/approve`, data, { withCredentials: true });
  }

  rejectAudit(uuid: string): Observable<ApiResponse<StockAudit>> {
    return this.http.patch<ApiResponse<StockAudit>>(`${this.baseUrl}/audits/${uuid}/reject`, {}, { withCredentials: true });
  }
}
