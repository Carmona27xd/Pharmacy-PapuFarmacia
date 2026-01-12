import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ComponentInputField } from '../../../shared/inputs/input-field/input-field';
import { ServiceAuth } from '../../../services/auth/auth';
import { ServiceShowCustomDialog } from '../../../shared/dialogs/service-dialog';
import { InterfaceLogin } from '../../../interfaces/user/login';
import { InterfaceApiError } from '../../../interfaces/http/HTTPError';

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

    const loginData: InterfaceLogin = {
      identifier: this.loginForm.value.identifier!,
      password: this.loginForm.value.password!,
    };

    this.serviceAuth.login(loginData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: InterfaceApiError) => {
        console.error('Error en login:', err);

        if (err.status === 401) {
          this.customDialogService.error('Error de autenticación', err.message);
        } else {
          this.customDialogService.error('Error de servidor', err.message);
        }
      },
    });
  }
}
