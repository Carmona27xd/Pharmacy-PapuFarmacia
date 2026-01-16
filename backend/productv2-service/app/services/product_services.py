from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime 
from pymongo import ReturnDocument

# Asegúrate de importar tus esquemas de productos aquí
from app.schemas import ProductCreate, ProductUpdate

class ProductService:
    def __init__(self, db_client: AsyncIOMotorClient):
        # Usamos una base de datos específica para productos
        self.db = db_client["pharma_products"]
        self.collection = self.db["products"]

    async def create_product(self, product: ProductCreate):
        # 1. Verificamos duplicados por SKU (Stock Keeping Unit)
        existing = await self.collection.find_one({"SKU": product.SKU})
        if existing:
            raise ValueError(f"El producto con SKU {product.SKU} ya existe.")
        
        # 2. Preparamos el diccionario
        product_dict = product.dict()
        product_dict["created_at"] = datetime.now()
        product_dict["updated_at"] = datetime.now()

        # 3. Insertamos en Mongo
        result = await self.collection.insert_one(product_dict)
        return str(result.inserted_id)
    
    async def get_products(self, skip: int = 0, limit: int = 100):
        cursor = self.collection.find().skip(skip).limit(limit)

        products = []
        async for document in cursor:
            document["id"] = str(document["_id"])
            products.append(document)

        return products
    
    async def get_product_by_sku(self, sku: str):
        # Buscamos por SKU en lugar de licencia
        document = await self.collection.find_one({"SKU": sku})

        if document: 
            document["id"] = str(document["_id"])
            return document
        
        return None
    
    async def delete_product(self, sku: str):
        # Borramos usando el SKU
        result = await self.collection.delete_one({"SKU": sku})
        return result.deleted_count > 0
    
    async def update_product(self, sku: str, product_data: ProductUpdate):
        # exclude_unset=True es vital para que sea un PATCH real (solo actualiza lo que envías)
        data = product_data.dict(exclude_unset=True)

        if not data: 
            return None
        
        data["updated_at"] = datetime.now()
        
        updated_product = await self.collection.find_one_and_update(
            {"SKU": sku}, 
            {"$set": data},
            return_document=ReturnDocument.AFTER
        )

        if updated_product:
            updated_product["id"] = str(updated_product["_id"])
            del updated_product["_id"]
            return updated_product
        
        return None
    
    async def get_products_by_category(self, category: str):
        filter_query = {"category": {"$regex": category, "$options": "i"}}
        
        cursor = self.collection.find(filter_query)

        products = []
        async for document in cursor:
            document["id"] = str(document["_id"])
            products.append(document)

        return products
    
    async def get_products_by_name(self, name: str):
        cursor = self.collection.find({
            "comercial_name": {"$regex": name, "$options": "i"}
        })

        products = []
        async for document in cursor:
            document["id"] = str(document["_id"])
            products.append(document)

        return products
    
    async def get_products_by_active_ingredient(self, ingredient: str):
        cursor = self.collection.find({
            "active_ingredient": {"$regex": ingredient, "$options": "i"}
        })

        products = []
        async for document in cursor:
            document["id"] = str(document["_id"])
            products.append(document)

        return products