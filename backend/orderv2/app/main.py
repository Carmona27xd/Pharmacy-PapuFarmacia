from fastapi import FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List
import os

from app import schemas
from app.services.ordersv2_services import PurchaseService
from fastapi.middleware.cors import CORSMiddleware

# Conexión a Mongo (Contenedor carmona_mongo)
MONGO_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Conectando a MongoDB (Servicio de Órdenes de Compra)...")
    app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
    yield 
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Purchase Order Service"}

# --- ENDPOINTS ---

@app.post("/orders", response_model=dict, status_code=201)
async def create_purchase_order(order: schemas.PurchaseOrderCreate, request: Request):
    service = PurchaseService(request.app.mongodb_client)
    order_id = await service.create_order(order)
    
    if not order_id:
        raise HTTPException(status_code=500, detail="Error al generar la orden")
    
    return {
        "message": "Orden de compra generada con éxito",
        "order_id": order_id
    }

@app.get("/orders", response_model=List[schemas.PurchaseOrderResponse])
async def get_all_orders(request: Request):
    service = PurchaseService(request.app.mongodb_client)
    return await service.get_orders_history()