from sqlalchemy.orm import Session
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.schemas.sale import SaleCreate
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, OperationalError

def create_sale(db: Session, sale: SaleCreate, user_id: int):
    try:
        total = 0
        sale_items = []

        for item in sale.items:
            subtotal = item.quantity * item.unit_price
            total += subtotal
            sale_items.append((item, subtotal))

        new_sale = Sale(
            user_id=user_id,
            total_amount=total,
            payment_method=sale.payment_method
        )

        db.add(new_sale)
        db.flush()

        for item, subtotal in sale_items:
            sale_item = SaleItem(
                sale_id=new_sale.id,
                product_id=item.product_id,
                product_name=item.product_name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=subtotal
            )
            db.add(sale_item)

        db.commit()
        db.refresh(new_sale)
        db.refresh(new_sale, attribute_names=["items"])
        return new_sale

    except IntegrityError as e:
        db.rollback()
        raise ValueError("Integrity error while creating sale", str(e))

    except OperationalError as e:
        db.rollback()
        raise ConnectionError("Database connection error", str(e))

    except Exception as e:
        db.rollback()
        # while debugging:
        raise e

def get_sale_by_id(db: Session, sale_id: int):
    try:
        sale = db.query(Sale).filter(Sale.id == sale_id).first()
        if not sale:
            raise ValueError("Sale not found")
        return sale
    except IntegrityError as e:
        raise ValueError("Integrity error while retrieving sale", str(e))
    except OperationalError as e:
        raise ConnectionError("Database connection error", str(e))
    except Exception as e:
        raise e

def get_sales_by_user(db: Session, user_id: int):
    try:
        sales = db.query(Sale).filter(Sale.user_id == user_id).all()
        if not sales:
            raise ValueError("No sales found for the user")
        return sales
    except IntegrityError as e:
        raise ValueError("Integrity error while retrieving sales", str(e))
    except OperationalError as e:
        raise ConnectionError("Database connection error", str(e))
    except Exception as e:
        raise e

def list_sales(db: Session, filters: dict, page: int, size: int):
    try:
        query = db.query(Sale)

        if filters.get("date_from") and filters.get("date_to"):
            query = query.filter(
                Sale.created_at.between(filters["date_from"], filters["date_to"])
            )
        elif filters.get("date_from"):
            query = query.filter(Sale.created_at >= filters["date_from"])
        elif filters.get("date_to"):
            query = query.filter(Sale.created_at <= filters["date_to"])
        
        if filters.get("payment_method"):
            query = query.filter(Sale.payment_method == filters["payment_method"])

        if filters.get("user_id"):
            query = query.filter(Sale.user_id == filters["user_id"])
            
        if filters.get("min_total") and filters.get("max_total"):
            query = query.filter(
                Sale.total_amount.between(filters["min_total"], filters["max_total"])
            )
        elif filters.get("min_total"):
            query = query.filter(Sale.total_amount >= filters["min_total"])
        elif filters.get("max_total"):
            query = query.filter(Sale.total_amount <= filters["max_total"])
        
        total = query.count()

        sales = (
            query
            .options(selectinload(Sale.items))
            .order_by(Sale.created_at.desc())
            .offset((page - 1) * size)
            .limit(size)
            .all()
        )


        return {
            "total": total,
            "page": page,
            "size": size,
            "sales": sales
        }
    except IntegrityError as e:
        raise ValueError("Integrity error while listing sales", str(e))
    except OperationalError as e:
        raise ConnectionError("Database connection error", str(e))
    except Exception as e:
        print("DEBUG repository error:", repr(e))
        raise e

def get_all_sales(db: Session):
    try:
        sales = db.query(Sale).all()
        return sales
    except IntegrityError as e:
        raise ValueError("Integrity error while retrieving sales", str(e))
    except OperationalError as e:
        raise ConnectionError("Database connection error", str(e))

