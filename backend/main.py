from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, query
from utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="AI Document Intelligence Platform",
    description="RAG-based document question answering system",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api/v1", tags=["Documents"])
app.include_router(query.router, prefix="/api/v1", tags=["Query"])

from auth import auth_routes
from chat import chat_routes
from database.db import engine, Base

# Create DB tables
Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat_routes.router, prefix="/api/v1/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Document Intelligence Platform API"}

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up API server...")
    
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down API server...")
