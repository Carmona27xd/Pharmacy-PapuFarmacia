import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';
import { InterfaceLogin } from '../../interfaces/user/user-login';
import { InterfaceUserCreate } from '../../interfaces/user/user-create';

@Injectable({
  providedIn: 'root',
})
export class ServiceAuth {
  private authServiceURL: string = '';

  constructor(private httpClient: HttpClient, private config: ServicesConfig) {
    this.authServiceURL = environment.authService;
  }

  login(loginData: InterfaceLogin): Observable<any> {
    return this.httpClient.post<any>(`${this.authServiceURL}/login`, loginData).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('auth_token', res.token);
        }
      }),
      catchError(this.config.handleError)
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // TODO Check if this is correct and what response are
  verifyToken(tokenJWT: string) {
    return this.httpClient.get(`${this.authServiceURL}/verify-token`);
  }

  postUser(userData: InterfaceUserCreate): Observable<any> {
    return this.httpClient.post<any>(`${this.authServiceURL}/register`, userData);
  }
}
