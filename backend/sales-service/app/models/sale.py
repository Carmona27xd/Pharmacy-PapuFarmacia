from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, func
from sqlalchemy.orm import relationship
from app.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    total_amount = Column(Float(10,2), nullable=False)
    payment_method = Column(String(30), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")