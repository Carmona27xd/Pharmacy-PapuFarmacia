import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ComponentInputField } from '../../../shared/inputs/input-field/input-field';
import { ComponentCancelAcceptButtons } from '../../../shared/buttons/cancel-accept/cancel-accept';

@Component({
  selector: 'registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ComponentInputField, ComponentCancelAcceptButtons],
  templateUrl: './registration.html',
})
export class PageRegistration {
  registrationForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      surnames: ['', [Validators.required, Validators.minLength(5)]],
      dateBirth: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Valid data:', this.registrationForm.value);
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
