from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

class SaleItemCreate(BaseModel):
    product_id: int 
    product_name:str = Field(min_length=1, max_length=255)
    quantity: int = Field(gt=0)
    unit_price: float = Field(gt=0)

class SaleCreate(BaseModel):
    items: List[SaleItemCreate]
    payment_method: str = Field(min_length=1, max_length=100)

class SaleItemResponse(SaleItemCreate):
    subtotal: float

class SaleResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    payment_method: str
    created_at: datetime
    items: List[SaleItemResponse]

