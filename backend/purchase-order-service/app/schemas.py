from pydantic import BaseModel, Field 
from datetime import datetime
from typing import Optional

class PurchaseOrderBase(BaseModel):
    licence_supplier: str = Field(..., example = "123456789")
    detail: str = Field(..., example = "Reabastecimiento de ibuprofeno necesario")
    description: str = Field(..., example = "20 cajas de ibuprofeno de 400 Miligramos")
    total_amount: float = Field(..., gt = 0)

class PurchaseOrderCreate(PurchaseOrderBase):
    date: datetime = Field(default_factory=datetime.now)

class PurchaseOrderResponse(PurchaseOrderBase):
    id: str 
    created_at: datetime
    updated_at: datetime

class PurchaseOrderUpdate(BaseModel):
    licence_supplier: Optional[str] = None
    detail: Optional[str] = None
    description: Optional[str] = None
    total_amount: Optional[str] = None

    