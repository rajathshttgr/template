from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.api.main import api_router
from app.core.config import settings
from app.core.db import engine, Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for Qbot services",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Create all database tables at startup
@app.on_event("startup")
def on_startup():
    logger.info("Starting up...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

# Shutdown event
@app.on_event("shutdown")
def on_shutdown():
    logger.info("Shutting down...")


@app.get("/", tags=["Root"])
def read_root():
        return {"message": "Welcome to Qbot API"}

# Include routers
app.include_router(api_router)