import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { InterfaceProduct } from '../../../interfaces/product/product';
import { ServiceProduct } from '../../../services/product/product';
import { PRODUCT_TYPES } from '../../../interfaces/product/PRODUCT_TYPES';
import { InterfaceProductType } from '../../../interfaces/product/product-type';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import { InterfacePutProduct } from '../../../interfaces/product/put-product';
import { ComponentInputField, SelectOption } from '../../../shared/inputs/input-field/input-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [NgClass, ComponentInputField, ReactiveFormsModule],
  templateUrl: './edit-product.html',
})
export class PageEditProduct implements OnInit, OnDestroy {
  // FormGroup para manejar todos los inputs
  productForm!: FormGroup;

  // Estado del componente
  currentProduct: InterfaceProduct | null = null;
  productTypes: InterfaceProductType[] = PRODUCT_TYPES;
  productTypeOptions: SelectOption[] = [];

  // Estados de carga y error
  isLoading: boolean = false;
  isSaving: boolean = false;
  error: string | null = null;

  // Subject para gestionar unsubscribes
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ServiceProduct,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializar FormGroup
    this.productForm = this.createForm();

    // Crear opciones para el select
    this.productTypeOptions = PRODUCT_TYPES.map((type) => ({
      value: type.id,
      label: type.name,
    }));
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Crea el FormGroup con validaciones
   */
  private createForm(): FormGroup {
    return this.fb.group({
      productTypeId: ['', Validators.required],
      chemicalName: [''],
      comercialName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      batch: ['', Validators.required],
      outdate: ['', Validators.required],
      provider: [''],
      pharmaceutical: [''],
      image: [''],
    });
  }

  /**
   * Carga el producto desde la ruta
   */
  private loadProduct(): void {
    const productIdParam = this.route.snapshot.paramMap.get('productId');

    if (!productIdParam) {
      this.handleError('ID de producto no proporcionado');
      return;
    }

    const productId = Number(productIdParam);

    if (isNaN(productId) || productId <= 0) {
      this.handleError('ID de producto inválido');
      return;
    }

    this.fetchProduct(productId);
  }

  /**
   * Obtiene el producto del servicio y carga los datos al formulario
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

            // ✅ CARGAR DATOS AL FORMULARIO
            this.productForm.patchValue({
              Id: productId,
              productTypeId: product.productTypeId,
              chemicalName: product.chemicalName || '',
              comercialName: product.comercialName,
              description: product.description,
              price: product.price,
              stock: product.stock,
              batch: product.batch,
              outdate: product.outdate,
              provider: product.provider || '',
              pharmaceutical: product.pharmaceutical || '',
              image: product.image || '',
            });
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
    const typeId =
      this.productForm.get('productTypeId')?.value || this.currentProduct?.productTypeId;

    if (!typeId) {
      return 'No especificado';
    }

    const productType = this.productTypes.find((type) => type.id === typeId);
    return productType?.name ?? 'Tipo desconocido';
  }

  /**
   * Verifica si debe mostrar el campo de nombre químico
   */
  shouldShowChemicalName(): boolean {
    const typeId = this.productForm.get('productTypeId')?.value;
    return typeId === 1 || typeId === 3;
  }

  /**
   * Guarda los cambios
   */
  onSave(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.currentProduct?.id) {
      // ✅ Usar productId
      alert('No se puede actualizar el producto');
      return;
    }

    this.isSaving = true;
    const formData: InterfacePutProduct = this.productForm.value;

    this.productService
      .put(formData, this.currentProduct.id) // ✅ CORRECTO
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.productForm.markAsPristine(); // ✅ Marcar como limpio
          this.router.navigate(['/productos/detalles', this.currentProduct!.id]);
        },
        error: (err: any) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar el producto');
        },
      });
  }

  /**
   * Descarta los cambios
   */
  onDiscard(): void {
    if (confirm('¿Descartar todos los cambios?')) {
      if (this.currentProduct) {
        this.productForm.patchValue({
          productTypeId: this.currentProduct.productTypeId,
          chemicalName: this.currentProduct.chemicalName || '',
          comercialName: this.currentProduct.comercialName,
          description: this.currentProduct.description,
          price: this.currentProduct.price,
          stock: this.currentProduct.stock,
          batch: this.currentProduct.batch,
          outdate: this.currentProduct.outdate,
          provider: this.currentProduct.provider || '',
          pharmaceutical: this.currentProduct.pharmaceutical || '',
          image: this.currentProduct.image || '',
        });
        this.productForm.markAsPristine(); // ✅ Agregar esto
      }
    }
  }

  /**
   * Elimina el producto
   */
  onDelete(): void {
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }

    if (!this.currentProduct?.id) {
      // ✅ Usar productId
      return;
    }

    this.productService
      .delete(this.currentProduct.id) // ✅ CORRECTO
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.router.navigate(['/productos/buscar']);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el producto');
        },
      });
  }

  /**
   * Maneja errores
   */
  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
    console.error(message);
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
    if (this.productForm.dirty) {
      if (confirm('Hay cambios sin guardar. ¿Deseas salir?')) {
        this.router.navigate(['/productos/detalles', this.currentProduct!.id]);
      }
    } else {
      this.router.navigate(['/productos/detalles', this.currentProduct!.id]);
    }
  }
}
