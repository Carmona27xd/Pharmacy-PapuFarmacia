import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleCreate, SaleItemCreate } from '../../interfaces/sales/sales';
import { SalesService } from '../../services/sales/sales';


@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.html'
})
export class PosComponent {
  // Carrito de compras local
  cart: SaleItemCreate[] = [];
  
  // Modelo para el formulario de "Agregar Producto"
  newItem: SaleItemCreate = {
    product_id: 0,
    product_name: '',
    quantity: 1,
    unit_price: 0
  };

  paymentMethod: string = 'CASH';
  isLoading = false;

  constructor(private salesService: SalesService) {}

  addToCart() {
    if (this.newItem.product_id && this.newItem.product_name && this.newItem.unit_price > 0) {
      // Agregamos una copia del objeto al carrito
      this.cart.push({ ...this.newItem });
      
      // Limpiamos el formulario
      this.newItem = { product_id: 0, product_name: '', quantity: 1, unit_price: 0 };
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  get totalAmount(): number {
    return this.cart.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  }

  processSale() {
    if (this.cart.length === 0) return;

    const saleData: SaleCreate = {
      items: this.cart,
      payment_method: this.paymentMethod
    };

    this.isLoading = true;
    this.salesService.createSale(saleData).subscribe({
      next: (resp) => {
        alert(`Venta #${resp.id} realizada con éxito! Total: $${resp.total_amount}`);
        this.cart = []; // Limpiar carrito
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error al procesar la venta');
        this.isLoading = false;
      }
    });
  }
}