from sqlalchemy.orm import Session
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.schemas.sale import SaleCreate
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
