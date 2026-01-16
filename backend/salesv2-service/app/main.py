from fastapi import FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List
import os

from app import schemas
from app.services.sales_service import SalesService
from fastapi.middleware.cors import CORSMiddleware

# Conexión a Mongo (usará el mismo contenedor 'carmona_mongo')
MONGO_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Conectando a MongoDB (Servicio de Ventas)...")
    app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
    print("Conexión exitosa a Ventas")
    yield 
    print("Cerrando conexión...")
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

# CORS (Para que Angular pueda hablar con este puerto)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Sales Service"}

# --- ENDPOINTS ---

@app.post("/sales", response_model=dict, status_code=201)
async def register_sale(sale: schemas.SaleCreate, request: Request):
    
    service = SalesService(request.app.mongodb_client)
    sale_id = await service.create_sale(sale)
    
    if not sale_id:
        raise HTTPException(status_code=500, detail="No se pudo registrar la venta")
    
    return {
        "message": "Venta registrada con éxito",
        "sale_id": sale_id
    }

@app.get("/sales", response_model=List[schemas.SaleResponse])
async def get_sales_history(request: Request):
    
    service = SalesService(request.app.mongodb_client)
    return await service.get_all_sales()