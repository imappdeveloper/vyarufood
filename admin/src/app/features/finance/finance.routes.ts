import { Routes } from '@angular/router';

export const FINANCE_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./finance-dashboard/finance-dashboard.component').then(m => m.FinanceDashboardComponent) },
  { path: 'accounts', loadComponent: () => import('./chart-of-accounts/chart-of-accounts.component').then(m => m.ChartOfAccountsComponent) },
  { path: 'accounts/create', loadComponent: () => import('./chart-of-accounts/chart-of-account-form/chart-of-account-form.component').then(m => m.ChartOfAccountFormComponent) },
  { path: 'accounts/:uuid/edit', loadComponent: () => import('./chart-of-accounts/chart-of-account-form/chart-of-account-form.component').then(m => m.ChartOfAccountFormComponent) },
  { path: 'journals', loadComponent: () => import('./journal-entries/journal-entries.component').then(m => m.JournalEntriesComponent) },
  { path: 'journals/create', loadComponent: () => import('./journal-entries/journal-entry-form/journal-entry-form.component').then(m => m.JournalEntryFormComponent) },
  { path: 'journals/:uuid', loadComponent: () => import('./journal-entries/journal-entry-detail/journal-entry-detail.component').then(m => m.JournalEntryDetailComponent) },
  { path: 'financial-years', loadComponent: () => import('./financial-years/financial-years.component').then(m => m.FinancialYearsComponent) },
  { path: 'bank-accounts', loadComponent: () => import('./bank-accounts/bank-accounts.component').then(m => m.BankAccountsComponent) },
  { path: 'bank-accounts/create', loadComponent: () => import('./bank-accounts/bank-account-form/bank-account-form.component').then(m => m.BankAccountFormComponent) },
  { path: 'bank-accounts/:uuid/edit', loadComponent: () => import('./bank-accounts/bank-account-form/bank-account-form.component').then(m => m.BankAccountFormComponent) },
  { path: 'reports/trial-balance', loadComponent: () => import('./reports/trial-balance/trial-balance.component').then(m => m.TrialBalanceComponent) },
  { path: 'reports/profit-loss', loadComponent: () => import('./reports/profit-loss/profit-loss.component').then(m => m.ProfitLossComponent) },
  { path: 'reports/balance-sheet', loadComponent: () => import('./reports/balance-sheet/balance-sheet.component').then(m => m.BalanceSheetComponent) },
  { path: 'reports/cash-flow', loadComponent: () => import('./reports/cash-flow/cash-flow.component').then(m => m.CashFlowComponent) },
];
