import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  MenuTemplate, MenuTemplateItem,
  CreateMenuTemplate, UpdateMenuTemplate,
} from '../models/monthly-menu/menu-template.model';

@Injectable({ providedIn: 'root' })
export class MenuTemplateApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/menu-templates`;

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

  getMenuTemplates(params?: Record<string, string>): Observable<ApiResponse<MenuTemplate[]>> {
    return this.http.get<ApiResponse<MenuTemplate[]>>(this.apiUrl, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getMenuTemplatePaginated(params: Record<string, string>): Observable<PaginatedResponse<MenuTemplate>> {
    return this.http.get<PaginatedResponse<MenuTemplate>>(this.apiUrl, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getMenuTemplate(uuid: string): Observable<ApiResponse<MenuTemplate>> {
    return this.http.get<ApiResponse<MenuTemplate>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  createMenuTemplate(data: CreateMenuTemplate): Observable<ApiResponse<MenuTemplate>> {
    return this.http.post<ApiResponse<MenuTemplate>>(this.apiUrl, data, { withCredentials: true });
  }

  updateMenuTemplate(uuid: string, data: UpdateMenuTemplate): Observable<ApiResponse<MenuTemplate>> {
    return this.http.put<ApiResponse<MenuTemplate>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteMenuTemplate(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  restoreMenuTemplate(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  duplicateMenuTemplate(uuid: string): Observable<ApiResponse<MenuTemplate>> {
    return this.http.post<ApiResponse<MenuTemplate>>(`${this.apiUrl}/${uuid}/duplicate`, {}, { withCredentials: true });
  }

  setDefault(uuid: string): Observable<ApiResponse<MenuTemplate>> {
    return this.http.patch<ApiResponse<MenuTemplate>>(`${this.apiUrl}/${uuid}/default`, {}, { withCredentials: true });
  }
}
