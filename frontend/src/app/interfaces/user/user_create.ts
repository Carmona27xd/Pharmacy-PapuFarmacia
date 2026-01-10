import { InterfaceBaseUser } from './base_user';

export interface InterfaceUserCreate extends InterfaceBaseUser {
  password: string;
}
