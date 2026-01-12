import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/purchase-order/order';
import { CreatePurchaseOrderDTO } from '../../../interfaces/purchase-order/purrchase-order';


@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-purchase-order.html'
})
export class CreateOrderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  supplierLicence: string = '';

  form: FormGroup = this.fb.group({
    detail: ['', [Validators.required]],
    description: ['', [Validators.required]],
    // Inicializamos en 0, validamos que sea mayor a 0
    total_amount: [0, [Validators.required, Validators.min(0.01)]] 
  });

  ngOnInit(): void {
    this.supplierLicence = this.route.snapshot.paramMap.get('licence') || '';
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Por favor completa los campos correctamente');
      return;
    }

    // ARMAMOS EL PAYLOAD EXACTO PARA TU SCHEMA
    const payload: CreatePurchaseOrderDTO = {
      licence_supplier: this.supplierLicence,
      detail: this.form.value.detail,
      description: this.form.value.description,
      total_amount: this.form.value.total_amount,
      // Generamos la fecha actual en formato ISO para que Pydantic la entienda
      date: new Date().toISOString() 
    };

    console.log('Enviando:', payload); // Debug para ver qué se envía

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        alert('Orden creada con éxito');
        this.router.navigate(['/suppliers']);
      },
      error: (err) => {
        console.error('Error al crear orden:', err);
        alert('Error al crear la orden. Revisa la consola.');
      }
    });
  }
}