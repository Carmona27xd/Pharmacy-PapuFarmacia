from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime 
from pymongo import ReturnDocument

from app.schemas import PurchaseOrderCreate, PurchaseOrderUpdate

class PurchaseOrderService: 
    def __init__(self, db_client: AsyncIOMotorClient):
        self.db = db_client["pharma_purchase_order"]
        self.collection = self.db["purchase_orders"]
    
    async def register_purchase_order(self, purchase_order: PurchaseOrderCreate):
        purchase_order_dict = purchase_order.dict()
        purchase_order_dict["created_at"] = datetime.now()
        purchase_order_dict["updated_at"] = datetime.now()

        result = await self.collection.insert_one(purchase_order_dict)
        return str(result.inserted_id)
    
    async def get_purchase_orders(self, skip: int = 0, limit: int = 100):
        cursor = self.collection.find().skip(skip).limit(limit)

        purchase_orders = []
        async for document in cursor:
            document["id"] = str(document["_id"])
            purchase_orders.append(document)

        return purchase_orders
    
    
    
