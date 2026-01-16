import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../../interfaces/salesv2/sales';
import { InterfaceSale } from '../../interfaces/sales-history/sale';
// La interfaz que creamos antes

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  // URL del microservicio de Ventas (Puerto 8087)
  private apiUrl = 'http://localhost:8087/sales';

  constructor(private http: HttpClient) { }

  // Enviar la venta a la base de datos
  createSale(sale: Sale): Observable<any> {
    return this.http.post<any>(this.apiUrl, sale);
  }

  //Obtener ventas
  getHistory(): Observable<InterfaceSale[]> {
    return this.http.get<InterfaceSale[]>(this.apiUrl);
  }
}