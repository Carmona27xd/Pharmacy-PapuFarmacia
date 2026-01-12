import { InterfaceUserBase } from "./base-user";

export interface InterfacePatchUser extends Partial<InterfaceUserBase> {
    is_active: boolean
    role_id: number
}