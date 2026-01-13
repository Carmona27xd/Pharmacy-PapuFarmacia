import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicesConfig } from '../config';
import { environment } from '../../../environments/environment.development';
import { InterfacePatchUser } from '../../interfaces/user/patch_user';
import { InterfaceUserBase } from '../../interfaces/user/base-user';
import { InterfaceUser } from '../../interfaces/user/user';


@Injectable({
    providedIn: 'root',
})
export class ServiceAdmmin {
    private adminServiceURL: string = '';
    private authServiceURL: string = '';

    constructor(private httpClient: HttpClient, private config: ServicesConfig) {
        this.adminServiceURL = environment.adminService;
        this.authServiceURL = environment.authService;
    }

    getData() {
        const headers = { Authorization: 'Bearer token' };
        return this.httpClient.get<InterfaceUser>(`${this.adminServiceURL}/users`, {
            headers,
        })
    }

    patchDataBan(user_id: number) {
        const headers = { Authorization: 'Bearer token' };
        return this.httpClient.patch<InterfacePatchUser>(
            `${this.adminServiceURL}/users/${user_id}/ban`,
            { is_active: false, role_id: 2 },
            { headers }
        )
    }

    patchDataUnban(user_id: number) {
        const headers = { Authorization: 'Bearer token' };
        return this.httpClient.patch<InterfacePatchUser>(
            `${this.adminServiceURL}/users/${user_id}/unban`,
            { is_active: true, role_id: 2 },
            { headers }
        )
    }
}