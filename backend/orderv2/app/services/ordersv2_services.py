from motor.motor_asyncio import AsyncIOMotorClient
from app.schemas import PurchaseOrderCreate
from datetime import datetime

class PurchaseService:
    def __init__(self, db_client: AsyncIOMotorClient):
        self.client = db_client
        # Base de datos unificada para inventario y compras
        self.database = self.client.get_database("pharma_inventory")
        self.collection = self.database.get_collection("purchase_orders")

    async def create_order(self, order_data: PurchaseOrderCreate):
        """
        Inserta una nueva orden de compra en la base de datos.
        """
        # 1. Convertimos el objeto Pydantic a diccionario de Python
        order_dict = order_data.dict()
        
        # 2. Aseguramos la fecha de creación en el servidor
        order_dict["order_date"] = datetime.now()
        
        # 3. Insertamos en la colección
        result = await self.collection.insert_one(order_dict)
        
        # Devuelve el ID generado como string
        return str(result.inserted_id)

    async def get_orders_history(self, limit: int = 50):
        """
        Recupera el historial de órdenes, de la más reciente a la más antigua.
        """
        orders = []
        # Buscamos y ordenamos por fecha descendente
        cursor = self.collection.find().sort("order_date", -1).limit(limit)
        
        async for document in cursor:
            # Transformamos el _id de MongoDB (ObjectId) a id (string) 
            # para que coincida con nuestro esquema de respuesta
            document["id"] = str(document["_id"])
            orders.append(document)
            
        return orders