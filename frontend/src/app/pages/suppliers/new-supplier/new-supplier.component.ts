import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierService } from '../../../services/supplier/supplier';


@Component({
  selector: 'app-new-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Importamos módulos necesarios
  templateUrl: './new-supplier.component.html',
  //styleUrls: ['./new-supplier.component.css']
})
export class NewSupplierComponent {
  // Inyecciones
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  // Definimos el formulario y sus validaciones
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    RFC: ['', [Validators.required, Validators.minLength(12)]],
    contact: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    email: ['', [Validators.required, Validators.email]],
    licence_number: ['', [Validators.required]],
    licence_expiration: [null, [Validators.required]],
    supplier_type: ['DISTRIBUIDOR', [Validators.required]] // Valor por defecto
  });

  // Función al enviar
  onSubmit() {
    if (this.form.invalid) {
      alert('Por favor completa todos los campos correctamente');
      return;
    } 

    const payload = { ...this.form.value }
    if(!payload.licence_expiration) {
      payload.licence_expiration = null;
    } else { payload.licence_expiration = new Date(payload.licence_expiration).toISOString(); }

    // Llamamos al servicio
    this.supplierService.createSupplier(this.form.value).subscribe({
      next: () => {
        alert('Proveedor creado con éxito');
        this.router.navigate(['/suppliers']); // Regresamos a la lista
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el proveedor');
      }
    });
  }
}