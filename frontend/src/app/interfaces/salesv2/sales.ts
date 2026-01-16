export interface SaleItem {
  sku: string;
  product_name: string; 
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Sale {
  id?: string;          
  items: SaleItem[];    
  payment_method: string;
  total: number;
  
  sale_date?: string;   
}