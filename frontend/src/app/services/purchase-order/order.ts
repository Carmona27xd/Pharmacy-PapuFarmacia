import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePurchaseOrderDTO, PurchaseOrder } from '../../interfaces/purchase-order/purrchase-order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085/orders'; 

  createOrder(order: CreatePurchaseOrderDTO): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  getOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.apiUrl);
  }
}

