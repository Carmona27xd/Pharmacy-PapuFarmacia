from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    productTypeId = Column(Integer, nullable=False, index=True)
    chemicalName = Column(String(255), nullable=True)
    comercialName = Column(String(255), nullable=False, index=True)
    imagen = Column(String(500), nullable=True)  # Ruta de la imagen
    description = Column(String(1000), nullable=True)
    price = Column(Float, nullable=False)
    outdate = Column(Date, nullable=True)
    stock = Column(Integer, nullable=False, default=0)
    batch = Column(String(100), nullable=False)
    provider = Column(String(255), nullable=False)
    pharmaceutical = Column(String(255), nullable=True)

    def __repr__(self):
        return f"<Product(id={self.id}, name={self.comercialName})>"