import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { InterfaceSale } from '../../interfaces/sales-history/sale';
import { SalesService } from '../../services/salesv2/sales';

// Importaciones para el PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ComponentInputField } from '../../shared/inputs/input-field/input-field';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './sales-list.html'
})
export class SalesHistoryPage implements OnInit {

  sales: InterfaceSale[] = [];
  loading: boolean = true;
  
  // Estadísticas
  totalRevenue: number = 0;
  countSales: number = 0;

  constructor(
    private salesService: SalesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;
    this.salesService.getHistory().subscribe({
      next: (data) => {
        this.sales = data;
        this.calculateStats();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener ventas', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.countSales = this.sales.length;
    // Sumamos el total de todas las ventas
    this.totalRevenue = this.sales.reduce((acc, sale) => acc + sale.total, 0);
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

    // 2. Mapeo de datos para la tabla
    // Usamos tus campos: id, sale_date, payment_method, items y total
    const tableBody = this.sales.map(sale => [
      new Date(sale.sale_date).toLocaleString(),
      sale.id.substring(sale.id.length - 6).toUpperCase(), // Mostramos solo los últimos 6 caracteres del ID de Mongo
      sale.payment_method,
      // Listamos los productos del array 'items'
      sale.items.map(i => `${i.quantity}x ${i.product_name}`).join('\n'),
      `$${sale.total.toLocaleString()}`
    ]);

    // 3. Generación de la tabla
    autoTable(doc, {
      startY: 50,
      head: [['Fecha', 'ID (Ref)', 'Método', 'Productos', 'Total']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }, // Color Índigo acorde a tu UI
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        3: { cellWidth: 80 } // Damos más espacio a la columna de productos
      }
    });

    // 4. Guardar archivo
    const fileName = `Reporte_Ventas_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fileName);
  }
}