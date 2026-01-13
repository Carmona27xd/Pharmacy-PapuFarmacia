import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { InterfaceProduct } from '../../../interfaces/product/product';
import { ServiceProduct } from '../../../services/product/product';
import { PRODUCT_TYPES } from '../../../interfaces/product/PRODUCT_TYPES';
import { InterfaceProductType } from '../../../interfaces/product/product-type';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './details-product.html',
})
export class PageDetailsProduct implements OnInit, OnDestroy {
  // Estado del componente
  currentProduct: InterfaceProduct | null = null;
  productTypes: InterfaceProductType[] = PRODUCT_TYPES;

  // Estados de carga y error
  isLoading: boolean = false;
  error: string | null = null;

  // Subject para gestionar unsubscribes
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ServiceProduct,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  ngOnDestroy(): void {
    // Limpia todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga el producto desde la ruta
   */
  private loadProduct(): void {
    const productIdParam = this.route.snapshot.paramMap.get('productId');

    // Validación del parámetro
    if (!productIdParam) {
      this.handleError('ID de producto no proporcionado');
      return;
    }

    const productId = Number(productIdParam);

    // Validación del número
    if (isNaN(productId) || productId <= 0) {
      this.handleError('ID de producto inválido');
      return;
    }

    this.fetchProduct(productId);
  }

  /**
   * Obtiene el producto del servicio
   */
  private fetchProduct(productId: number): void {
    this.isLoading = true;
    this.error = null;

    this.productService
      .getById(productId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Error al obtener el producto:', err);

          // Manejo de errores específicos
          if (err.status === 404) {
            this.error = 'Producto no encontrado';
          } else if (err.status === 0) {
            this.error = 'No se pudo conectar con el servidor';
          } else {
            this.error = 'Error al cargar el producto. Por favor, intenta de nuevo.';
          }

          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (product) => {
          if (product) {
            this.currentProduct = product;
          } else if (!this.error) {
            this.error = 'Producto no encontrado';
          }
        },
      });
  }

  /**
   * Obtiene el nombre del tipo de producto
   */
  getProductTypeName(): string {
    if (!this.currentProduct?.productTypeId) {
      return 'No especificado';
    }

    const productType = this.productTypes.find(
      (type) => type.id === this.currentProduct!.productTypeId
    );

    return productType?.name ?? 'Tipo desconocido';
  }

  /**
   * Maneja errores y puede redirigir
   */
  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
    console.error(message);

    // Opcional: redirigir después de un tiempo
    // setTimeout(() => {
    //   this.router.navigate(['/productos']);
    // }, 3000);
  }

  /**
   * Reintentar la carga del producto
   */
  retry(): void {
    this.loadProduct();
  }

  /**
   * Navegar de regreso a la lista
   */
  goBack(): void {
    this.router.navigate(['/productos']);
  }

  updateProduct(): void {
    const productIdParam = this.route.snapshot.paramMap.get('productId');
    this.router.navigate(['/productos/editar', productIdParam]);
  }
}
