import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Books',
      icon: 'pi pi-book',
      routerLink: '/books'
    },
    {
      label: 'Members',
      icon: 'pi pi-users',
      routerLink: '/members'
    },
    {
      label: 'Transactions',
      icon: 'pi pi-sync',
      routerLink: '/transactions'
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      routerLink: '/reports'
    }
  ];

}
