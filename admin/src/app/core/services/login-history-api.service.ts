import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../interfaces/api-response.interface';
import { LoginHistory } from '../models/auth/login-history.model';
import { PaginationParams } from '../interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class LoginHistoryApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/login-history`;

  getPaginated(params: PaginationParams): Observable<PaginatedResponse<LoginHistory>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('per_page', params.per_page.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<LoginHistory>>(this.apiUrl, { params: httpParams });
  }
}
