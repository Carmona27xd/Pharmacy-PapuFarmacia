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

class SaleRead(SaleCreate):
    id: int
    items: List[SaleItemResponse]
    created_at: datetime

    class Config:
        orm_mode = True

class SalesListResponse(BaseModel):
    total: int
    page: int
    size: int
    sales: List[SaleResponse]

class SaleFilters(BaseModel):
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    payment_method: Optional[str] = None
    user_id: Optional[int] = None
    min_total: Optional[float] = None
    max_total: Optional[float] = None