import { InterfaceUser } from './user';

export interface InterfaceTokenVerified extends InterfaceUser {
  hashed_password: string;
  created_at: string; // ISO date
  updated_at: string | null;
}
