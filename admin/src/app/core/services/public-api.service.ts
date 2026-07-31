import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface CompanyInfo {
  company_name: string;
  address: string;
  phone: string;
  email: string;
  office_hours: { day: string; time: string; open: boolean }[];
}

export interface MaintenanceStatus {
  maintenance_mode: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  getCompanyInfo(): Observable<ApiResponse<CompanyInfo>> {
    return this.http.get<ApiResponse<CompanyInfo>>(`${this.apiUrl}/customer/company-info`);
  }

  getMaintenanceStatus(): Observable<ApiResponse<MaintenanceStatus>> {
    return this.http.get<ApiResponse<MaintenanceStatus>>(`${this.apiUrl}/maintenance-status`);
  }
}
