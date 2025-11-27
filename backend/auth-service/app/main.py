from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 

from app import schemas
from app.database import get_db
from app.dependencies.dependencies import get_current_user, oauth2_scheme
from app.services.auth_service import AuthService, get_auth_service
from sqlalchemy.exc import IntegrityError

#yet to add pwd recovery

app = FastAPI(title="Auth service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:4200",
        "*"
        # añade otras orígenes si las necesitas
    ],           # no usar "*" si usas Authorization + credentials
    allow_credentials=False,
    #allow_methods=["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
    allow_methods="*",
    allow_headers=["Authorization","Content-Type","Accept","X-Requested-With"],
)

# --- API Endpoints ---
@app.post("/register", response_model=schemas.User)
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
    
@app.post("/login", response_model=schemas.Token)
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
    
@app.get("/verify-token")
def verify_token(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.get("/health")
def health_check():
    return {"status": "ok"}