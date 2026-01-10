import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ComponentInputField } from '../../../shared/inputs/input-field/input-field';
import { ComponentCancelAcceptButtons } from '../../../shared/buttons/cancel-accept/cancel-accept';
import { Router } from '@angular/router';

@Component({
  selector: 'registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ComponentInputField, ComponentCancelAcceptButtons],
  templateUrl: './registration.html',
})
export class PageRegistration {
  registrationForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      surnames: ['', [Validators.required, Validators.minLength(5)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {}

  onCancel() {
    this.router.navigate(['/']);
  }
}
