from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.repositories import sale_repository
from app.schemas.sale import SaleCreate, SaleResponse


class SalesService:
    def __init__(self, db: Session):
        self.db = db

    def create_sale(self, user_id: int, sale_data: SaleCreate) -> SaleResponse:
        try:
            return sale_repository.create_sale(self.db, sale_data, user_id)
        except (ValueError, ConnectionError) as e:
            raise e
        except Exception as e:
            raise Exception("Failed to create sale") from e
    

def get_sales_service(db: Session = Depends(get_db)):
    return SalesService(db)