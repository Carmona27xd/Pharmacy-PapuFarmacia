from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from contextlib import asynccontextmanager
import os
import base64

# Configuración de la base de datos

POSTGRES_USER = os.getenv("POSTGRES_PRODUCT_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PRODUCT_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_PRODUCT_DB")
POSTGRES_HOST = os.getenv("POSTGRES_PRODUCT_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PRODUCT_PORT")
DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelos de la base de datos
class ProductType(Base):
    __tablename__ = "product_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    products = relationship("Product", back_populates="product_type")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    product_type_id = Column(Integer, ForeignKey("product_types.id"), nullable=False)
    chemical_name = Column(String(200))
    commercial_name = Column(String(200), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    expiration_date = Column(Date)
    stock = Column(Integer, default=0)
    batch = Column(String(100))
    supplier = Column(String(200))
    pharmaceutical = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    product_type = relationship("ProductType", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_data = Column(Text, nullable=False)  # Base64 encoded
    is_primary = Column(Integer, default=0)
    
    product = relationship("Product", back_populates="images")

# Modelos Pydantic
class ProductTypeCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProductTypeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    
    class Config:
        from_attributes = True

class ProductImageResponse(BaseModel):
    id: int
    image_data: str
    is_primary: bool
    
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    product_type_id: int
    chemical_name: Optional[str] = None
    commercial_name: str
    description: Optional[str] = None
    price: float = Field(gt=0)
    expiration_date: Optional[date] = None
    stock: int = Field(ge=0, default=0)
    batch: Optional[str] = None
    supplier: Optional[str] = None
    pharmaceutical: Optional[str] = None

class ProductUpdate(BaseModel):
    product_type_id: Optional[int] = None
    chemical_name: Optional[str] = None
    commercial_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(gt=0, default=None)
    expiration_date: Optional[date] = None
    stock: Optional[int] = Field(ge=0, default=None)
    batch: Optional[str] = None
    supplier: Optional[str] = None
    pharmaceutical: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    product_type_id: int
    product_type: ProductTypeResponse
    chemical_name: Optional[str]
    commercial_name: str
    description: Optional[str]
    price: float
    expiration_date: Optional[date]
    stock: int
    batch: Optional[str]
    supplier: Optional[str]
    pharmaceutical: Optional[str]
    images: List[ProductImageResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown

# FastAPI app
app = FastAPI(
    title="Pharmacy Products API",
    description="API para gestión de productos farmacéuticos",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints - Tipos de Producto
@app.post("/product-types/", response_model=ProductTypeResponse, status_code=201)
def create_product_type(product_type: ProductTypeCreate, db: Session = next(get_db())):
    db_type = ProductType(**product_type.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type

@app.get("/product-types/", response_model=List[ProductTypeResponse])
def get_product_types(skip: int = 0, limit: int = 100, db: Session = next(get_db())):
    return db.query(ProductType).offset(skip).limit(limit).all()

@app.get("/product-types/{type_id}", response_model=ProductTypeResponse)
def get_product_type(type_id: int, db: Session = next(get_db())):
    db_type = db.query(ProductType).filter(ProductType.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Tipo de producto no encontrado")
    return db_type

# Endpoints - Productos
@app.post("/products/", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate, db: Session = next(get_db())):
    # Verificar que el tipo de producto existe
    product_type = db.query(ProductType).filter(ProductType.id == product.product_type_id).first()
    if not product_type:
        raise HTTPException(status_code=404, detail="Tipo de producto no encontrado")
    
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    product_type_id: Optional[int] = None,
    db: Session = next(get_db())
):
    query = db.query(Product)
    if product_type_id:
        query = query.filter(Product.product_type_id == product_type_id)
    return query.offset(skip).limit(limit).all()

@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = next(get_db())):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@app.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, db: Session = next(get_db())):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    update_data = product.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db_product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = next(get_db())):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db.delete(db_product)
    db.commit()
    return None

# Endpoints - Imágenes
@app.post("/products/{product_id}/images/", status_code=201)
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = False,
    db: Session = next(get_db())
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    contents = await file.read()
    encoded = base64.b64encode(contents).decode('utf-8')
    
    if is_primary:
        db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_primary": 0})
    
    db_image = ProductImage(
        product_id=product_id,
        image_data=encoded,
        is_primary=1 if is_primary else 0
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return {"id": db_image.id, "message": "Imagen cargada exitosamente"}

@app.delete("/products/{product_id}/images/{image_id}", status_code=204)
def delete_product_image(product_id: int, image_id: int, db: Session = next(get_db())):
    db_image = db.query(ProductImage).filter(
        ProductImage.id == image_id,
        ProductImage.product_id == product_id
    ).first()
    
    if not db_image:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    
    db.delete(db_image)
    db.commit()
    return None

@app.get("/")
def root():
    return {
        "message": "Pharmacy Products API",
        "version": "1.0.0",
        "docs": "/docs"
    }