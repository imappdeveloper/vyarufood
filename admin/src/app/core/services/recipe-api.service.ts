import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Recipe, RecipeVersion, InventoryConsumptionLog, Unit, InventoryItem } from '../models/recipe/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/recipes`;

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

  getRecipes(params?: Record<string, string>): Observable<PaginatedResponse<Recipe>> {
    return this.http.get<PaginatedResponse<Recipe>>(this.apiUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  getRecipe(uuid: string): Observable<ApiResponse<Recipe>> {
    return this.http.get<ApiResponse<Recipe>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  createRecipe(data: any): Observable<ApiResponse<Recipe>> {
    return this.http.post<ApiResponse<Recipe>>(this.apiUrl, data, { withCredentials: true });
  }

  updateRecipe(uuid: string, data: any): Observable<ApiResponse<Recipe>> {
    return this.http.put<ApiResponse<Recipe>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteRecipe(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  restoreRecipe(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  cloneRecipe(uuid: string): Observable<ApiResponse<Recipe>> {
    return this.http.post<ApiResponse<Recipe>>(`${this.apiUrl}/${uuid}/clone`, {}, { withCredentials: true });
  }

  getVersions(uuid: string): Observable<ApiResponse<RecipeVersion[]>> {
    return this.http.get<ApiResponse<RecipeVersion[]>>(`${this.apiUrl}/${uuid}/versions`, { withCredentials: true });
  }

  getConsumptionLogs(params?: Record<string, string>): Observable<PaginatedResponse<InventoryConsumptionLog>> {
    return this.http.get<PaginatedResponse<InventoryConsumptionLog>>(`${this.apiUrl}/consumption-logs`, { params: this.buildParams(params), withCredentials: true });
  }

  getFoodCostReport(params?: Record<string, string>): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/food-cost-report`, { params: this.buildParams(params), withCredentials: true });
  }

  getUnits(): Observable<ApiResponse<Unit[]>> {
    return this.http.get<ApiResponse<Unit[]>>(`${environment.apiUrl}/${environment.apiVersion}/admin/units`, { withCredentials: true });
  }

  getInventoryItems(): Observable<ApiResponse<InventoryItem[]>> {
    return this.http.get<ApiResponse<InventoryItem[]>>(`${environment.apiUrl}/${environment.apiVersion}/admin/inventory-items`, { withCredentials: true });
  }
}
