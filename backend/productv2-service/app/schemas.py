from pydantic import BaseModel, Field 
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    comercial_name: str = Field(..., example = "Aspirina")
    active_ingredient: str = Field(..., example = "acido acetilsalicilico")
    description: str = Field(..., example = "Caja con 20 tabletas")
    SKU : str = Field(..., example = "750100112345")
    category: str = Field(..., example = "Analgesico")
    stock: int = Field (ge = 0, example = 100)
    price: float = Field(..., gt = 0, example = 45.50)

class ProductCreate(ProductBase):
    created_at_input: Optional[datetime] = Field(default_factory=datetime.now)

class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

class ProductUpdate(BaseModel):
    comercial_name: Optional[str] = None
    active_ingredient: Optional[str] = None
    description: Optional[str] = None
    SKU: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    price: Optional[float] = None



