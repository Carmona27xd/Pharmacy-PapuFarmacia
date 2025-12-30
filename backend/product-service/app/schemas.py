from pydantic import BaseModel, Field, ConfigDict
from datetime import date
from typing import Optional

class ProductBase(BaseModel):
    productTypeId: int = Field(..., description="ID of the product type")
    chemicalName: Optional[str] = Field(None, max_length=255)
    comercialName: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    price: float = Field(..., gt=0, description="Price must be greater than zero")
    outdate: Optional[date] = None
    stock: int = Field(..., ge=0, description="Stock must be zero or positive")
    batch: str = Field(..., min_length=1, max_length=100)
    provider: str = Field(..., min_length=1, max_length=255)
    pharmaceutical: Optional[str] = Field(None, max_length=255)
    imagen: Optional[str] = Field(None, max_length=500)

class ProductCreate(ProductBase):
    """Schema for create a product"""
    pass

class ProductUpdate(BaseModel):
    """Schema for update a product (all fields optional)"""
    productTypeId: Optional[int] = None
    chemicalName: Optional[str] = None
    comercialName: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    outdate: Optional[date] = None
    stock: Optional[int] = Field(None, ge=0)
    batch: Optional[str] = None
    provider: Optional[str] = None
    pharmaceutical: Optional[str] = None
    imagen: Optional[str] = None

class Product(ProductBase):
    """Schema for response of product"""
    id: int
    
    model_config = ConfigDict(from_attributes=True)