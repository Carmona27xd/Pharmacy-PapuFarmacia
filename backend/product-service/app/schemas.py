from pydantic import BaseModel, Field, validator
from typing import Optional 
from datetime import datetime

class ProductsBase(BaseModel):
    name: str = Field(..., example="Paracetamol 500mg")
    description: Optional[str] = Field(None, example="Caja con 20 capsulas")
    price: float = Field(..., ge=0, example=45.50)
    stock: int = Field(..., ge=0, example=50)
    category: str = Field(..., example="Analgesicos")
    manufacturer: str = Field(..., example="Bayer")
    requires_prescription: bool = Field(default=False)
    sku: str = Field(..., example="750123456789")

class ProductCreate(ProductsBase):
    expiration_date: datetime

class productsResponse(ProductsBase):
    id: str
    create_ate: datetime
    update_at: datetime

    class Config:
        from_attributes = True

        

