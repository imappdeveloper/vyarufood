import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Permission, PermissionGroup } from '../models/auth/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/permissions`;

  getAll(): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(this.apiUrl);
  }

  getGrouped(): Observable<ApiResponse<PermissionGroup[]>> {
    return this.http.get<ApiResponse<PermissionGroup[]>>(`${this.apiUrl}/grouped`);
  }
}
