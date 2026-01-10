export interface InterfaceUserUpdate {
  is_active?: boolean | null; // Opcional, puede ser null
  full_name?: string | null; // Opcional, string[2,50] o null
  username?: string | null; // Opcional, string[4,50] o null
  role_id?: number | null; // Opcional, integer ≥ 1 o null
}
