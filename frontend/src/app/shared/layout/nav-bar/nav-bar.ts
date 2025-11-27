import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavigationEnd, RouterLink, Router } from '@angular/router';
import { ComponentSearchBox } from '../../inputs/search-box/search-box';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, ComponentSearchBox],
  templateUrl: './nav-bar.html',
})
export class ComponentNavBar {
  currentPath: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.urlAfterRedirects.split('/')[1];
      }
    });
  }

  getNavbarClass(): string {
    // TODO Show or not Show navbar
    /*return this.currentPath === 'login' || this.currentPath === 'register'
      ? 'bg-transparent'
      : 'bg-emerald-500';*/

    switch (this.currentPath) {
      case 'inicio':
        return 'bg-blue-500';
      case 'infantil':
        return 'bg-rose-300';
      case 'suplementos':
        return 'bg-red-600';
      case 'vitaminas-minerales':
        return 'bg-purple-700';
      case 'adultos-mayores':
        return 'bg-amber-600';
      default:
        return 'bg-blue-500';
    }
  }
}
