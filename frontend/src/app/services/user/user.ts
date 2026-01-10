import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServiceUser {
  private authServiceURL: string = '';
  private userServiceURL: string = '';

  constructor(private httpClient: HttpClient, private config: ServicesConfig) {
    this.authServiceURL = environment.authService;
    this.userServiceURL = environment.userService;
  }

  getData(idUser: number) {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.get<UserTemplate>(`${this.authServiceURL}/${idUser}`, { headers });
  }

  postData(user: UserTemplate) {
    return this.httpClient.post<UserTemplate>(`${this.authServiceURL}`, {});
  }

  putData(user: UserTemplate) {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.put<UserTemplate>(`${this.authServiceURL}/${user.id}`, {}, { headers });
  }

  putProfilePhoto(user: UserTemplate) {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.put<UserTemplate>(
      `${this.authServiceURL}/${user.id}/picture`,
      {},
      { headers }
    );
  }
}
