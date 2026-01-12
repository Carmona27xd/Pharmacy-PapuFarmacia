import { Component, OnInit } from '@angular/core';
import { InterfaceProduct } from '../../../interfaces/product/product';
import { ServiceProduct } from '../../../services/product/product';
import { PRODUCT_TYPES } from '../../../interfaces/product/PRODUCT_TYPES';
import { InterfaceProductType } from '../../../interfaces/product/product-type';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './details-product.html',
})
export class PageDetailsProduct implements OnInit {
  productId!: number;
  currentProduct: InterfaceProduct | null = null;
  productTypes: InterfaceProductType[] = PRODUCT_TYPES;

  constructor(private productService: ServiceProduct, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('productId')!;

    this.productService.getById(this.productId).subscribe({
      next: (product) => {
        this.currentProduct = product;
      },
      error: (err) => {
        console.error('Error al obtener el producto', err);
      },
    });
  }

  getProductTypeName(): string {
    if (!this.currentProduct || !this.currentProduct.productTypeId) {
      return 'Tipo no encontrado';
    }
    const type = this.productTypes.find((p) => p.id === this.currentProduct!.productTypeId);
    return type ? type.name : 'Tipo no encontrado';
  }
}
