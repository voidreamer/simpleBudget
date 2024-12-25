from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .controllers import budget
from .database import engine, Base

app = FastAPI(title="Budget API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(budget.router, prefix="/api", tags=["budget"])
