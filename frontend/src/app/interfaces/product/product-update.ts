interface InterfaceProductUpdate {
  productTypeId?: number | null; // Optional, integer or null
  chemicalName?: string | null; // Optional, string or null
  comercialName?: string | null; // Optional, string or null
  description?: string | null; // Optional, string or null
  price?: number | null; // Optional, number > 0 or null
  outdate?: string | null; // Optional, string date or null
  stock?: number | null; // Optional, integer ≥ 0 or null
  batch?: string | null; // Optional, string or null
  provider?: string | null; // Optional, string or null
  pharmaceutical?: string | null; // Optional, string or null
  imagen?: string | null; // Optional, string or null
}
