from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.dependencies.dependencies import get_admin_service
from app.services.admin_service import AdminService
from app.schemas.user import User
from app.core.security import admin_required

router = APIRouter(prefix="/api/admin", tags=["Admin"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

@router.get("/users", response_model=list[User])
async def list_users(
    limit: int = 50,
    offset: int = 0,
    token: str = Depends(oauth2_scheme),
    current_user=Depends(admin_required),
    admin_service: AdminService = Depends(get_admin_service),
):
    return await admin_service.list_users(token, limit, offset)


@router.patch("/users/{user_id}/ban", response_model=User)
async def ban_user(
    user_id: int,
    token: str = Depends(oauth2_scheme),
    current_user=Depends(admin_required),
    admin_service: AdminService = Depends(get_admin_service),
):
    return await admin_service.ban_user(token, user_id)


@router.patch("/users/{user_id}/unban", response_model=User)
async def unban_user(
    user_id: int,
    token: str = Depends(oauth2_scheme),
    current_user=Depends(admin_required),
    admin_service: AdminService = Depends(get_admin_service),
):
    return await admin_service.unban_user(token, user_id)
