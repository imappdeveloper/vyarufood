import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  Supplier,
  SupplierProduct,
  SupplierDocument,
  SupplierContact,
  SupplierPriceHistory,
} from '../models/supplier/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/suppliers`;

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

  // Supplier CRUD
  getSuppliers(params?: Record<string, string>): Observable<PaginatedResponse<Supplier>> {
    return this.http.get<PaginatedResponse<Supplier>>(this.baseUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getSupplierStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats`, { withCredentials: true });
  }

  getSupplierDashboardStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard-stats`, { withCredentials: true });
  }

  getSupplier(uuid: string): Observable<ApiResponse<Supplier>> {
    return this.http.get<ApiResponse<Supplier>>(`${this.baseUrl}/${uuid}`, { withCredentials: true });
  }

  createSupplier(data: any): Observable<ApiResponse<Supplier>> {
    return this.http.post<ApiResponse<Supplier>>(this.baseUrl, data, { withCredentials: true });
  }

  updateSupplier(uuid: string, data: any): Observable<ApiResponse<Supplier>> {
    return this.http.put<ApiResponse<Supplier>>(`${this.baseUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteSupplier(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${uuid}`, { withCredentials: true });
  }

  changeSupplierStatus(uuid: string, data: { status: string; remarks?: string }): Observable<ApiResponse<Supplier>> {
    return this.http.post<ApiResponse<Supplier>>(`${this.baseUrl}/${uuid}/change-status`, data, { withCredentials: true });
  }

  blacklistSupplier(uuid: string, data: { remarks?: string }): Observable<ApiResponse<Supplier>> {
    return this.http.post<ApiResponse<Supplier>>(`${this.baseUrl}/${uuid}/blacklist`, data, { withCredentials: true });
  }

  restoreSupplier(uuid: string): Observable<ApiResponse<Supplier>> {
    return this.http.post<ApiResponse<Supplier>>(`${this.baseUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  // Products
  getSupplierProducts(uuid: string, params?: Record<string, string>): Observable<PaginatedResponse<SupplierProduct>> {
    return this.http.get<PaginatedResponse<SupplierProduct>>(`${this.baseUrl}/${uuid}/products`, { params: this.buildParams(params), withCredentials: true });
  }

  createSupplierProduct(uuid: string, data: any): Observable<ApiResponse<SupplierProduct>> {
    return this.http.post<ApiResponse<SupplierProduct>>(`${this.baseUrl}/${uuid}/products`, data, { withCredentials: true });
  }

  updateSupplierProduct(productUuid: string, data: any): Observable<ApiResponse<SupplierProduct>> {
    return this.http.put<ApiResponse<SupplierProduct>>(`${this.baseUrl}/products/${productUuid}`, data, { withCredentials: true });
  }

  deleteSupplierProduct(productUuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/products/${productUuid}`, { withCredentials: true });
  }

  // Documents
  getSupplierDocuments(uuid: string): Observable<ApiResponse<SupplierDocument[]>> {
    return this.http.get<ApiResponse<SupplierDocument[]>>(`${this.baseUrl}/${uuid}/documents`, { withCredentials: true });
  }

  createSupplierDocument(uuid: string, data: any): Observable<ApiResponse<SupplierDocument>> {
    return this.http.post<ApiResponse<SupplierDocument>>(`${this.baseUrl}/${uuid}/documents`, data, { withCredentials: true });
  }

  deleteSupplierDocument(documentUuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/documents/${documentUuid}`, { withCredentials: true });
  }

  // Contacts
  getSupplierContacts(uuid: string): Observable<ApiResponse<SupplierContact[]>> {
    return this.http.get<ApiResponse<SupplierContact[]>>(`${this.baseUrl}/${uuid}/contacts`, { withCredentials: true });
  }

  createSupplierContact(uuid: string, data: any): Observable<ApiResponse<SupplierContact>> {
    return this.http.post<ApiResponse<SupplierContact>>(`${this.baseUrl}/${uuid}/contacts`, data, { withCredentials: true });
  }

  updateSupplierContact(contactUuid: string, data: any): Observable<ApiResponse<SupplierContact>> {
    return this.http.put<ApiResponse<SupplierContact>>(`${this.baseUrl}/contacts/${contactUuid}`, data, { withCredentials: true });
  }

  deleteSupplierContact(contactUuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/contacts/${contactUuid}`, { withCredentials: true });
  }

  // Price History
  getSupplierPriceHistory(uuid: string): Observable<ApiResponse<SupplierPriceHistory[]>> {
    return this.http.get<ApiResponse<SupplierPriceHistory[]>>(`${this.baseUrl}/${uuid}/price-history`, { withCredentials: true });
  }
}
