from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

POSTGRES_USER = os.getenv("POSTGRES_PRODUCT_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PRODUCT_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_PRODUCT_DB")
POSTGRES_HOST = os.getenv("POSTGRES_PRODUCT_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PRODUCT_PORT")
DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependencia
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)