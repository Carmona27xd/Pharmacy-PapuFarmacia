from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime 
from pymongo import ReturnDocument

from app.schemas import SupplierBase, SupplierCreate, SupplierUpdate

class SupplierService:
    def __init__(self, db_client: AsyncIOMotorClient):
        self.db = db_client["pharma_suppliers"]
        self.collection = self.db["suppliers"]

    async def register_supplier(self, supplier: SupplierCreate):
        existing = await self.collection.find_one({"licence_number": supplier.licence_number})
        if existing:
            raise ValueError(f"El proveedor con licencia {supplier.licence_number} ya existe.")
        
        supplier_dict = supplier.dict()
        supplier_dict["created_at"] = datetime.now()
        supplier_dict["updated_at"] = datetime.now()

        result = await self.collection.insert_one(supplier_dict)
        return str(result.inserted_id)
    
    async def get_suppliers(self, skip: int = 0, limit: int = 100):
        cursor = self.collection.find().skip(skip).limit(limit)

        suppliers = []
        async for document in cursor:
            document["id"] = str(document["_id"])
            suppliers.append(document)

        return suppliers
    
    async def delete_supplier(self, licence_number: str):
        result = await self.collection.delete_one({"licence_number": licence_number})
        return result.deleted_count > 0
    
    async def update_supplier(self, licence_number: str, supplier_data: SupplierUpdate):
        data = supplier_data.dict(exclude_unset = True)

        if not data: 
            return None
        
        data["updated_at"] = datetime.now()
        updated_supplier = await self.collection.find_one_and_update(
            {"licence_number": licence_number},
            {"$set": data},
            return_document = ReturnDocument.AFTER
        )

        if updated_supplier:
            updated_supplier["id"] = str(updated_supplier["_id"])
            del updated_supplier["_id"]
            return updated_supplier
        
        return None
    
    async def get_supplier_by_licence(self, licence_number: str):
        document = await self.collection.find_one({"licence_number": licence_number})

        if document: 
            document["id"] = str(document["_id"])
            return document
        
        return None


        


        


        
        