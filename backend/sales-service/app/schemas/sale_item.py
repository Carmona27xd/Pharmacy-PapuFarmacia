from pydantic import BaseModel
from typing import Optional

class SaleItemBase(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    discount: Optional[float] = 0.0

class SaleItemCreate(SaleItemBase):
    pass

class SaleItemUpdate(BaseModel):
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    discount: Optional[float] = None

class SaleItemInDBBase(SaleItemBase):
    id: int
    sale_id: int
    total_price: float

    class Config:
        orm_mode = True

class SaleItem(SaleItemInDBBase):
    pass
