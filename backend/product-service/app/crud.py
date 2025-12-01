from sqlalchemy.orm import Session
from . import models, schemas

def get_products(db: Session):
    return db.query(models.Product).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def post_product(db: Session, product: schemas.ProductCreate, image_path: str | None):
    db_product = models.Product(**product.dict(), imagen=image_path)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def put_product(db: Session, product_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        # Example update logic; in practice, you'd pass in the fields to update
        product.name = product.name + " (Updated)"
        db.commit()
        db.refresh(product)
    return product

def delete_product(db: Session, product_id: int):
    product = get_product(db, product_id)
    if product:
        db.delete(product)
        db.commit()
    return product
