import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  WeeklyMenu, WeeklyMenuItem, CustomerMealSelection, WeeklyMenuStats, SelectionSummary,
  CreateWeeklyMenu, UpdateWeeklyMenu, CreateWeeklyMenuItem, UpdateWeeklyMenuItem, CreateCustomerMealSelection,
} from '../models/weekly-menu/weekly-menu.model';

@Injectable({ providedIn: 'root' })
export class WeeklyMenuApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin`;

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

  getWeeklyMenus(params?: Record<string, string>): Observable<ApiResponse<WeeklyMenu[]>> {
    return this.http.get<ApiResponse<WeeklyMenu[]>>(`${this.apiUrl}/weekly-menus`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getWeeklyMenuPaginated(params: Record<string, string>): Observable<PaginatedResponse<WeeklyMenu>> {
    return this.http.get<PaginatedResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  createWeeklyMenu(data: CreateWeeklyMenu): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.post<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus`, data, { withCredentials: true });
  }

  getWeeklyMenuStats(): Observable<ApiResponse<WeeklyMenuStats>> {
    return this.http.get<ApiResponse<WeeklyMenuStats>>(`${this.apiUrl}/weekly-menus/stats`, { withCredentials: true });
  }

  getUpcomingMenus(): Observable<ApiResponse<WeeklyMenu[]>> {
    return this.http.get<ApiResponse<WeeklyMenu[]>>(`${this.apiUrl}/weekly-menus/upcoming`, { withCredentials: true });
  }

  getPublishedMenus(): Observable<ApiResponse<WeeklyMenu[]>> {
    return this.http.get<ApiResponse<WeeklyMenu[]>>(`${this.apiUrl}/weekly-menus/published`, { withCredentials: true });
  }

  getMenusByWeek(params: Record<string, string>): Observable<ApiResponse<WeeklyMenu[]>> {
    return this.http.get<ApiResponse<WeeklyMenu[]>>(`${this.apiUrl}/weekly-menus/by-week`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  copyPreviousWeek(data: { from_week_start: string; to_week_start: string }): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.post<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus/copy-previous`, data, { withCredentials: true });
  }

  autoGenerate(data: { week_start: string; week_end: string }): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.post<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus/auto-generate`, data, { withCredentials: true });
  }

  getWeeklyMenu(uuid: string): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.get<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus/${uuid}`, { withCredentials: true });
  }

  updateWeeklyMenu(uuid: string, data: UpdateWeeklyMenu): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.put<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus/${uuid}`, data, { withCredentials: true });
  }

  deleteWeeklyMenu(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/weekly-menus/${uuid}`, { withCredentials: true });
  }

  restoreWeeklyMenu(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/weekly-menus/${uuid}/restore`, {}, { withCredentials: true });
  }

  publishWeeklyMenu(uuid: string): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.post<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus/${uuid}/publish`, {}, { withCredentials: true });
  }

  unpublishWeeklyMenu(uuid: string): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.post<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menus/${uuid}/unpublish`, {}, { withCredentials: true });
  }

  getWeeklyMenuItems(params?: Record<string, string>): Observable<ApiResponse<WeeklyMenuItem[]>> {
    return this.http.get<ApiResponse<WeeklyMenuItem[]>>(`${this.apiUrl}/weekly-menu-items`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  createWeeklyMenuItem(data: CreateWeeklyMenuItem): Observable<ApiResponse<WeeklyMenuItem>> {
    return this.http.post<ApiResponse<WeeklyMenuItem>>(`${this.apiUrl}/weekly-menu-items`, data, { withCredentials: true });
  }

  getItemsByDate(params: Record<string, string>): Observable<ApiResponse<WeeklyMenuItem[]>> {
    return this.http.get<ApiResponse<WeeklyMenuItem[]>>(`${this.apiUrl}/weekly-menu-items/by-date`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getDefaultItems(): Observable<ApiResponse<WeeklyMenuItem[]>> {
    return this.http.get<ApiResponse<WeeklyMenuItem[]>>(`${this.apiUrl}/weekly-menu-items/defaults`, { withCredentials: true });
  }

  bulkCreateItems(data: { items: CreateWeeklyMenuItem[] }): Observable<ApiResponse<WeeklyMenuItem[]>> {
    return this.http.post<ApiResponse<WeeklyMenuItem[]>>(`${this.apiUrl}/weekly-menu-items/bulk`, data, { withCredentials: true });
  }

  reorderItems(data: { item_ids: number[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/weekly-menu-items/reorder`, data, { withCredentials: true });
  }

  assignDefaults(data: { menu_id: number; date: string }): Observable<ApiResponse<WeeklyMenuItem[]>> {
    return this.http.post<ApiResponse<WeeklyMenuItem[]>>(`${this.apiUrl}/weekly-menu-items/assign-defaults`, data, { withCredentials: true });
  }

  getWeeklyMenuItem(uuid: string): Observable<ApiResponse<WeeklyMenuItem>> {
    return this.http.get<ApiResponse<WeeklyMenuItem>>(`${this.apiUrl}/weekly-menu-items/${uuid}`, { withCredentials: true });
  }

  updateWeeklyMenuItem(uuid: string, data: UpdateWeeklyMenuItem): Observable<ApiResponse<WeeklyMenuItem>> {
    return this.http.put<ApiResponse<WeeklyMenuItem>>(`${this.apiUrl}/weekly-menu-items/${uuid}`, data, { withCredentials: true });
  }

  deleteWeeklyMenuItem(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/weekly-menu-items/${uuid}`, { withCredentials: true });
  }

  getCustomerSelections(params?: Record<string, string>): Observable<ApiResponse<CustomerMealSelection[]>> {
    return this.http.get<ApiResponse<CustomerMealSelection[]>>(`${this.apiUrl}/customer-meal-selections`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  createCustomerSelection(data: CreateCustomerMealSelection): Observable<ApiResponse<CustomerMealSelection>> {
    return this.http.post<ApiResponse<CustomerMealSelection>>(`${this.apiUrl}/customer-meal-selections`, data, { withCredentials: true });
  }

  getSelectionSummary(params: Record<string, string>): Observable<ApiResponse<SelectionSummary>> {
    return this.http.get<ApiResponse<SelectionSummary>>(`${this.apiUrl}/customer-meal-selections/summary`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getSelectionsByDate(params: Record<string, string>): Observable<ApiResponse<CustomerMealSelection[]>> {
    return this.http.get<ApiResponse<CustomerMealSelection[]>>(`${this.apiUrl}/customer-meal-selections/by-date`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getCustomerSelectionsList(params: Record<string, string>): Observable<ApiResponse<CustomerMealSelection[]>> {
    return this.http.get<ApiResponse<CustomerMealSelection[]>>(`${this.apiUrl}/customer-meal-selections/customer`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  canSelect(data: { customer_id: number; weekly_menu_item_id: number }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/customer-meal-selections/can-select`, data, { withCredentials: true });
  }

  skipSelection(data: { customer_id: number; menu_item_id: number; menu_date: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/customer-meal-selections/skip`, data, { withCredentials: true });
  }

  bulkApplyDefaults(data: { menu_id: number }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/customer-meal-selections/bulk-defaults`, data, { withCredentials: true });
  }

  getCustomerSelection(uuid: string): Observable<ApiResponse<CustomerMealSelection>> {
    return this.http.get<ApiResponse<CustomerMealSelection>>(`${this.apiUrl}/customer-meal-selections/${uuid}`, { withCredentials: true });
  }

  updateCustomerSelection(uuid: string, data: Partial<CreateCustomerMealSelection>): Observable<ApiResponse<CustomerMealSelection>> {
    return this.http.put<ApiResponse<CustomerMealSelection>>(`${this.apiUrl}/customer-meal-selections/${uuid}`, data, { withCredentials: true });
  }

  deleteCustomerSelection(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/customer-meal-selections/${uuid}`, { withCredentials: true });
  }
}
