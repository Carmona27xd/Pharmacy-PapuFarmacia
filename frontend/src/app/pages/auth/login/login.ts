import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios e Interfaces
import { ServiceAuth } from '../../../services/auth/auth';
import { InterfaceLogin } from '../../../interfaces/user/login';
import { InterfaceApiError } from '../../../interfaces/http/HTTPError';

@Component({
  selector: 'login',
  standalone: true,
  // NOTA: Quitamos ComponentInputField de aquí porque el nuevo HTML usa inputs nativos con Tailwind
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class PageLogin implements OnInit {
  
  loginForm: FormGroup;
  
  // VARIABLE NUEVA: Controla la visibilidad del Modal en el HTML
  isErrorModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private serviceAuth: ServiceAuth,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      // Mantenemos tus validadores
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
        // Redirigir a inicio si todo sale bien
        this.router.navigate(['/inicio']);
      },
      error: (err: InterfaceApiError) => {
        console.error('Error en login:', err);

        // AQUÍ ACTIVAMOS EL MODAL DEL HTML
        // No importa si es 401 u otro error, mostramos el modal de "Credenciales inválidas"
        // o podrías personalizar el mensaje si quisieras.
        this.isErrorModalOpen = true;

        this.cd.detectChanges();
      },
    });
  }

  // FUNCIÓN NUEVA: Cierra el modal cuando el usuario hace clic en el botón
  closeErrorModal() {
    this.isErrorModalOpen = false;
    this.cd.detectChanges();
  }
}