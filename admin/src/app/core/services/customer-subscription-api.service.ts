import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { CustomerSubscription } from '../models/customer-subscription/customer-subscription.model';

export interface PurchaseSubscriptionPayload {
  subscription_plan_id: number;
  start_date: string;
  address_uuid?: string;
  delivery_slot?: string;
  remarks?: string;
}

export interface PauseSubscriptionPayload {
  pause_start?: string;
  pause_end?: string;
  reason?: string;
}

export interface SkipMealPayload {
  skip_type?: string;
  skip_date?: string;
  reason?: string;
}

export interface UpgradeSubscriptionPayload {
  to_plan_id?: number;
  reason?: string;
}

export interface CancelSubscriptionPayload {
  reason?: string;
  remarks?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerSubscriptionApiService {
  private http = inject(HttpClient);
  private adminUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/customer-subscriptions`;
  private customerUrl = `${environment.apiUrl}/${environment.apiVersion}/customer`;

  // ── Customer-facing methods ─────────────────────────────────────────────

  getMySubscriptions(params?: Record<string, string | number | boolean>): Observable<PaginatedResponse<CustomerSubscription>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions`, { params: httpParams, withCredentials: true });
  }

  getMySubscription(uuid: string): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.get<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions/${uuid}`, { withCredentials: true });
  }

  purchaseSubscription(data: PurchaseSubscriptionPayload): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/subscriptions/purchase`, data, { withCredentials: true });
  }

  pauseSubscription(uuid: string, data: PauseSubscriptionPayload): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions/${uuid}/pause`, data, { withCredentials: true });
  }

  resumeSubscription(uuid: string): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions/${uuid}/resume`, {}, { withCredentials: true });
  }

  skipMeal(uuid: string, data: SkipMealPayload): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions/${uuid}/skip`, data, { withCredentials: true });
  }

  upgradeSubscription(uuid: string, data: UpgradeSubscriptionPayload): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions/${uuid}/upgrade`, data, { withCredentials: true });
  }

  renewSubscription(uuid: string): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions/${uuid}/renew`, {}, { withCredentials: true });
  }

  cancelSubscription(uuid: string, data: CancelSubscriptionPayload): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.customerUrl}/my-subscriptions/${uuid}/cancel`, data, { withCredentials: true });
  }

  getTimeline(uuid: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.customerUrl}/my-subscriptions/${uuid}/timeline`, { withCredentials: true });
  }

  // ── Admin methods ───────────────────────────────────────────────────────

  getSubscriptions(params?: Record<string, string | number | boolean>): Observable<PaginatedResponse<CustomerSubscription>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<CustomerSubscription>>(this.adminUrl, { params: httpParams, withCredentials: true });
  }

  getSubscription(uuid: string): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.get<ApiResponse<CustomerSubscription>>(`${this.adminUrl}/${uuid}`, { withCredentials: true });
  }

  createSubscription(data: any): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(this.adminUrl, data, { withCredentials: true });
  }

  updateSubscription(uuid: string, data: any): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.put<ApiResponse<CustomerSubscription>>(`${this.adminUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteSubscription(uuid: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.adminUrl}/${uuid}`, { withCredentials: true });
  }

  restoreSubscription(uuid: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.adminUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.adminUrl}/stats`, { withCredentials: true });
  }

  activateSubscription(uuid: string): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.adminUrl}/${uuid}/activate`, {}, { withCredentials: true });
  }

  suspendSubscription(uuid: string, reason?: string): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.adminUrl}/${uuid}/suspend`, { reason }, { withCredentials: true });
  }

  forceResumeSubscription(uuid: string, reason?: string): Observable<ApiResponse<CustomerSubscription>> {
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.adminUrl}/${uuid}/force-resume`, { reason }, { withCredentials: true });
  }

  approveUpgrade(historyId: number, approvedBy: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.adminUrl}/approve-upgrade/${historyId}`, { approved_by: approvedBy }, { withCredentials: true });
  }

  adjustMeals(uuid: string, additionalMeals: number | { adjustment: number }, reason?: string): Observable<ApiResponse<CustomerSubscription>> {
    const meals = typeof additionalMeals === 'number' ? additionalMeals : additionalMeals.adjustment;
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.adminUrl}/${uuid}/adjust-meals`, { additional_meals: meals, reason }, { withCredentials: true });
  }

  adjustWallet(uuid: string, amount: number | { adjustment: string | number }, reason?: string): Observable<ApiResponse<CustomerSubscription>> {
    const adj = typeof amount === 'number' ? amount : Number(amount.adjustment);
    return this.http.post<ApiResponse<CustomerSubscription>>(`${this.adminUrl}/${uuid}/adjust-wallet`, { amount: adj, reason }, { withCredentials: true });
  }

  getAdminTimeline(uuid: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.adminUrl}/${uuid}/timeline`, { withCredentials: true });
  }
}
