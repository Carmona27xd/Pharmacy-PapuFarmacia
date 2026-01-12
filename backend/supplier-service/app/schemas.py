from pydantic import BaseModel, Field 
from datetime import datetime
from typing import Optional

class SupplierBase(BaseModel):
    name: str = Field(..., example="SANDOZ")
    RFC: str = Field(..., example="CUCM002271R1")
    contact: str = Field(..., example="Martin Emmanuel Cruz Carmona")
    address: str = Field(..., example="Nuevo Xalapa, numero 18, 91078")
    phone: str = Field(..., example="228274516")
    email: str = Field(..., example="SANDOZ_COMPRADORES@domain.com")
    licence_number: str = Field(..., example="203300402AXXXX")
    licence_expiration: datetime
    supplier_type: str = Field(..., example="LABORATORIO")

class SupplierCreate(SupplierBase):
    date: datetime = Field(default_factory=datetime.now)

class SupplierResponse(SupplierBase):
    id: str
    created_at: datetime
    updated_at: datetime

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    RFC: Optional[str] = None
    contact: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    licence_number: Optional[str] = None
    licence_expiration: Optional[datetime] = None
    supplier_type: Optional[str] = None



