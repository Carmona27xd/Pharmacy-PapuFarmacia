import shutil
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/api/product", tags=["Products"])

@router.get("/", response_model=list[schemas.Product])
def list_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return crud.get_product(db, product_id)

@router.post("/", response_model=schemas.Product)
async def post_product(
    product: schemas.ProductCreate,
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    image_path = None
    if image:
        image_path = f"images/{image.filename}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    return crud.create_product(db, product, image_path)

@router.put("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return crud.put_product(db, product_id)

@router.delete("/{product_id}", response_model=schemas.Product)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return crud.delete_product(db, product_id)

@router.get("/health")
def health_check():
    return {"status": "ok"}