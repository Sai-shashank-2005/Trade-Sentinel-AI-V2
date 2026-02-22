from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import analyze, dashboard, transactions

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Trade Risk Intelligence API",
    description="Hybrid AI + Rule-Based + Context-Aware Trade Risk Engine",
    version="2.0.0"
)

# CORS configuration (allow frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(analyze.router)
app.include_router(dashboard.router)
app.include_router(transactions.router)


@app.get("/")
def root():
    return {"message": "Trade Risk Intelligence Backend Running"}
