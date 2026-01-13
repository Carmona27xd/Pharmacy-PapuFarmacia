export interface SaleItemCreate {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface SaleCreate {
  items: SaleItemCreate[];
  payment_method: string; // 'CASH', 'CARD', 'TRANSFER', etc.
}

// Lo que recibimos del servidor
export interface SaleItemResponse extends SaleItemCreate {
  subtotal: number;
}

export interface SaleResponse {
  id: number;
  user_id: number;
  total_amount: number;
  payment_method: string;
  created_at: string; // DateTime viene como string en JSON
  items: SaleItemResponse[];
}

export interface SalesListResponse {
  total: number;
  page: number;
  size: number;
  sales: SaleResponse[];
}

export interface SaleFilters {
  page?: number;
  size?: number;
  date_from?: string;
  date_to?: string;
  payment_method?: string;
  min_total?: number;
  max_total?: number;
}