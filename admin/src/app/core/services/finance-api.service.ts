import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  ChartOfAccount, FinancialYear, JournalEntry, BankAccount,
  BankReconciliation, CustomerLedger, SupplierLedger, CashBookEntry,
  BankBookEntry, TrialBalance, ProfitAndLoss, BalanceSheet, CashFlow,
  FinanceDashboardStats
} from '../models/finance/finance.model';

@Injectable({ providedIn: 'root' })
export class FinanceApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/${environment.apiVersion}/admin/finance`;

  private buildParams(params: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }

  // Dashboard
  getDashboardStats(): Observable<ApiResponse<FinanceDashboardStats>> {
    return this.http.get<ApiResponse<FinanceDashboardStats>>(`${this.base}/dashboard-stats`, { withCredentials: true });
  }

  // Chart of Accounts
  getAccounts(params: Record<string, string> = {}): Observable<ApiResponse<ChartOfAccount[]>> {
    return this.http.get<ApiResponse<ChartOfAccount[]>>(`${this.base}/accounts`, { params: this.buildParams(params), withCredentials: true });
  }

  getAccount(uuid: string): Observable<ApiResponse<ChartOfAccount>> {
    return this.http.get<ApiResponse<ChartOfAccount>>(`${this.base}/accounts/${uuid}`, { withCredentials: true });
  }

  createAccount(data: any): Observable<ApiResponse<ChartOfAccount>> {
    return this.http.post<ApiResponse<ChartOfAccount>>(`${this.base}/accounts`, data, { withCredentials: true });
  }

  updateAccount(uuid: string, data: any): Observable<ApiResponse<ChartOfAccount>> {
    return this.http.put<ApiResponse<ChartOfAccount>>(`${this.base}/accounts/${uuid}`, data, { withCredentials: true });
  }

  deleteAccount(uuid: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/accounts/${uuid}`, { withCredentials: true });
  }

  // Financial Years
  getFinancialYears(params: Record<string, string> = {}): Observable<ApiResponse<FinancialYear[]>> {
    return this.http.get<ApiResponse<FinancialYear[]>>(`${this.base}/financial-years`, { params: this.buildParams(params), withCredentials: true });
  }

  getCurrentFinancialYear(): Observable<ApiResponse<FinancialYear>> {
    return this.http.get<ApiResponse<FinancialYear>>(`${this.base}/financial-years/current`, { withCredentials: true });
  }

  getFinancialYear(uuid: string): Observable<ApiResponse<FinancialYear>> {
    return this.http.get<ApiResponse<FinancialYear>>(`${this.base}/financial-years/${uuid}`, { withCredentials: true });
  }

  createFinancialYear(data: any): Observable<ApiResponse<FinancialYear>> {
    return this.http.post<ApiResponse<FinancialYear>>(`${this.base}/financial-years`, data, { withCredentials: true });
  }

  closeFinancialYear(uuid: string, data: any): Observable<ApiResponse<FinancialYear>> {
    return this.http.patch<ApiResponse<FinancialYear>>(`${this.base}/financial-years/${uuid}/close`, data, { withCredentials: true });
  }

  // Journal Entries
  getJournals(params: Record<string, string> = {}): Observable<ApiResponse<JournalEntry[]>> {
    return this.http.get<ApiResponse<JournalEntry[]>>(`${this.base}/journals`, { params: this.buildParams(params), withCredentials: true });
  }

  getJournal(uuid: string): Observable<ApiResponse<JournalEntry>> {
    return this.http.get<ApiResponse<JournalEntry>>(`${this.base}/journals/${uuid}`, { withCredentials: true });
  }

  createJournal(data: any): Observable<ApiResponse<JournalEntry>> {
    return this.http.post<ApiResponse<JournalEntry>>(`${this.base}/journals`, data, { withCredentials: true });
  }

  postJournal(uuid: string): Observable<ApiResponse<JournalEntry>> {
    return this.http.patch<ApiResponse<JournalEntry>>(`${this.base}/journals/${uuid}/post`, {}, { withCredentials: true });
  }

  reverseJournal(uuid: string, data: { reason: string }): Observable<ApiResponse<JournalEntry>> {
    return this.http.patch<ApiResponse<JournalEntry>>(`${this.base}/journals/${uuid}/reverse`, data, { withCredentials: true });
  }

  bulkPostJournals(ids: number[]): Observable<ApiResponse<number>> {
    return this.http.patch<ApiResponse<number>>(`${this.base}/journals/bulk-post`, { ids }, { withCredentials: true });
  }

  // Bank Accounts
  getBankAccounts(params: Record<string, string> = {}): Observable<ApiResponse<BankAccount[]>> {
    return this.http.get<ApiResponse<BankAccount[]>>(`${this.base}/bank-accounts`, { params: this.buildParams(params), withCredentials: true });
  }

  getBankAccount(uuid: string): Observable<ApiResponse<BankAccount>> {
    return this.http.get<ApiResponse<BankAccount>>(`${this.base}/bank-accounts/${uuid}`, { withCredentials: true });
  }

  createBankAccount(data: any): Observable<ApiResponse<BankAccount>> {
    return this.http.post<ApiResponse<BankAccount>>(`${this.base}/bank-accounts`, data, { withCredentials: true });
  }

  updateBankAccount(uuid: string, data: any): Observable<ApiResponse<BankAccount>> {
    return this.http.put<ApiResponse<BankAccount>>(`${this.base}/bank-accounts/${uuid}`, data, { withCredentials: true });
  }

  deleteBankAccount(uuid: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/bank-accounts/${uuid}`, { withCredentials: true });
  }

  // Reports
  getTrialBalance(financialYearId: number, asOfDate?: string): Observable<ApiResponse<TrialBalance>> {
    let params: Record<string, string> = { financial_year_id: String(financialYearId) };
    if (asOfDate) params['as_of_date'] = asOfDate;
    return this.http.get<ApiResponse<TrialBalance>>(`${this.base}/trial-balance`, { params: this.buildParams(params), withCredentials: true });
  }

  getProfitAndLoss(financialYearId: number, fromDate?: string, toDate?: string): Observable<ApiResponse<ProfitAndLoss>> {
    let params: Record<string, string> = { financial_year_id: String(financialYearId) };
    if (fromDate) params['from_date'] = fromDate;
    if (toDate) params['to_date'] = toDate;
    return this.http.get<ApiResponse<ProfitAndLoss>>(`${this.base}/profit-loss`, { params: this.buildParams(params), withCredentials: true });
  }

  getBalanceSheet(financialYearId: number, asOfDate?: string): Observable<ApiResponse<BalanceSheet>> {
    let params: Record<string, string> = { financial_year_id: String(financialYearId) };
    if (asOfDate) params['as_of_date'] = asOfDate;
    return this.http.get<ApiResponse<BalanceSheet>>(`${this.base}/balance-sheet`, { params: this.buildParams(params), withCredentials: true });
  }

  getCashFlow(financialYearId: number, fromDate?: string, toDate?: string): Observable<ApiResponse<CashFlow>> {
    let params: Record<string, string> = { financial_year_id: String(financialYearId) };
    if (fromDate) params['from_date'] = fromDate;
    if (toDate) params['to_date'] = toDate;
    return this.http.get<ApiResponse<CashFlow>>(`${this.base}/cash-flow`, { params: this.buildParams(params), withCredentials: true });
  }

  // Ledgers
  getCustomerLedger(customerUuid: string, params: Record<string, string> = {}): Observable<ApiResponse<CustomerLedger[]>> {
    return this.http.get<ApiResponse<CustomerLedger[]>>(`${this.base}/ledgers/customer/${customerUuid}`, { params: this.buildParams(params), withCredentials: true });
  }

  getSupplierLedger(supplierUuid: string, params: Record<string, string> = {}): Observable<ApiResponse<SupplierLedger[]>> {
    return this.http.get<ApiResponse<SupplierLedger[]>>(`${this.base}/ledgers/supplier/${supplierUuid}`, { params: this.buildParams(params), withCredentials: true });
  }

  getCashBook(params: Record<string, string> = {}): Observable<ApiResponse<CashBookEntry[]>> {
    return this.http.get<ApiResponse<CashBookEntry[]>>(`${this.base}/ledgers/cash-book`, { params: this.buildParams(params), withCredentials: true });
  }

  getBankBook(params: Record<string, string> = {}): Observable<ApiResponse<BankBookEntry[]>> {
    return this.http.get<ApiResponse<BankBookEntry[]>>(`${this.base}/ledgers/bank-book`, { params: this.buildParams(params), withCredentials: true });
  }
}
