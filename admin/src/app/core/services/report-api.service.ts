import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import {
  DashboardKPIs,
  ExecutiveReport,
  ReportResponse,
  SavedReport,
  ScheduledReport,
  ReportExport,
} from '../models/report/report.model';

@Injectable({ providedIn: 'root' })
export class ReportApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/${environment.apiVersion}`;
  private dashboardBase = `${this.base}/admin/dashboard`;
  private reportBase = `${this.base}/admin/reports`;

  private buildParams(params: Record<string, string | null | undefined>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }

  // Dashboard KPIs & Charts
  getDashboardKPIs(): Observable<ApiResponse<DashboardKPIs>> {
    return this.http.get<ApiResponse<DashboardKPIs>>(`${this.dashboardBase}/`, { withCredentials: true });
  }

  getSalesChart(params: Record<string, string | null> = {}): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.dashboardBase}/sales-chart`, { params: this.buildParams(params), withCredentials: true });
  }

  getOrderChart(params: Record<string, string | null> = {}): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.dashboardBase}/order-chart`, { params: this.buildParams(params), withCredentials: true });
  }

  getRevenueChart(params: Record<string, string | null> = {}): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.dashboardBase}/revenue-chart`, { params: this.buildParams(params), withCredentials: true });
  }

  getExpenseChart(params: Record<string, string | null> = {}): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.dashboardBase}/expense-chart`, { params: this.buildParams(params), withCredentials: true });
  }

  // Report Generation
  getExecutiveReport(params: Record<string, string | null> = {}): Observable<ApiResponse<ExecutiveReport>> {
    return this.http.get<ApiResponse<ExecutiveReport>>(`${this.reportBase}/executive`, { params: this.buildParams(params), withCredentials: true });
  }

  getReport(type: string, params: Record<string, string | null> = {}): Observable<ApiResponse<ReportResponse>> {
    return this.http.get<ApiResponse<ReportResponse>>(`${this.reportBase}/${type}`, { params: this.buildParams(params), withCredentials: true });
  }

  // Saved Reports
  getSavedReports(): Observable<ApiResponse<SavedReport[]>> {
    return this.http.get<ApiResponse<SavedReport[]>>(`${this.reportBase}/saved`, { withCredentials: true });
  }

  saveReport(data: { name: string; report_type: string; format: string; filters?: Record<string, any> }): Observable<ApiResponse<SavedReport>> {
    return this.http.post<ApiResponse<SavedReport>>(`${this.reportBase}/saved`, data, { withCredentials: true });
  }

  deleteSavedReport(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.reportBase}/saved/${id}`, { withCredentials: true });
  }

  // Scheduled Reports
  getScheduledReports(): Observable<ApiResponse<ScheduledReport[]>> {
    return this.http.get<ApiResponse<ScheduledReport[]>>(`${this.reportBase}/scheduled`, { withCredentials: true });
  }

  scheduleReport(data: any): Observable<ApiResponse<ScheduledReport>> {
    return this.http.post<ApiResponse<ScheduledReport>>(`${this.reportBase}/scheduled`, data, { withCredentials: true });
  }

  updateScheduledReport(id: number, data: any): Observable<ApiResponse<ScheduledReport>> {
    return this.http.put<ApiResponse<ScheduledReport>>(`${this.reportBase}/scheduled/${id}`, data, { withCredentials: true });
  }

  deleteScheduledReport(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.reportBase}/scheduled/${id}`, { withCredentials: true });
  }

  // Export
  exportReport(data: { report_type: string; format: string; filters?: Record<string, any> }): Observable<ApiResponse<ReportExport>> {
    return this.http.post<ApiResponse<ReportExport>>(`${this.reportBase}/export`, data, { withCredentials: true });
  }

  getExportHistory(): Observable<ApiResponse<ReportExport[]>> {
    return this.http.get<ApiResponse<ReportExport[]>>(`${this.reportBase}/export-history`, { withCredentials: true });
  }
}
