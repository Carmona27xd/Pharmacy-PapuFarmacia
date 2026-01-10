import { InterfaceUser } from './user';

export interface InterfaceFullUserResponse extends InterfaceUser {
  profile_picture: string | null;
}
