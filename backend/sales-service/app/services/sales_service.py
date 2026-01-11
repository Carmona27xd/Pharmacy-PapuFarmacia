from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.repositories import sale_repository
from app.schemas.sale import SaleCreate, SaleResponse, SaleRead


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
    
    def get_sale(self, sale_id: int) -> SaleRead:
        try:
            sale = sale_repository.get_sale_by_id(self.db, sale_id)
            if not sale:
                raise ValueError("Sale not found")
            return sale
        except (ValueError, ConnectionError) as e:
            raise e
        except Exception as e:
            raise Exception("Failed to retrieve sale") from e

    def list_sales(self, filters: dict, page: int, size: int) -> dict:
        try:
            sales = sale_repository.list_sales(self.db, filters or {}, page, size)
            return sales
        except Exception as e:
            print("DEBUG list_sales error:", repr(e))  # or logging
            raise Exception("Failed to list sales") from e


    def get_all_sales(self):
        try:
            sales = sale_repository.get_all_sales(self.db)
            if not sales:
                raise ValueError("No sales found")
            return sales
        except (ValueError, ConnectionError) as e:
            raise e
        except Exception as e:
            raise Exception("Failed to retrieve sales") from e


def get_sales_service(db: Session = Depends(get_db)):
    return SalesService(db)