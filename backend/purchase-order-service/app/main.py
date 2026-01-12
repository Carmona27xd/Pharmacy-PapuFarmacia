from fastapi import FastAPI, HTTPException, Request, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List
import os

from app import schemas
from app.services.orders_service import PurchaseOrderService
from app.schemas import PurchaseOrderUpdate

from fastapi.middleware.cors import CORSMiddleware

MONGO_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Conectando a MongoDB...")
    app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
    app.database = app.mongodb_client.get_default_database()
    print("¡Conexión exitosa a la BD de ordenes de compra!")
    
    yield 
    
    print("Cerrando conexión a MongoDB...")
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # Opción Nuclear: Permitir todo ("*") para que no te de lata en desarrollo
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/orders", status_code = 201)
async def create_purchase_order(purchase_order: schemas.PurchaseOrderCreate, request: Request):
    service = PurchaseOrderService(request.app.mongodb_client)
    order_id = await service.register_purchase_order(purchase_order)

    if not order_id:
        raise HTTPException(status_code = 400, detail = "No se pudo registrar la orden de compra.")
    
    return {
        "message": "Orden de compra registrada",
        "ID": order_id
    }

@app.get("/orders", response_model = List[schemas.PurchaseOrderResponse])
async def read_purchase_orders(request: Request, skip: int = 0, limit: int = 100):
    service = PurchaseOrderService(request.app.mongodb_client)

    orders = await service.get_purchase_orders(skip=skip, limit=limit)
    return orders
