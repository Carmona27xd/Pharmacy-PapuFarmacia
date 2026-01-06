import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';
import { InterfaceNewUser } from '../../interfaces/user/new-user';

export interface UserTemplate {
  id?: number;
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  idRole?: number;
}

export interface LoginTemplate {
  identifier: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceAuth {
  private baseUrl: string = '';

  constructor(private httpClient: HttpClient, private config: ServicesConfig) {
    this.baseUrl = environment.authService;
  }

  login(identifier: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/login`, { identifier, password }).pipe(
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
    return this.httpClient.get(`${this.baseUrl}/verify-token`);
  }

  postUser(user: InterfaceNewUser) {
    return this.httpClient.post<InterfaceNewUser>(`${this.baseUrl}/register`, user);
  }
}
