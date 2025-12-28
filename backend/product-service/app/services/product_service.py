from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

from app.schemas import ProductCreate

class ProductService:
    def __init__(self, db_client: AsyncIOMotorClient):
        self.db = db_client["pharma_inventory"]
        self.collection = self.db["products"]

    async def register_product(self, product: ProductCreate):
        existing = await self.collection.find_one({"sku": product.sku})
        if existing:
            raise ValueError(f"El SKU {product.sku} ya existe.")

        product_dict = product.dict()
        product_dict["created_at"] = datetime.utcnow()
        product_dict["updated_at"] = datetime.utcnow()

        result = await self.collection.insert_one(product_dict)
        return str(result.inserted_id)