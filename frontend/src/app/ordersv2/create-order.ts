import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PurchaseOrder, PurchaseOrderItem } from '../interfaces/ordersv2/ordersv2';
import { PurchaseOrderService } from '../services/purchase-orderv2/new-purchase';
import { ProductService } from '../services/productv2/product';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-order.html',
})
export class CreateOrderComponentV2 implements OnInit {
  licence_supplier: string = '';
  detail: string = '';
  searchSku: string = '';
  
  selectedItems: PurchaseOrderItem[] = [];
  totalAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseOrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.licence_supplier = this.route.snapshot.paramMap.get('id') || '';
  }

  updateQuantity(index: number, newQty: number): void {
    if (newQty < 1) {
      this.selectedItems[index].quantity = 1;
    }
    
    const item = this.selectedItems[index];
    item.subtotal = item.quantity * item.unit_price;
    this.calculateTotal();
    this.cdr.detectChanges(); 
  }

  addProductBySku(): void {
    if (!this.searchSku.trim()) return;

    this.productService.getProducts().subscribe(products => {
      // Nota: Usamos SKU en mayúsculas según tu servicio de productos
      const product = products.find(p => p.SKU === this.searchSku);
      
      if (product) {
        const existingItem = this.selectedItems.find(item => item.sku === product.SKU);
        
        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
        } else {
          this.selectedItems.push({
            product_id: product.id || '',
            product_name: product.comercial_name,
            sku: product.SKU,
            quantity: 1,
            unit_price: product.price,
            subtotal: product.price
          });
        }
        this.calculateTotal();
        this.searchSku = '';
        this.cdr.detectChanges(); 
      } else {
        alert('Producto no encontrado con el SKU: ' + this.searchSku);
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.selectedItems.reduce((acc, item) => acc + item.subtotal, 0);
    this.cdr.detectChanges();
  }

  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
    this.calculateTotal();
    this.cdr.detectChanges();
  }

  // VALIDACIÓN DE CAMPOS ANTES DE ENVIAR
  generarOrden(): void {
    // 1. Validar que el detalle no esté vacío
    if (!this.detail || this.detail.trim().length === 0) {
      alert('Por favor, ingresa un detalle o asunto para la orden.');
      return;
    }

    // 2. Validar que haya al menos un producto
    if (this.selectedItems.length === 0) {
      alert('Debes agregar al menos un producto a la lista antes de generar la orden.');
      return;
    }

    const nuevaOrden: PurchaseOrder = {
      licence_supplier: this.licence_supplier,
      detail: this.detail,
      items: this.selectedItems,
      total_amount: this.totalAmount
    };

    this.purchaseService.createOrder(nuevaOrden).subscribe({
      next: (res) => {
        alert('Orden generada con éxito. ID: ' + res.order_id);
        // Limpiar campos tras el éxito
        this.detail = '';
        this.selectedItems = [];
        this.totalAmount = 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al crear la orden', err);
        alert('Hubo un error al procesar la orden en el servidor.');
      }
    });
  }
}