import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './features/dashboard/components/dashboard/dashboard.component'
      ).then((m) => m.DashboardComponent),
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./features/book/book.component').then((m) => m.BookComponent),
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./features/member/member.component').then(
        (m) => m.MemberComponent
      ),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transaction/transaction.component').then(
        (m) => m.TransactionComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/report/report.component').then(
        (m) => m.ReportComponent
      ),
  },
];
