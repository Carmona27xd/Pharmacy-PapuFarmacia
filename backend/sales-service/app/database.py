from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

POSTGRES_SALES_USER = os.getenv("POSTGRES_SALES_USER")
POSTGRES_SALES_PASSWORD = os.getenv("POSTGRES_SALES_PASSWORD")
POSTGRES_SALES_HOST = os.getenv("POSTGRES_SALES_HOST")
POSTGRES_SALES_DB = os.getenv("POSTGRES_SALES_DB")
POSTGRES_SALES_PORT = os.getenv("POSTGRES_SALES_PORT")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_SALES_USER}:{POSTGRES_SALES_PASSWORD}@{POSTGRES_SALES_HOST}:{POSTGRES_SALES_PORT}/{POSTGRES_SALES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get a DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    except: 
        db.rollback()
        raise
    finally:
        db.close()