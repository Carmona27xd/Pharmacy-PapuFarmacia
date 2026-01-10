import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ComponentInputField } from '../../../shared/inputs/input-field/input-field';
import { ServiceAuth } from '../../../services/auth/auth';
import { ServiceShowCustomDialog } from '../../../shared/dialogs/service-dialog';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ComponentInputField],
  templateUrl: './login.html',
})
export class PageLogin implements OnInit {
  loginForm: FormGroup;
  token: any = null;

  constructor(
    private fb: FormBuilder,
    private serviceAuth: ServiceAuth,
    private router: Router,
    private customDialogService: ServiceShowCustomDialog
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { identifier, password } = this.loginForm.value;

    this.serviceAuth.login(identifier, password).subscribe({
      next: (data: any) => {
        this.token = data;
        console.log('Token recibido:', data);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        if (err.error.status === 401) {
          this.customDialogService.error(
            'Error de autenticación',
            'Credenciales incorrectas. Por favor, inténtelo de nuevo.'
          );
        }
      },
      complete: () => {
        console.log('Petición de login completada');
      },
    });
  }
}
