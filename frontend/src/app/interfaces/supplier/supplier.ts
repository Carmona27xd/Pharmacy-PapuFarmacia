export interface Supplier {
  id?: string;             
  name: string;
  RFC: string;
  contact: string;
  address: string;
  phone: string;
  email: string;
  licence_number: string;
  licence_expiration?: string; 
  supplier_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSupplierDto {
  name: string;
  RFC: string;
  contact: string;
  address: string;
  phone: string;
  email: string;
  licence_number: string;
  licence_expiration?: string;
  supplier_type: string;
}