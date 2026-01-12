import { InterfaceUser } from './user';

export interface InterfaceUserWithProfilePicture extends InterfaceUser {
  profile_picture: string;
}
