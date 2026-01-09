from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from app.schemas.sale import SaleResponse, SaleCreate
from app.core.security import get_current_user
from app.services.sales_service import SalesService, get_sales_service

router = APIRouter(
    # prefix="/api/sales",
    tags=["Sales"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

@router.get("/")
def read_root():
    return {
        "message": "Sales Service API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@router.get("/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check the health status of the sales service")
def health_check():
    return {"status": "ok", "service": "sales-service"}

# Sales endpoints

@router.post("/sales", response_model=SaleResponse)
def create_sale(
    sale: SaleCreate,
    current_user = Depends(get_current_user),
    sales_service: SalesService = Depends(get_sales_service)
):
    try:
        return sales_service.create_sale(current_user["user_id"], sale)
    except ValueError as e:
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=str(e) # debugging purpose
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=repr(e)
        )