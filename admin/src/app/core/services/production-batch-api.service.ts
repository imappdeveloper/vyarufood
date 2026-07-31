import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { ProductionBatch } from '../models/production-batch/production-batch.model';

@Injectable({ providedIn: 'root' })
export class ProductionBatchApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/production-batches`;

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

  getBatches(params?: Record<string, string>): Observable<PaginatedResponse<ProductionBatch>> {
    return this.http.get<PaginatedResponse<ProductionBatch>>(this.apiUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  getProductionSummary(date: string, kitchenId?: number): Observable<ApiResponse<any>> {
    let params: Record<string, string> = { date };
    if (kitchenId) params['kitchen_id'] = kitchenId.toString();
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/summary`, { params, withCredentials: true });
  }

  getBatch(uuid: string): Observable<ApiResponse<ProductionBatch>> {
    return this.http.get<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  createBatch(data: any): Observable<ApiResponse<ProductionBatch>> {
    return this.http.post<ApiResponse<ProductionBatch>>(this.apiUrl, data, { withCredentials: true });
  }

  updateBatch(uuid: string, data: any): Observable<ApiResponse<ProductionBatch>> {
    return this.http.put<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteBatch(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  restoreBatch(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  startBatch(uuid: string): Observable<ApiResponse<ProductionBatch>> {
    return this.http.patch<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}/start`, {}, { withCredentials: true });
  }

  pauseBatch(uuid: string): Observable<ApiResponse<ProductionBatch>> {
    return this.http.patch<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}/pause`, {}, { withCredentials: true });
  }

  completeBatch(uuid: string): Observable<ApiResponse<ProductionBatch>> {
    return this.http.patch<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}/complete`, {}, { withCredentials: true });
  }

  cancelBatch(uuid: string, reason?: string): Observable<ApiResponse<ProductionBatch>> {
    return this.http.post<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}/cancel`, { reason }, { withCredentials: true });
  }

  updateItems(uuid: string, items: any[]): Observable<ApiResponse<ProductionBatch>> {
    return this.http.put<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}/items`, { items }, { withCredentials: true });
  }

  updateWastage(uuid: string, itemId: number, data: any): Observable<ApiResponse<ProductionBatch>> {
    return this.http.put<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}/items/${itemId}/wastage`, data, { withCredentials: true });
  }

  generateFromOrders(data: any): Observable<ApiResponse<ProductionBatch>> {
    return this.http.post<ApiResponse<ProductionBatch>>(`${this.apiUrl}/generate-from-orders`, data, { withCredentials: true });
  }

  getPackingList(uuid: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${uuid}/packing-list`, { withCredentials: true });
  }

  packMeal(uuid: string, packingId: number): Observable<ApiResponse<ProductionBatch>> {
    return this.http.post<ApiResponse<ProductionBatch>>(`${this.apiUrl}/${uuid}/pack/${packingId}`, {}, { withCredentials: true });
  }

  getTimeline(uuid: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${uuid}/timeline`, { withCredentials: true });
  }

  bulkStart(batchIds: number[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-start`, { batch_ids: batchIds }, { withCredentials: true });
  }

  bulkComplete(batchIds: number[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-complete`, { batch_ids: batchIds }, { withCredentials: true });
  }
}
