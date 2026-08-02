from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routes import auth

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Solvane Security Testing Platform API",
    version="1.0.0",
    description="Authentication, Scans, and Security Reports API for Solvane."
)

# CORS Configuration — read dynamically from settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
)

# Register routers
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message": "Solvane API Service operational",
        "docs": "/docs",
        "frontend_url": settings.FRONTEND_URL,
    }
