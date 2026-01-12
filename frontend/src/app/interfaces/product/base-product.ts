export interface InterfaceProductBase {
  productTypeId: number;
  chemicalName: string;
  comercialName: string;
  description: string;
  price: number;
  outdate: string; // ISO date (YYYY-MM-DD)
  stock: number;
  batch: string;
  provider: string;
  pharmaceutical: string;
  image: string;
}
