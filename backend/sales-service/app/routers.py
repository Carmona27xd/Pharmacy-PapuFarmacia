from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from app.schemas.sale import SaleResponse, SaleCreate, SaleRead, SalesListResponse
from typing import Optional
from datetime import datetime
from app.core.security import get_current_user
from app.services.sales_service import SalesService, get_sales_service
from app.services.report_service import ReportService, get_report_service
from fastapi.responses import JSONResponse, StreamingResponse

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

@router.get("/sales/{sale_id}", response_model=SaleRead)
def get_sale(
    sale_id: int,
    current_user = Depends(get_current_user),
    sales_service: SalesService = Depends(get_sales_service)
):
    try:
        return sales_service.get_sale(sale_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=repr(e)
        )

@router.get("/sales/", response_model=SalesListResponse)
async def get_sales(
    page: int = 1,
    size: int = 10,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    payment_method: Optional[str] = None,
    user_id: Optional[int] = None,
    min_total: Optional[float] = None,
    max_total: Optional[float] = None,
    current_user = Depends(get_current_user),
    sales_service: SalesService = Depends(get_sales_service)
):
    try:
        filters = {
            "date_from": date_from,
            "date_to": date_to,
            "payment_method": payment_method,
            "user_id": user_id,
            "min_total": min_total,
            "max_total": max_total
        }

        return sales_service.list_sales(filters, page, size)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=repr(e)
        )

@router.get("/reports/cash-closing")
def cash_closing_report(
    date_from: datetime,
    date_to: datetime,
    current_user = Depends(get_current_user),
    report_service: ReportService = Depends(get_report_service)
):
    try:
        pdf_buffer = report_service.generate_sales_report(date_from, date_to)

    
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=cash_closing_report.pdf"}
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=repr(e)
        )