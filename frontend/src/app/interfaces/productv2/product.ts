export interface Product {
  id?: string;
  comercial_name: string;
  active_ingredient: string;
  description: string;
  SKU: string;           
  category: string;
  stock: number;         
  price: number;         

  created_at?: string;
  updated_at?: string;
}