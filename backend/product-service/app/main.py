from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.routers import router
from app.database import create_tables

async def lifespan(app: FastAPI):
    # Startup actions
    create_tables()
    yield
    # Shutdown actions

app = FastAPI(
    title="Product service",
    description="For managing products in the inventory",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    # TODO Cors
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)