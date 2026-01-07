from fastapi import APIRouter, HTTPException, Depends, status

router = APIRouter(
    # prefix="/api/sales",
    tags=["Sales"]
)

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