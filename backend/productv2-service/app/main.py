from fastapi import FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List
import os

# Asegúrate de importar tus esquemas y servicio de productos
from app import schemas
from app.services.product_services import ProductService # <--- Ojo al nombre del archivo
from app.schemas import ProductUpdate

from fastapi.middleware.cors import CORSMiddleware

# Configuración de la DB (Puede ser la misma URL, pero el servicio elegirá la DB 'pharma_products')
MONGO_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Conectando a MongoDB (Servicio de Productos)...")
    app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
    app.database = app.mongodb_client.get_default_database()
    print("¡Conexión exitosa a la BD de Productos!")
    
    yield 
    
    print("Cerrando conexión a MongoDB...")
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

# Configuración de CORS (Igual que en suppliers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Product Service"}

# ==========================================
# CRUD BÁSICO (CREATE, READ, UPDATE, DELETE)
# ==========================================

@app.post("/products", status_code=201)
async def create_product(product: schemas.ProductCreate, request: Request):
    service = ProductService(request.app.mongodb_client)
    product_id = await service.create_product(product)

    if not product_id:
        raise HTTPException(status_code=400, detail="No se pudo registrar el producto.")
    
    return {
        "message": "Producto registrado exitosamente",
        "ID": product_id,
        "SKU": product.SKU
    }

@app.get("/products", response_model=List[schemas.ProductResponse])
async def read_products(request: Request, skip: int = 0, limit: int = 100):
    service = ProductService(request.app.mongodb_client)
    products = await service.get_products(skip=skip, limit=limit)
    return products

@app.get("/products/{sku}", response_model=schemas.ProductResponse)
async def read_product_by_sku(sku: str, request: Request):
    service = ProductService(request.app.mongodb_client)
    product = await service.get_product_by_sku(sku)
    
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return product

@app.patch("/products/{sku}")
async def update_product(sku: str, product: ProductUpdate, request: Request):
    service = ProductService(request.app.mongodb_client)
    
    updated_product = await service.update_product(sku, product)
    
    if not updated_product:
        raise HTTPException(status_code=404, detail="No se encontró el producto para actualizar")
    
    return {
        "message": "Producto actualizado",
        "data": updated_product
    }

@app.delete("/products/{sku}")
async def delete_product(sku: str, request: Request):
    service = ProductService(request.app.mongodb_client)
    
    deleted = await service.delete_product(sku)
    if not deleted:
        raise HTTPException(status_code=404, detail="No se encontró el producto a eliminar")
    
    return {"message": "Producto eliminado exitosamente"}

# ==========================================
# ENDPOINTS DE BÚSQUEDA AVANZADA
# ==========================================

@app.get("/products/category/{category_name}", response_model=List[schemas.ProductResponse])
async def search_by_category(category_name: str, request: Request):
    service = ProductService(request.app.mongodb_client)
    return await service.get_products_by_category(category_name)

@app.get("/products/search-name/{name}", response_model=List[schemas.ProductResponse])
async def search_by_name(name: str, request: Request):
    service = ProductService(request.app.mongodb_client)
    return await service.get_products_by_name(name)

@app.get("/products/search-ingredient/{ingredient}", response_model=List[schemas.ProductResponse])
async def search_by_ingredient(ingredient: str, request: Request):
    service = ProductService(request.app.mongodb_client)
    return await service.get_products_by_active_ingredient(ingredient)

