from pydantic import BaseModel, Field 
from datetime import datetime
from typing import Optional, List

# Esquema para cada producto dentro de la lista de la orden
class PurchaseOrderItem(BaseModel):
    product_id: str
    product_name: str
    sku: str
    quantity: int = Field(..., gt=0, example=10)
    unit_price: float = Field(..., gt=0, example=5.50)
    subtotal: float = Field(..., gt=0, example=55.00)

# Base común para la orden de compra
class PurchaseOrderBase(BaseModel):
    licence_supplier: str = Field(..., example="123456789")
    detail: str = Field(..., example="Reabastecimiento mensual de farmacia")
    items: List[PurchaseOrderItem]
    total_amount: float = Field(..., gt=0, example=55.00)

# Esquema para la creación (POST)
class PurchaseOrderCreate(PurchaseOrderBase):
    # La fecha se genera automáticamente si no se envía
    date: datetime = Field(default_factory=datetime.now)

# Esquema para la respuesta (GET)
class PurchaseOrderResponse(PurchaseOrderBase):
    id: str 
    order_date: datetime # Sincronizado con el campo de la base de datos

    class Config:
        from_attributes = True