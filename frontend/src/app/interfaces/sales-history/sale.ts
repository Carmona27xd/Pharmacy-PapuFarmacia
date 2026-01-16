export interface InterfaceSaleItem {
  sku: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface InterfaceSale {
  id: string;             // Viene del _id de Mongo
  sale_date: string;      // Viene como ISO string
  payment_method: string;
  total: number;
  items: InterfaceSaleItem[]; // Lista de productos vendidos
}