export interface InterfaceBaseProduct {
  productTypeId: number;
  chemicalName: string | null; // ≤ 255 characters or null
  comercialName: string; // [1, 255] characters
  description: string | null; // ≤ 1000 characters or null
  price: number; // > 0
  outdate: string | null; // Format date or null
  stock: number; // ≥ 0
  batch: string; // [1, 100] characters
  provider: string; // [1, 255] characters
  pharmaceutical: string | null; // ≤ 255 characters or null
  imagen: string | null; // ≤ 500 characters or null
}
