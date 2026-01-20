import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesListResponse, SaleViewModel } from '../../interfaces/sales/sales';
import { SalesService } from '../../services/sales/sales';

// Importaciones para el PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './sales-list.html',
})
export class SalesHistoryPage implements OnInit {
  sales: SaleViewModel[] = [];
  allSales: SaleViewModel[] = [];
  loading: boolean = true;

  // Estadísticas
  totalRevenue: number = 0;
  countSales: number = 0;
  totalCash = 0;
  totalCard = 0;
  totalOther = 0;

  //filtros
  filters = {
    date_from: '',
    date_to: '',
    payment_method: '',
    min_total: '',
    max_total: '',
  };

  productFilter = '';

  constructor(
    private salesService: SalesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    this.filters.date_from = start;
    this.filters.date_to = end;

    this.applyFilters();
  }

  //filtros
  applyFilters() {
    const cleanedFilters: any = {};

    Object.entries(this.filters).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        cleanedFilters[key] = value;
      }
    });

    this.loadSales(cleanedFilters);
  }

  resetFilters() {
    this.filters = {
      date_from: '',
      date_to: '',
      payment_method: '',
      min_total: '',
      max_total: '',
    };

    this.loadSales();
  }

  applyProductFilter() {
    if (!this.productFilter.trim()) {
      this.sales = [...this.allSales];
      this.calculateStats();
      return;
    }

    const term = this.productFilter.toLowerCase();

    this.sales = this.allSales.filter((sale) =>
      sale.items.some((item) => item.product_name.toLowerCase().includes(term)),
    );

    this.calculateStats();
  }

  loadSales(customFilters: any = {}) {
    this.loading = true;

    const baseFilters = {
      page: 1,
      size: 100,
    };

    this.salesService
      .getSales({
        ...baseFilters,
        ...customFilters,
      })
      .subscribe({
        next: (response) => {
          const mappedSales: SaleViewModel[] = response.sales.map((sale) => ({
            id: sale.id.toString(),
            sale_date: sale.created_at,
            payment_method: sale.payment_method,
            total: sale.total_amount,
            items: sale.items.map((i) => ({
              product_name: i.product_name,
              quantity: i.quantity,
              subtotal: i.subtotal,
            })),
          }));

          this.allSales = mappedSales;
          this.sales = mappedSales;

          this.calculateStats();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  calculateStats() {
    this.countSales = this.sales.length;

    this.totalRevenue = 0;
    this.totalCash = 0;
    this.totalCard = 0;
    this.totalOther = 0;

    this.sales.forEach((sale) => {
      this.totalRevenue += sale.total;

      switch (sale.payment_method.toUpperCase()) {
        case 'EFECTIVO':
        case 'CASH':
          this.totalCash += sale.total;
          break;

        case 'TARJETA':
        case 'CARD':
          this.totalCard += sale.total;
          break;

        default:
          this.totalOther += sale.total;
          break;
      }
    });
  }

  // --- NUEVA FUNCIÓN PARA DESCARGAR EL PDF ---
  downloadPDF() {
    const doc = new jsPDF();

    // 1. Configuración de encabezado
    doc.setFontSize(18);
    doc.text('Reporte de Ventas - PapuFarmacia', 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total de ventas: ${this.countSales}`, 14, 37);
    doc.text(`Ingresos totales: $${this.totalRevenue.toLocaleString()}`, 14, 44);

    // --- NUEVO: Totales por método de pago ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Desglose por método de pago:', 14, 54);

    doc.setFontSize(11);
    doc.text(`• Efectivo: $${this.totalCash.toLocaleString()}`, 18, 61);
    doc.text(`• Tarjeta: $${this.totalCard.toLocaleString()}`, 18, 68);

    if (this.totalOther > 0) {
      doc.text(`• Otros: $${this.totalOther.toLocaleString()}`, 18, 75);
    }

    // 2. Mapeo de datos para la tabla
    // Usamos tus campos: id, sale_date, payment_method, items y total
    const tableBody = this.sales.map((sale) => [
      new Date(sale.sale_date).toLocaleString(),
      sale.id.substring(sale.id.length - 6).toUpperCase(), // Mostramos solo los últimos 6 caracteres del ID de Mongo
      sale.payment_method,
      // Listamos los productos del array 'items'
      sale.items.map((i) => `${i.quantity}x ${i.product_name}`).join('\n'),
      `$${sale.total.toLocaleString()}`,
    ]);

    // 3. Generación de la tabla
    autoTable(doc, {
      startY: this.totalOther > 0 ? 85 : 78,
      head: [['Fecha', 'ID (Ref)', 'Método', 'Productos', 'Total']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }, // Color Índigo acorde a tu UI
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        3: { cellWidth: 80 }, // Damos más espacio a la columna de productos
      },
    });

    // 4. Guardar archivo
    const fileName = `Reporte_Ventas_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  }
}
