import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServiceProduct } from '../../../services/product/product';
import { ComponentCard1Product } from '../../../shared/cards/product-card-1/card';
import { ProductList } from '../../../interfaces/product/products';

@Component({
  selector: 'page-search-for',
  standalone: true,
  imports: [CommonModule, ComponentCard1Product],
  templateUrl: './search-for.html',
})
export class PageSearchForProducts implements OnInit {
  searchQuery: string = '';
  products: ProductList = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ServiceProduct,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Escucha cambios en el parámetro de ruta
    this.route.params.subscribe((params) => {
      this.searchQuery = params['query'];
      if (this.searchQuery) {
        this.searchProducts();
      }
    });
  }

  searchProducts(): void {
    this.loading = true;
    this.error = '';
    this.products = [];

    // Llama al servicio con parámetros por defecto para precio
    this.productService.getByQuery(this.searchQuery, 0, 999999).subscribe({
      next: (response: ProductList) => {
        if (Array.isArray(response)) {
          this.products = response;
        } else if (response && typeof response === 'object' && Array.isArray(response)) {
          this.products = response;
        } else if (response != null && Array.isArray(response)) {
          this.products = response;
        } else {
          this.products = [];
        }

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al buscar productos';
        console.error('Error:', err);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
