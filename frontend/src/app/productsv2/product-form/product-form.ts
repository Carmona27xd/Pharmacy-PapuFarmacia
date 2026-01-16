import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Importamos NgForm para la validación
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../interfaces/productv2/product';
import { ProductService } from '../../services/productv2/product';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.html',
  //styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  // Modelo inicial del producto (Limpio)
  product: Product = {
    SKU: '',
    comercial_name: '',
    active_ingredient: '',
    description: '',
    category: '',
    price: 0,
    stock: 0
  };

  isEditMode: boolean = false;
  isLoading: boolean = false;

  // Lista de categorías para el Combo Box
  categories: string[] = [
    'Analgesico',
    'Antibiotico',
    'Antiinflamatorio',
    'Antihistaminico',
    'Antipiretico',
    'Suplemento',
    'Material de Curacion'
  ];

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef // Inyectamos el detector de cambios
  ) {}

  ngOnInit(): void {
    // 1. Verificamos si la URL tiene un SKU (Ej: /products/edit/TEM-500)
    const skuFromUrl = this.route.snapshot.paramMap.get('sku');

    if (skuFromUrl) {
      this.isEditMode = true;
      this.loadProduct(skuFromUrl);
    }
  }

  // Carga los datos cuando estamos en modo EDICIÓN
  loadProduct(sku: string) {
    this.isLoading = true;
    
    this.productService.getProductBySku(sku).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
        
        // ¡IMPORTANTE! Forzamos la actualización de la vista para llenar los inputs
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        alert('No se pudo cargar la información del producto.');
        this.router.navigate(['/productsv2/list']);
      }
    });
  }

  // Función que se ejecuta al enviar el formulario
  onSubmit(form: NgForm) {
    
    // 1. VALIDACIÓN: Si faltan campos obligatorios
    if (form.invalid) {
      alert('Por favor completa la información requerida (Campos marcados con *).');
      
      // Marcamos los controles como "tocados" para activar estilos visuales de error si los tuvieras
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return; // Detenemos la ejecución aquí
    }

    // 2. Si el formulario es válido, procedemos
    this.isLoading = true;

    if (this.isEditMode) {
      // --- ACTUALIZAR PRODUCTO ---
      this.productService.updateProduct(this.product.SKU, this.product).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.router.navigate(['/productsv2/list']);
        },
        error: (err) => {
          console.error(err);
          alert('Ocurrió un error al actualizar el producto.');
          this.isLoading = false;
        }
      });

    } else {
      // --- CREAR NUEVO PRODUCTO ---
      this.productService.createProduct(this.product).subscribe({
        next: () => {
          alert('Producto registrado exitosamente');
          this.router.navigate(['/productsv2/list']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al registrar. Verifica que el SKU no esté duplicado.');
          this.isLoading = false;
        }
      });
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }
}