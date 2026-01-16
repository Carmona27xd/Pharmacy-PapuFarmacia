import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/productv2/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Apuntamos directo al puerto 8086 de tu Docker
  private apiUrl = 'http://localhost:8086/products';

  constructor(private http: HttpClient) { }

  // 1. Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // 2. Obtener un solo producto por SKU
  getProductBySku(sku: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${sku}`);
  }

  // 3. Crear producto
  createProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  // 4. Actualizar producto (PATCH)
  updateProduct(sku: string, product: Partial<Product>): Observable<any> {
    // Partial<Product> permite enviar solo precio y stock si queremos
    return this.http.patch<any>(`${this.apiUrl}/${sku}`, product);
  }

  // 5. Eliminar producto
  deleteProduct(sku: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${sku}`);
  }

  // ==========================================
  // BÚSQUEDAS AVANZADAS
  // ==========================================

  searchByName(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search-name/${term}`);
  }

  searchByIngredient(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search-ingredient/${term}`);
  }

  searchByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  //ACTUALIZAR STOCK
  updateStock(sku: string, newStock: number): Observable<any> {
    const body = { stock: newStock }; 
    // Hacemos PATCH a la URL de productos: http://localhost:8084/products/{sku}
    return this.http.patch(`${this.apiUrl}/${sku}`, body);
  }
}