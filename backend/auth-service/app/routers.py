from fastapi import APIRouter, HTTPException, Depends, status
from app import schemas
from app.security import security
from app.database import get_db
from app.services.auth_service import AuthService, get_auth_service
from app.dependencies.dependencies import get_current_user, admin_required

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# --- API Endpoints ---
@router.post("/register", response_model=schemas.User)
def register(
    user: schemas.UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    try:
        return auth_service.register_user(user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service Unavailable, please try again later"
        )
    
@router.post("/login", response_model=schemas.Token)
def login(
    form_data: schemas.UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    try: 
        return auth_service.login_user(form_data.identifier, form_data.password)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service Unavailable, please try again later"
        )

@router.get("/me", response_model=schemas.FullUserResponse)
def get_full_user(
    token: str = Depends(security),
    current_user = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    try:
        return auth_service.get_all_user_data(
            current_user.id,
            token=token.credentials
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
@router.get("/verify-token")
def verify_token(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@router.get("/health")
def health_check():
    return {"status": "ok"}

#admin user mgmt
@router.get("/users", response_model=list[schemas.User])
def list_users(
    limit: int = 50,
    offset: int = 0,
    auth_service: AuthService = Depends(get_auth_service)
):
    try:
        return auth_service.get_all_users(limit=limit, offset=offset)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ConnectionError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )

@router.patch("/users/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    current_user = Depends(admin_required),
    auth_service: AuthService = Depends(get_auth_service)
):
    try:
        return auth_service.update_user(user_id, user_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ConnectionError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )