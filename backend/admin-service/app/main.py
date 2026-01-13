from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import router

app = FastAPI(
    title="Admin service",
    description="Handles administrative tasks and user management",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    root_path="/api/admin"
)

app.add_middleware(
    CORSMiddleware,
    # Opción Nuclear: Permitir todo ("*") para que no te de lata en desarrollo
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(router)