import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PurchaseOrder } from '../interfaces/ordersv2/ordersv2';
import { PurchaseOrderService } from '../services/purchase-orderv2/new-purchase';


@Component({
  selector: 'app-order-list-v2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './new-order-list.html',
})
export class OrderListV2Component implements OnInit {
  orders: PurchaseOrder[] = [];
  selectedOrder: PurchaseOrder | null = null; // Variable para el modal

  constructor(
    private purchaseService: PurchaseOrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.purchaseService.getOrderHistory().subscribe({
      next: (data) => {
        this.orders = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar el historial", err)
    });
  }

  // Funciones para el Modal
  openDetails(order: PurchaseOrder): void {
    this.selectedOrder = order;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.selectedOrder = null;
    this.cdr.detectChanges();
  }
}