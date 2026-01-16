from motor.motor_asyncio import AsyncIOMotorClient
from app.schemas import SaleCreate
from datetime import datetime

class SalesService:
    def __init__(self, db_client: AsyncIOMotorClient):
        self.client = db_client
        
        self.database = self.client.get_database("pharma_sales")
        self.collection = self.database.get_collection("sales_history")

    async def create_sale(self, sale_data: SaleCreate):
        # 1. Convertimos el modelo Pydantic a Diccionario
        sale_dict = sale_data.dict()
        
        # 2. Agregamos la fecha y hora exacta de la venta
        sale_dict["sale_date"] = datetime.now()
        
        # 3. Insertamos en MongoDB
        result = await self.collection.insert_one(sale_dict)
        
        # 4. Retornamos el ID generado
        return str(result.inserted_id)

    async def get_all_sales(self, limit: int = 100):
        sales = []
        cursor = self.collection.find().sort("sale_date", -1).limit(limit)
        
        async for document in cursor:
            document["id"] = str(document["_id"])
            sales.append(document)
        
        return sales