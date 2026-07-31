import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer/reviews`;

  getMyReviews(params?: Record<string, string | number>): Observable<PaginatedResponse<any>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, String(params[key]));
      });
    }
    return this.http.get<PaginatedResponse<any>>(this.apiUrl, { params: httpParams });
  }

  createReview(data: { meal_id: number; order_id: number; rating: number; comment?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, data);
  }

  updateReview(uuid: string, data: { rating: number; comment?: string }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${uuid}`, data);
  }

  deleteReview(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`);
  }
}
