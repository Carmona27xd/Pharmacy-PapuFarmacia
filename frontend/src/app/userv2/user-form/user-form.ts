import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServiceAuth } from '../../services/auth/auth';
import { InterfaceRegister } from '../../interfaces/user/userv2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.html',
})
export class PageRegister {
  
  registerForm: FormGroup;
  isErrorModalOpen: boolean = false;
  errorMessage: string = 'No se pudo completar el registro.';

  constructor(
    private fb: FormBuilder,
    private serviceAuth: ServiceAuth,
    private router: Router,
    private cdr: ChangeDetectorRef // Importante para que se actualice la vista al error
  ) {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [
        Validators.required, 
        Validators.minLength(3), 
        // Regex: Solo letras, números y guión bajo (igual que tu backend)
        Validators.pattern(/^[a-zA-Z0-9_]+$/) 
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        // Regex: Mayúscula, Minúscula y Número
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador para que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirm_password');
    if (!password || !confirm) return null;
    return password.value === confirm.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Armamos el objeto usando la Interfaz
    const registerData: InterfaceRegister = {
      full_name: this.registerForm.value.full_name,
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.serviceAuth.register(registerData).subscribe({
      next: () => {
        // Registro exitoso
        alert('¡Usuario registrado!');
        this.router.navigate(['/inicio']);
      },
      error: (err: any) => {
        console.error('Error en registro:', err);
        
        // Intentamos leer el mensaje de error del backend (FastAPI suele enviar 'detail')
        this.errorMessage = err.error?.detail || 'Ocurrió un error al registrar el usuario. Intente con otro correo o usuario.';
        
        // Abrimos modal y forzamos actualización
        this.isErrorModalOpen = true;
        this.cdr.detectChanges();
      }
    });
  }

  closeErrorModal() {
    this.isErrorModalOpen = false;
    this.cdr.detectChanges();
  }
}