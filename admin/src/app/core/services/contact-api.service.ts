import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/customer`;

  submitForm(data: ContactFormData): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/contact`, data);
  }
}
