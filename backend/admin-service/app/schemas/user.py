from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    username: Optional[str]
    is_active: bool = True
    role_id: Optional[int]

    class Config:
        from_attributes = True