import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';
import { InterfaceLogin } from '../../interfaces/user/login';
import { InterfacePostUser } from '../../interfaces/user/post-user';
import { InterfaceLoginResponse } from '../../interfaces/user/login-response';
import { InterfaceTokenVerified } from '../../interfaces/user/token-verified';

@Injectable({
  providedIn: 'root',
})
export class ServiceAuth {
  private authServiceURL: string = '';

  constructor(private httpClient: HttpClient, private config: ServicesConfig) {
    this.authServiceURL = environment.authService;
  }

  login(loginData: InterfaceLogin): Observable<InterfaceLoginResponse> {
    return this.httpClient
      .post<InterfaceLoginResponse>(`${this.authServiceURL}/login`, loginData)
      .pipe(
        tap((res: InterfaceLoginResponse) => {
          if (res?.access_token) {
            localStorage.setItem('auth_token', res.access_token);
          }
        })
      );
  }

  // TODO Check if this is correct and what response are
  verifyToken(tokenJWT: string): Observable<InterfaceTokenVerified> {
    return this.httpClient.get<InterfaceTokenVerified>(`${this.authServiceURL}/verify-token`);
  }

  /*
  postUser(user: InterfaceNewUser) {
    return this.httpClient.post<InterfaceNewUser>(`${this.baseUrl}/register`, user);
  postUser(userData: InterfacePostUser): Observable<any> {
    return this.httpClient.post<any>(`${this.authServiceURL}/register`, userData);
  }
  */
}
