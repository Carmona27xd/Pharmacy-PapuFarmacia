export interface InterfaceUserUpdate {
  is_active?: boolean | null; // Optional, may be null
  full_name?: string | null; // Optional, string[2,50] or null
  username?: string | null; // Optional, string[4,50] or null
  role_id?: number | null; // Optional, integer ≥ 1 or null
}
