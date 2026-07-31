import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Role, CreateRole, UpdateRole } from '../models/auth/role.model';
import { PaginationParams } from '../interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/roles`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<Role[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<Role[]>>(`${this.apiUrl}/all`, { params: httpParams });
  }

  getPaginated(params: PaginationParams): Observable<PaginatedResponse<Role>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('per_page', params.per_page.toString());
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);
    return this.http.get<PaginatedResponse<Role>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateRole): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(this.apiUrl, data);
  }

  update(id: number, data: UpdateRole): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  clone(id: number, name: string): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/${id}/clone`, { name });
  }

  assignPermissions(id: number, permissionIds: number[]): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/${id}/permissions`, { permission_ids: permissionIds });
  }

  removePermissions(id: number, permissionIds: number[]): Observable<ApiResponse<Role>> {
    return this.http.delete<ApiResponse<Role>>(`${this.apiUrl}/${id}/permissions`, { body: { permission_ids: permissionIds } });
  }
}
