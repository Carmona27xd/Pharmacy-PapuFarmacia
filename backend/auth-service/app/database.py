from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

POSTGRES_USER = os.getenv("POSTGRES_AUTH_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_AUTH_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_AUTH_HOST")
POSTGRES_DB = os.getenv("POSTGRES_AUTH_DB")
POSTGRES_PORT = os.getenv("POSTGRES_AUTH_PORT")
SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Create engine and session
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