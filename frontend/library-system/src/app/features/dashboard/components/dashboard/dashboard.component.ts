import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DashboardItem } from '../../models/dashboard.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  dashboardItems: DashboardItem[] = [
    {
      title: 'Books',
      description: 'Manage your book inventory',
      icon: 'pi pi-book',
      color: 'bg-blue-500',
      route: '/books',
    },
    {
      title: 'Members',
      description: 'Manage library members',
      icon: 'pi pi-users',
      color: 'bg-green-500',
      route: '/members',
    },
    {
      title: 'Transactions',
      description: 'Manage book issues and returns',
      icon: 'pi pi-sync',
      color: 'bg-purple-500',
      route: '/transactions',
    },
    {
      title: 'Reports',
      description: 'View library reports',
      icon: 'pi pi-chart-bar',
      color: 'bg-amber-500',
      route: '/reports',
    },
  ];

  router = inject(Router)

  navigateTo(route: string) {
    console.log("tputer", route);
    this.router.navigate([route])
    
  }
}
