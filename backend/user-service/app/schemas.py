from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime

class AllowedProfilePictures(str, Enum):
    AVATAR1 = "avatar1.png"
    AVATAR2 = "avatar2.png"
    AVATAR3 = "avatar3.png"
    AVATAR4 = "avatar4.png"

class UserProfileBase(BaseModel):
    profile_picture: AllowedProfilePictures = AllowedProfilePictures.AVATAR1

class UserProfileCreate(UserProfileBase):
    user_id: int

class UserProfileUpdate(BaseModel):
    profile_picture: Optional[AllowedProfilePictures] = None

class UserProfileResponse(UserProfileBase):
    user_id: int 
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True