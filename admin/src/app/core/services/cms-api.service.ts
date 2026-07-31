import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface CmsPageContent {
  page_code: string;
  page_title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  updated_at: string | null;
}

@Injectable({ providedIn: 'root' })
export class CmsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/customer`;

  getCmsPage(slug: string): Observable<ApiResponse<CmsPageContent>> {
    return this.http.get<ApiResponse<CmsPageContent>>(`${this.baseUrl}/cms/${slug}`);
  }
}
