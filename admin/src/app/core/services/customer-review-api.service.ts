import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  Review,
  ReviewListParams,
  ReviewEligibility,
  ReviewEligibilityByOrder,
} from '../models/review/review.model';

@Injectable({ providedIn: 'root' })
export class CustomerReviewApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer`;

  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  getMealReviews(mealSlug: string, params: ReviewListParams = {}): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/customer/meals/${mealSlug}/reviews`, {
      params: this.buildParams(params),
      withCredentials: true,
    });
  }

  getMyReviews(params: ReviewListParams = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews`, {
      params: this.buildParams(params),
      withCredentials: true,
    });
  }

  getReviewEligibility(orderUuid: string): Observable<ApiResponse<ReviewEligibilityByOrder>> {
    return this.http.get<ApiResponse<ReviewEligibilityByOrder>>(
      `${this.apiUrl}/orders/${orderUuid}/review-eligibility`,
      { withCredentials: true }
    );
  }

  getEligibilityByMeal(mealSlug: string): Observable<ApiResponse<ReviewEligibility>> {
    return this.http.get<ApiResponse<ReviewEligibility>>(
      `${this.apiUrl}/meals/${mealSlug}/review-eligibility`,
      { withCredentials: true }
    );
  }

  createReview(formData: FormData): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${this.apiUrl}/reviews`, formData, {
      reportProgress: false,
      withCredentials: true,
    });
  }

  updateReview(uuid: string, formData: FormData): Observable<ApiResponse<Review>> {
    return this.http.put<ApiResponse<Review>>(`${this.apiUrl}/reviews/${uuid}`, formData, {
      reportProgress: false,
      withCredentials: true,
    });
  }

  deleteReview(uuid: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/reviews/${uuid}`, { withCredentials: true });
  }
}
