import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';

// TODO Validate data attributes from backend
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
export class ServiceUser {
  private baseUrl: string = '';

  constructor(private httpClient: HttpClient, private config: ServicesConfig) {
    this.baseUrl = `${environment.userService}/profiles`;
  }

  getData(idUser: number) {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.get<UserTemplate>(`${this.baseUrl}/${idUser}`, { headers });
  }

  postData(user: UserTemplate) {
    return this.httpClient.post<UserTemplate>(`${this.baseUrl}`, {});
  }

  putData(user: UserTemplate) {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.put<UserTemplate>(`${this.baseUrl}/${user.id}`, {}, { headers });
  }

  putProfilePhoto(user: UserTemplate) {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.put<UserTemplate>(`${this.baseUrl}/${user.id}/picture`, {}, { headers });
  }
}
