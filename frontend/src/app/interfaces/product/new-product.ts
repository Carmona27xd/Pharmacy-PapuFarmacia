export interface interfaceNewProduct {
  idProductType: number;
  chemicalName?: string; // Optional for non medicine products
  comercialName: string;
  photoId: string;
  description: string;
  price: number;
  dateOut?: Date; // Optional for non medicine products
  newStock: number;
  batch: string;
  provider: string;
  pharmaceutical?: string; // Optional for non medicine products
}
