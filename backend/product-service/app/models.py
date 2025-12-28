from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, nullable=False)
    nombre_quimico = Column(String, nullable=True)
    nombre_comercial = Column(String, nullable=False)
    imagen = Column(String, nullable=True)  # Ruta o archivo
    descripcion = Column(String, nullable=True)
    precio = Column(Float, nullable=False)
    fecha_caducidad = Column(Date, nullable=True)
    stock = Column(Integer, nullable=False)
    lote = Column(String, nullable=False)
    proveedor = Column(String, nullable=False)
    farmaceutica = Column(String, nullable=True)
