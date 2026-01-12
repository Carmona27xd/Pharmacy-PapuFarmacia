import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';
import { InterfacePostProduct } from '../../interfaces/product/post-product';
import { Observable } from 'rxjs';
import { InterfaceProduct } from '../../interfaces/product/product';
import { InterfacePutProduct } from '../../interfaces/product/put-product';
import { ProductList } from '../../interfaces/product/products';

@Injectable({
  providedIn: 'root',
})
export class ServiceProduct {
  private productServiceURL: string = '';

  constructor(private httpClient: HttpClient, private config: ServicesConfig) {
    this.productServiceURL = environment.productService;
  }

  get_all(): Observable<ProductList> {
    return this.httpClient.get<ProductList>(`${this.productServiceURL}`);
  }

  getByQuery(name: string, min_price: number, max_price: number): Observable<ProductList> {
    return this.httpClient.get<ProductList>(
      `${this.productServiceURL}/search?name=${name}&min_price=${min_price}&max_price=${max_price}`
    );
  }

  getById(product_id: number): Observable<InterfaceProduct> {
    return this.httpClient.get<InterfaceProduct>(`${this.productServiceURL}/${product_id}`);
  }

  post(productData: InterfacePostProduct): Observable<InterfaceProduct> {
    return this.httpClient.post<InterfaceProduct>(`${this.productServiceURL}/create`, productData);
  }

  put(productData: InterfacePutProduct, product_id: number): Observable<InterfaceProduct> {
    return this.httpClient.put<InterfaceProduct>(
      `${this.productServiceURL}/${product_id}/update`,
      productData
    );
  }

  delete(product_id: number): Observable<InterfaceProduct> {
    return this.httpClient.delete<InterfaceProduct>(
      `${this.productServiceURL}/${product_id}/delete`
    );
  }
}
