from fastapi import APIRouter, HTTPException, Depends, status
from app import schemas
from app.security import security
from app.database import get_db
from app.services.auth_service import AuthService, get_auth_service
from app.dependencies.dependencies import get_current_user, admin_required
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

router = APIRouter(
    # prefix="/api/auth", 
    tags=["Authentication"])

<<<<<<< HEAD
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# --- API Endpoints ---
=======
##########################################################################
@router.get("/")
def read_root():
    return {
        "message": "Auth Service API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@router.get("/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check the health status of the auth service")
def health_check():
    return {"status": "ok", "service": "auth-service"}

# --- API Endpoints --- ##################################################
>>>>>>> c577c07403639462b6402aa4920abaea4c82d96c
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
async def update_user(
    user_id: int,
    payload: schemas.UserUpdate,
    current_user=Depends(admin_required),
    auth_service: AuthService = Depends(get_auth_service)
):
    try:
        return auth_service.update_user(user_id, payload)
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
