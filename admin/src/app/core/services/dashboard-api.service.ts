import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/interfaces/api-response.interface';
import { DashboardSummary } from '../../core/models/dashboard/dashboard-summary.model';
import { ChartData, RevenueData, OrderAnalytics, CustomerAnalytics, InventoryAnalytics } from '../../core/models/dashboard/dashboard-charts.model';
import { SystemHealth, DashboardFilter } from '../../core/models/dashboard/dashboard-types.model';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/${environment.apiVersion}/admin/dashboard`;

  private buildParams(filter?: DashboardFilter): HttpParams {
    let params = new HttpParams();
    if (filter?.period) params = params.set('period', filter.period);
    if (filter?.start_date) params = params.set('start_date', filter.start_date);
    if (filter?.end_date) params = params.set('end_date', filter.end_date);
    return params;
  }

  getSummary(filter?: DashboardFilter): Observable<ApiResponse<DashboardSummary>> {
    return this.http.get<ApiResponse<DashboardSummary>>(`${this.base}/summary`, { params: this.buildParams(filter), withCredentials: true });
  }

  getRevenue(filter?: DashboardFilter): Observable<ApiResponse<RevenueData>> {
    return this.http.get<ApiResponse<RevenueData>>(`${this.base}/revenue`, { params: this.buildParams(filter), withCredentials: true });
  }

  getOrders(filter?: DashboardFilter): Observable<ApiResponse<OrderAnalytics>> {
    return this.http.get<ApiResponse<OrderAnalytics>>(`${this.base}/orders`, { params: this.buildParams(filter), withCredentials: true });
  }

  getCustomers(filter?: DashboardFilter): Observable<ApiResponse<CustomerAnalytics>> {
    return this.http.get<ApiResponse<CustomerAnalytics>>(`${this.base}/customers`, { params: this.buildParams(filter), withCredentials: true });
  }

  getInventory(filter?: DashboardFilter): Observable<ApiResponse<InventoryAnalytics>> {
    return this.http.get<ApiResponse<InventoryAnalytics>>(`${this.base}/inventory`, { params: this.buildParams(filter), withCredentials: true });
  }

  getCharts(filter?: DashboardFilter): Observable<ApiResponse<ChartData>> {
    return this.http.get<ApiResponse<ChartData>>(`${this.base}/charts`, { params: this.buildParams(filter), withCredentials: true });
  }

  getRecentOrders(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/recent-orders`, { withCredentials: true });
  }

  getRecentCustomers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/recent-customers`, { withCredentials: true });
  }

  getSystemHealth(): Observable<ApiResponse<SystemHealth>> {
    return this.http.get<ApiResponse<SystemHealth>>(`${this.base}/system-health`, { withCredentials: true });
  }

  exportSummary(filter?: DashboardFilter): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/export/summary`, { params: this.buildParams(filter), withCredentials: true });
  }

  exportRevenue(filter?: DashboardFilter): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/export/revenue`, { params: this.buildParams(filter), withCredentials: true });
  }
}
