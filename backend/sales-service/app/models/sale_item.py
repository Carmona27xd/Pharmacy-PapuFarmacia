from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, func
from sqlalchemy.orm import relationship
from app.database import Base

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float(10,2), nullable=False)
    subtotal = Column(Float(10,2), nullable=False)
