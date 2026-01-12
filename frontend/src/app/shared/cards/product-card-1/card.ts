import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { InterfaceProduct } from '../../../interfaces/product/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styles: ``,
})
export class ComponentCard1Product {
  @Input() product: InterfaceProduct | null = null;

  constructor(private router: Router) {}

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  showDetailPage(): void {
    const productId = this.product?.id || 0;

    if (productId > 0) {
      this.router.navigate(['/productos/detalles/', productId]);
    }
  }
}
