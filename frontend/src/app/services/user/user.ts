import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';
import { InterfaceUserWithProfilePicture } from '../../interfaces/user/user-photo';
import { InterfacePostUser } from '../../interfaces/user/post-user';
import { InterfacePutUser } from '../../interfaces/user/put-user';

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

  getData() {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.get<InterfaceUserWithProfilePicture>(`${this.authServiceURL}/me`, {
      headers,
    });
  }

  postData(userData: InterfacePostUser) {
    return this.httpClient.post<InterfacePostUser>(`${this.authServiceURL}/register`, userData);
  }

  putData(userData: InterfacePutUser, user_id: number) {
    const headers = { Authorization: 'Bearer token' };
    return this.httpClient.patch<InterfacePutUser>(
      `${this.authServiceURL}/users/${user_id}`,
      userData,
      { headers }
    );
  }
}
