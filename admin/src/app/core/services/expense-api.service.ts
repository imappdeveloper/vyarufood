import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Expense, ExpenseCategory } from '../models/expense/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/expenses`;

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

  // Categories
  getCategories(params?: Record<string, string>): Observable<PaginatedResponse<ExpenseCategory>> {
    return this.http.get<PaginatedResponse<ExpenseCategory>>(`${this.baseUrl}/categories`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getActiveCategories(): Observable<ApiResponse<ExpenseCategory[]>> {
    return this.http.get<ApiResponse<ExpenseCategory[]>>(`${this.baseUrl}/categories/active`, {
      withCredentials: true,
    });
  }

  getCategory(uuid: string): Observable<ApiResponse<ExpenseCategory>> {
    return this.http.get<ApiResponse<ExpenseCategory>>(`${this.baseUrl}/categories/${uuid}`, {
      withCredentials: true,
    });
  }

  createCategory(data: any): Observable<ApiResponse<ExpenseCategory>> {
    return this.http.post<ApiResponse<ExpenseCategory>>(`${this.baseUrl}/categories`, data, {
      withCredentials: true,
    });
  }

  updateCategory(uuid: string, data: any): Observable<ApiResponse<ExpenseCategory>> {
    return this.http.put<ApiResponse<ExpenseCategory>>(`${this.baseUrl}/categories/${uuid}`, data, {
      withCredentials: true,
    });
  }

  deleteCategory(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/categories/${uuid}`, {
      withCredentials: true,
    });
  }

  // Expenses
  getExpenses(params?: Record<string, string>): Observable<PaginatedResponse<Expense>> {
    return this.http.get<PaginatedResponse<Expense>>(this.baseUrl, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats`, { withCredentials: true });
  }

  getDashboardStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard-stats`, { withCredentials: true });
  }

  getExpense(uuid: string): Observable<ApiResponse<Expense>> {
    return this.http.get<ApiResponse<Expense>>(`${this.baseUrl}/${uuid}`, { withCredentials: true });
  }

  createExpense(data: any): Observable<ApiResponse<Expense>> {
    return this.http.post<ApiResponse<Expense>>(this.baseUrl, data, { withCredentials: true });
  }

  updateExpense(uuid: string, data: any): Observable<ApiResponse<Expense>> {
    return this.http.put<ApiResponse<Expense>>(`${this.baseUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteExpense(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${uuid}`, { withCredentials: true });
  }

  approveExpense(uuid: string, data?: any): Observable<ApiResponse<Expense>> {
    return this.http.patch<ApiResponse<Expense>>(`${this.baseUrl}/${uuid}/approve`, data || {}, {
      withCredentials: true,
    });
  }

  rejectExpense(uuid: string, data?: any): Observable<ApiResponse<Expense>> {
    return this.http.patch<ApiResponse<Expense>>(`${this.baseUrl}/${uuid}/reject`, data || {}, {
      withCredentials: true,
    });
  }

  markPaid(uuid: string): Observable<ApiResponse<Expense>> {
    return this.http.patch<ApiResponse<Expense>>(`${this.baseUrl}/${uuid}/mark-paid`, {}, {
      withCredentials: true,
    });
  }

  getPendingApprovals(): Observable<ApiResponse<Expense[]>> {
    return this.http.get<ApiResponse<Expense[]>>(`${this.baseUrl}/pending-approvals`, {
      withCredentials: true,
    });
  }

  getMonthlySummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/monthly-summary`, { withCredentials: true });
  }

  getCategorySummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/category-summary`, { withCredentials: true });
  }
}
