import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../../interfaces/ordersv2/ordersv2';
// Importamos tu interfaz

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  // La URL apunta al puerto 8088 definido en tu docker-compose
  private apiUrl = 'http://localhost:8088/orders';

  constructor(private http: HttpClient) {}

  /**
   * Envía la nueva orden de compra al backend.
   * El objeto 'orden' debe incluir licence_supplier, items y total_amount.
   */
  createOrder(order: PurchaseOrder): Observable<any> {
    return this.http.post<any>(this.apiUrl, order);
  }

  /**
   * Obtiene el historial de órdenes para este proveedor o general.
   */
  
  getOrderHistory(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>('http://localhost:8088/orders');
  }
}