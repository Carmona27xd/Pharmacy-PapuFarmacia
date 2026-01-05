from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    """Obtain all products with pagination"""
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int) -> models.Product:
    """Obtain a product by its ID"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} no found"
        )
    return product

def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    """Create a new product"""
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    try:
        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error while creating a new product: {str(e)}"
        )

def update_product(
    db: Session, 
    product_id: int, 
    product_update: schemas.ProductUpdate
) -> models.Product:
    """Update an existing product"""
    db_product = get_product(db, product_id)
    
    update_data = product_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    try:
        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error while updating product: {str(e)}"
        )

def delete_product(db: Session, product_id: int) -> models.Product:
    """Delete a product by its ID"""
    db_product = get_product(db, product_id)
    
    try:
        db.delete(db_product)
        db.commit()
        return db_product
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error while deleting product: {str(e)}"
        )

def search_products(
    db: Session, 
    name: Optional[str] = None,
    provider: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
) -> List[models.Product]:
    """Search products by various criteria"""
    query = db.query(models.Product)
    
    if name:
        query = query.filter(models.Product.comercialName.ilike(f"%{name}%"))
    if provider:
        query = query.filter(models.Product.provider.ilike(f"%{provider}%"))
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)
    
    return query.all()