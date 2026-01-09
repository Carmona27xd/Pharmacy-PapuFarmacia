from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user

def admin_required(user=Depends(get_current_user)):
    if user["role_id"] != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return user