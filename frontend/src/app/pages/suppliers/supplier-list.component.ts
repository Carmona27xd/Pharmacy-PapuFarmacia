import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para usar *ngFor
import { Supplier } from '../../interfaces/supplier/supplier';
import { SupplierService } from '../../services/supplier/supplier';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-list.component.html',
  //styleUrls: ['./suppliers-list.component.css']
})

export class SuppliersListComponent implements OnInit {
  suppliers: Supplier[] = [];

  selectedSupplier: Supplier | null = null;
  
  private supplierService = inject(SupplierService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        console.log('Proveedores cargados:', data);
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  deleteSupplier(licence: string) {
    if(confirm('¿Estás seguro de borrar este proveedor?')) {
      this.supplierService.deleteSupplier(licence).subscribe(() => {
        
        this.loadSuppliers(); 
      });
    }
  }

  openModal(supplier: Supplier) {
    this.selectedSupplier = supplier;
  }

  closeModal() {
    this.selectedSupplier = null;
  }
}