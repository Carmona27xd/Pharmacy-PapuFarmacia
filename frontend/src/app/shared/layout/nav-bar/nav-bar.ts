import { Component, HostListener } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { NavigationEnd, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { ComponentSearchBox } from '../../inputs/search-box/search-box';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule, ComponentSearchBox, RouterLinkActive],
  templateUrl: './nav-bar.html',
})
export class ComponentNavBar {
  currentPath: string = '';
  isMobileMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.urlAfterRedirects.split('/')[1];
        this.isMobileMenuOpen = false;
        this.isUserMenuOpen = false;
      }
    });
  }

  // Cierra los menús al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isUserMenuOpen = false;
    }
  }

  getNavbarClass(): string {
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

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    // Aquí implementa tu lógica de cierre de sesión
    console.log('Cerrando sesión...');
    this.closeUserMenu();
    this.router.navigate(['/login']);
  }
}
