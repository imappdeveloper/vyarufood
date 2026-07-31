import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Meal } from '../models/meal/meal.model';
import { MealCategory } from '../models/meal/meal-category.model';
import { MealType } from '../models/meal/meal-type.model';
import { MealQueryParams } from '../models/meal/meal-type.model';
import { SubscriptionPlan } from '../models/subscription-plan/subscription-plan.model';
import { WeeklyMenu } from '../models/weekly-menu/weekly-menu.model';

export interface WeeklyScheduleDay {
  day_of_week: string;
  day_of_week_label: string;
  is_working: boolean;
  opening_time: string | null;
  closing_time: string | null;
}

export interface UpcomingHoliday {
  holiday_name: string;
  holiday_type: string;
  holiday_type_label: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string | null;
}

export interface KitchenHolidayStatus {
  is_off_today: boolean;
  status: 'open' | 'weekly_off' | 'holiday';
  message: string;
  off_day_type: string | null;
  day_of_week: string;
  today_holiday: {
    holiday_name: string;
    holiday_type: string;
    holiday_type_label: string;
    start_date: string;
    end_date: string;
    reason: string | null;
  } | null;
  working_hours: {
    opening_time: string;
    closing_time: string;
  } | null;
  weekly_schedule: WeeklyScheduleDay[];
  upcoming_holidays: UpcomingHoliday[];
}

export interface HomeStats {
  total_meals: number;
  happy_customers: number;
  total_deliveries: number;
  average_rating: number;
  total_reviews: number;
}

export interface PincodeCheckResponse {
  deliverable: boolean;
  pincode_id?: number;
  pincode: string;
  message: string;
  zone_name?: string;
  estimated_delivery_time?: number;
  delivery_charge?: number;
  free_delivery_above?: number;
  minimum_order_amount?: number;
  city?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerBrowseApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer`;

  getCategories(): Observable<ApiResponse<MealCategory[]>> {
    return this.http.get<ApiResponse<MealCategory[]>>(`${this.apiUrl}/categories`, { withCredentials: true });
  }

  getCategoryBySlug(slug: string): Observable<ApiResponse<MealCategory>> {
    return this.http.get<ApiResponse<MealCategory>>(`${this.apiUrl}/categories/${slug}`, { withCredentials: true });
  }

  getMealTypes(): Observable<ApiResponse<MealType[]>> {
    return this.http.get<ApiResponse<MealType[]>>(`${this.apiUrl}/meal-types`, { withCredentials: true });
  }

  getMeals(params?: MealQueryParams): Observable<PaginatedResponse<Meal>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<Meal>>(`${this.apiUrl}/meals`, { params: httpParams, withCredentials: true });
  }

  getMealBySlug(slug: string): Observable<ApiResponse<Meal>> {
    return this.http.get<ApiResponse<Meal>>(`${this.apiUrl}/meals/${slug}`, { withCredentials: true });
  }

  getRelatedMeals(slug: string): Observable<ApiResponse<Meal[]>> {
    return this.http.get<ApiResponse<Meal[]>>(`${this.apiUrl}/meals/${slug}/related`, { withCredentials: true });
  }

  getSubscriptionPlans(params?: Record<string, string | number | boolean>): Observable<PaginatedResponse<SubscriptionPlan>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<SubscriptionPlan>>(`${this.apiUrl}/subscription-plans`, { params: httpParams, withCredentials: true });
  }

  getSubscriptionPlanBySlug(slug: string): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.get<ApiResponse<SubscriptionPlan>>(`${this.apiUrl}/subscription-plans/${slug}`, { withCredentials: true });
  }

  getCurrentWeekMenu(): Observable<ApiResponse<WeeklyMenu>> {
    return this.http.get<ApiResponse<WeeklyMenu>>(`${this.apiUrl}/weekly-menu/current`, { withCredentials: true });
  }

  getHomeReviews(perPage: number = 6): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/home/reviews`, {
      params: new HttpParams().set('per_page', String(perPage)),
      withCredentials: true,
    });
  }

  getHomeStats(): Observable<ApiResponse<HomeStats>> {
    return this.http.get<ApiResponse<HomeStats>>(`${this.apiUrl}/home/stats`, { withCredentials: true });
  }

  checkPincode(pincode: string): Observable<ApiResponse<PincodeCheckResponse>> {
    return this.http.get<ApiResponse<PincodeCheckResponse>>(`${this.apiUrl}/check-pincode/${pincode}`, { withCredentials: true });
  }

  requestService(data: { pincode: string; name?: string; email?: string; phone?: string; message?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/request-service`, data, { withCredentials: true });
  }

  getKitchenHolidayStatus(kitchenId?: number): Observable<ApiResponse<KitchenHolidayStatus>> {
    let params = new HttpParams();
    if (kitchenId) {
      params = params.set('kitchen_id', String(kitchenId));
    }
    return this.http.get<ApiResponse<KitchenHolidayStatus>>(`${this.apiUrl}/kitchen/holiday-status`, {
      params,
      withCredentials: true,
    });
  }
}
