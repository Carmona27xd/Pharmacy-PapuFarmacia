from fastapi import FastAPI, HTTPException, Request, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List
import os

from app import schemas
from app.services.suppliers_service import SupplierService
from app.schemas import SupplierUpdate

from fastapi.middleware.cors import CORSMiddleware

MONGO_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Conectando a MongoDB...")
    app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
    app.database = app.mongodb_client.get_default_database()
    print("¡Conexión exitosa a la BD de Proveedores!")
    
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

@app.post("/suppliers", status_code = 201)
async def create_supplier(supplier: schemas.SupplierCreate, request: Request):
    service = SupplierService(request.app.mongodb_client)
    supplier_id = await service.register_supplier(supplier)

    if not supplier_id:
        raise HTTPException(status_code = 400, detail = "No se pudo registrar el proveedor.")
    
    return {
        "message": "Proveedor registrado",
        "ID": supplier_id
    }
    
@app.get("/suppliers", response_model=List[schemas.SupplierResponse])
async def read_suppliers(request: Request, skip: int = 0, limit: int = 100):
    service = SupplierService(request.app.mongodb_client)
    
    suppliers = await service.get_suppliers(skip=skip, limit=limit)
    return suppliers

@app.delete("/suppliers/{licence_number}")
async def delete_supplier(licence_number: str, request: Request):
    service = SupplierService(request.app.mongodb_client)

    delete = await service.delete_supplier(licence_number)
    if not delete:
        raise HTTPException(status_code = 404, detail = "No se encontro el proveedor")
    
    return {"message": "Proveedor eliminado exitosamente"}

@app.patch("/suppliers/{licence_number}")
async def update_supplier(licence_number: str, supplier: SupplierUpdate, request: Request):
    service = SupplierService(request.app.mongodb_client)

    updated_supplier = await service.update_supplier(licence_number, supplier)
    
    if not update_supplier:
        raise HTTPException(status_code = 404, detail = f"No se encontro el proveedor")
    
    return {
        "message": "Provedor actualizado",
        "data": updated_supplier
    }

@app.get("/suppliers/{licence_number}", response_model=schemas.SupplierResponse)
async def read_supplier(licence_number: str, request: Request):
    service = SupplierService(request.app.mongodb_client)
    
    supplier = await service.get_supplier_by_licence(licence_number)
    
    if not supplier:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    return supplier