import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Asegúrate de que estas rutas sean las correctas en tu proyecto
import { Product } from '../../interfaces/productv2/product';
import { Sale, SaleItem } from '../../interfaces/salesv2/sales';
import { ProductService } from '../../services/productv2/product';
import { SalesService } from '../../services/salesv2/sales';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-sale.html', // Asegúrate de que coincida con tu archivo HTML
  // styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  // --- FILTROS DE BÚSQUEDA ---
  searchFilters = {
    sku: '',
    name: '',
    ingredient: '',
  };

  // --- DATOS ---
  allProducts: Product[] = []; // Todos los productos (caché)
  foundProducts: Product[] = []; // Los resultados de la búsqueda
  cart: SaleItem[] = []; // El carrito de compras

  // --- UI ---
  isLoading: boolean = false;
  total: number = 0;
  paymentMethod: string = 'Efectivo';

  categories: string[] = [
    'Analgesico',
    'Antibiotico',
    'Antiinflamatorio',
    'Antihistaminico',
    'Antipiretico',
    'Suplemento',
    'Material de Curacion',
  ];

  constructor(
    private productService: ProductService,
    private salesService: SalesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.allProducts = data),
      error: (err) => console.error('Error cargando inventario', err),
    });
  }

  // 1. BUSCAR PRODUCTOS
  search() {
    if (!this.searchFilters.sku && !this.searchFilters.name && !this.searchFilters.ingredient) {
      alert('Ingresa SKU, Nombre o Ingrediente.');
      return;
    }

    const fSku = this.searchFilters.sku.toLowerCase();
    const fName = this.searchFilters.name.toLowerCase();
    const fIng = this.searchFilters.ingredient.toLowerCase();

    this.foundProducts = this.allProducts.filter((p) => {
      const matchSku = fSku ? p.SKU.toLowerCase().includes(fSku) : true;
      const matchName = fName ? p.comercial_name.toLowerCase().includes(fName) : true;
      const matchIng = fIng ? p.active_ingredient.toLowerCase().includes(fIng) : true;

      return matchSku && matchName && matchIng;
    });

    if (this.foundProducts.length === 0) {
      // Opcional: Feedback visual si no hay resultados
    }
  }

  // 2. AGREGAR AL CARRITO
  addToCart(product: Product, quantityInput: string) {
    const qty = parseInt(quantityInput);

    if (qty <= 0) {
      alert('Cantidad inválida');
      return;
    }
    if (qty > product.stock) {
      alert(`Stock insuficiente. Solo hay ${product.stock}`);
      return;
    }

    const existingItem = this.cart.find((item) => item.sku === product.SKU);

    if (existingItem) {
      if (existingItem.quantity + qty > product.stock) {
        alert('No puedes agregar más de lo que hay en stock.');
        return;
      }
      existingItem.quantity += qty;
      existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
    } else {
      const newItem: SaleItem = {
        sku: product.SKU,
        product_name: product.comercial_name,
        quantity: qty,
        unit_price: product.price,
        subtotal: product.price * qty,
      };
      this.cart.push(newItem);
    }

    this.calculateTotal();
  }

  // 3. ELIMINAR DEL CARRITO
  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateTotal();
  }

  // 4. CALCULAR TOTAL
  calculateTotal() {
    this.total = this.cart.reduce((acc, item) => acc + item.subtotal, 0);
  }

  // =========================================================
  // LÓGICA DE COBRO Y ACTUALIZACIÓN (Chain Reaction)
  // =========================================================

  // PASO 1: Registrar Venta
  processSale() {
    if (this.cart.length === 0) return;
    this.isLoading = true;

    const saleData: Sale = {
      items: this.cart,
      payment_method: this.paymentMethod,
      total: this.total,
    };

    this.salesService.createSale(saleData).subscribe({
      next: (res) => {
        console.log(
          '✅ Venta registrada en Mongo. Iniciando actualización de stock en Postgres...',
        );

        // IMPORTANTE: No borramos el carrito todavía. Llamamos a actualizar el stock.
        this.updateStock();
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al procesar venta.');
        this.isLoading = false;
      },
    });
  }

  // PASO 2: Actualizar Inventario
  updateStock() {
    // Usamos el carrito para generar las peticiones de actualización
    const requests = this.cart.map((item) => {
      const originalProduct = this.allProducts.find((p) => p.SKU === item.sku);

      if (originalProduct) {
        // Restamos lo vendido al stock original
        const finalStock = originalProduct.stock - item.quantity;
        // Llamamos al servicio (PATCH)
        return this.productService.updateStock(item.sku, finalStock);
      }
      return null;
    });

    // Filtramos los nulos para evitar errores en forkJoin
    const validRequests = requests.filter((r) => r !== null);

    if (validRequests.length === 0) {
      this.finishTransaction();
      return;
    }

    // Ejecutamos todas las actualizaciones en paralelo
    forkJoin(validRequests).subscribe({
      next: () => {
        console.log('✅ Stock actualizado correctamente.');
        this.finishTransaction(); // Vamos al paso final
      },
      error: (err) => {
        console.error('Error al actualizar stock', err);
        // Aunque falle el stock, la venta ya se cobró.
        alert('⚠️ Venta cobrada, pero hubo un error actualizando el inventario.');
        this.finishTransaction();
      },
    });
  }

  // PASO 3: Limpieza y Redirección
  finishTransaction() {
    this.generateTicket();
    alert('¡Venta completada con éxito!');
    this.cart = [];
    this.calculateTotal();
    this.isLoading = false;
    this.reload();
  }

  reload() {
    const url = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  generateTicket() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200], // ticket 80mm
    });

    let y = 10;

    // HEADER
    doc.setFontSize(12);
    doc.text('PapuFarmacia', 40, y, { align: 'center' });
    y += 6;

    doc.setFontSize(8);
    doc.text('RFC: PAPUFARMHZP', 40, y, { align: 'center' });
    y += 4;

    doc.text(`Fecha: ${new Date().toLocaleString()}`, 40, y, { align: 'center' });
    y += 6;

    doc.line(5, y, 75, y);
    y += 4;

    // ITEMS
    doc.setFontSize(8);
    this.cart.forEach((item) => {
      doc.text(item.product_name, 5, y);
      y += 4;

      doc.text(`${item.quantity} x $${item.unit_price.toFixed(2)}`, 5, y);

      doc.text(`$${item.subtotal.toFixed(2)}`, 75, y, { align: 'right' });

      y += 5;
    });

    doc.line(5, y, 75, y);
    y += 5;

    // TOTAL
    doc.setFontSize(10);
    doc.text('TOTAL:', 5, y);
    doc.text(`$${this.total.toFixed(2)}`, 75, y, { align: 'right' });
    y += 6;

    doc.setFontSize(8);
    doc.text(`Pago: ${this.paymentMethod}`, 5, y);
    y += 6;

    doc.text('¡Gracias por su compra!', 40, y, { align: 'center' });

    // DESCARGAR
    doc.save(`ticket_${Date.now()}.pdf`);

    doc.autoPrint();
    window.open(doc.output('bloburl'));
  }
}
