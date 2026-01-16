from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SaleItem(BaseModel):
    sku: str
    product_name: str
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    subtotal: float 

class SaleCreate(BaseModel):
    items: List[SaleItem]
    payment_method: str = Field(..., example="Efectivo") 
    total: float 
    
class SaleResponse(SaleCreate):
    id: str
    sale_date: datetime