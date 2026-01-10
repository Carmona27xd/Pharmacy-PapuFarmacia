import { InterfaceBaseUser } from './base-user';

export interface InterfaceUserCreate extends InterfaceBaseUser {
  password: string; // 8 or more characters
}
