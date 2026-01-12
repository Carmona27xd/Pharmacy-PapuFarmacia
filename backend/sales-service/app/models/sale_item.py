from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, func
from sqlalchemy.orm import relationship
from app.database import Base

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id", ondelete="CASCADE"), nullable=False)

    product_id = Column(Integer, nullable=False)
    product_name = Column(String(255), nullable=False)

    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float(10,2), nullable=False)
    discount = Column(Float(10,2), default=0.0)

    subtotal = Column(Float(10,2), nullable=False)

    sale = relationship("Sale", back_populates="items")

