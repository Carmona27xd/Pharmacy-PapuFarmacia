import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { PurchaseOrder } from '../../interfaces/purchase-order/purrchase-order';
import { OrderService } from '../../services/purchase-order/order';


@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './orders-list.html',
})
export class OrdersListComponent implements OnInit {
  orders: PurchaseOrder[] = [];

  selectedOrder: PurchaseOrder | null = null;

  private orderService = inject(OrderService);
  private cd = inject(ChangeDetectorRef)

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        console.log('Ordenes cargadas:', data);

        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar órdenes:', err)
    });
  }

  openModal(purchaseOrder: PurchaseOrder) {
    this.selectedOrder = purchaseOrder;
  }

  closeModal() {
    this.selectedOrder = null;
  }
}