import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier, CreateSupplierDto } from '../../interfaces/supplier/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = 'http://localhost:8084/suppliers';

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  createSupplier(supplier: CreateSupplierDto): Observable<any> {
    return this.http.post(this.apiUrl, supplier);
  }

  deleteSupplier(licenceNumber: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${licenceNumber}`);
  }

  getSupplierByLicence(licence: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${licence}`);
  }

  updateSupplier(licence: string, supplier: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${licence}`, supplier);
  }
}