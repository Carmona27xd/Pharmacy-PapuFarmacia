// Define cada producto dentro de la lista
export interface PurchaseOrderItem {
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// Define la estructura completa de la orden
export interface PurchaseOrder {
  licence_supplier: string;
  detail: string;
  items: PurchaseOrderItem[];
  total_amount: number;
  // Opcional: para cuando recibas la respuesta del servidor
  id?: string;
  order_date?: Date | string;
}