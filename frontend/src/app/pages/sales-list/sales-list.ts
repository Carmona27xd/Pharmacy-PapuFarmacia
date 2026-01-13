import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { SaleResponse, SaleFilters } from '../../interfaces/sales/sales';
import { SalesService } from '../../services/sales/sales';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sales-list.html',
})
export class SalesListComponent implements OnInit {
  
  private salesService = inject(SalesService);
  
  // 1. Inyectamos el detector (Ya lo tenías, perfecto)
  private cd = inject(ChangeDetectorRef);

  sales: SaleResponse[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(page: number = 1) {
    this.loading = true;
    this.currentPage = page;

    const filters: SaleFilters = {
      page: this.currentPage,
      size: this.pageSize
    };

    this.salesService.getSales(filters).subscribe({
      next: (resp) => {
        this.sales = resp.sales;
        this.totalRecords = resp.total;
        this.loading = false;
        
        // 2. ¡MAGIA AQUÍ! Forzamos la actualización visual
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar el historial de ventas.';
        this.loading = false;
        
        // 3. También aquí por si falla, para quitar el "Cargando..."
        this.cd.detectChanges();
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }
}