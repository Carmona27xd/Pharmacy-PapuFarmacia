// src/app/services/sales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'; // <-- Agregado HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SaleCreate, SaleFilters, SaleResponse, SalesListResponse } from '../../interfaces/sales/sales';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = environment.salesService;

  constructor(private http: HttpClient) {}

 
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; 
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  
  createSale(sale: SaleCreate): Observable<SaleResponse> {
    const headers = this.getHeaders(); // Obtenemos el pase VIP
    return this.http.post<SaleResponse>(`${this.apiUrl}/sales`, sale, { headers });
  }

  // 2. Obtener historial (GET /sales/)
  getSales(filters: SaleFilters): Observable<SalesListResponse> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    
    // Convertimos el objeto de filtros a parametros de URL
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof SaleFilters];
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });

    return this.http.get<SalesListResponse>(`${this.apiUrl}/sales/`, { params, headers });
  }

  // 3. Obtener una venta específica (GET /sales/{id})
  getSaleById(id: number): Observable<SaleResponse> {
    const headers = this.getHeaders();
    return this.http.get<SaleResponse>(`${this.apiUrl}/sales/${id}`, { headers });
  }

  // 4. Descargar reporte PDF (GET /reports/cash-closing)
  downloadReport(dateFrom: string, dateTo: string): Observable<Blob> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('date_from', dateFrom)
      .set('date_to', dateTo);

    return this.http.get(`${this.apiUrl}/reports/cash-closing`, {
      params,
      headers,           // También enviamos el token aquí
      responseType: 'blob' // Importante para descargar archivos
    });
  }
}