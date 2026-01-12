import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupplierService } from '../../../services/supplier/supplier';


@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-supplier.html'
})
export class EditSupplierComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  licenceFromUrl: string = '';

  // Definimos el formulario con validaciones
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    RFC: ['', Validators.required],
    // La licencia la dejaremos deshabilitada visualmente porque es el ID
    licence_number: [{value: '', disabled: true}, Validators.required], 
    supplier_type: ['Distributor', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: [''],
    contact: ['']
  });

  ngOnInit(): void {
    // 1. Capturar la licencia de la URL
    this.licenceFromUrl = this.route.snapshot.paramMap.get('licence') || '';

    // 2. Si hay licencia, cargar los datos del backend
    if (this.licenceFromUrl) {
      this.loadSupplierData();
    }
  }

  loadSupplierData() {
    this.supplierService.getSupplierByLicence(this.licenceFromUrl).subscribe({
      next: (data) => {
        // 3. Llenar el formulario con los datos recibidos (patchValue)
        this.form.patchValue(data);
      },
      error: (err) => {
        console.error('Error al cargar proveedor', err);
        alert('No se pudo cargar el proveedor');
        this.router.navigate(['/suppliers']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    // OJO: getRawValue() incluye los campos deshabilitados (como licence_number)
    // Pero para un PATCH, quizás solo quieras enviar lo que cambió.
    // Por simplicidad, enviaremos los datos del formulario.
    const supplierData = this.form.getRawValue();

    this.supplierService.updateSupplier(this.licenceFromUrl, supplierData).subscribe({
      next: () => {
        alert('Proveedor actualizado correctamente');
        this.router.navigate(['/suppliers']);
      },
      error: (err) => {
        console.error('Error actualizando', err);
        alert('Error al actualizar');
      }
    });
  }
}