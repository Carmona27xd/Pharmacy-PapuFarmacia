import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceLogin } from '../../interfaces/user/login';
// <--- Importamos la nueva interfaz
import { environment } from '../../../environments/environment';
import { InterfaceRegister } from '../../interfaces/user/userv2';
import { ServicesConfig } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ServiceAuth {
  // Esta variable YA EXISTE en tu código, NO agregues apiUrl
  private authServiceURL: string = ''; 

  constructor(private httpClient: HttpClient, private config: ServicesConfig) {
    this.authServiceURL = environment.authService;
  }

  // ... (Tus métodos login, logout, etc. déjalos igual) ...

  // 2. AGREGA SOLO ESTE MÉTODO AL FINAL DE LA CLASE
  // Fíjate que usa 'this.authServiceURL' en lugar de 'this.apiUrl'
  register(userData: InterfaceRegister): Observable<any> {
    return this.httpClient.post<any>(`${this.authServiceURL}/register`, userData);
  }
}