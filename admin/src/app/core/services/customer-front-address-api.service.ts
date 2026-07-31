import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CustomerAddress, CreateCustomerAddress, UpdateCustomerAddress } from '../models/customer/customer-address.model';

@Injectable({ providedIn: 'root' })
export class CustomerFrontAddressApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer/addresses`;

  getAddresses(): Observable<ApiResponse<CustomerAddress[]>> {
    return this.http.get<ApiResponse<CustomerAddress[]>>(this.apiUrl, { withCredentials: true });
  }

  getAddress(uuid: string): Observable<ApiResponse<CustomerAddress>> {
    return this.http.get<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  createAddress(data: CreateCustomerAddress): Observable<ApiResponse<CustomerAddress>> {
    return this.http.post<ApiResponse<CustomerAddress>>(this.apiUrl, data, { withCredentials: true });
  }

  updateAddress(uuid: string, data: UpdateCustomerAddress): Observable<ApiResponse<CustomerAddress>> {
    return this.http.put<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteAddress(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  setDefault(uuid: string): Observable<ApiResponse<CustomerAddress>> {
    return this.http.patch<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}/default`, {}, { withCredentials: true });
  }

  getCountries(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/${environment.apiVersion}/customer/location/countries`, { withCredentials: true });
  }

  getStates(countryUuid: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/${environment.apiVersion}/customer/location/states/${countryUuid}`, { withCredentials: true });
  }

  getCities(stateUuid: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/${environment.apiVersion}/customer/location/cities/${stateUuid}`, { withCredentials: true });
  }

  getAreas(cityUuid: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/${environment.apiVersion}/customer/location/areas/${cityUuid}`, { withCredentials: true });
  }

  getPincodes(cityUuid: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/${environment.apiVersion}/customer/location/pincodes/${cityUuid}`, { withCredentials: true });
  }

  checkDelivery(data: { area_id?: number; pincode_id?: number; latitude?: number; longitude?: number }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/${environment.apiVersion}/check-service-area`, data, { withCredentials: true });
  }
}
