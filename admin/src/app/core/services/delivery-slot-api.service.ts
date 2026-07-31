import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { DeliverySlot, CreateDeliverySlot, UpdateDeliverySlot } from '../models/master/delivery-slot.model';
import { PaginationParams } from '../interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class DeliverySlotApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/delivery-zones`;

  getAll(zoneUuid: string, params?: Record<string, string>): Observable<ApiResponse<DeliverySlot[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<DeliverySlot[]>>(`${this.baseUrl}/${zoneUuid}/slots`, { params: httpParams, withCredentials: true });
  }

  getPaginated(zoneUuid: string, params: PaginationParams): Observable<PaginatedResponse<DeliverySlot>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('per_page', params.per_page.toString());
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<DeliverySlot>>(`${this.baseUrl}/${zoneUuid}/slots`, { params: httpParams, withCredentials: true });
  }

  getById(zoneUuid: string, slotUuid: string): Observable<ApiResponse<DeliverySlot>> {
    return this.http.get<ApiResponse<DeliverySlot>>(`${this.baseUrl}/${zoneUuid}/slots/${slotUuid}`, { withCredentials: true });
  }

  create(zoneUuid: string, data: CreateDeliverySlot): Observable<ApiResponse<DeliverySlot>> {
    return this.http.post<ApiResponse<DeliverySlot>>(`${this.baseUrl}/${zoneUuid}/slots`, data, { withCredentials: true });
  }

  update(zoneUuid: string, slotUuid: string, data: UpdateDeliverySlot): Observable<ApiResponse<DeliverySlot>> {
    return this.http.put<ApiResponse<DeliverySlot>>(`${this.baseUrl}/${zoneUuid}/slots/${slotUuid}`, data, { withCredentials: true });
  }

  delete(zoneUuid: string, slotUuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${zoneUuid}/slots/${slotUuid}`, { withCredentials: true });
  }

  restore(zoneUuid: string, slotUuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/${zoneUuid}/slots/${slotUuid}/restore`, {}, { withCredentials: true });
  }

  forceDelete(zoneUuid: string, slotUuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${zoneUuid}/slots/${slotUuid}/force-delete`, { withCredentials: true });
  }

  getAvailableSlots(zoneUuid: string): Observable<ApiResponse<DeliverySlot[]>> {
    return this.http.get<ApiResponse<DeliverySlot[]>>(`${this.baseUrl}/${zoneUuid}/slots/available`, { withCredentials: true });
  }
}
