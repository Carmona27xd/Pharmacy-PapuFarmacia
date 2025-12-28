from fastapi import FastAPI, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
import os

from app.services.product_service import ProductService
from app import schemas 

app = FastAPI(title="Pharma Product Service")

MONGO_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")

db_client: AsyncIOMotorClient = None

@app.on_event("startup")
async def startup_db_client():
    global db_client
    db_client = AsyncIOMotorClient(MONGO_URL)
    print("Conectado a Mongo DB")

@app.on_event("shutdown")
async def shutdown_db_client():
    db_client.close()

def get_product_service():
    return ProductService(db_client)

@app.post("/products", status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: schemas.ProductCreate,
    service: ProductService = Depends(get_product_service) 
):
    try:
        product_id = await service.register_product(product_data)
        return {"message": "Producto registrado", "id": product_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

