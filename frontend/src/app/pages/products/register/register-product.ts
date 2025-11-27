import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentInputField } from '../../../shared/inputs/input-field/input-field';
import { ComponentImageUploader } from '../../../shared/inputs/image-uploader/image-uploader';
import { ComponentCancelAcceptButtons } from '../../../shared/buttons/cancel-accept/cancel-accept';

@Component({
  selector: 'register-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentInputField,
    ComponentImageUploader,
    ComponentCancelAcceptButtons,
  ],
  templateUrl: './register-product.html',
})
export class PageRegisterProduct {
  medicineForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.medicineForm = this.fb.group({
      idProductType: ['', Validators.required],
      chemicalName: ['', [Validators.required, Validators.minLength(3)]],
      comercialName: ['', [Validators.required, Validators.minLength(3)]],
      imageProduct: ['', Validators.required],
      description: ['', Validators.required, Validators.minLength(3)],
      price: ['', Validators.required],
      expirationDate: ['', Validators.required],
      stockAvailable: ['', [Validators.required, Validators.min(0)]],
      batch: ['', Validators.required],
      supplier: ['', Validators.required],
      pharmaceutical: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.medicineForm.valid) {
      console.log('Valid data:', this.medicineForm.value);
    } else {
      this.medicineForm.markAllAsTouched();
    }
  }
}
