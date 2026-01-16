import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, CurrencyPipe
import { RouterLink } from '@angular/router';   // Para navegar a Crear/Editar
import { FormsModule } from '@angular/forms';   // <--- VITAL para los inputs
import { Product } from '../../interfaces/productv2/product';
import { ProductService } from '../../services/productv2/product';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], 
  templateUrl: './product-list.html',
  //styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  
  // Variables de estado
  products: Product[] = [];
  isLoading: boolean = false;
  hasSearched: boolean = false; // Para controlar si ya se intentó buscar

  // Variables para los filtros
  searchName: string = '';
  searchIngredient: string = '';
  selectedCategory: string = '';

  // Lista de categorías para el Combo Box (puedes agregar más)
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
    private cd: ChangeDetectorRef
  ) {}

  // Función principal de búsqueda
  onSearch(): void {
    this.isLoading = true;
    this.hasSearched = true;
    this.products = []; // Limpiamos la tabla antes de buscar

    // Lógica de Prioridad: 
    // 1. Si hay nombre, busca por nombre.
    // 2. Si no, si hay ingrediente, busca por ingrediente.
    // 3. Si no, si hay categoría, busca por categoría.
    
    if (this.searchName.trim()) {
      this.productService.searchByName(this.searchName).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
    } else if (this.searchIngredient.trim()) {
      this.productService.searchByIngredient(this.searchIngredient).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
    } else if (this.selectedCategory) {
      this.productService.searchByCategory(this.selectedCategory).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
    } else {
      // Si el usuario le dio click sin escribir nada
      this.isLoading = false;
      alert('Por favor escribe un nombre, ingrediente o selecciona una categoría.');
    }
  }

  handleSuccess(data: Product[]) {
    this.products = data;
    this.isLoading = false;

    this.cd.detectChanges();
  }

  handleError(error: any) {
    console.error('Error al buscar', error);
    this.products = [];
    this.isLoading = false;

    this.cd.detectChanges();
  }

  // Función para borrar (Opcional por si la quieres implementar de una vez)
  deleteProduct(sku: string) {
    if(confirm(`¿Estás seguro de eliminar el producto ${sku}?`)) {
      this.productService.deleteProduct(sku).subscribe(() => {
        // Filtramos la lista localmente para no tener que recargar
        this.products = this.products.filter(p => p.SKU !== sku);
      });
    }
  }

  // Limpiar filtros
  clearFilters() {
    this.searchName = '';
    this.searchIngredient = '';
    this.selectedCategory = '';
    this.products = [];
    this.hasSearched = false;
  }
}