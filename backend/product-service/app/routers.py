from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import schemas, crud
from app.database import get_db

router = APIRouter()

# INFO ####################################################
@router.get("/")
def read_root():
    return {
        "message": "Product Service API",
        "version": "1.0.0",
        "docs": "api/products/docs"
    }
    
# Health ##################################################
@router.get("/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check the health status of the product service")
def health_check():
    return {"status": "ok", "service": "product-service"}

# Get list of products ####################################
@router.get(
    "/products", 
    response_model=List[schemas.Product],
    status_code=status.HTTP_200_OK,
    summary="Get all products",
    description="Retrieve a list of all products with optional pagination."
)
def get_products(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    return crud.get_products(db, skip=skip, limit=limit)

# Search product by query #################################
@router.get(
    "/search",
    response_model=List[schemas.Product],
    status_code=status.HTTP_200_OK,
    summary="Search products",
    description="Search products by name, provider or range of price"
)
def search_products(
    name: Optional[str] = Query(None, description="Commercial nanme of product"),
    provider: Optional[str] = Query(None, description="Provider name"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    db: Session = Depends(get_db)
):
    return crud.search_products(db, name, provider, min_price, max_price)

# Get product by ID #######################################
@router.get(
    "/{product_id}",
    response_model=schemas.Product,
    status_code=status.HTTP_200_OK,
    summary="Retrieve a product by ID",
    description="Get a single product using its unique ID."
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_product(db, product_id)

# Create product ##########################################
@router.post(
    "/",
    response_model=schemas.Product,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
    description="Create a new product in the database."
)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    # TODO Manage images upload
    return crud.create_product(db, product)

# Modicy product ##########################################
@router.put(
    "/{product_id}",
    response_model=schemas.Product,
    status_code=status.HTTP_200_OK,
    summary="Update a product",
    description="Update an existing product in the database."
)
def update_product(
    product_id: int,
    product: schemas.ProductUpdate,
    db: Session = Depends(get_db)
):
    return crud.update_product(db, product_id, product)

# Delete product by ID ####################################
@router.delete(
    "/{product_id}",
    response_model=schemas.Product,
    status_code=status.HTTP_200_OK,
    summary="Delete a product",
    description="Delete a product from the database."
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return crud.delete_product(db, product_id)