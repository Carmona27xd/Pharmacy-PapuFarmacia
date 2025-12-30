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
    root_path="/api/products",
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

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Product Service API",
        "version": "1.0.0",
        "docs": "/docs"
    }
    
# Health check general
@app.get("/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check the health status of the product service")
def health_check():
    return {"status": "ok", "service": "product-service"}